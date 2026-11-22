import sqlite3

db = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db)
cur = conn.cursor()

# Check Stock values in ProductVariants
stats = cur.execute("""
    SELECT 
        COUNT(*),
        COUNT(CASE WHEN Stock > 0 THEN 1 END),
        COUNT(CASE WHEN Stock >= 15 THEN 1 END),
        SUM(CASE WHEN Stock >= 15 THEN Stock * COALESCE(PurchaseRate, PurchaseCost, SalesRate * 0.8) END),
        AVG(CASE WHEN Stock > 0 THEN Stock END),
        MAX(Stock)
    FROM ProductVariants
    WHERE IsActive = 1
""").fetchone()

print(f"Total Active Variants: {stats[0]}")
print(f"Variants with Stock > 0: {stats[1]}")
print(f"Variants with Stock >= 15: {stats[2]}")
print(f"Capital Locked in Stock >= 15: Rs. {stats[3]:,.2f}" if stats[3] else "None")
print(f"Avg Stock: {stats[4]:.1f} | Max Stock: {stats[5]}")

# Also check predicted_5yr_inventory_movement.json
import os, json
if os.path.exists('data/predicted_5yr_inventory_movement.json') or os.path.exists('predicted_5yr_inventory_movement.json'):
    p_path = 'data/predicted_5yr_inventory_movement.json' if os.path.exists('data/predicted_5yr_inventory_movement.json') else 'predicted_5yr_inventory_movement.json'
    print(f"Found {p_path} ({os.path.getsize(p_path) / (1024*1024):.2f} MB)")

conn.close()
