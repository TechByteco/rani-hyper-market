for p in ['admin.html', 'public/admin.html']:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    target = """    async function checkLicense() {
      const pill = document.getElementById('license-pill');
      if (pill) {
        pill.className = 'px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm';
        pill.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> License Active • Vercel Edge 2.0';
      }
    }
    }"""
    
    replacement = """    async function checkLicense() {
      const pill = document.getElementById('license-pill');
      if (pill) {
        pill.className = 'px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm';
        pill.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> License Active • Vercel Edge 2.0';
      }
    }"""

    if target in content:
        content = content.replace(target, replacement)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed extra brace in {p}')
    else:
        print(f'Target not found in {p}')
