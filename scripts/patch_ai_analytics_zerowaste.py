card_html = """
      <!-- Perishable Spoilage Prevention & Waste Recovery Card -->
      <div class="bg-gray-900 border border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-emerald-400">Zero-Waste Spoilage Saved</p>
            <h3 class="text-2xl font-extrabold text-white mt-1">96.4%</h3>
          </div>
          <div class="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <i data-lucide="leaf" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="mt-3 text-xs text-emerald-400 font-medium flex items-center gap-1">
          <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
          <span>₹4,850/mo Capital Recovered</span>
        </div>
      </div>
"""

for fp in ['ai-analytics.html', 'public/ai-analytics.html']:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'Zero-Waste Spoilage Saved' not in content:
        # Update grid cols to 6
        content = content.replace('lg:grid-cols-5 gap-4" id="kpi-container"', 'lg:grid-cols-6 gap-4" id="kpi-container"')
        
        # Insert after Est. Gross Margin card
        target = 'id="kpi-margin">18.5%</h3>'
        idx = content.find(target)
        if idx != -1:
            div_end = content.find('</div>\n    </div>', idx)
            if div_end != -1:
                div_end += 6  # after first </div>
                content = content[:div_end] + card_html + content[div_end:]
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Added Zero-Waste card to {fp}")
            else:
                print(f"Could not find end of card in {fp}")
        else:
            print(f"Could not find kpi-margin in {fp}")
    else:
        print(f"Card already present in {fp}")
