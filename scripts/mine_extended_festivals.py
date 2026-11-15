import sqlite3, json, os

db_paths = {
    '2022-2023': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/51cd71bd-6eed-4502-8d0c-ad8a42436fd6_2022-2023.db',
    '2023-2024': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db',
    '2024-2025': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db',
    '2025-2026': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/92c79395-c73b-4280-90f9-dfa651b3de01_2025-2026.db',
    '2026-2027': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
}

def get_db_for_date(date_str):
    y, m, d = [int(x) for x in date_str.split('-')]
    fy_start = y if m >= 4 else y - 1
    fy_key = f"{fy_start}-{fy_start+1}"
    return db_paths.get(fy_key)

festivals = [
    {
        'id': 'deepavali',
        'name': 'Deepavali (Diwali Mega Shopping Week)',
        'tamil': 'தீபாவளி பெருவிழா',
        'tier': 'Peak (Highest Annual Surge +140%)',
        'rule': 'Aipasi Amavasya / Naraka Chaturdashi (Lunisolar shifts Oct/Nov)',
        'category': 'Sweets, Savouries, Cooking Oils, Ghee, Dry Fruits, Rava, Maida, Sugar',
        'windows': {
            '2022': ('2022-10-21', '2022-10-25'),
            '2023': ('2023-11-09', '2023-11-13'),
            '2024': ('2024-10-28', '2024-11-01'),
            '2025': ('2025-10-17', '2025-10-21'),
            '2026': ('2026-11-05', '2026-11-09')
        }
    },
    {
        'id': 'pongal_harvest',
        'name': 'Thai Pongal (Tamil Harvest Festival)',
        'tamil': 'தைப்பொங்கல் & மாட்டுப் பொங்கல்',
        'tier': 'Peak (+120% Surge)',
        'rule': 'Thai 1 (Solar transit / Makar Sankranti Jan 14-17)',
        'category': 'Raw Rice (Pacharisi), Jaggery, Ghee, Cashews, Raisins, Cardamom, Turmeric, Sugarcane',
        'windows': {
            '2023': ('2023-01-13', '2023-01-17'),
            '2024': ('2024-01-13', '2024-01-17'),
            '2025': ('2025-01-12', '2025-01-16'),
            '2026': ('2026-01-13', '2026-01-17')
        }
    },
    {
        'id': 'ayudha_pooja',
        'name': 'Ayudha Pooja & Saraswathi Pooja',
        'tamil': 'ஆயுத பூஜை & சரஸ்வதி பூஜை',
        'tier': 'High (+85% Surge)',
        'rule': 'Navaratri Navami Tithi (Purattasi/Aipasi shifts Sep/Oct)',
        'category': 'Pori, Kadalai, Jaggery, Fruits, Camphor, Agarbatti, Plantain stems, Pooja Oils',
        'windows': {
            '2022': ('2022-10-01', '2022-10-05'),
            '2023': ('2023-10-20', '2023-10-24'),
            '2024': ('2024-10-08', '2024-10-12'),
            '2025': ('2025-09-28', '2025-10-02'),
            '2026': ('2026-10-16', '2026-10-20')
        }
    },
    {
        'id': 'vinayakar_chaturthi',
        'name': 'Vinayakar Chaturthi (Ganesh Festival)',
        'tamil': 'விநாயகர் சதுர்த்தி',
        'tier': 'High (+75% Surge)',
        'rule': 'Avani Shukla Chaturthi (Lunisolar shifts Aug/Sep)',
        'category': 'Kozhukattai Maida/Rice Flour, Modak Moulds, Jaggery, Coconut, Ghee, Sesame Seed',
        'windows': {
            '2022': ('2022-08-28', '2022-09-01'),
            '2023': ('2023-09-15', '2023-09-19'),
            '2024': ('2024-09-04', '2024-09-08'),
            '2025': ('2025-08-24', '2025-08-28'),
            '2026': ('2026-09-11', '2026-09-15')
        }
    },
    {
        'id': 'karthigai_deepam',
        'name': 'Karthigai Deepam (Festival of 1,000 Lamps)',
        'tamil': 'கார்த்திகை தீபம்',
        'tier': 'High (+90% Oil & Ghee Surge)',
        'rule': 'Karthigai Pournami / Krittika Nakshatra (Lunisolar Nov/Dec)',
        'category': 'Deepam Oil, Gingelly/Sesame Oil, Ghee, Cotton Wicks (Thiri), Clay Lamps (Agal)',
        'windows': {
            '2022': ('2022-12-03', '2022-12-07'),
            '2023': ('2023-11-23', '2023-11-27'),
            '2024': ('2024-12-10', '2024-12-14'),
            '2025': ('2025-12-01', '2025-12-05'),
            '2026': ('2026-11-21', '2026-11-25')
        }
    },
    {
        'id': 'krishna_jayanthi',
        'name': 'Sri Krishna Jayanthi (Gokulashtami)',
        'tamil': 'ஸ்ரீ கிருஷ்ண ஜெயந்தி (கோகுலாஷ்டமி)',
        'tier': 'Moderate (+55% Surge)',
        'rule': 'Avani Ashtami Rohini Nakshatra (Lunisolar Aug/Sep)',
        'category': 'Butter (Vennai), Fresh Cow Milk, Aval (Poha), Jaggery, Murukku flour, Seedai flour',
        'windows': {
            '2022': ('2022-08-16', '2022-08-20'),
            '2023': ('2023-09-04', '2023-09-08'),
            '2024': ('2024-08-24', '2024-08-28'),
            '2025': ('2025-08-14', '2025-08-18'),
            '2026': ('2026-09-02', '2026-09-06')
        }
    },
    {
        'id': 'tamil_new_year',
        'name': 'Tamil New Year (Puthandu / Chithirai 1)',
        'tamil': 'தமிழ்ப் புத்தாண்டு (சித்திரை 1)',
        'tier': 'High (+65% Surge)',
        'rule': 'Chithirai 1 (Solar Mesha Sankranti fixed April 14)',
        'category': 'Raw Mango, Neem flower, Jaggery, Payasam essentials, Appalam, Ghee, Vegetables',
        'windows': {
            '2022': ('2022-04-12', '2022-04-16'),
            '2023': ('2023-04-12', '2023-04-16'),
            '2024': ('2024-04-12', '2024-04-16'),
            '2025': ('2025-04-12', '2025-04-16'),
            '2026': ('2026-04-12', '2026-04-16')
        }
    },
    {
        'id': 'aadi_18_perukku',
        'name': 'Aadi 18 Perukku (River Feast & 5 Variety Rice)',
        'tamil': 'ஆடி 18 பெருக்கு (சித்ரான்னங்கள் விழா)',
        'tier': 'High (+65% Surge)',
        'rule': 'Aadi 18 (Solar Day approx Aug 2/3)',
        'category': 'Lemon, Tamarind, Coconut, Sesame, Curd, Rice, Pappad, Pickles, Cooking Oil',
        'windows': {
            '2022': ('2022-08-01', '2022-08-05'),
            '2023': ('2023-08-01', '2023-08-05'),
            '2024': ('2024-08-01', '2024-08-05'),
            '2025': ('2025-08-01', '2025-08-05'),
            '2026': ('2026-08-01', '2026-08-05')
        }
    }
]

results = {}

for fest in festivals:
    f_id = fest['id']
    results[f_id] = {
        'meta': fest,
        'yearly_metrics': {},
        'products_by_year': {},
        'all_time_top_products': [],
        'recommended_stock_needs': []
    }
    
    prod_aggregate = {}

    for year, (start_d, end_d) in fest['windows'].items():
        db_file = get_db_for_date(start_d)
        if not db_file or not os.path.exists(db_file):
            continue
            
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        
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
            
        results[f_id]['yearly_metrics'][year] = {
            'window': f"{start_d} to {end_d}",
            'bills': bills,
            'turnover': turnover,
            'avg_basket': avg_basket
        }
        
        cur.execute("""
            SELECT p.Name as product_name,
                   round(sum(tp.Quantity), 1) as qty,
                   round(sum(tp.NetValue), 2) as rev,
                   count(distinct t.Id) as buyer_bills,
                   round(avg(tp.Price), 2) as avg_price,
                   round(sum(tp.Profit), 2) as profit
            FROM TransProducts tp
            JOIN Transactions t ON tp.TransId = t.Id
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
            
        results[f_id]['products_by_year'][year] = prods[:20]
        conn.close()
        
    sorted_prods = sorted(prod_aggregate.values(), key=lambda x: x['total_rev'], reverse=True)
    results[f_id]['all_time_top_products'] = sorted_prods[:25]
    
    # Calculate recommended stock needs
    stock_needs = []
    for item in sorted_prods[:15]:
        qty_vals = [v['qty'] for v in item['years'].values() if v['qty'] > 0]
        avg_qty = round(sum(qty_vals) / len(qty_vals), 1) if qty_vals else 10.0
        # +15% YoY growth + 25% surge safety buffer
        rec_qty = int(round(avg_qty * 1.15 * 1.25))
        price = item['latest_price'] or 100.0
        cost = round(price * 0.85, 2)
        budget = round(rec_qty * cost, 2)
        proj_rev = round(rec_qty * price, 2)
        proj_profit = round(proj_rev - budget, 2)
        
        priority = 'CRITICAL' if avg_qty >= 50 or any(k in item['name'].lower() for k in ['oil', 'rice', 'ghee', 'egg', 'batter', 'sugar', 'vellam']) else 'HIGH'
        
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
    results[f_id]['recommended_stock_needs'] = stock_needs

with open('mined_festival_empirical_data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("Comprehensive Lunisolar Mining Completed for 8 Grand Festivals!")
