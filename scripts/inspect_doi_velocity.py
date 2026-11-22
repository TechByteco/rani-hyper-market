import sqlite3, json

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# 1. Get the max voucher date from the 17,547 transactions
cur.execute("""
SELECT MAX(VoucherDate)
FROM (SELECT VoucherDate FROM Transactions WHERE VouType = 27 ORDER BY Id LIMIT 17547);
""")
max_date = cur.fetchone()[0]
print(f"Dataset cutoff date: {max_date}")

# 2. Compute 30-day sales (last 30 days before max_date)
# 2026-08-14 to 2026-09-12
cur.execute("""
SELECT 
    p.Id as ProductId,
    p.Name as ProductName,
    pv.Id as VariantId,
    COALESCE(pvs.Stock, 0) as CurrentStock,
    COALESCE(tp_recent.RecentSales30D, 0) as Sales30D,
    COALESCE(tp_all.TotalSales17K, 0) as TotalSales17K,
    COALESCE(tp_recent.AvgPrice, 0) as Price
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
      AND t.Id IN (SELECT Id FROM Transactions WHERE VouType = 27 ORDER BY Id LIMIT 17547)
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
      AND t.Id IN (SELECT Id FROM Transactions WHERE VouType = 27 ORDER BY Id LIMIT 17547)
    GROUP BY tp.VariantId
) tp_all ON pv.Id = tp_all.VariantId
WHERE p.IsActive = 1;
""")

rows = cur.fetchall()
print(f"Total active SKUs evaluated: {len(rows):,}")

sku_metrics = []
overstocked_alerts = []

for r in rows:
    prod_id, prod_name, var_id, current_stock, sales_30d, total_sales, price = r
    
    # 30-Day Average Daily Sales (ADS)
    ads = sales_30d / 30.0 if sales_30d > 0 else (total_sales / 165.0 if total_sales > 0 else 0.0)
    
    # Days of Inventory (DOI)
    if ads > 0:
        doi = current_stock / ads
    elif current_stock > 0:
        doi = 999.0 # Dead stock
    else:
        doi = 0.0 # Out of stock
        
    unit_price = float(price or 0)
    locked_capital = round(current_stock * unit_price, 2)
    
    sku_data = {
        'product_id': prod_id,
        'variant_id': var_id,
        'product_name': prod_name.strip(),
        'current_stock': round(current_stock, 1),
        'sales_30d': round(sales_30d, 1),
        'daily_velocity': round(ads, 3),
        'doi_days': round(doi, 1),
        'price': unit_price,
        'locked_capital': locked_capital
    }
    sku_metrics.append(sku_data)
    
    # Check DOI > 60 days alert
    if doi > 60.0 and current_stock > 0:
        urgency = 'CRITICAL' if doi >= 180.0 or locked_capital > 2500 else ('HIGH' if doi >= 90.0 else 'MEDIUM')
        action = 'Markdown 20% on Zero-Waste Fresh Shelf' if any(w in prod_name.lower() for w in ['milk', 'bread', 'curd', 'batter', 'egg', 'paneer']) else ('Bundle with High-Affinity Cross-Sell Partner' if locked_capital > 1500 else 'Store Floor Promo & Reorder Freeze')
        overstocked_alerts.append({
            **sku_data,
            'urgency': urgency,
            'alert_type': 'OVERSTOCKED_EXCESS_INVENTORY',
            'recommended_action': action
        })

overstocked_alerts.sort(key=lambda x: -x['locked_capital'])
print(f"\nSKUs with DOI > 60 days: {len(overstocked_alerts):,}")
total_locked = sum(x['locked_capital'] for x in overstocked_alerts)
print(f"Total Working Capital Locked in Overstocked Items: ₹{total_locked:,.2f}")

print("\nTop 10 Overstocked SKUs by Locked Capital:")
for a in overstocked_alerts[:10]:
    print(f"  {a['product_name']} | Stock: {a['current_stock']} | 30D Sales: {a['sales_30d']} | DOI: {a['doi_days']}d | Locked: ₹{a['locked_capital']:,.2f} | Action: {a['recommended_action']}")

conn.close()
