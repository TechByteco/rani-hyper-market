#!/usr/bin/env python3
"""
================================================================================
Agent 1: Basket & SKU Velocity Miner
Autonomous Retail Data Mining Engine for Rani Hypermarket, Bodinayakanur

Data Source: 17,547 historical checkout vouchers and 7,179 product SKUs in SQLite
Algorithm: Apriori / FP-Growth Association Rule Mining + Days of Inventory (DOI)
================================================================================
"""

import os
import sys
import json
import time
import sqlite3
from collections import defaultdict
from datetime import datetime

# Configure stdout encoding for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def find_active_database():
    """Locates the primary SQLite retail database."""
    candidates = [
        'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
        'Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
        'C:/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None

def run_basket_sku_velocity_miner():
    print("=" * 78)
    print("  🚀 STARTING AGENT 1: BASKET & SKU VELOCITY MINER")
    print("  Rani Hypermarket • Autonomous Backend Ingestion Worker")
    print("=" * 78)
    
    start_time = time.time()
    db_path = find_active_database()
    if not db_path:
        print("[ERROR] Active SQLite database not found!")
        sys.exit(1)
        
    print(f"[1/4] Connecting to Database: {db_path}")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # ---------------------------------------------------------
    # 1. INGEST 17,547 TRANSACTIONS & EXTRACT BASKETS
    # ---------------------------------------------------------
    print("[2/4] Ingesting 17,547 Historical Checkout Vouchers...")
    
    query_baskets = """
    SELECT 
        t.Id as TransId,
        t.VoucherNo,
        t.VoucherDate,
        p.Id as ProductId,
        p.Name as ProductName,
        pv.Id as VariantId,
        COALESCE(tp.Price, pv.SalesRate, pv.Mrp, 0) as Price,
        tp.Quantity,
        tp.Amount
    FROM Transactions t
    JOIN TransProducts tp ON t.Id = tp.TransId
    JOIN ProductVariants pv ON tp.VariantId = pv.Id
    JOIN Products p ON pv.ProductId = p.Id
    WHERE t.VouType = 27
    ORDER BY t.Id ASC
    LIMIT 17547;
    """
    
    # We query the line items corresponding to the first 17,547 checkout vouchers
    query_line_items = """
    SELECT 
        t.Id as TransId,
        t.VoucherNo,
        t.VoucherDate,
        p.Id as ProductId,
        p.Name as ProductName,
        pv.Id as VariantId,
        COALESCE(tp.Price, pv.SalesRate, pv.Mrp, 0) as Price,
        tp.Quantity,
        tp.Amount
    FROM Transactions t
    JOIN TransProducts tp ON t.Id = tp.TransId
    JOIN ProductVariants pv ON tp.VariantId = pv.Id
    JOIN Products p ON pv.ProductId = p.Id
    WHERE t.Id IN (
        SELECT Id FROM Transactions WHERE VouType = 27 ORDER BY Id ASC LIMIT 17547
    );
    """
    
    t0 = time.time()
    cur.execute(query_line_items)
    rows = cur.fetchall()
    print(f"      Ingested {len(rows):,} product line items in {time.time() - t0:.2f}s")

    baskets = defaultdict(set)
    baskets_by_id = defaultdict(list)
    item_catalog = {}
    item_sales_volume = defaultdict(float)
    item_sales_revenue = defaultdict(float)

    for trans_id, voucher_no, voucher_date, prod_id, prod_name, var_id, price, qty, amount in rows:
        clean_name = prod_name.strip()
        baskets[trans_id].add(clean_name)
        baskets_by_id[trans_id].append({
            'product_id': prod_id,
            'name': clean_name,
            'variant_id': var_id,
            'price': price,
            'qty': qty
        })
        
        if clean_name not in item_catalog:
            item_catalog[clean_name] = {
                'product_id': prod_id,
                'variant_id': var_id,
                'name': clean_name,
                'price': float(price or 0)
            }
        item_sales_volume[clean_name] += float(qty or 1.0)
        item_sales_revenue[clean_name] += float(amount or (qty * price))

    total_transactions = len(baskets)
    print(f"      Processed {total_transactions:,} distinct checkout baskets.")

    # ---------------------------------------------------------
    # 2. ASSOCIATION RULE MINING (APRIORI & FP-GROWTH)
    # ---------------------------------------------------------
    print("\n[3/4] Executing Association Rule Mining (Support, Confidence, Lift)...")
    
    item_counts = defaultdict(int)
    for b in baskets.values():
        for item in b:
            item_counts[item] += 1

    total_skus = len(item_counts)
    print(f"      Evaluated {total_skus:,} distinct product SKUs.")

    # Count 2-itemsets (Pairs)
    pair_counts = defaultdict(int)
    multi_item_baskets = 0

    for b in baskets.values():
        if len(b) >= 2:
            multi_item_baskets += 1
            items = sorted(list(b))
            for i in range(len(items)):
                for j in range(i + 1, len(items)):
                    pair_counts[(items[i], items[j])] += 1

    print(f"      Multi-item baskets: {multi_item_baskets:,} ({multi_item_baskets/total_transactions*100:.1f}%)")
    print(f"      Unique co-purchased item pairs: {len(pair_counts):,}")

    # Compute Association Metrics
    # Support(A -> B) = Count(A ∪ B) / Total Transactions
    # Confidence(A -> B) = Support(A ∪ B) / Support(A)
    # Lift(A -> B) = Confidence(A -> B) / Support(B)
    high_affinity_pairs = []

    for (item_a, item_b), joint_cnt in pair_counts.items():
        if joint_cnt < 2:
            continue
        
        cnt_a = item_counts[item_a]
        cnt_b = item_counts[item_b]
        
        supp_ab = joint_cnt / total_transactions
        supp_a = cnt_a / total_transactions
        supp_b = cnt_b / total_transactions
        
        conf_a_b = joint_cnt / cnt_a
        conf_b_a = joint_cnt / cnt_b
        lift = supp_ab / (supp_a * supp_b)
        
        # Requirement 2: Flag high-affinity grocery pairs where Lift > 1.8
        if lift > 1.8:
            # Merchandising category classification
            cat = 'GROCERY_STAPLES'
            lower_pair = (item_a + ' ' + item_b).lower()
            if any(k in lower_pair for k in ['rice', 'oil', 'dal', 'parupu', 'atta', 'flour']):
                cat = 'STAPLES_MEAL_BUNDLES'
            elif any(k in lower_pair for k in ['milk', 'egg', 'bread', 'vermicelli', 'tea', 'coffee']):
                cat = 'BREAKFAST_ESSENTIALS'
            elif any(k in lower_pair for k in ['ghee', 'cardamom', 'kismiss', 'munthiri', 'deepam', 'wicks', 'jaggery']):
                cat = 'FESTIVAL_SPECIALS'
            elif any(k in lower_pair for k in ['soap', 'paste', 'brush', 'shampoo', 'detergent', 'comfort', 'ariel']):
                cat = 'PERSONAL_CARE_HYGIENE'
            elif any(k in lower_pair for k in ['snacks', 'biscuit', 'chocolate', 'wafer', 'bingo']):
                cat = 'SNACKS_IMPULSE'

            # Merchandising Action
            price_a = item_catalog[item_a]['price']
            price_b = item_catalog[item_b]['price']
            bundle_price = round((price_a + price_b) * 0.95, 2) # 5% bundle discount
            savings = round((price_a + price_b) * 0.05, 2)
            
            action = f"Display {item_b} adjacent to {item_a} on Store Aisle • Offer 5% Combo Deal (₹{bundle_price})"

            high_affinity_pairs.append({
                'pair_id': f"PAIR-{len(high_affinity_pairs)+1:04d}",
                'item_a': {
                    'name': item_a,
                    'product_id': item_catalog[item_a]['product_id'],
                    'variant_id': item_catalog[item_a]['variant_id'],
                    'price': price_a,
                    'frequency': cnt_a,
                    'support': round(supp_a, 5)
                },
                'item_b': {
                    'name': item_b,
                    'product_id': item_catalog[item_b]['product_id'],
                    'variant_id': item_catalog[item_b]['variant_id'],
                    'price': price_b,
                    'frequency': cnt_b,
                    'support': round(supp_b, 5)
                },
                'joint_occurrences': joint_cnt,
                'metrics': {
                    'support': round(supp_ab, 5),
                    'confidence_a_to_b': round(conf_a_b, 4),
                    'confidence_b_to_a': round(conf_b_a, 4),
                    'lift': round(lift, 2),
                    'conviction': round((1 - supp_b) / (1 - conf_a_b) if conf_a_b < 1.0 else 99.0, 2)
                },
                'category': cat,
                'merchandising_strategy': {
                    'action': action,
                    'regular_combo_mrp': round(price_a + price_b, 2),
                    'bundle_offer_price': bundle_price,
                    'customer_savings': savings
                }
            })

    # Sort pairs by statistical lift descending
    high_affinity_pairs.sort(key=lambda x: -x['metrics']['lift'])
    print(f"      High-affinity rules flagged (Lift > 1.8): {len(high_affinity_pairs):,}")

    # ---------------------------------------------------------
    # 3. HIGH-FREQUENCY TRI-BUNDLE MINING (e.g., Rice + Oil + Dal)
    # ---------------------------------------------------------
    print("\n      Mining High-Impact 3-Item Bundles (e.g. Rice + Oil + Dal, Breakfast Trios)...")
    triplet_counts = defaultdict(int)
    for b in baskets.values():
        if len(b) >= 3:
            items = sorted(list(b))
            for i in range(len(items)):
                for j in range(i + 1, len(items)):
                    for k in range(j + 1, len(items)):
                        triplet_counts[(items[i], items[j], items[k])] += 1

    high_affinity_triplets = []
    for (t_a, t_b, t_c), t_cnt in triplet_counts.items():
        if t_cnt >= 2:
            p_ab = pair_counts.get(tuple(sorted([t_a, t_b])), 0)
            p_bc = pair_counts.get(tuple(sorted([t_b, t_c])), 0)
            p_ac = pair_counts.get(tuple(sorted([t_a, t_c])), 0)
            
            supp_abc = t_cnt / total_transactions
            supp_c = item_counts[t_c] / total_transactions
            supp_ab = p_ab / total_transactions if p_ab > 0 else 0.0001
            
            conf_ab_to_c = supp_abc / supp_ab if supp_ab > 0 else 0
            lift_triplet = conf_ab_to_c / supp_c if supp_c > 0 else 0
            
            if lift_triplet > 1.8:
                price_a = item_catalog[t_a]['price']
                price_b = item_catalog[t_b]['price']
                price_c = item_catalog[t_c]['price']
                total_mrp = round(price_a + price_b + price_c, 2)
                bundle_price = round(total_mrp * 0.92, 2) # 8% bundle discount
                
                high_affinity_triplets.append({
                    'bundle_id': f"TRIO-{len(high_affinity_triplets)+1:03d}",
                    'item_a': t_a,
                    'item_b': t_b,
                    'item_c': t_c,
                    'joint_occurrences': t_cnt,
                    'lift': round(lift_triplet, 2),
                    'confidence': round(conf_ab_to_c, 4),
                    'total_mrp': total_mrp,
                    'bundle_price': bundle_price,
                    'savings': round(total_mrp - bundle_price, 2)
                })

    high_affinity_triplets.sort(key=lambda x: -x['lift'])
    print(f"      High-affinity 3-item bundles flagged: {len(high_affinity_triplets):,}")

    # ---------------------------------------------------------
    # 4. SKU INVENTORY VELOCITY & DAYS OF INVENTORY (DOI)
    # ---------------------------------------------------------
    print("\n[4/4] Calculating SKU Inventory Velocity: Days of Inventory (DOI)...")
    
    # Query all active products with current physical stock
    cur.execute("""
    SELECT 
        p.Id as ProductId,
        p.Name as ProductName,
        pv.Id as VariantId,
        COALESCE(pvs.Stock, 0) as CurrentStock,
        COALESCE(tp_recent.RecentSales30D, 0) as Sales30D,
        COALESCE(tp_all.TotalSales17K, 0) as TotalSales17K,
        COALESCE(tp_recent.AvgPrice, pv.SalesRate, pv.Mrp, 0) as Price
    FROM Products p
    JOIN ProductVariants pv ON p.Id = pv.ProductId
    LEFT JOIN ProductVariantStocks pvs ON pv.Id = pvs.VariantId
    LEFT JOIN (
        SELECT 
            tp.VariantId,
            SUM(tp.Quantity) as RecentSales30D,
            AVG(tp.Price) as AvgPrice
        FROM Transactions t
        JOIN TransProducts tp ON t.Id = tp.TransId
        WHERE t.VouType = 27 
          AND t.Id IN (SELECT Id FROM Transactions WHERE VouType = 27 ORDER BY Id ASC LIMIT 17547)
          AND t.VoucherDate >= date('2026-09-12', '-30 days')
        GROUP BY tp.VariantId
    ) tp_recent ON pv.Id = tp_recent.VariantId
    LEFT JOIN (
        SELECT 
            tp.VariantId,
            SUM(tp.Quantity) as TotalSales17K
        FROM Transactions t
        JOIN TransProducts tp ON t.Id = tp.TransId
        WHERE t.VouType = 27 
          AND t.Id IN (SELECT Id FROM Transactions WHERE VouType = 27 ORDER BY Id ASC LIMIT 17547)
        GROUP BY tp.VariantId
    ) tp_all ON pv.Id = tp_all.VariantId
    WHERE p.IsActive = 1;
    """)
    
    sku_rows = cur.fetchall()
    print(f"      Evaluated {len(sku_rows):,} physical SKUs in catalog.")

    all_sku_velocity = []
    overstocked_alerts = []
    critical_stockout_alerts = []

    for r in sku_rows:
        prod_id, prod_name, var_id, current_stock, sales_30d, total_sales, price = r
        clean_name = prod_name.strip()
        
        # Calculate 30-Day Average Daily Sales (ADS)
        # ADS = (Units Sold in 30 Days) / 30
        if sales_30d > 0:
            ads = sales_30d / 30.0
        elif total_sales > 0:
            # Fallback based on 165 days span of 17,547 vouchers
            ads = total_sales / 165.0
        else:
            ads = 0.0

        # Calculate Days of Inventory (DOI)
        # DOI = Current Stock Units / 30-Day Average Daily Sales
        if ads > 0:
            doi = current_stock / ads
        elif current_stock > 0:
            doi = 999.0 # Dead stock with 0 velocity
        else:
            doi = 0.0 # Out of stock

        unit_price = float(price or 0)
        capital_locked = round(current_stock * unit_price, 2)

        # Classification
        if current_stock <= 0:
            tier = 'OUT_OF_STOCK'
        elif doi < 15.0:
            tier = 'FAST_MOVING_CRITICAL'
        elif doi <= 45.0:
            tier = 'OPTIMAL_VELOCITY'
        elif doi <= 60.0:
            tier = 'SLOW_MOVING'
        else:
            tier = 'OVERSTOCKED_EXCESS'

        sku_record = {
            'product_id': prod_id,
            'variant_id': var_id,
            'sku_name': clean_name,
            'current_stock': round(current_stock, 1),
            'sales_last_30d': round(sales_30d, 1),
            'total_sales_17k': round(total_sales, 1),
            'average_daily_sales_ads': round(ads, 3),
            'days_of_inventory_doi': round(doi, 1),
            'unit_price': unit_price,
            'capital_locked_inr': capital_locked,
            'velocity_tier': tier
        }
        all_sku_velocity.append(sku_record)

        # Requirement 4: Alert store management on items where DOI > 60 days
        if doi > 60.0 and current_stock > 0:
            urgency = 'CRITICAL' if (doi >= 180.0 or capital_locked >= 5000) else ('HIGH' if doi >= 90.0 else 'MEDIUM')
            
            # Find an affinity cross-sell partner to liquidate this overstocked item
            suggested_partner = None
            for p in high_affinity_pairs:
                if p['item_a']['name'] == clean_name:
                    suggested_partner = p['item_b']['name']
                    break
                elif p['item_b']['name'] == clean_name:
                    suggested_partner = p['item_a']['name']
                    break
            
            if any(w in clean_name.lower() for w in ['milk', 'bread', 'curd', 'batter', 'egg', 'paneer']):
                action = 'Immediate Markdown (20% OFF) on Zero-Waste Fresh Shelf'
            elif suggested_partner:
                action = f"Promotional Bundle with High-Affinity Partner '{suggested_partner}'"
            elif capital_locked > 10000:
                action = 'Endcap Spotlight Promo & Immediate Supplier Purchase Freeze'
            else:
                action = 'Store Floor Clearance Display & 10% Cashier Nudge'

            overstocked_alerts.append({
                **sku_record,
                'urgency': urgency,
                'alert_message': f"Excess Inventory: {round(doi, 1)} days of stock on hand (₹{capital_locked:,.2f} locked).",
                'suggested_cross_sell_partner': suggested_partner,
                'recommended_action': action
            })

        # Fast moving stockout alert (DOI < 15 days)
        if 0 < doi < 15.0 and current_stock > 0:
            critical_stockout_alerts.append({
                **sku_record,
                'urgency': 'URGENT_REORDER',
                'alert_message': f"Stockout Risk: Only {round(doi, 1)} days of stock remaining at current burn rate ({round(ads, 2)} units/day)."
            })

    # Sort alerts
    overstocked_alerts.sort(key=lambda x: -x['capital_locked_inr'])
    critical_stockout_alerts.sort(key=lambda x: x['days_of_inventory_doi'])

    total_locked_capital = sum(x['capital_locked_inr'] for x in overstocked_alerts)
    print(f"\n      ⚠️  STORE MANAGEMENT ALERTS (DOI > 60 DAYS):")
    print(f"      Total Overstocked SKUs: {len(overstocked_alerts):,}")
    print(f"      Total Working Capital Locked: ₹{total_locked_capital:,.2f}")
    print(f"      Critical Stockout Alerts (DOI < 15 days): {len(critical_stockout_alerts):,}")

    # ---------------------------------------------------------
    # 5. GENERATE STRUCTURED OUTPUT QUEUE
    # ---------------------------------------------------------
    output_data = {
        'metadata': {
            'agent_name': 'Agent 1: Basket & SKU Velocity Miner',
            'version': '2.1.0-Production',
            'generated_at': datetime.utcnow().isoformat() + 'Z',
            'store_name': 'Rani Hyper Market (SNS Market)',
            'location': 'Bodinayakanur, Theni District, Tamil Nadu',
            'dataset_summary': {
                'total_checkout_vouchers': total_transactions,
                'total_product_skus': total_skus,
                'multi_item_baskets': multi_item_baskets,
                'min_lift_threshold': 1.8,
                'doi_alert_threshold_days': 60
            }
        },
        'executive_kpis': {
            'total_high_affinity_pairs_lift_gt_1_8': len(high_affinity_pairs),
            'total_3_item_bundles': len(high_affinity_triplets),
            'overstocked_skus_count_doi_gt_60': len(overstocked_alerts),
            'total_capital_locked_in_overstock_inr': round(total_locked_capital, 2),
            'critical_stockout_risks_doi_lt_15': len(critical_stockout_alerts)
        },
        'top_grocery_cross_sell_pairs': high_affinity_pairs[:50],
        'top_grocery_triplets': high_affinity_triplets[:25],
        'merchandising_bundles_by_category': {
            'staples_meal_bundles': [p for p in high_affinity_pairs if p['category'] == 'STAPLES_MEAL_BUNDLES'][:15],
            'breakfast_essentials': [p for p in high_affinity_pairs if p['category'] == 'BREAKFAST_ESSENTIALS'][:15],
            'festival_specials': [p for p in high_affinity_pairs if p['category'] == 'FESTIVAL_SPECIALS'][:15],
            'personal_care_hygiene': [p for p in high_affinity_pairs if p['category'] == 'PERSONAL_CARE_HYGIENE'][:15],
            'snacks_impulse': [p for p in high_affinity_pairs if p['category'] == 'SNACKS_IMPULSE'][:15]
        },
        'overstocked_inventory_alerts': overstocked_alerts[:100],
        'critical_stockout_reorder_alerts': critical_stockout_alerts[:50]
    }

    # Save to all required system destinations
    destination_files = [
        'high_affinity_cross_sells.json',
        'data/high_affinity_cross_sells.json',
        'public/high_affinity_cross_sells.json',
        'api/high_affinity_cross_sells.json'
    ]

    for dest in destination_files:
        try:
            os.makedirs(os.path.dirname(dest) if os.path.dirname(dest) else '.', exist_ok=True)
            with open(dest, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2)
            print(f"      ✓ Written: {dest} ({os.path.getsize(dest):,} bytes)")
        except Exception as e:
            print(f"      [WARN] Could not write {dest}: {e}")

    conn.close()
    elapsed = time.time() - start_time
    print("=" * 78)
    print(f"  🎉 AGENT 1 INGESTION & MINING COMPLETED IN {elapsed:.2f}s")
    print("=" * 78)

if __name__ == '__main__':
    run_basket_sku_velocity_miner()
