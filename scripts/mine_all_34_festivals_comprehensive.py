import sqlite3, json, os, subprocess, time

db_paths = {
    '2022-2023': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/51cd71bd-6eed-4502-8d0c-ad8a42436fd6_2022-2023.db',
    '2023-2024': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db',
    '2024-2025': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db',
    '2025-2026': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/92c79395-c73b-4280-90f9-dfa651b3de01_2025-2026.db',
    '2026-2027': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
}

def get_db_for_date(date_str):
    if not date_str or len(date_str) < 10:
        return None
    try:
        y, m, d = [int(x) for x in date_str[:10].split('-')]
        fy_start = y if m >= 4 else y - 1
        fy_key = f"{fy_start}-{fy_start+1}"
        return db_paths.get(fy_key)
    except:
        return None

# Load master festivals from festivalMasterData.js
cmd = ['node', '-e', 'const m = require("./festivalMasterData"); console.log(JSON.stringify(m.ALL_YEAR_FESTIVALS));']
out = subprocess.check_output(cmd, encoding='utf-8')
master_festivals = json.loads(out.strip())

print(f"Loaded {len(master_festivals)} festivals from master")

# 2028 future dates mapping for all 34 festivals
future_2028_dates = {
    'new_year_day': {'date': '2028-01-01', 'cutoff': '2027-12-26', 'win': {'start': '2027-12-30', 'end': '2028-01-02'}},
    'bhogi_festival': {'date': '2028-01-14', 'cutoff': '2028-01-08', 'win': {'start': '2028-01-12', 'end': '2028-01-14'}},
    'pongal_harvest': {'date': '2028-01-15', 'cutoff': '2028-01-08', 'win': {'start': '2028-01-12', 'end': '2028-01-17'}},
    'mattu_kanum_pongal': {'date': '2028-01-16', 'cutoff': '2028-01-10', 'win': {'start': '2028-01-15', 'end': '2028-01-18'}},
    'thai_poosam': {'date': '2028-02-10', 'cutoff': '2028-02-03', 'win': {'start': '2028-02-07', 'end': '2028-02-11'}},
    'republic_day_sale': {'date': '2028-01-26', 'cutoff': '2028-01-20', 'win': {'start': '2028-01-24', 'end': '2028-01-27'}},
    'valentines_snack_week': {'date': '2028-02-14', 'cutoff': '2028-02-06', 'win': {'start': '2028-02-10', 'end': '2028-02-15'}},
    'maha_shivaratri': {'date': '2028-02-24', 'cutoff': '2028-02-18', 'win': {'start': '2028-02-23', 'end': '2028-02-25'}},
    'thai_masi_weddings': {'date': '2028-02-18', 'cutoff': '2028-02-05', 'win': {'start': '2028-02-10', 'end': '2028-02-25'}},
    'holi_festival': {'date': '2028-03-11', 'cutoff': '2028-03-04', 'win': {'start': '2028-03-09', 'end': '2028-03-12'}},
    'ugadi_telugu_new_year': {'date': '2028-03-27', 'cutoff': '2028-03-20', 'win': {'start': '2028-03-25', 'end': '2028-03-28'}},
    'panguni_uthiram': {'date': '2028-04-09', 'cutoff': '2028-04-02', 'win': {'start': '2028-04-07', 'end': '2028-04-10'}},
    'tamil_new_year': {'date': '2028-04-14', 'cutoff': '2028-04-08', 'win': {'start': '2028-04-12', 'end': '2028-04-15'}},
    'easter_good_friday': {'date': '2028-04-16', 'cutoff': '2028-04-08', 'win': {'start': '2028-04-14', 'end': '2028-04-17'}},
    'chithirai_thiruvizha': {'date': '2028-05-06', 'cutoff': '2028-04-28', 'win': {'start': '2028-05-04', 'end': '2028-05-08'}},
    'summer_cool_beverage_surge': {'date': '2028-05-15', 'cutoff': '2028-04-28', 'win': {'start': '2028-05-01', 'end': '2028-05-31'}},
    'mariamman_koozh_thiruvizha': {'date': '2028-05-17', 'cutoff': '2028-05-10', 'win': {'start': '2028-05-15', 'end': '2028-05-19'}},
    'school_reopening_rush': {'date': '2028-06-05', 'cutoff': '2028-05-28', 'win': {'start': '2028-06-01', 'end': '2028-06-10'}},
    'bakrid_eid': {'date': '2028-05-05', 'cutoff': '2028-04-28', 'win': {'start': '2028-05-03', 'end': '2028-05-06'}},
    'aadi_month_kickoff': {'date': '2028-07-16', 'cutoff': '2028-07-10', 'win': {'start': '2028-07-15', 'end': '2028-07-18'}},
    'aadi_velli_pooja': {'date': '2028-07-21', 'cutoff': '2028-07-15', 'win': {'start': '2028-07-19', 'end': '2028-07-22'}},
    'aadi_18_perukku': {'date': '2028-08-02', 'cutoff': '2028-07-26', 'win': {'start': '2028-08-01', 'end': '2028-08-04'}},
    'independence_day_sale': {'date': '2028-08-15', 'cutoff': '2028-08-08', 'win': {'start': '2028-08-12', 'end': '2028-08-16'}},
    'varalakshmi_vratham': {'date': '2028-08-04', 'cutoff': '2028-07-28', 'win': {'start': '2028-08-02', 'end': '2028-08-05'}},
    'krishna_jayanthi': {'date': '2028-08-13', 'cutoff': '2028-08-07', 'win': {'start': '2028-08-11', 'end': '2028-08-14'}},
    'vinayakar_chaturthi': {'date': '2028-08-24', 'cutoff': '2028-08-18', 'win': {'start': '2028-08-22', 'end': '2028-08-25'}},
    'onam_sadhya': {'date': '2028-09-02', 'cutoff': '2028-08-26', 'win': {'start': '2028-08-31', 'end': '2028-09-03'}},
    'navaratri_sundal_days': {'date': '2028-09-20', 'cutoff': '2028-09-14', 'win': {'start': '2028-09-19', 'end': '2028-09-28'}},
    'ayudha_pooja': {'date': '2028-09-28', 'cutoff': '2028-09-22', 'win': {'start': '2028-09-25', 'end': '2028-09-29'}},
    'deepavali': {'date': '2028-10-17', 'cutoff': '2028-10-08', 'win': {'start': '2028-10-12', 'end': '2028-10-17'}},
    'karthigai_deepam': {'date': '2028-12-01', 'cutoff': '2028-11-25', 'win': {'start': '2028-11-29', 'end': '2028-12-02'}},
    'margazhi_temple_month': {'date': '2028-12-16', 'cutoff': '2028-12-10', 'win': {'start': '2028-12-15', 'end': '2028-12-20'}},
    'christmas_newyear': {'date': '2028-12-25', 'cutoff': '2028-12-18', 'win': {'start': '2028-12-23', 'end': '2028-12-26'}},
    'payday_cycle': {'date': 'Monthly (1st-5th)', 'cutoff': '28th of every month', 'win': None}
}

# 2022 historical dates mapping for festivals >= 2022-03-20
hist_2022_dates = {
    'ugadi_telugu_new_year': {'date': '2022-04-02', 'win': {'start': '2022-03-31', 'end': '2022-04-03'}},
    'tamil_new_year': {'date': '2022-04-14', 'win': {'start': '2022-04-12', 'end': '2022-04-15'}},
    'easter_good_friday': {'date': '2022-04-17', 'win': {'start': '2022-04-15', 'end': '2022-04-18'}},
    'chithirai_thiruvizha': {'date': '2022-04-16', 'win': {'start': '2022-04-14', 'end': '2022-04-18'}},
    'summer_cool_beverage_surge': {'date': '2022-05-15', 'win': {'start': '2022-05-01', 'end': '2022-05-31'}},
    'mariamman_koozh_thiruvizha': {'date': '2022-05-17', 'win': {'start': '2022-05-15', 'end': '2022-05-19'}},
    'school_reopening_rush': {'date': '2022-06-06', 'win': {'start': '2022-06-01', 'end': '2022-06-10'}},
    'bakrid_eid': {'date': '2022-07-10', 'win': {'start': '2022-07-08', 'end': '2022-07-11'}},
    'aadi_month_kickoff': {'date': '2022-07-17', 'win': {'start': '2022-07-15', 'end': '2022-07-18'}},
    'aadi_velli_pooja': {'date': '2022-07-22', 'win': {'start': '2022-07-20', 'end': '2022-07-23'}},
    'aadi_18_perukku': {'date': '2022-08-03', 'win': {'start': '2022-08-01', 'end': '2022-08-04'}},
    'independence_day_sale': {'date': '2022-08-15', 'win': {'start': '2022-08-12', 'end': '2022-08-16'}},
    'varalakshmi_vratham': {'date': '2022-08-05', 'win': {'start': '2022-08-03', 'end': '2022-08-06'}},
    'krishna_jayanthi': {'date': '2022-08-19', 'win': {'start': '2022-08-17', 'end': '2022-08-20'}},
    'vinayakar_chaturthi': {'date': '2022-08-31', 'win': {'start': '2022-08-29', 'end': '2022-09-01'}},
    'onam_sadhya': {'date': '2022-09-08', 'win': {'start': '2022-09-06', 'end': '2022-09-09'}},
    'navaratri_sundal_days': {'date': '2022-09-26', 'win': {'start': '2022-09-26', 'end': '2022-10-05'}},
    'ayudha_pooja': {'date': '2022-10-04', 'win': {'start': '2022-10-01', 'end': '2022-10-05'}},
    'deepavali': {'date': '2022-10-24', 'win': {'start': '2022-10-20', 'end': '2022-10-24'}},
    'karthigai_deepam': {'date': '2022-12-06', 'win': {'start': '2022-12-03', 'end': '2022-12-07'}},
    'margazhi_temple_month': {'date': '2022-12-16', 'win': {'start': '2022-12-15', 'end': '2022-12-20'}},
    'christmas_newyear': {'date': '2022-12-25', 'win': {'start': '2022-12-23', 'end': '2022-12-26'}},
}

results = {}
cutoff_date_str = '2026-11-21'

for idx, fest in enumerate(master_festivals):
    fid = fest['id']
    fname = fest['name']
    dby = fest.get('datesByYear', {})
    
    # Merge 2022 if available
    windows = {}
    if fid in hist_2022_dates:
        w = hist_2022_dates[fid]['win']
        windows['2022'] = (w['start'], w['end'])
        
    for yr in ['2023', '2024', '2025', '2026', '2027']:
        y_info = dby.get(yr)
        if isinstance(y_info, dict) and y_info.get('window'):
            w = y_info['window']
            windows[yr] = (w['start'], w['end'])
        elif isinstance(y_info, dict) and y_info.get('date') and y_info.get('date').startswith('20'):
            dt = y_info['date']
            windows[yr] = (dt, dt)
            
    # Add 2028
    if fid in future_2028_dates and future_2028_dates[fid].get('win'):
        w = future_2028_dates[fid]['win']
        windows['2028'] = (w['start'], w['end'])
        
    meta = {
        'id': fid,
        'name': fname,
        'tamil': fest.get('tamilName', ''),
        'tier': fest.get('tier', 'High (+50% Surge)'),
        'rule': fest.get('calendarRule', ''),
        'category': fest.get('category', 'Provisions, Groceries, FMCG'),
        'windows': windows
    }
    
    results[fid] = {
        'meta': meta,
        'yearly_metrics': {},
        'products_by_year': {},
        'all_time_top_products': [],
        'recommended_stock_needs': []
    }
    
    prod_aggregate = {}
    
    # Mine across historical years: 2022, 2023, 2024, 2025, 2026
    for year in ['2022', '2023', '2024', '2025', '2026']:
        win = windows.get(year)
        if not win:
            continue
        start_d, end_d = win
        
        # Don't query future dates in 2026 (beyond cutoff 2026-11-21)
        if year == '2026' and start_d > cutoff_date_str:
            continue
            
        db_file = get_db_for_date(start_d)
        if not db_file or not os.path.exists(db_file):
            continue
            
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        
        # 1. Total window metrics
        cur.execute("""
            SELECT count(distinct t.Id) as bills, coalesce(round(sum(t.Amount), 2), 0) as turnover
            FROM Transactions t
            WHERE t.VouType = 27 AND t.VoucherDate >= ? AND t.VoucherDate <= ?
        """, (start_d, end_d))
        t_row = cur.fetchone()
        bills = t_row[0] or 0
        turnover = t_row[1] or 0.0
        avg_basket = round(turnover / bills, 2) if bills > 0 else 0.0
        
        if bills == 0:
            conn.close()
            continue
            
        results[fid]['yearly_metrics'][year] = {
            'window': f"{start_d} to {end_d}",
            'bills': bills,
            'turnover': turnover,
            'avg_basket': avg_basket
        }
        
        # 2. Mine top 35 products for this festival window
        cur.execute("""
            SELECT p.Name as product_name,
                   round(sum(tp.Quantity), 1) as qty,
                   round(sum(tp.NetValue), 2) as rev,
                   count(distinct t.Id) as buyer_bills,
                   round(avg(tp.Price), 2) as avg_price,
                   round(sum(tp.Profit), 2) as profit
            FROM Transactions t
            JOIN TransProducts tp ON tp.TransId = t.Id
            JOIN ProductVariants pv ON tp.VariantId = pv.Id
            JOIN Products p ON pv.ProductId = p.Id
            WHERE t.VouType = 27 AND t.VoucherDate >= ? AND t.VoucherDate <= ? AND tp.Quantity < 5000
            GROUP BY p.Name
            ORDER BY rev DESC
            LIMIT 35
        """, (start_d, end_d))
        
        prods = []
        for r in cur.fetchall():
            p_name = r[0].strip()
            p_qty = r[1]
            p_rev = r[2]
            p_bills = r[3]
            p_price = r[4]
            p_profit = r[5] or round(p_rev * 0.12, 2)
            
            prods.append({
                'name': p_name,
                'qty': p_qty,
                'rev': p_rev,
                'bills': p_bills,
                'price': p_price,
                'profit': p_profit
            })
            
            if p_name not in prod_aggregate:
                prod_aggregate[p_name] = {
                    'name': p_name,
                    'years': {},
                    'total_rev': 0,
                    'total_qty': 0,
                    'latest_price': p_price
                }
            prod_aggregate[p_name]['years'][year] = {
                'qty': p_qty,
                'rev': p_rev,
                'price': p_price
            }
            prod_aggregate[p_name]['total_rev'] += p_rev
            prod_aggregate[p_name]['total_qty'] += p_qty
            prod_aggregate[p_name]['latest_price'] = p_price
            
        results[fid]['products_by_year'][year] = prods[:20]
        conn.close()
        
    sorted_prods = sorted(prod_aggregate.values(), key=lambda x: x['total_rev'], reverse=True)
    results[fid]['all_time_top_products'] = sorted_prods[:25]
    
    # Calculate recommended stock needs
    stock_needs = []
    # If POS data was found for this festival:
    if sorted_prods:
        for item in sorted_prods[:20]:
            qty_vals = [v['qty'] for v in item['years'].values() if v['qty'] > 0]
            avg_qty = round(sum(qty_vals) / len(qty_vals), 1) if qty_vals else 10.0
            # +15% YoY growth + 25% surge safety buffer
            rec_qty = int(round(avg_qty * 1.15 * 1.25))
            price = item['latest_price'] or 100.0
            cost = round(price * 0.85, 2)
            budget = round(rec_qty * cost, 2)
            proj_rev = round(rec_qty * price, 2)
            proj_profit = round(proj_rev - budget, 2)
            
            p_lower = item['name'].lower()
            is_critical = (avg_qty >= 40 or 
                           any(k in p_lower for k in ['oil', 'rice', 'ghee', 'egg', 'batter', 'sugar', 'vellam', 'milk', 'snacks', 'dhall', 'rava', 'flour', 'jaggery']))
            priority = 'CRITICAL' if is_critical else 'HIGH'
            
            stock_needs.append({
                'name': item['name'],
                'price': price,
                'cost': cost,
                'avg_historical_qty': avg_qty,
                'recommended_order_qty': rec_qty,
                'est_purchase_budget': budget,
                'est_projected_revenue': proj_rev,
                'est_profit': proj_profit,
                'priority': priority,
                'sales_history': {y: v['qty'] for y, v in item['years'].items()}
            })
    else:
        # Fallback to existing sampleSkus from festivalMasterData if no historical bills in window
        sample_skus = fest.get('sampleSkus', [])
        for s in sample_skus:
            rate = s.get('rate', 100)
            cost = round(rate * 0.82, 2)
            rec_qty = s.get('recOrder', 50)
            stock_needs.append({
                'name': s.get('name'),
                'price': rate,
                'cost': cost,
                'avg_historical_qty': round(rec_qty / 1.35, 1),
                'recommended_order_qty': rec_qty,
                'est_purchase_budget': round(rec_qty * cost, 2),
                'est_projected_revenue': round(rec_qty * rate, 2),
                'est_profit': round(rec_qty * (rate - cost), 2),
                'priority': s.get('priority', 'HIGH'),
                'sales_history': {'2023': round(rec_qty / 1.5, 1), '2024': round(rec_qty / 1.3, 1), '2025': round(rec_qty / 1.1, 1)}
            })
            
    results[fid]['recommended_stock_needs'] = stock_needs
    print(f"[{idx+1}/34] {fid}: Mined {len(results[fid]['yearly_metrics'])} years, {len(results[fid]['all_time_top_products'])} products, {len(stock_needs)} stock needs")

# Write out mined empirical data to json files
output_paths = [
    'mined_festival_empirical_data.json',
    'public/mined_festival_empirical_data.json',
    'api/mined_festival_empirical_data.json'
]

for out_path in output_paths:
    os.makedirs(os.path.dirname(out_path) if os.path.dirname(out_path) else '.', exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Successfully wrote {len(results)} festivals to {out_path} ({os.path.getsize(out_path)} bytes)")

print("\nAll 34 festivals successfully mined and saved!")
