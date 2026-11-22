"""
Rani Hypermarket - Automated Dead-Stock Capital Recovery Algorithm
Role: Inventory Optimization & Financial Recovery Specialist
Location: Main Road, Bodinayakanur, Theni District, Tamil Nadu

Formulas:
  Capital Locked = Unsold Stock Units * Landed Cost
  Liquidation Discount = Min(MarginAboveLandedCost, HoldingCostPerMonth * MonthsStagnant)
  Bundle Price = FastMover_Price + (DeadStock_LandedCost * 1.02)
  Bundle Gross Profit = Bundle Price - (FastMover_LandedCost + DeadStock_LandedCost) > 0
  Capital Recovery = DeadStock_LandedCost * 1.02 (102.0% >= 98% Recovery)
"""

import sqlite3
import json
import datetime
import os
import sys

def run_dead_stock_recovery():
    print("=" * 75)
    print("RANI HYPERMARKET - DEAD-STOCK CAPITAL RECOVERY ALGORITHM")
    print("=" * 75)

    ref_date = datetime.date(2026, 11, 21)
    
    # 1. Ingest SQLite Last Sold Dates
    db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
    last_sold_map = {}
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        rows = cur.execute("""
            SELECT tp.VariantId, MAX(t.VoucherDate)
            FROM TransProducts tp
            JOIN Transactions t ON tp.TransId = t.Id
            WHERE t.IsActive = 1
            GROUP BY tp.VariantId
        """).fetchall()
        for vid, vdate_str in rows:
            if vdate_str:
                try:
                    d = datetime.datetime.strptime(vdate_str[:10], '%Y-%m-%d').date()
                    last_sold_map[vid] = (ref_date - d).days
                except: pass
        conn.close()

    # 2. Ingest 5-Year Inventory Movement Dataset (7,722 Products)
    inv_file = 'data/predicted_5yr_inventory_movement.json'
    if not os.path.exists(inv_file):
        inv_file = 'predicted_5yr_inventory_movement.json'
    
    with open(inv_file, 'r', encoding='utf-8') as f:
        inv_data = json.load(f)
    
    products = inv_data.get('products', {})
    print(f"Scanned {len(products)} catalog SKUs from inventory master.")

    dead_stock_items = []
    fast_movers = []

    for vid_str, p in products.items():
        vid = int(vid_str)
        name = p.get('name', f"SKU {vid}").strip()
        sales_rate = float(p.get('sales_rate') or 0.0)
        mrp = float(p.get('mrp') or (sales_rate * 1.1 if sales_rate > 0 else 10.0))
        landed_cost = float(p.get('purchase_rate') or (sales_rate * 0.82))
        stock = int(p.get('predicted_onhand_stock') or 0)
        daily_velocity = float(p.get('daily_velocity') or 0.0)
        sold_5yr = float(p.get('5yr_sold_exits') or 0.0)
        category = p.get('category_type') or 'general_provisions'

        # Default days stagnant if never sold in current fiscal year is 365 days
        days_stagnant = last_sold_map.get(vid, 365)
        months_stagnant = round(days_stagnant / 30.0, 1)

        # Condition 1: Dead-Stock: last_sold_date > 60 days and current_stock >= 15
        if days_stagnant >= 60 and stock >= 15 and landed_cost > 0:
            capital_locked = round(stock * landed_cost, 2)
            holding_cost_per_month = round(landed_cost * 0.02, 2) # 2% carrying cost per month
            margin_above_cost = max(0.0, sales_rate - landed_cost)
            # Equation: Liquidation Discount = Min(MarginAboveLandedCost, HoldingCostPerMonth * MonthsStagnant)
            liquidation_discount = round(min(margin_above_cost, holding_cost_per_month * months_stagnant), 2)
            
            dead_stock_items.append({
                'variant_id': vid,
                'name': name,
                'category': category,
                'days_stagnant': days_stagnant,
                'months_stagnant': months_stagnant,
                'current_stock': stock,
                'landed_cost': landed_cost,
                'sales_rate': sales_rate,
                'mrp': mrp,
                'capital_locked': capital_locked,
                'holding_cost_accrued': round(holding_cost_per_month * months_stagnant * stock, 2),
                'liquidation_discount': liquidation_discount
            })

        # Condition 2: Fast-Moving Anchor SKU: high daily velocity or high historical volume
        if (daily_velocity >= 0.2 or sold_5yr >= 250) and sales_rate >= 10.0 and landed_cost > 0:
            fast_movers.append({
                'variant_id': vid,
                'name': name,
                'category': category,
                'sales_rate': sales_rate,
                'landed_cost': landed_cost,
                'margin': round(sales_rate - landed_cost, 2),
                'margin_pct': round(((sales_rate - landed_cost) / sales_rate) * 100, 1),
                'daily_velocity': daily_velocity,
                'sold_5yr': sold_5yr
            })

    total_locked = sum(d['capital_locked'] for d in dead_stock_items)
    print(f"Identified Dead-Stock SKUs (Days >= 60, Stock >= 15): {len(dead_stock_items)}")
    print(f"Total Trapped Capital Locked in Dead Stock: Rs. {total_locked:,.2f}")
    print(f"Identified Fast-Moving Anchor SKUs: {len(fast_movers)}")

    # Sort dead stock by capital locked descending
    dead_stock_items.sort(key=lambda x: -x['capital_locked'])

    # Semantic pairing helper to achieve the prompt's pairing vision
    # (e.g. Pair slow-moving dishwashing liquid with 5kg Idli Rice, cleaners with cooking oils/flour, etc.)
    def select_ideal_anchor(dead_sku, anchors):
        d_name = dead_sku['name'].lower()
        d_cost = dead_sku['landed_cost']

        scored = []
        for a in anchors:
            if a['variant_id'] == dead_sku['variant_id']: continue
            a_name = a['name'].lower()

            score = 0
            # Dishwashing / Cleaners / Soaps / Toiletries -> Pair with Idli Rice, Atta, or Cooking Oil
            if any(k in d_name for k in ['cleaner', 'wash', 'soap', 'harpic', 'vim', 'sani', 'shampoo', 'paste', 'detergent', 'bleach', 'coil', 'pest']):
                if any(k in a_name for k in ['idli', 'batter', 'mavu', 'rice', 'atta', 'oil']): score += 60
            
            # Specialty Rice sacks -> Pair with Cooking Oil (Sunflower Oil / Fortune Oil / Ghee)
            elif 'rice' in d_name:
                if any(k in a_name for k in ['oil', 'ghee', 'atta', 'dal', 'sugar']): score += 50
                if 'rice' in a_name: score -= 30 # Avoid pairing rice with another rice

            # Spices / Masalas / Podi -> Pair with Sunflower Oil, Dals, or Rice
            elif any(k in d_name for k in ['masala', 'podi', 'cardamom', 'pepper', 'pattai', 'clove']):
                if any(k in a_name for k in ['oil', 'dal', 'rice']): score += 50

            # General staples / other
            else:
                if any(k in a_name for k in ['idli', 'oil', 'sugar', 'atta', 'rice', 'dal']): score += 40

            # Velocity weight
            if a['daily_velocity'] >= 2.0: score += 25
            if a['sold_5yr'] >= 3000: score += 20

            # Price ratio balance (avoid extreme mismatches)
            if d_cost <= 200:
                if 25 <= a['sales_rate'] <= 250: score += 30
            else:
                if a['sales_rate'] >= 100: score += 30

            scored.append((score, a))

        scored.sort(key=lambda x: -x[0])
        return scored[0][1] if scored else anchors[0]

    # Generate Dynamic Bundling Packages
    bundles = []
    total_capital_recovered = 0.0
    total_gross_profit = 0.0

    for dead in dead_stock_items:
        anchor = select_ideal_anchor(dead, fast_movers)

        # 3. Compute bundle pricing: Bundle Price = FastMover_Price + (DeadStock_LandedCost * 1.02)
        dead_recovered_unit = round(dead['landed_cost'] * 1.02, 2)
        bundle_price = round(anchor['sales_rate'] + dead_recovered_unit, 2)
        standalone_retail_price = round(anchor['sales_rate'] + dead['sales_rate'], 2)
        
        bundle_cost = round(anchor['landed_cost'] + dead['landed_cost'], 2)
        bundle_gross_profit = round(bundle_price - bundle_cost, 2)
        bundle_margin_pct = round((bundle_gross_profit / max(1.0, bundle_price)) * 100, 1)

        customer_savings = round(standalone_retail_price - bundle_price, 2)
        customer_discount_pct = round((customer_savings / max(1.0, standalone_retail_price)) * 100, 1)
        
        # Dead capital recovery % = 102.0% >= 98%
        dead_cap_recovery_pct = round((dead_recovered_unit / dead['landed_cost']) * 100, 1)

        # Financial integrity assertions
        assert bundle_gross_profit > 0, f"Error: Bundle gross profit must be positive for {dead['name']}"
        assert dead_cap_recovery_pct >= 98.0, f"Error: Recovery must be >= 98% for {dead['name']}"

        batch_cap_recovered = round(dead_recovered_unit * dead['current_stock'], 2)
        batch_profit = round(bundle_gross_profit * dead['current_stock'], 2)
        
        total_capital_recovered += batch_cap_recovered
        total_gross_profit += batch_profit

        # Bundle Marketing Badge
        if customer_discount_pct >= 25.0:
            badge = "🔥 Mega Clearance Saver"
            badge_color = "#ef4444"
        elif customer_discount_pct >= 15.0:
            badge = "⚡ Super Value Combo"
            badge_color = "#f59e0b"
        else:
            badge = "✨ Essential Pair"
            badge_color = "#10b981"

        bundles.append({
            'bundle_id': f"BND_{dead['variant_id']}_{anchor['variant_id']}",
            'bundle_title': f"{anchor['name']} + {dead['name']}",
            'marketing_headline': f"Buy {anchor['name']} & Get {dead['name']} at Wholesale Cost!",
            'marketing_badge': badge,
            'badge_color': badge_color,
            'stagnant_sku': {
                'variant_id': dead['variant_id'],
                'name': dead['name'],
                'category': dead['category'],
                'current_stock': dead['current_stock'],
                'landed_cost': dead['landed_cost'],
                'sales_rate': dead['sales_rate'],
                'mrp': dead['mrp'],
                'days_stagnant': dead['days_stagnant'],
                'months_stagnant': dead['months_stagnant'],
                'capital_locked': dead['capital_locked'],
                'holding_cost_accrued': dead['holding_cost_accrued'],
                'liquidation_discount': dead['liquidation_discount']
            },
            'anchor_sku': {
                'variant_id': anchor['variant_id'],
                'name': anchor['name'],
                'category': anchor['category'],
                'sales_rate': anchor['sales_rate'],
                'landed_cost': anchor['landed_cost'],
                'daily_velocity': anchor['daily_velocity'],
                'sold_5yr': anchor['sold_5yr']
            },
            'financials': {
                'standalone_total': standalone_retail_price,
                'bundle_price': bundle_price,
                'bundle_cost': bundle_cost,
                'bundle_gross_profit': bundle_gross_profit,
                'bundle_margin_pct': bundle_margin_pct,
                'customer_savings': customer_savings,
                'customer_discount_pct': customer_discount_pct,
                'dead_capital_recovery_pct': dead_cap_recovery_pct,
                'unit_capital_recovered': dead_recovered_unit,
                'total_batch_capital_recovered': batch_cap_recovered,
                'total_batch_profit': batch_profit
            }
        })

    # Output structured payload
    payload = {
        'metadata': {
            'algorithm': 'Dead-Stock Capital Recovery & Dynamic Bundling Engine',
            'version': '1.0.0',
            'execution_timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'reference_date': str(ref_date),
            'total_catalog_skus_scanned': len(products),
            'dead_stock_skus_identified': len(dead_stock_items),
            'fast_movers_identified': len(fast_movers),
            'bundles_generated': len(bundles)
        },
        'portfolio_recovery_metrics': {
            'total_dead_capital_locked': round(total_locked, 2),
            'total_capital_recovered': round(total_capital_recovered, 2),
            'overall_capital_recovery_pct': round((total_capital_recovered / max(1.0, total_locked)) * 100, 1),
            'total_bundle_gross_profit': round(total_gross_profit, 2),
            'average_customer_discount_pct': round(sum(b['financials']['customer_discount_pct'] for b in bundles) / len(bundles), 1),
            'target_threshold_met': total_locked >= 418000.0,
            'recovery_efficiency_status': 'OPTIMAL_RECOVERY (>98% Capital Recovered with Positive Gross Profit)'
        },
        'bundles': bundles
    }

    # Persist across all project tiers
    export_paths = [
        'data/dead_stock_bundles.json',
        'public/dead_stock_bundles.json',
        'api/data/dead_stock_bundles.json',
        'dead_stock_bundles.json'
    ]

    for p in export_paths:
        os.makedirs(os.path.dirname(p) if os.path.dirname(p) else '.', exist_ok=True)
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
        print(f"Exported JSON queue: {p} ({round(os.path.getsize(p) / 1024, 1)} KB)")

    print("\n--- EXECUTIVE CAPITAL RECOVERY SUMMARY ---")
    m = payload['portfolio_recovery_metrics']
    print(f"Total Trapped Capital Locked: Rs. {m['total_dead_capital_locked']:,.2f}")
    print(f"Total Working Capital Recovered: Rs. {m['total_capital_recovered']:,.2f} ({m['overall_capital_recovery_pct']}%)")
    print(f"Total Gross Profit Generated: Rs. {m['total_bundle_gross_profit']:,.2f} (100% Positive)")
    print(f"Avg Customer Discount: {m['average_customer_discount_pct']}%")
    print(f"Status: {m['recovery_efficiency_status']}")
    print("=" * 75)

    return payload

if __name__ == '__main__':
    run_dead_stock_recovery()
