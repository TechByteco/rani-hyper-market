import datetime, json

# 1. Target festivals with surge multipliers
FESTIVAL_CONFIG = {
    "pongal_harvest": {
        "id": "pongal_harvest",
        "name": "Thai Pongal (Harvest Week)",
        "tamilName": "தைப்பொங்கல் திருநாள் (அறுவடை வாரம்)",
        "surgeMultiplier": 3.20,
        "surgePercent": "+220%",
        "calendarRule": "Makar Sankranti / Thai 1 (Solar Ingress)",
        "commodityBasket": "Raw rice, Country jaggery, Ghee, Cashews, Turmeric plants",
        "vendor": {
            "name": "Sri Meenakshi Agro Mandi & Rice Mill",
            "location": "Madurai & Theni APMC Yard",
            "code": "VND-MDU-RICE-01",
            "leadDays": 7
        },
        "datesByYear": {
            "2026": "2026-01-14",
            "2027": "2027-01-15",
            "2028": "2028-01-15",
            "2029": "2029-01-14",
            "2030": "2030-01-14",
            "2031": "2031-01-15",
            "2032": "2032-01-15",
            "2033": "2033-01-14",
            "2034": "2034-01-14",
            "2035": "2035-01-14"
        },
        "items": [
            {"sku": "First Grade Pacharisi (Raw Rice 10kg)", "baseDaily": 25, "mandiCost": 440.0, "spotCost": 560.0, "mrp": 620.0, "currStock": 45},
            {"sku": "Mandi Round Vellam / Jaggery 1kg", "baseDaily": 30, "mandiCost": 46.5, "spotCost": 62.0, "mrp": 70.0, "currStock": 60},
            {"sku": "Pure Ghee Jar 500ml (Hat/GRB)", "baseDaily": 18, "mandiCost": 385.0, "spotCost": 475.0, "mrp": 500.0, "currStock": 32},
            {"sku": "W320 Premium Cashews (Kaju) 500g", "baseDaily": 12, "mandiCost": 375.0, "spotCost": 480.0, "mrp": 520.0, "currStock": 20},
            {"sku": "Bodi Fresh Cardamom 8mm Bold 250g", "baseDaily": 8, "mandiCost": 620.0, "spotCost": 790.0, "mrp": 850.0, "currStock": 15},
            {"sku": "Fresh Green Turmeric Plants (கொத்து மஞ்சள்)", "baseDaily": 40, "mandiCost": 20.0, "spotCost": 38.0, "mrp": 45.0, "currStock": 10}
        ]
    },
    "chithirai_thiruvizha": {
        "id": "chithirai_thiruvizha",
        "name": "Chithirai Thiruvizha (Summer Festive Season)",
        "tamilName": "சித்திரைத் திருவிழா (கோடைக்கால பானங்கள் & பழங்கள்)",
        "surgeMultiplier": 1.85,
        "surgePercent": "+85%",
        "calendarRule": "Chithirai Pournami (Full Moon in Chithirai / April-May)",
        "commodityBasket": "Mineral water, Spiced Buttermilk, Watermelons, Bovonto, Glucose",
        "vendor": {
            "name": "Cumbum Valley Beverage Depot & Agro Cold Chain",
            "location": "Cumbum Valley & Theni",
            "code": "VND-CBM-BEV-04",
            "leadDays": 7
        },
        "datesByYear": {
            "2026": "2026-05-01",
            "2027": "2027-04-20",
            "2028": "2028-05-08",
            "2029": "2029-04-28",
            "2030": "2030-04-17",
            "2031": "2031-05-06",
            "2032": "2032-04-25",
            "2033": "2033-05-14",
            "2034": "2034-05-03",
            "2035": "2035-04-23"
        },
        "items": [
            {"sku": "Kinley / Aquafina Mineral Water 1L (Case of 12)", "baseDaily": 45, "mandiCost": 105.0, "spotCost": 150.0, "mrp": 180.0, "currStock": 50},
            {"sku": "Arokya Spiced Buttermilk 200ml (Crate of 30)", "baseDaily": 35, "mandiCost": 210.0, "spotCost": 290.0, "mrp": 330.0, "currStock": 40},
            {"sku": "Cumbum Sweet Watermelons (Per Quintal / 100kg)", "baseDaily": 15, "mandiCost": 980.0, "spotCost": 1650.0, "mrp": 2000.0, "currStock": 12},
            {"sku": "Bovonto Grape/Fruit Soda 1.5L (Case of 6)", "baseDaily": 25, "mandiCost": 410.0, "spotCost": 520.0, "mrp": 600.0, "currStock": 25},
            {"sku": "Dabur Glucose-D Energy Drink 500g", "baseDaily": 22, "mandiCost": 102.0, "spotCost": 135.0, "mrp": 155.0, "currStock": 30}
        ]
    },
    "ayudha_pooja": {
        "id": "ayudha_pooja",
        "name": "Ayudha Pooja (Commercial Shop Worship)",
        "tamilName": "ஆயுத பூஜை & சரஸ்வதி பூஜை (வணிக நிறுவன வழிபாடு)",
        "surgeMultiplier": 2.10,
        "surgePercent": "+110%",
        "calendarRule": "Purattasi Mahanavami (Navaratri 9th Tithi / Sep-Oct)",
        "commodityBasket": "Pori, Kadalai, Camphor, Agarbatti, Sweet boxes, Lamp oil",
        "vendor": {
            "name": "Dindigul Agro Pori Mills & Pooja Essentials Ltd",
            "location": "Dindigul Mandi & Bodi Traders",
            "code": "VND-DGL-PORI-03",
            "leadDays": 7
        },
        "datesByYear": {
            "2026": "2026-10-19",
            "2027": "2027-10-09",
            "2028": "2028-09-27",
            "2029": "2029-10-16",
            "2030": "2030-10-05",
            "2031": "2031-10-24",
            "2032": "2032-10-13",
            "2033": "2033-10-02",
            "2034": "2034-10-21",
            "2035": "2035-10-10"
        },
        "items": [
            {"sku": "Fresh Puffed Rice (Pori 500g Wholesale Polybag)", "baseDaily": 80, "mandiCost": 12.5, "spotCost": 22.0, "mrp": 28.0, "currStock": 120},
            {"sku": "Jeyyam Porikadalai (Roasted Gram 500g)", "baseDaily": 50, "mandiCost": 68.0, "spotCost": 92.0, "mrp": 105.0, "currStock": 80},
            {"sku": "Zed Black Pure Camphor Tablet Tin 50g", "baseDaily": 40, "mandiCost": 38.0, "spotCost": 58.0, "mrp": 70.0, "currStock": 50},
            {"sku": "Cycle Pure Agarbatti Master Carton (48 Packs)", "baseDaily": 25, "mandiCost": 105.0, "spotCost": 145.0, "mrp": 175.0, "currStock": 35},
            {"sku": "Dheepam / Porna Lamp Pooja Oil Pet 1L", "baseDaily": 30, "mandiCost": 162.0, "spotCost": 215.0, "mrp": 240.0, "currStock": 45},
            {"sku": "Festive Sweet Candy Drops & Jaggery 500g", "baseDaily": 35, "mandiCost": 30.0, "spotCost": 45.0, "mrp": 55.0, "currStock": 40}
        ]
    },
    "deepavali": {
        "id": "deepavali",
        "name": "Deepavali (Sweet Making Rush)",
        "tamilName": "தீபாவளி பெருந்திருவிழா (பலகார சீசன் & இனிப்புகள்)",
        "surgeMultiplier": 2.35,
        "surgePercent": "+135%",
        "calendarRule": "Aipasi Amavasya / Naraka Chaturdashi (Lunisolar Oct-Nov)",
        "commodityBasket": "Ghee, Maida, Rava, Sunflower oil, Sugar, Besan",
        "vendor": {
            "name": "Sundaram Oil Mills & Agro Traders",
            "location": "Theni Wholesale Bazaar & Salem",
            "code": "VND-THN-OIL-02",
            "leadDays": 7
        },
        "datesByYear": {
            "2026": "2026-11-08",
            "2027": "2027-10-29",
            "2028": "2028-10-17",
            "2029": "2029-11-05",
            "2030": "2030-10-26",
            "2031": "2031-11-14",
            "2032": "2032-11-02",
            "2033": "2033-10-22",
            "2034": "2034-11-10",
            "2035": "2035-10-30"
        },
        "items": [
            {"sku": "Gold Winner Refined Sunflower Oil Jar 5L", "baseDaily": 45, "mandiCost": 590.0, "spotCost": 740.0, "mrp": 795.0, "currStock": 60},
            {"sku": "Pure Aavin / GRB Ghee Tin 1L", "baseDaily": 25, "mandiCost": 780.0, "spotCost": 960.0, "mrp": 1050.0, "currStock": 35},
            {"sku": "Anil / Naga First Quality Maida 1kg", "baseDaily": 55, "mandiCost": 31.5, "spotCost": 42.0, "mrp": 48.0, "currStock": 80},
            {"sku": "Naga Roasted Sooji / Rava 1kg", "baseDaily": 40, "mandiCost": 64.0, "spotCost": 85.0, "mrp": 95.0, "currStock": 50},
            {"sku": "Refined White Sugar Bag 5kg", "baseDaily": 50, "mandiCost": 195.0, "spotCost": 250.0, "mrp": 275.0, "currStock": 75},
            {"sku": "Pure Bengal Gram Flour (Besan / Kadalai Maavu 1kg)", "baseDaily": 35, "mandiCost": 68.0, "spotCost": 88.0, "mrp": 100.0, "currStock": 45}
        ]
    }
}

# 2. Calculation logic
def compute_festival_schedule(year=2026):
    results = []
    for fid, f in FESTIVAL_CONFIG.items():
        fdate_str = f["datesByYear"].get(str(year))
        if not fdate_str:
            continue
        fdate = datetime.datetime.strptime(fdate_str, "%Y-%m-%d").date()
        t_minus_14 = fdate - datetime.timedelta(days=14)
        t_minus_7 = fdate - datetime.timedelta(days=7)
        t_minus_5 = fdate - datetime.timedelta(days=5)
        t_minus_3 = fdate - datetime.timedelta(days=3)
        t_minus_1 = fdate - datetime.timedelta(days=1)

        # PO generation for T-14
        po_lines = []
        total_mandi_cost = 0.0
        total_spot_cost = 0.0
        total_mrp_value = 0.0

        for item in f["items"]:
            # 14-day surge forecast
            surge_forecast = int(round(item["baseDaily"] * 14 * (f["surgeMultiplier"] / 2.0)))
            # Net procurement: forecast - current + buffer
            reorder_qty = max(10, int(round(surge_forecast * 1.15)) - item["currStock"])
            line_mandi = reorder_qty * item["mandiCost"]
            line_spot = reorder_qty * item["spotCost"]
            line_mrp = reorder_qty * item["mrp"]
            savings = line_spot - line_mandi

            po_lines.append({
                "sku": item["sku"],
                "base_daily_sales": item["baseDaily"],
                "surge_multiplier": f["surgeMultiplier"],
                "surge_forecast_units": surge_forecast,
                "current_stock": item["currStock"],
                "net_reorder_units": reorder_qty,
                "mandi_wholesale_rate": item["mandiCost"],
                "spot_surge_rate": item["spotCost"],
                "mrp": item["mrp"],
                "po_line_total": round(line_mandi, 2),
                "spot_cost_if_delayed": round(line_spot, 2),
                "lock_in_savings": round(savings, 2)
            })

            total_mandi_cost += line_mandi
            total_spot_cost += line_spot
            total_mrp_value += line_mrp

        total_savings = total_spot_cost - total_mandi_cost
        savings_pct = round((total_savings / total_spot_cost) * 100, 1)

        po_object = {
            "po_number": f"PO-{year}-{fdate.strftime('%m%d')}-{fid.upper()[:8]}",
            "festival_id": fid,
            "festival_name": f["name"],
            "tamil_name": f["tamilName"],
            "surge_multiplier": f["surgeMultiplier"],
            "po_generation_date_t14": str(t_minus_14),
            "vendor_delivery_deadline_t7": str(t_minus_7),
            "festival_onset_date": str(fdate),
            "vendor": f["vendor"],
            "line_items": po_lines,
            "total_units": sum(l["net_reorder_units"] for l in po_lines),
            "total_mandi_po_amount": round(total_mandi_cost, 2),
            "spot_market_cost_if_delayed": round(total_spot_cost, 2),
            "mandi_lock_in_savings": round(total_savings, 2),
            "arbitrage_savings_percent": savings_pct,
            "status": "APPROVED_READY_FOR_DISPATCH"
        }

        results.append({
            "festival_id": fid,
            "name": f["name"],
            "tamil_name": f["tamilName"],
            "year": year,
            "festival_date": str(fdate),
            "t_minus_14_po_date": str(t_minus_14),
            "t_minus_7_delivery_date": str(t_minus_7),
            "campaign_stage_dates": {
                "t_minus_5_early_bird": str(t_minus_5),
                "t_minus_3_blast": str(t_minus_3),
                "t_minus_1_flash": str(t_minus_1)
            },
            "surge_multiplier": f["surgeMultiplier"],
            "commodity_basket": f["commodityBasket"],
            "purchase_order": po_object
        })

    return results

# Test run for 2026
data_2026 = compute_festival_schedule(2026)
print(f"Computed {len(data_2026)} festival schedules for 2026:")
for item in data_2026:
    po = item["purchase_order"]
    print("="*60)
    print(f"Festival: {item['name']} ({item['tamil_name']})")
    print(f"Date: {item['festival_date']} | T-14 PO Date: {item['t_minus_14_po_date']} | T-7 Delivery: {item['t_minus_7_delivery_date']}")
    print(f"PO Number: {po['po_number']} | Vendor: {po['vendor']['name']}")
    print(f"Total PO Amount: Rs. {po['total_mandi_po_amount']:,.2f} | Lock-in Savings: Rs. {po['mandi_lock_in_savings']:,.2f} ({po['arbitrage_savings_percent']}%)")
    print(f"SKU Lines count: {len(po['line_items'])}")
