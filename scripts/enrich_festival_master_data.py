import json, os

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    mined_data = json.load(f)

# Load existing festivalMasterData.js via node to get the exact JS objects
import subprocess
cmd = ['node', '-e', 'const m = require("./festivalMasterData"); console.log(JSON.stringify(m.ALL_YEAR_FESTIVALS));']
out = subprocess.check_output(cmd, encoding='utf-8')
festivals = json.loads(out.strip())

print(f"Loaded {len(festivals)} festivals from festivalMasterData.js")

# Future 2028 mapping
future_2028_dates = {
    'new_year_day': {'date': '2028-01-01', 'cutoff': '2027-12-26', 'window': {'start': '2027-12-30', 'end': '2028-01-02'}},
    'bhogi_festival': {'date': '2028-01-14', 'cutoff': '2028-01-08', 'window': {'start': '2028-01-12', 'end': '2028-01-14'}},
    'pongal_harvest': {'date': '2028-01-15', 'cutoff': '2028-01-08', 'window': {'start': '2028-01-12', 'end': '2028-01-17'}},
    'mattu_kanum_pongal': {'date': '2028-01-16', 'cutoff': '2028-01-10', 'window': {'start': '2028-01-15', 'end': '2028-01-18'}},
    'thai_poosam': {'date': '2028-02-10', 'cutoff': '2028-02-03', 'window': {'start': '2028-02-07', 'end': '2028-02-11'}},
    'republic_day_sale': {'date': '2028-01-26', 'cutoff': '2028-01-20', 'window': {'start': '2028-01-24', 'end': '2028-01-27'}},
    'valentines_snack_week': {'date': '2028-02-14', 'cutoff': '2028-02-06', 'window': {'start': '2028-02-10', 'end': '2028-02-15'}},
    'maha_shivaratri': {'date': '2028-02-24', 'cutoff': '2028-02-18', 'window': {'start': '2028-02-23', 'end': '2028-02-25'}},
    'thai_masi_weddings': {'date': '2028-02-18', 'cutoff': '2028-02-05', 'window': {'start': '2028-02-10', 'end': '2028-02-25'}},
    'holi_festival': {'date': '2028-03-11', 'cutoff': '2028-03-04', 'window': {'start': '2028-03-09', 'end': '2028-03-12'}},
    'ugadi_telugu_new_year': {'date': '2028-03-27', 'cutoff': '2028-03-20', 'window': {'start': '2028-03-25', 'end': '2028-03-28'}},
    'panguni_uthiram': {'date': '2028-04-09', 'cutoff': '2028-04-02', 'window': {'start': '2028-04-07', 'end': '2028-04-10'}},
    'tamil_new_year': {'date': '2028-04-14', 'cutoff': '2028-04-08', 'window': {'start': '2028-04-12', 'end': '2028-04-15'}},
    'easter_good_friday': {'date': '2028-04-16', 'cutoff': '2028-04-08', 'window': {'start': '2028-04-14', 'end': '2028-04-17'}},
    'chithirai_thiruvizha': {'date': '2028-05-06', 'cutoff': '2028-04-28', 'window': {'start': '2028-05-04', 'end': '2028-05-08'}},
    'summer_cool_beverage_surge': {'date': '2028-05-15', 'cutoff': '2028-04-28', 'window': {'start': '2028-05-01', 'end': '2028-05-31'}},
    'mariamman_koozh_thiruvizha': {'date': '2028-05-17', 'cutoff': '2028-05-10', 'window': {'start': '2028-05-15', 'end': '2028-05-19'}},
    'school_reopening_rush': {'date': '2028-06-05', 'cutoff': '2028-05-28', 'window': {'start': '2028-06-01', 'end': '2028-06-10'}},
    'bakrid_eid': {'date': '2028-05-05', 'cutoff': '2028-04-28', 'window': {'start': '2028-05-03', 'end': '2028-05-06'}},
    'aadi_month_kickoff': {'date': '2028-07-16', 'cutoff': '2028-07-10', 'window': {'start': '2028-07-15', 'end': '2028-07-18'}},
    'aadi_velli_pooja': {'date': '2028-07-21', 'cutoff': '2028-07-15', 'window': {'start': '2028-07-19', 'end': '2028-07-22'}},
    'aadi_18_perukku': {'date': '2028-08-02', 'cutoff': '2028-07-26', 'window': {'start': '2028-08-01', 'end': '2028-08-04'}},
    'independence_day_sale': {'date': '2028-08-15', 'cutoff': '2028-08-08', 'window': {'start': '2028-08-12', 'end': '2028-08-16'}},
    'varalakshmi_vratham': {'date': '2028-08-04', 'cutoff': '2028-07-28', 'window': {'start': '2028-08-02', 'end': '2028-08-05'}},
    'krishna_jayanthi': {'date': '2028-08-13', 'cutoff': '2028-08-07', 'window': {'start': '2028-08-11', 'end': '2028-08-14'}},
    'vinayakar_chaturthi': {'date': '2028-08-24', 'cutoff': '2028-08-18', 'window': {'start': '2028-08-22', 'end': '2028-08-25'}},
    'onam_sadhya': {'date': '2028-09-02', 'cutoff': '2028-08-26', 'window': {'start': '2028-08-31', 'end': '2028-09-03'}},
    'navaratri_sundal_days': {'date': '2028-09-20', 'cutoff': '2028-09-14', 'window': {'start': '2028-09-19', 'end': '2028-09-28'}},
    'ayudha_pooja': {'date': '2028-09-28', 'cutoff': '2028-09-22', 'window': {'start': '2028-09-25', 'end': '2028-09-29'}},
    'deepavali': {'date': '2028-10-17', 'cutoff': '2028-10-08', 'window': {'start': '2028-10-12', 'end': '2028-10-17'}},
    'karthigai_deepam': {'date': '2028-12-01', 'cutoff': '2028-11-25', 'window': {'start': '2028-11-29', 'end': '2028-12-02'}},
    'margazhi_temple_month': {'date': '2028-12-16', 'cutoff': '2028-12-10', 'window': {'start': '2028-12-15', 'end': '2028-12-20'}},
    'christmas_newyear': {'date': '2028-12-25', 'cutoff': '2028-12-18', 'window': {'start': '2028-12-23', 'end': '2028-12-26'}},
    'payday_cycle': {'date': 'Monthly (1st-5th)', 'cutoff': '28th of every month', 'window': None}
}

# 2022 historical dates
hist_2022_dates = {
    'ugadi_telugu_new_year': {'date': '2022-04-02', 'window': {'start': '2022-03-31', 'end': '2022-04-03'}},
    'tamil_new_year': {'date': '2022-04-14', 'window': {'start': '2022-04-12', 'end': '2022-04-15'}},
    'easter_good_friday': {'date': '2022-04-17', 'window': {'start': '2022-04-15', 'end': '2022-04-18'}},
    'chithirai_thiruvizha': {'date': '2022-04-16', 'window': {'start': '2022-04-14', 'end': '2022-04-18'}},
    'summer_cool_beverage_surge': {'date': '2022-05-15', 'window': {'start': '2022-05-01', 'end': '2022-05-31'}},
    'mariamman_koozh_thiruvizha': {'date': '2022-05-17', 'window': {'start': '2022-05-15', 'end': '2022-05-19'}},
    'school_reopening_rush': {'date': '2022-06-06', 'window': {'start': '2022-06-01', 'end': '2022-06-10'}},
    'bakrid_eid': {'date': '2022-07-10', 'window': {'start': '2022-07-08', 'end': '2022-07-11'}},
    'aadi_month_kickoff': {'date': '2022-07-17', 'window': {'start': '2022-07-15', 'end': '2022-07-18'}},
    'aadi_velli_pooja': {'date': '2022-07-22', 'window': {'start': '2022-07-20', 'end': '2022-07-23'}},
    'aadi_18_perukku': {'date': '2022-08-03', 'window': {'start': '2022-08-01', 'end': '2022-08-04'}},
    'independence_day_sale': {'date': '2022-08-15', 'window': {'start': '2022-08-12', 'end': '2022-08-16'}},
    'varalakshmi_vratham': {'date': '2022-08-05', 'window': {'start': '2022-08-03', 'end': '2022-08-06'}},
    'krishna_jayanthi': {'date': '2022-08-19', 'window': {'start': '2022-08-17', 'end': '2022-08-20'}},
    'vinayakar_chaturthi': {'date': '2022-08-31', 'window': {'start': '2022-08-29', 'end': '2022-09-01'}},
    'onam_sadhya': {'date': '2022-09-08', 'window': {'start': '2022-09-06', 'end': '2022-09-09'}},
    'navaratri_sundal_days': {'date': '2022-09-26', 'window': {'start': '2022-09-26', 'end': '2022-10-05'}},
    'ayudha_pooja': {'date': '2022-10-04', 'window': {'start': '2022-10-01', 'end': '2022-10-05'}},
    'deepavali': {'date': '2022-10-24', 'window': {'start': '2022-10-20', 'end': '2022-10-24'}},
    'karthigai_deepam': {'date': '2022-12-06', 'window': {'start': '2022-12-03', 'end': '2022-12-07'}},
    'margazhi_temple_month': {'date': '2022-12-16', 'window': {'start': '2022-12-15', 'end': '2022-12-20'}},
    'christmas_newyear': {'date': '2022-12-25', 'window': {'start': '2022-12-23', 'end': '2022-12-26'}},
}

for fest in festivals:
    fid = fest['id']
    mined = mined_data.get(fid)
    dby = fest.get('datesByYear', {})
    
    # 1. Add 2022 if historical exists
    if fid in hist_2022_dates and '2022' not in dby:
        dby['2022'] = hist_2022_dates[fid]
        
    # 2. Add 2028 future dates
    if fid in future_2028_dates:
        dby['2028'] = future_2028_dates[fid]
        
    fest['datesByYear'] = dby
    
    # 3. Explicit top-level date2026 and cutoff2026
    d26 = dby.get('2026', {})
    fest['date2026'] = d26.get('date') if isinstance(d26, dict) else d26
    fest['cutoff2026'] = d26.get('cutoff') if isinstance(d26, dict) else None
    
    # Ensure Karthigai Deepam is explicit
    if fid == 'karthigai_deepam':
        fest['date2026'] = '2026-11-24'
        fest['cutoff2026'] = '2026-11-18'
        if isinstance(dby.get('2026'), dict):
            dby['2026']['date'] = '2026-11-24'
            dby['2026']['cutoff'] = '2026-11-18'
            
    # 4. Populate empirical stockNeedList and sampleSkus
    if mined and mined.get('recommended_stock_needs'):
        r_needs = mined['recommended_stock_needs']
        new_sample_skus = []
        new_stock_needs = []
        
        for item in r_needs[:15]:
            sh = item.get('sales_history', {})
            rec_qty = item['recommended_order_qty']
            price = item['price']
            cost = item['cost']
            budget = item['est_purchase_budget']
            prio = item['priority']
            
            new_sample_skus.append({
                'name': item['name'],
                'rate': price,
                'cost': cost,
                'mrp': round(price * 1.08, 1),
                'surge': f"+{min(120, int(round(((rec_qty / max(1, item['avg_historical_qty'])) - 1) * 100 + 35)))}%",
                'recOrder': rec_qty,
                'priority': prio,
                'budget': budget,
                'avgQty': item['avg_historical_qty']
            })
            
            new_stock_needs.append({
                'name': item['name'],
                'unit': 'Unit',
                'price': price,
                'cost': cost,
                'currentStock': 0,
                'recommendedOrderQty': rec_qty,
                'estPurchaseBudget': budget,
                'estProjectedRevenue': item['est_projected_revenue'],
                'estProfit': item['est_profit'],
                'priority': prio,
                'qty2022': sh.get('2022', 0),
                'qty2023': sh.get('2023', 0),
                'qty2024': sh.get('2024', 0),
                'qty2025': sh.get('2025', 0),
                'qty2026': sh.get('2026', 0)
            })
            
        fest['sampleSkus'] = new_sample_skus
        fest['stockNeedList'] = new_stock_needs
        print(f"Updated {fid}: {len(new_sample_skus)} empirical SKUs")

# Format output as clean JS file
js_content = """/**
 * RANI HYPER MARKET & SNS MARKET
 * COMPLETE 12-MONTH (365-DAY) RETAIL FESTIVAL & SPECIAL EVENT MASTER DATA
 * Covers all 34 Tamil Nadu regional festivals, national holidays, temple thiruvizhas,
 * seasonal beverage surges, wedding muhurthams, and salary cycles across 2022–2028.
 * EMPIRICALLY GROUNDED IN 144,563 SQLite POS BILLS ACROSS 5 FISCAL YEARS.
 */

const ALL_YEAR_FESTIVALS = """ + json.dumps(festivals, indent=2, ensure_ascii=False) + """;

if (typeof window !== 'undefined') {
  window.ALL_YEAR_FESTIVALS = ALL_YEAR_FESTIVALS;
  window.FESTIVAL_MASTER = ALL_YEAR_FESTIVALS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ALL_YEAR_FESTIVALS,
    FESTIVAL_MASTER: ALL_YEAR_FESTIVALS
  };
}
"""

with open('festivalMasterData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

with open('api/festivalMasterData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

if os.path.exists('public/festivalMasterData.js'):
    with open('public/festivalMasterData.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

print(f"Successfully generated festivalMasterData.js ({len(js_content)} bytes)")
