import sqlite3
import datetime

db = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db)
cur = conn.cursor()

# Find last sale date for each variant in 2026-2027
query = """
    SELECT 
        tp.VariantId,
        p.Name,
        pv.SalesRate,
        pv.PurchaseRate,
        pv.Mrp,
        MAX(t.VoucherDate) as LastSoldDate,
        COUNT(tp.Quantity) as TotalTxCount,
        SUM(tp.Quantity) as TotalQtySold
    FROM TransProducts tp
    JOIN Transactions t ON tp.TransId = t.Id
    JOIN ProductVariants pv ON tp.VariantId = pv.Id
    JOIN Products p ON pv.ProductId = p.Id
    WHERE t.IsActive = 1
    GROUP BY tp.VariantId
"""

rows = cur.execute(query).fetchall()
print(f"Variants with sales in 2026-2027: {len(rows)}")

ref_date = datetime.date(2026, 11, 21)
stagnant_60d = []
for r in rows:
    vid, name, srate, prate, mrp, last_date_str, tx_cnt, qty = r
    try:
        ldate = datetime.datetime.strptime(last_date_str[:10], '%Y-%m-%d').date()
        days_since_sold = (ref_date - ldate).days
        if days_since_sold >= 60:
            stagnant_60d.append((vid, name, srate, prate, mrp, days_since_sold, tx_cnt, qty))
    except: pass

print(f"Variants sold in 2026-2027 but stagnant for >= 60 days: {len(stagnant_60d)}")

# Also what about variants that have NO sales at all in 2026-2027 (sold only in 2025 or never sold)?
# Those are 100% stagnant for > 60 days!
cur_variants = cur.execute("SELECT pv.Id, p.Name, pv.SalesRate, pv.PurchaseRate, pv.Mrp FROM ProductVariants pv JOIN Products p ON pv.ProductId = p.Id WHERE pv.IsActive = 1").fetchall()
all_sold_vids = set(r[0] for r in rows)
zero_sales_vids = [v for v in cur_variants if v[0] not in all_sold_vids]
print(f"Variants with ZERO sales in 2026-2027: {len(zero_sales_vids)}")

conn.close()
