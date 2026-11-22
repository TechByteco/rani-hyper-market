"""
Rani Hypermarket - Autonomous RFM Customer Segmentation Processor
Role: Senior Retail Analytics & Data Science Engineer
Location: Main Road, Bodinayakanur, Theni District, Tamil Nadu

Formulas:
  Recency (R) = Days since last store checkout
  Frequency (F) = Count of unique shopping visits in past 12 months
  Monetary (M) = Total net revenue generated in past 12 months
Quintile Scoring (1 to 5):
  Scores from 111 to 555
Dedicated Cohorts:
  1. VIP High-Spenders (R >= 4, F >= 4, M >= 4)
  2. Weekend Family Shoppers (R >= 3, F >= 3, M >= 3, Weekend Visit % >= 35%)
  3. Daily Essentials / Milk Loyals (R = 5, F >= 4, M <= 2 or Avg Ticket <= Rs. 350)
  4. At-Risk / Lapsed Churn (R <= 2, F >= 3, M >= 3, Inactivity >= 45 days)
  5. Regular Neighborhood Shoppers (Active baseline patrons)
"""

import sqlite3
import datetime
import json
import os
import sys

def run_rfm_processor(target_date_str=None):
    print("=" * 70)
    print("RANI HYPERMARKET - RFM SEGMENTATION PROCESSOR (AUTONOMOUS)")
    print("=" * 70)

    if target_date_str:
        ref_date = datetime.datetime.strptime(target_date_str, '%Y-%m-%d').date()
    else:
        ref_date = datetime.date(2026, 11, 21) # Latest store data anchor
    
    window_start = ref_date - datetime.timedelta(days=365) # Past 12 months
    print(f"Reference Date: {ref_date}")
    print(f"12-Month Rolling Window: {window_start} to {ref_date}")

    db_paths = [
        'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
        'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/92c79395-c73b-4280-90f9-dfa651b3de01_2025-2026.db',
        'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db'
    ]

    customer_registry = {}

    for db in db_paths:
        if not os.path.exists(db):
            print(f"Warning: {db} does not exist, skipping.")
            continue
        
        conn = sqlite3.connect(db)
        cur = conn.cursor()

        # Ingest Master AccountLedgers
        try:
            ledgers = cur.execute("""
                SELECT Id, Name, PhoneNumber, City, AddressLine, District
                FROM AccountLedgers
                WHERE ContactType = 1 AND Id != 3
            """).fetchall()
            for r in ledgers:
                cid, name, phone, city, addr, dist = r
                if not name or 'walk-in' in name.lower(): continue
                name_clean = name.strip()
                phone_clean = phone.strip() if phone else ""
                if cid not in customer_registry:
                    customer_registry[cid] = {
                        'id': cid,
                        'name': name_clean,
                        'phone': phone_clean,
                        'city': city or 'Bodinayakanur',
                        'address': addr or 'Theni District',
                        'district': dist or 'Theni',
                        'visits_by_date': {}, # date -> total_amount
                        'total_items_bought': 0
                    }
        except Exception as e:
            print(f"Error loading AccountLedgers from {db}: {e}")

        # Ingest Transactions
        try:
            tx_rows = cur.execute("""
                SELECT t.LedgerId, t.VoucherDate, t.Amount
                FROM Transactions t
                WHERE t.IsActive = 1 AND t.LedgerId != 3 AND t.LedgerId IN (SELECT Id FROM AccountLedgers WHERE ContactType = 1)
            """).fetchall()
            for cid, vdate_str, amt in tx_rows:
                if not vdate_str: continue
                try:
                    vdate = datetime.datetime.strptime(vdate_str[:10], '%Y-%m-%d').date()
                    if cid in customer_registry:
                        if vdate not in customer_registry[cid]['visits_by_date']:
                            customer_registry[cid]['visits_by_date'][vdate] = 0.0
                        customer_registry[cid]['visits_by_date'][vdate] += (amt or 0.0)
                except: pass
        except Exception as e:
            print(f"Error loading Transactions from {db}: {e}")

        # Ingest PointsPostings (Counter Loyalty Scans)
        try:
            pp_rows = cur.execute("""
                SELECT pp.ContactId, pp.PostDate, pp.Value, pp.TransId, t.Amount
                FROM PointsPostings pp
                LEFT JOIN Transactions t ON pp.TransId = t.Id
                WHERE pp.ContactId IN (SELECT Id FROM AccountLedgers WHERE ContactType = 1)
            """).fetchall()
            for cid, pdate_str, pval, tid, tamt in pp_rows:
                if not pdate_str: continue
                try:
                    pdate = datetime.datetime.strptime(pdate_str[:10], '%Y-%m-%d').date()
                    amt = tamt if (tamt is not None and tamt > 0) else (pval * 100.0 if pval else 125.0)
                    if cid in customer_registry:
                        if pdate not in customer_registry[cid]['visits_by_date']:
                            customer_registry[cid]['visits_by_date'][pdate] = 0.0
                        if not tid or customer_registry[cid]['visits_by_date'][pdate] == 0:
                            customer_registry[cid]['visits_by_date'][pdate] += amt
                except: pass
        except Exception as e:
            print(f"Error loading PointsPostings from {db}: {e}")

        conn.close()

    # Ingest Online Store Orders (data/online_orders.json or rani_orders.json)
    for order_file in ['data/online_orders.json', 'public/online_orders.json']:
        if os.path.exists(order_file):
            try:
                with open(order_file, 'r', encoding='utf-8') as f:
                    online_orders = json.load(f)
                    for o in online_orders:
                        cust = o.get('customer') or {}
                        cphone = (cust.get('phone') or o.get('customerPhone') or o.get('phone') or '').strip()
                        cname = (cust.get('name') or o.get('customerName') or o.get('name') or 'Online Shopper').strip()
                        amt = float(o.get('total') or o.get('totalAmount') or o.get('amount') or 0.0)
                        dstr = (o.get('createdAt') or o.get('orderDate') or o.get('date') or '2026-11-20')[:10]
                        try:
                            odate = datetime.datetime.strptime(dstr, '%Y-%m-%d').date()
                        except:
                            odate = datetime.date(2026, 11, 20)
                        
                        matched_cid = None
                        if cphone:
                            for cid, cinfo in customer_registry.items():
                                if cinfo['phone'] and (cinfo['phone'] in cphone or cphone in cinfo['phone']):
                                    matched_cid = cid
                                    break
                        if matched_cid:
                            if odate not in customer_registry[matched_cid]['visits_by_date']:
                                customer_registry[matched_cid]['visits_by_date'][odate] = 0.0
                            customer_registry[matched_cid]['visits_by_date'][odate] += amt
                        else:
                            new_id = 9000 + len(customer_registry)
                            customer_registry[new_id] = {
                                'id': new_id,
                                'name': cname,
                                'phone': cphone,
                                'city': cust.get('city') or 'Bodinayakanur',
                                'address': cust.get('address') or 'Online Delivery',
                                'district': 'Theni',
                                'visits_by_date': {odate: amt},
                                'total_items_bought': 0
                            }
                break
            except Exception as e:
                print(f"Error parsing online orders from {order_file}: {e}")

    # Process and Compute RFM Features
    processed_records = []
    for cid, cinfo in customer_registry.items():
        if not cinfo['visits_by_date']: continue

        all_dates = sorted(cinfo['visits_by_date'].keys())
        most_recent_date = all_dates[-1]
        recency_days = max(0, (ref_date - most_recent_date).days)

        # 12-month Rolling Metrics
        dates_12m = [d for d in all_dates if d >= window_start]
        freq_12m = len(dates_12m)
        monetary_12m = sum(cinfo['visits_by_date'][d] for d in dates_12m)

        # Lifetime Metrics
        lifetime_visits = len(all_dates)
        lifetime_monetary = sum(cinfo['visits_by_date'].values())

        # Weekend Concentration (Friday=4, Saturday=5, Sunday=6)
        eval_dates = dates_12m if dates_12m else all_dates
        weekend_visits = sum(1 for d in eval_dates if d.weekday() in [4, 5, 6])
        weekend_pct = round((weekend_visits / len(eval_dates)) * 100, 1)

        # Effective Monetary for Scoring (ensure lapsed customers have fair basis)
        eff_monetary = monetary_12m if monetary_12m > 0 else (lifetime_monetary * 0.25)
        eff_freq = freq_12m if freq_12m > 0 else (1 if lifetime_visits > 0 else 0)

        # Avg Ticket Size
        avg_ticket = round(eff_monetary / max(1, eff_freq), 2)
        monthly_avg = round(eff_monetary / 12, 2)

        # 1. Quintile Scoring - Recency (R: 1 to 5, Inverted: Lower Days = Higher Score)
        if recency_days <= 14:
            r_score = 5
        elif recency_days <= 45:
            r_score = 4
        elif recency_days <= 90:
            r_score = 3
        elif recency_days <= 180:
            r_score = 2
        else:
            r_score = 1

        # 2. Quintile Scoring - Frequency (F: 1 to 5, Higher Visits = Higher Score)
        # Bodinayakanur high-touch grocery thresholds:
        # F=5: >= 12 visits/yr (Weekly regulars)
        # F=4: 6 to 11 visits/yr (Monthly regulars)
        # F=3: 3 to 5 visits/yr (Quarterly regulars)
        # F=2: 2 visits/yr (Occasional)
        # F=1: 1 visit/yr (One-off)
        eval_f = eff_freq if eff_freq >= 2 else (lifetime_visits if recency_days > 45 else eff_freq)
        if eval_f >= 12:
            f_score = 5
        elif eval_f >= 6:
            f_score = 4
        elif eval_f >= 3:
            f_score = 3
        elif eval_f >= 2:
            f_score = 2
        else:
            f_score = 1

        # 3. Quintile Scoring - Monetary (M: 1 to 5, Higher Net Spend = Higher Score)
        # M=5: >= Rs. 18,000/yr (or Rs. 1,500/mo)
        # M=4: Rs. 8,000 - 17,999
        # M=3: Rs. 3,000 - 7,999
        # M=2: Rs. 1,000 - 2,999
        # M=1: < Rs. 1,000
        eval_m = eff_monetary if eff_monetary >= 1000 else (lifetime_monetary if recency_days > 45 else eff_monetary)
        if eval_m >= 18000.0:
            m_score = 5
        elif eval_m >= 8000.0:
            m_score = 4
        elif eval_m >= 3000.0:
            m_score = 3
        elif eval_m >= 1000.0:
            m_score = 2
        else:
            m_score = 1

        rfm_score = f"{r_score}{f_score}{m_score}"
        R, F, M = r_score, f_score, m_score

        # 4. Cohort Partitioning Rules
        # Cohort 1: VIP High-Spenders (R >= 4, F >= 4, M >= 4) - Monthly grocery spend > Rs. 4,500 or annual > Rs. 18,000
        is_vip = (R >= 4 and F >= 4 and M >= 4 and (monthly_avg >= 4500.0 or eff_monetary >= 18000.0 or avg_ticket >= 1000.0))
        
        # Cohort 3: Daily Essentials / Milk Loyals (R = 5, F >= 4, M <= 2 or Avg Ticket <= Rs. 650)
        # Frequent visits for daily perishable dairy/snacks with lower ticket sizes
        is_milk_loyal = ((R == 5 and F >= 4 and M <= 2) or 
                         (R >= 4 and F >= 4 and (avg_ticket <= 650.0 or M <= 3 or monthly_avg <= 2500.0))) and not is_vip

        # Cohort 2: Weekend Family Shoppers (R >= 3, F >= 3, M >= 3, weekend_pct >= 35%)
        is_weekend = (R >= 3 and F >= 3 and M >= 3 and weekend_pct >= 35.0) and not is_vip and not is_milk_loyal

        # Cohort 4: At-Risk / Lapsed Churn (R <= 2, F >= 3, M >= 3, recency_days >= 45)
        is_at_risk = (R <= 2 and F >= 3 and M >= 3 and recency_days >= 45) and not is_vip

        if is_vip:
            cohort_code = "VIP_HIGH_SPENDERS"
            cohort_name = "VIP High-Spenders"
            badge_color = "#10b981" # Emerald Green
            priority_rank = 1
            recommended_strategy = "Dedicated WhatsApp Concierge + Free 30-min Priority Delivery + Festival Dry Fruit Box + Zero-Fee Privilege"
            action_channel = "WHATSAPP_CONCIERGE"
            promo_discount = "8% VIP Privilege Cash Back"

        elif is_milk_loyal:
            cohort_code = "DAILY_ESSENTIALS_MILK_LOYALS"
            cohort_name = "Daily Essentials / Milk Loyals"
            badge_color = "#06b6d4" # Cyan / Sky
            priority_rank = 2
            recommended_strategy = "Counter Impulse Lift: Pre-packaged Ghee, Premium Tea, or Snack combo bundles to raise ticket size above Rs. 280"
            action_channel = "COUNTER_POS_PROMPT"
            promo_discount = "Rs. 20 OFF on Tea/Ghee bundle with 2L Milk"

        elif is_weekend:
            cohort_code = "WEEKEND_FAMILY_SHOPPERS"
            cohort_name = "Weekend Family Shoppers"
            badge_color = "#8b5cf6" # Royal Purple
            priority_rank = 3
            recommended_strategy = "Thursday 05:30 PM WhatsApp blast: 25kg Ponni Rice + 5L Sunflower Oil combo reservation for weekend pickup"
            action_channel = "WHATSAPP_BROADCAST"
            promo_discount = "Combo Special: Rs. 120 OFF on Rice + Oil 5L"

        elif is_at_risk:
            cohort_code = "AT_RISK_LAPSED_CHURN"
            cohort_name = "At-Risk / Lapsed Churn"
            badge_color = "#ef4444" # Ruby Red
            priority_rank = 4
            recommended_strategy = "Urgent Reactivation: 'We Miss You' Personal Tamil WhatsApp voice note + Rs. 200 Welcome-Back Voucher"
            action_channel = "WHATSAPP_DIRECT_CALL"
            promo_discount = "Rs. 200 OFF on purchase of Rs. 1,000+"

        # Cohort 5: Regular Neighborhood Shoppers (Active baseline patrons)
        else:
            cohort_code = "REGULAR_NEIGHBORHOOD_SHOPPERS"
            cohort_name = "Regular Neighborhood Shoppers"
            badge_color = "#3b82f6" # Sapphire Blue
            priority_rank = 5
            recommended_strategy = "Bi-weekly WhatsApp grocery catalog with seasonal local produce and festival countdown specials"
            action_channel = "WHATSAPP_DIGITAL_CATALOG"
            promo_discount = "Storewide 3% App Discount"

        # Mask phone number for privacy in public UI (e.g. 96262***** or 98***)
        masked_phone = ""
        if cinfo['phone']:
            clean_p = cinfo['phone'].replace(' ', '').replace('-', '')
            if len(clean_p) >= 10:
                masked_phone = clean_p[:5] + "*****"
            else:
                masked_phone = clean_p[:2] + "***"

        record = {
            'customer_id': cid,
            'customer_name': cinfo['name'],
            'phone_number': cinfo['phone'],
            'phone_masked': masked_phone,
            'city': cinfo['city'],
            'address': cinfo['address'],
            'district': cinfo['district'],
            'recency_days': recency_days,
            'last_checkout_date': str(most_recent_date),
            'frequency_12m': eff_freq,
            'monetary_12m': round(eff_monetary, 2),
            'monthly_spend_avg': monthly_avg,
            'average_ticket_size': avg_ticket,
            'lifetime_visits': lifetime_visits,
            'lifetime_spend': round(lifetime_monetary, 2),
            'weekend_visit_pct': weekend_pct,
            'r_score': r_score,
            'f_score': f_score,
            'm_score': m_score,
            'rfm_score': rfm_score,
            'cohort_code': cohort_code,
            'cohort_name': cohort_name,
            'badge_color': badge_color,
            'priority_rank': priority_rank,
            'recommended_strategy': recommended_strategy,
            'action_channel': action_channel,
            'promo_discount': promo_discount,
            'last_scored_at': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'sync_status': 'SYNCED'
        }
        processed_records.append(record)

    # Sort records: VIPs and At-Risk first, then by monetary spend
    processed_records.sort(key=lambda x: (x['priority_rank'], -x['monetary_12m']))
    print(f"\nSuccessfully segmented and scored {len(processed_records)} customer accounts.")

    # Compute Cohort Aggregations
    cohort_aggregates = {}
    for r in processed_records:
        ccode = r['cohort_code']
        if ccode not in cohort_aggregates:
            cohort_aggregates[ccode] = {
                'cohort_code': ccode,
                'cohort_name': r['cohort_name'],
                'badge_color': r['badge_color'],
                'priority_rank': r['priority_rank'],
                'recommended_strategy': r['recommended_strategy'],
                'action_channel': r['action_channel'],
                'promo_discount': r['promo_discount'],
                'customer_count': 0,
                'total_monetary_12m': 0.0,
                'avg_monetary_12m': 0.0,
                'avg_recency_days': 0.0,
                'avg_frequency_12m': 0.0,
                'avg_ticket_size': 0.0,
                'members': []
            }
        agg = cohort_aggregates[ccode]
        agg['customer_count'] += 1
        agg['total_monetary_12m'] += r['monetary_12m']
        agg['avg_recency_days'] += r['recency_days']
        agg['avg_frequency_12m'] += r['frequency_12m']
        agg['avg_ticket_size'] += r['average_ticket_size']
        if len(agg['members']) < 15: # Top 15 members preview
            agg['members'].append(r)

    total_base_spend = sum(r['monetary_12m'] for r in processed_records)
    total_customers = len(processed_records)

    for ccode, agg in cohort_aggregates.items():
        cnt = agg['customer_count']
        agg['total_monetary_12m'] = round(agg['total_monetary_12m'], 2)
        agg['avg_monetary_12m'] = round(agg['total_monetary_12m'] / cnt, 2)
        agg['avg_recency_days'] = round(agg['avg_recency_days'] / cnt, 1)
        agg['avg_frequency_12m'] = round(agg['avg_frequency_12m'] / cnt, 1)
        agg['avg_ticket_size'] = round(agg['avg_ticket_size'] / cnt, 2)
        agg['revenue_share_pct'] = round((agg['total_monetary_12m'] / max(1.0, total_base_spend)) * 100, 1)
        agg['customer_share_pct'] = round((cnt / max(1, total_customers)) * 100, 1)

    print("\n--- Cohort Distribution & Financial Metrics ---")
    for ccode in ['VIP_HIGH_SPENDERS', 'DAILY_ESSENTIALS_MILK_LOYALS', 'WEEKEND_FAMILY_SHOPPERS', 'AT_RISK_LAPSED_CHURN', 'REGULAR_NEIGHBORHOOD_SHOPPERS']:
        if ccode in cohort_aggregates:
            ca = cohort_aggregates[ccode]
            print(f"[{ca['priority_rank']}] {ca['cohort_name']} ({ca['cohort_code']}):")
            print(f"    Customers: {ca['customer_count']} ({ca['customer_share_pct']}%)")
            print(f"    12M Net Revenue: Rs. {ca['total_monetary_12m']:,.2f} ({ca['revenue_share_pct']}%)")
            print(f"    Avg Spend/Cust: Rs. {ca['avg_monetary_12m']:,.2f} | Avg Ticket: Rs. {ca['avg_ticket_size']:,.2f}")
            print(f"    Avg Recency: {ca['avg_recency_days']} days | Avg Frequency: {ca['avg_frequency_12m']} visits")
            print(f"    Strategy: {ca['recommended_strategy']}")
            print()

    # 5. Persist to SQLite Database Table: customer_rfm_partitions
    # We update the primary 2026-2027 active database
    primary_db = db_paths[0]
    if os.path.exists(primary_db):
        conn = sqlite3.connect(primary_db)
        cur = conn.cursor()
        
        # Create Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS customer_rfm_partitions (
                customer_id INTEGER PRIMARY KEY,
                customer_name TEXT NOT NULL,
                phone_number TEXT,
                phone_masked TEXT,
                city TEXT,
                address TEXT,
                district TEXT,
                recency_days INTEGER,
                last_checkout_date TEXT,
                frequency_12m INTEGER,
                monetary_12m REAL,
                monthly_spend_avg REAL,
                average_ticket_size REAL,
                lifetime_visits INTEGER,
                lifetime_spend REAL,
                weekend_visit_pct REAL,
                r_score INTEGER,
                f_score INTEGER,
                m_score INTEGER,
                rfm_score TEXT,
                cohort_code TEXT,
                cohort_name TEXT,
                badge_color TEXT,
                priority_rank INTEGER,
                recommended_strategy TEXT,
                action_channel TEXT,
                promo_discount TEXT,
                last_scored_at TEXT,
                sync_status TEXT
            )
        """)

        # Clear old partition rows
        cur.execute("DELETE FROM customer_rfm_partitions")

        # Insert batch
        insert_sql = """
            INSERT INTO customer_rfm_partitions (
                customer_id, customer_name, phone_number, phone_masked, city, address, district,
                recency_days, last_checkout_date, frequency_12m, monetary_12m, monthly_spend_avg,
                average_ticket_size, lifetime_visits, lifetime_spend, weekend_visit_pct,
                r_score, f_score, m_score, rfm_score, cohort_code, cohort_name,
                badge_color, priority_rank, recommended_strategy, action_channel,
                promo_discount, last_scored_at, sync_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        batch = [
            (
                r['customer_id'], r['customer_name'], r['phone_number'], r['phone_masked'], r['city'], r['address'], r['district'],
                r['recency_days'], r['last_checkout_date'], r['frequency_12m'], r['monetary_12m'], r['monthly_spend_avg'],
                r['average_ticket_size'], r['lifetime_visits'], r['lifetime_spend'], r['weekend_visit_pct'],
                r['r_score'], r['f_score'], r['m_score'], r['rfm_score'], r['cohort_code'], r['cohort_name'],
                r['badge_color'], r['priority_rank'], r['recommended_strategy'], r['action_channel'],
                r['promo_discount'], r['last_scored_at'], r['sync_status']
            )
            for r in processed_records
        ]
        cur.executemany(insert_sql, batch)

        # Create Indices
        cur.execute("CREATE INDEX IF NOT EXISTS idx_rfm_cohort ON customer_rfm_partitions(cohort_code)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_rfm_score ON customer_rfm_partitions(rfm_score)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_rfm_recency ON customer_rfm_partitions(recency_days)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_rfm_monetary ON customer_rfm_partitions(monetary_12m)")

        conn.commit()
        cnt_inserted = cur.execute("SELECT COUNT(*) FROM customer_rfm_partitions").fetchone()[0]
        print(f"SQLite Persistence: Successfully saved {cnt_inserted} rows to table `customer_rfm_partitions` in {primary_db}")
        conn.close()

    # 6. Structured JSON Export for Serverless REST APIs and Frontend
    payload = {
        'metadata': {
            'system': 'Rani Hypermarket Autonomous RFM Segmentation Engine',
            'version': '1.0.0',
            'generated_at': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'reference_date': str(ref_date),
            'window_start': str(window_start),
            'total_customers_scored': len(processed_records),
            'total_portfolio_revenue_12m': round(total_base_spend, 2)
        },
        'cohort_summary': cohort_aggregates,
        'customers': processed_records
    }

    export_paths = [
        'data/customer_rfm_partitions.json',
        'public/customer_rfm_partitions.json',
        'api/data/customer_rfm_partitions.json',
        'customer_rfm_partitions.json'
    ]

    for p in export_paths:
        os.makedirs(os.path.dirname(p) if os.path.dirname(p) else '.', exist_ok=True)
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
        print(f"Exported JSON queue: {p} ({round(os.path.getsize(p) / 1024, 1)} KB)")

    print("\n[OK] RFM Segmentation Processor execution complete.")
    return payload

if __name__ == '__main__':
    run_rfm_processor()
