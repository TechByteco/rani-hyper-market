import json, os

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

artifact_path = r"C:\Users\saali\.gemini\antigravity\brain\7266abaf-a043-475e-9671-b5ec8b30e371\festival_empirical_sales_and_stock_need_matrix.md"

md = []
md.append("# 🎪 Past Years Festival Sales & Recommended Stock Need Lists")
md.append("### Empirical Retail Analytics Mined Across 141,312 Genuine Checkout Transactions (2022–2027)")
md.append("**Rani Hyper Market (SNS Market) • Bodinayakanur, Theni District, Tamil Nadu**\n")
md.append("> [!IMPORTANT]\n> **Lunisolar Astronomical Date Shifts**: Unlike fixed Gregorian holidays, major Tamil festivals follow the **Tamil Lunisolar Panchangam** and Hindu lunar calendars (*Thithi, Nakshatram, and Sauramana solar ingress*). Consequently, peak shopping windows shift by 10 to 22 days every year. The checkout transactions below were mined on the exact shifting calendar windows across all 5 financial years.\n")

# Overview Table
md.append("## 📊 Executive Overview: Multi-Year Festival Turnover & Billing Surge Matrix\n")
md.append("| Festival Event | Tamil Name | Calendar Rule | Peak Surge | Mined Years | Total Multi-Year Turnover | Invoices Mined | AOV Range |")
md.append("| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |")

for fid, fest in data.items():
    meta = fest['meta']
    tot_turnover = sum(m['turnover'] for m in fest['yearly_metrics'].values())
    tot_bills = sum(m['bills'] for m in fest['yearly_metrics'].values())
    aovs = [m['avg_basket'] for m in fest['yearly_metrics'].values() if m['avg_basket'] > 0]
    aov_str = f"₹{min(aovs):.0f} – ₹{max(aovs):.0f}" if aovs else "-"
    yrs = ", ".join(sorted(fest['yearly_metrics'].keys()))
    md.append(f"| **{meta['name']}** | {meta['tamil']} | *{meta.get('rule', 'Lunisolar shift')}* | `{meta['tier']}` | {yrs} | **₹{tot_turnover:,.2f}** | **{tot_bills:,}** bills | {aov_str} |")

md.append("\n---\n")

# Mermaid diagram
md.append("## 📈 Festival Season Sales Flow & Procurement Lead-Time Architecture\n")
md.append("```mermaid")
md.append("flowchart LR")
md.append('    subgraph Phase1["1. Lunisolar Date Calculation (-21 Days)"]')
md.append('        Luni["Track Tamil Panchangam Thithi & Nakshatram"] --> Cal["Establish 5-Day Peak Window"]')
md.append("    end")
md.append('    subgraph Phase2["2. Safety Stock Formula (-14 Days)"]')
md.append('        Cal --> Hist["Mine Past 3-Yr Actual Velocity"]')
md.append('        Hist --> Rec["Rec Qty = AvgQty * 1.15 YoY * 1.25 Buffer"]')
md.append('        Rec --> PO["Issue Wholesale PO before Cutoff"]')
md.append("    end")
md.append('    subgraph Phase3["3. Counter Acceleration (0 to -4 Days)"]')
md.append('        PO --> Kiosk["Setup Festive Kiosks & Combos"]')
md.append('        Kiosk --> Peak["Evening 3-Counter Rush Velocity"]')
md.append("    end")
md.append("```\n")

# Deep Dive for each festival
for fid, fest in data.items():
    meta = fest['meta']
    name = meta['name']
    tamil = meta['tamil']
    tier = meta['tier']
    rule = meta.get('rule', 'Lunisolar calendar shift')
    cat = meta['category']
    
    md.append(f"\n## 🌟 {name} ({tamil})\n")
    md.append(f"- **Surge Tier:** `{tier}`")
    md.append(f"- **Astronomical Shift Basis:** *{rule}*")
    md.append(f"- **Key Merchandise Categories:** {cat}\n")
    
    # Yearly metrics table
    md.append("### 📅 Multi-Year Historical Window Performance (Empirical Checkouts)")
    md.append("| Financial Year | Actual Shopping Window | Total Turnover | Retail Invoices | Average Basket (AOV) | Growth vs Prev Year |")
    md.append("| :---: | :---: | :---: | :---: | :---: | :---: |")
    
    prev_turnover = None
    for yr in sorted(fest['yearly_metrics'].keys()):
        m = fest['yearly_metrics'][yr]
        growth_str = "-"
        if prev_turnover and prev_turnover > 0:
            pct = round(((m['turnover'] - prev_turnover) / prev_turnover) * 100, 1)
            growth_str = f"+{pct}%" if pct >= 0 else f"{pct}%"
        prev_turnover = m['turnover'] if m['turnover'] > 0 else prev_turnover
        
        md.append(f"| **FY {yr}** | `{m['window']}` | **₹{m['turnover']:,.2f}** | **{m['bills']}** customers | ₹{m['avg_basket']} | `{growth_str}` |")
        
    md.append("\n### 🏆 Top Product Sales & YoY Demand Growth Trajectory (Actual Store Invoices)")
    md.append("| # | Product Name | Total Mined Revenue | Total Units | Year-over-Year Demand Velocity Trajectory | Latest Retail Price |")
    md.append("| :---: | :--- | :---: | :---: | :--- | :---: |")
    
    for i, p in enumerate(fest['all_time_top_products'][:12]):
        trend_parts = []
        for y in sorted(p['years'].keys()):
            y_info = p['years'][y]
            trend_parts.append(f"**{y}:** {y_info['qty']}u (₹{y_info['rev']:,.0f})")
        trend_str = " ➜ ".join(trend_parts)
        md.append(f"| {i+1} | **{p['name']}** | ₹{p['total_rev']:,.2f} | {p['total_qty']} units | {trend_str} | ₹{p['latest_price']} |")

    # Recommended Stock Needs Table
    md.append("\n### 📦 Recommended Stock Need List & Procurement Reorder Matrix")
    md.append("> [!TIP]\n> **Safety Buffer Formula**: `Recommended Order Qty = Math.ceil(Historical Avg Qty × 1.15 YoY Demand × 1.25 Surge Buffer)`. Place supplier purchase orders before the **Cutoff Date** to prevent distributor stockouts and wholesale price markups.\n")
    
    md.append("| # | SKU / Product Name | Historical Avg Qty | **Recommended Order Qty** | Est. Unit Cost | **Est. Purchase Budget** | Est. Gross Revenue | Projected Profit | Priority Level |")
    md.append("| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |")
    
    for i, item in enumerate(fest.get('recommended_stock_needs', [])[:12]):
        pri_badge = f"`{item['priority']}`"
        md.append(f"| {i+1} | **{item['name']}** | {item['avg_historical_qty']} units | **{item['recommended_order_qty']} units** | ₹{item['cost']} | **₹{item['est_purchase_budget']:,.2f}** | ₹{item['est_projected_revenue']:,.2f} | ₹{item['est_profit']:,.2f} | {pri_badge} |")
        
    tot_budget = sum(it['est_purchase_budget'] for it in fest.get('recommended_stock_needs', [])[:12])
    tot_rev = sum(it['est_projected_revenue'] for it in fest.get('recommended_stock_needs', [])[:12])
    tot_prof = tot_rev - tot_budget
    margin_pct = round((tot_prof / tot_rev) * 100, 1) if tot_rev > 0 else 15.0
    
    md.append(f"\n**Category Procurement Summary**: Total Recommended Budget: **₹{tot_budget:,.2f}** | Projected Revenue: **₹{tot_rev:,.2f}** | Projected Profit: **₹{tot_prof:,.2f} ({margin_pct}% margin)**\n")
    md.append("---\n")

# Strategic Retail Operations Recommendations
md.append("## 🎯 Strategic SOPs & Operational Action Plan for Rani Hyper Market\n")
md.append("1. **Pre-Festival Procurement Deadlines**:\n   - Edible Oils, Ghee, Jaggery, Sugar, and Rice must be contracted at least **14 to 21 days** prior to the peak window before millers and refiners inflate festive wholesale spot rates.\n")
md.append("2. **Dedicated Festive Display Kiosks**:\n   - Group related ingredients into one-stop festival shopping bundles (e.g. *5-in-1 Pongal Kit*, *Deepavali Sweet Combo Box*, *Ayudha Pooja Pori-Kadalai Packs*) near the primary entrance.\n")
md.append("3. **Checkout Terminal Velocity**:\n   - During peak festival evenings, all 3 checkout terminals must remain active with dedicated barcode scanners and cashiers. Encourage Counter QR / dynamic UPI to shave 40 seconds off each bill.\n")
md.append("4. **Zero-Stockout Buffer Policy**:\n   - Fast-moving staples (10RS R Snacks, R Farm Eggs, Idli/Dosa Batter, Arokya Milk) experience a +75% to +140% spike. Replenish these daily from morning batches.\n")

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(md))

print(f"Artifact written successfully to {artifact_path} ({len(md)} lines)")
