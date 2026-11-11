import os
import json
import sqlite3
import datetime

def run_export():
    print("=== EXPORTING FRESH DATA FROM 21-OCT-2026 BACKUP ===")
    
    db_path = r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
    master_path = r'data\database\master.db'
    zip_path = r'G:\Full Backup RANI HYPER MARKET on 21-Oct-2026.zip'

    # Backup Info
    zip_stats = None
    if os.path.exists(zip_path):
        s = os.stat(zip_path)
        zip_stats = {
            "name": "Full Backup RANI HYPER MARKET on 21-Oct-2026.zip",
            "sizeBytes": s.st_size,
            "sizeMb": f"{s.st_size / (1024*1024):.2f} MB",
            "modified": datetime.datetime.fromtimestamp(s.st_mtime).isoformat(),
            "path": zip_path
        }

    # 1. Master Profile
    m_conn = sqlite3.connect(master_path)
    m_cur = m_conn.cursor()
    m_cur.execute("SELECT Id, Name, PhoneNumber, AddressLine, Email, TaxNumber FROM Entities WHERE Id = 1")
    e = m_cur.fetchone()
    m_conn.close()

    profile = {
        "tenant_id": "37a64e83-514d-4b00-b90a-9af172dacdd6",
        "username": "rani",
        "store_name": e[1] if e and e[1] else "RANI HYPER MARKET",
        "tagline": "Fresh Farm Groceries & Everyday Supermarket",
        "announcement": "🎉 Welcome to RANI HYPER MARKET! Free 30-min Delivery across Bodinayakanur!! Wholesale & Retail Rates.",
        "address": (e[3] if e and e[3] else "93, Sundara pandian street, Anwar complex, Near Kottai Karuppasamy Kovil, Bodinayakanur").replace('\n', ', '),
        "phone": e[2] if e and e[2] else "77088 34547, 88073 34547",
        "email": e[4] if e and e[4] else "rani.hypermarket@gmail.com",
        "tax_number": e[5] if e and e[5] else "33BAGPN1341C1ZC",
        "hours": "Mon - Sun: 7:00 AM - 10:00 PM",
        "about": "Welcome to RANI HYPER MARKET! Located at Anwar Complex, Sundara Pandian Street, Bodinayakanur. We offer complete grocery, dairy, and household essentials at the best rates with free delivery.",
        "hero_img": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800",
        "backup_info": zip_stats,
        "source_database": "9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db",
        "financial_year": "2026-2027",
        "last_updated": "2026-10-21T13:57:06Z"
    }

    with open('rani_store_profile.json', 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
    with open('public/rani_store_profile.json', 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
    print("[OK] Saved rani_store_profile.json & public/rani_store_profile.json")

    # Connect to Active Database
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # 2. Existing Product Images Map
    existing_images = {}
    if os.path.exists('products_catalog.json'):
        with open('products_catalog.json', 'r', encoding='utf-8') as f:
            old_cat = json.load(f)
            for it in old_cat:
                img = it.get('image_url') or it.get('image')
                if img:
                    if it.get('id'):
                        existing_images[f"id_{it['id']}"] = img
                    if it.get('barcode'):
                        existing_images[f"bc_{it['barcode']}"] = img
                    if it.get('title'):
                        existing_images[f"t_{it['title'].strip().lower()}"] = img

    # 3. Extract Products
    print("Extracting Products from ProductVariants...")
    prod_query = """
        SELECT 
          p.Id as id,
          p.Name as title,
          pv.Mrp as mrp,
          pv.SalesRate as price,
          pv.PurchaseRate as cost,
          pv.Stock as stock,
          pv.Code as barcode,
          pv.Units as unit,
          pv.Id as variant_id
        FROM Products p
        JOIN ProductVariants pv ON p.Id = pv.ProductId
        WHERE p.IsActive = 1 AND pv.SalesRate > 0
        ORDER BY p.Id ASC
    """
    cur.execute(prod_query)
    prod_rows = cur.fetchall()

    products = []
    catalog = []
    default_img = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"

    for r in prod_rows:
        pid, raw_title, mrp, price, cost, raw_stock, barcode, unit, var_id = r
        title = raw_title.strip() if raw_title else f"Product #{pid}"
        
        try:
            stock = int(float(raw_stock)) if raw_stock not in [None, '', 'Stock'] else 50
        except:
            stock = 50

        price = float(price or 0)
        mrp = float(mrp) if mrp and mrp > price else round(price * 1.15, 2)
        cost = float(cost) if cost and cost > 0 else round(price * 0.84, 2)
        barcode = str(barcode).strip() if barcode else ""
        unit = str(unit).strip() if unit else "1 unit"

        # Resolve image
        img = None
        if f"id_{pid}" in existing_images:
            img = existing_images[f"id_{pid}"]
        elif barcode and f"bc_{barcode}" in existing_images:
            img = existing_images[f"bc_{barcode}"]
        elif f"t_{title.lower()}" in existing_images:
            img = existing_images[f"t_{title.lower()}"]
        else:
            img = default_img

        prod_item = {
            "id": pid,
            "title": title,
            "mrp": mrp,
            "price": price,
            "cost": cost,
            "stock": stock,
            "barcode": barcode,
            "unit": unit,
            "variant_id": var_id,
            "image_url": img
        }
        products.append(prod_item)

        catalog_item = {
            "id": pid,
            "title": title,
            "price": price,
            "mrp": mrp,
            "stock": stock,
            "unit": unit,
            "image_url": img,
            "barcode": barcode,
            "image": img
        }
        catalog.append(catalog_item)

    print(f"[OK] Extracted {len(products)} products (catalog size: {len(catalog)})")

    with open('rani_products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False)
    with open('public/rani_products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False)

    with open('products_catalog.json', 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False)
    with open('public/products_catalog.json', 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False)

    print("[OK] Saved rani_products.json & products_catalog.json (mirrored to public/)")

    # 4. Extract Customers
    print("Extracting Customers from AccountLedgers...")
    cust_query = """
        SELECT Id, Name, PhoneNumber, AddressLine, City, Pincode
        FROM AccountLedgers
        WHERE PhoneNumber IS NOT NULL AND PhoneNumber != ''
    """
    cur.execute(cust_query)
    cust_rows = cur.fetchall()

    customers = []
    cust_map = {}
    for r in cust_rows:
        cid, name, phone, addr, city, pin = r
        clean_name = (name or "Customer").strip()
        clean_phone = (phone or "").strip()
        address_parts = [p.strip() for p in [addr, city, pin] if p and p.strip()]
        full_addr = ", ".join(address_parts) if address_parts else "Bodinayakanur"
        c_obj = {
            "id": cid,
            "name": clean_name,
            "phone": clean_phone,
            "address": full_addr,
            "frequency": 0,
            "totalSpent": 0.0,
            "lastOrder": None
        }
        customers.append(c_obj)
        cust_map[clean_phone] = c_obj

    print(f"[OK] Extracted {len(customers)} registered customers with phones")

    # 5. Extract Transactions / Orders
    print("Extracting All Transactions...")
    tx_query = """
        SELECT 
          t.Id as trans_id,
          t.VoucherNo as voucher_no,
          t.VoucherDate as voucher_date,
          t.CreatedOn as created_on,
          ti.NetAmount as net_amount,
          ti.SubTotal as sub_total,
          ti.Profit as profit,
          al.Name as customer_name,
          al.PhoneNumber as customer_phone,
          al.AddressLine as customer_address,
          t.IsActive
        FROM Transactions t
        JOIN TransInventories ti ON t.Id = ti.TransId
        LEFT JOIN AccountLedgers al ON t.LedgerId = al.Id
        WHERE t.IsActive = 1
        ORDER BY t.Id DESC
    """
    cur.execute(tx_query)
    tx_rows = cur.fetchall()

    orders = []
    day_wise = {}
    month_wise = {}

    tot_sales = 0.0
    tot_profit = 0.0
    tot_cost = 0.0

    for r in tx_rows:
        tid, v_no, v_date, created_on, net_amt, sub_tot, profit, c_name, c_phone, c_addr, is_active = r

        net = float(net_amt or 0)
        prof = float(profit or 0)
        cst = max(0.0, net - prof)

        tot_sales += net
        tot_profit += prof
        tot_cost += cst

        date_str = str(v_date)[:10]
        created_iso = created_on.replace(' ', 'T') + 'Z' if created_on else (date_str + 'T12:00:00Z')

        # Day Stats
        if date_str not in day_wise:
            day_wise[date_str] = { "date": date_str, "count": 0, "sales": 0.0, "cost": 0.0, "profit": 0.0 }
        day_wise[date_str]["count"] += 1
        day_wise[date_str]["sales"] = round(day_wise[date_str]["sales"] + net, 2)
        day_wise[date_str]["cost"] = round(day_wise[date_str]["cost"] + cst, 2)
        day_wise[date_str]["profit"] = round(day_wise[date_str]["profit"] + prof, 2)

        # Month Stats
        m_str = date_str[:7]
        if m_str not in month_wise:
            month_wise[m_str] = { "month": m_str, "count": 0, "sales": 0.0, "cost": 0.0, "profit": 0.0 }
        month_wise[m_str]["count"] += 1
        month_wise[m_str]["sales"] = round(month_wise[m_str]["sales"] + net, 2)
        month_wise[m_str]["cost"] = round(month_wise[m_str]["cost"] + cst, 2)
        month_wise[m_str]["profit"] = round(month_wise[m_str]["profit"] + prof, 2)

        # Customer matching
        cust_display = (c_name or "").strip()
        if not cust_display or cust_display in ["Cash Party", "Counter Cash"]:
            cust_display = "Walk-in Customer"
        cust_ph = (c_phone or "").strip() or "9876543210"

        if c_phone and c_phone.strip() in cust_map:
            cm = cust_map[c_phone.strip()]
            cm["frequency"] += 1
            cm["totalSpent"] = round(cm["totalSpent"] + net, 2)
            if not cm["lastOrder"] or created_iso > cm["lastOrder"]:
                cm["lastOrder"] = created_iso

        orders.append({
            "id": f"RANI-{v_no}",
            "db_id": tid,
            "voucher_no": v_no,
            "voucher_date": date_str,
            "created_at": created_iso,
            "status": "delivered",
            "payment_method": "Cash / Counter POS",
            "total_amount": net,
            "cost": cst,
            "profit": prof,
            "customer_name": cust_display,
            "customer_phone": cust_ph,
            "shipping_address": f"{cust_display} | Ph: {cust_ph} | {c_addr or 'Bodinayakanur Town'}",
            "product_summary": f"POS Retail Bill #{v_no}"
        })

    conn.close()

    print(f"[OK] Processed {len(orders)} total orders.")
    print(f"  Turnover: Rs. {tot_sales:,.2f} | Profit: Rs. {tot_profit:,.2f} | Cost: Rs. {tot_cost:,.2f}")

    # Top 1,000 Recent Orders for rapid dashboard loading
    recent_orders = orders[:1000]

    with open('rani_orders.json', 'w', encoding='utf-8') as f:
        json.dump(recent_orders, f, ensure_ascii=False)
    with open('public/rani_orders.json', 'w', encoding='utf-8') as f:
        json.dump(recent_orders, f, ensure_ascii=False)

    with open('rani_customers.json', 'w', encoding='utf-8') as f:
        json.dump(customers, f, indent=2, ensure_ascii=False)
    with open('public/rani_customers.json', 'w', encoding='utf-8') as f:
        json.dump(customers, f, indent=2, ensure_ascii=False)

    # 6. Analytics Overview
    analytics = {
        "totalOrders": len(orders),
        "totalSales": round(tot_sales, 2),
        "totalCost": round(tot_cost, 2),
        "totalProfit": round(tot_profit, 2),
        "dayWise": day_wise,
        "monthWise": month_wise,
        "backupFile": "Full Backup RANI HYPER MARKET on 21-Oct-2026.zip",
        "backupDate": "2026-10-21T13:57:06Z",
        "dateRange": {
            "start": min(day_wise.keys()),
            "end": max(day_wise.keys())
        }
    }

    with open('rani_analytics.json', 'w', encoding='utf-8') as f:
        json.dump(analytics, f, indent=2, ensure_ascii=False)
    with open('public/rani_analytics.json', 'w', encoding='utf-8') as f:
        json.dump(analytics, f, indent=2, ensure_ascii=False)

    print("[OK] Saved rani_orders.json, rani_customers.json, and rani_analytics.json")
    print("=== DATA EXPORT SUCCESSFULLY COMPLETED! ===")

if __name__ == '__main__':
    run_export()
