import os

with open('scripts/generated_festival_copilot.js', 'r', encoding='utf-8') as f:
    copilot_js = f.read()

dispatch_trigger = """          // Store details / owner / contact
          if (q.includes('owner') || q.includes('who is rani') || q.includes('store address') || q.includes('contact') || q.includes('phone') || q.includes('whatsapp') || q.includes('where is')) {
            return this.handleStoreDetails();
          }

          // Festival Multi-Year Sales, YoY Product Growth & Recommended Stock Need Lists (141,312 Invoices)
          if (q.includes('festival') || q.includes('deepavali') || q.includes('diwali') || q.includes('pongal') || q.includes('ayudha') || q.includes('vinayakar') || q.includes('chaturthi') || q.includes('karthigai') || q.includes('krishna jayanthi') || q.includes('tamil new year') || q.includes('aadi 18') || q.includes('stock need') || q.includes('festival sales') || q.includes('lunisolar')) {
            return this.handleFestivalAnalytics(rawQuery);
          }"""

old_store_details = """          // Store details / owner / contact
          if (q.includes('owner') || q.includes('who is rani') || q.includes('store address') || q.includes('contact') || q.includes('phone') || q.includes('whatsapp') || q.includes('where is')) {
            return this.handleStoreDetails();
          }"""

target_closing = """        `;
      }
    };"""

new_closing = """        `;
      }
    };

""" + copilot_js

for filepath in ['admin.html', 'public/admin.html']:
    if not os.path.exists(filepath):
        print('Skipping non-existent:', filepath)
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject trigger
    if 'handleFestivalAnalytics(rawQuery)' not in content:
        if old_store_details in content:
            content = content.replace(old_store_details, dispatch_trigger, 1)
            print(f'Injected festival trigger into {filepath}')
        else:
            print(f'Could not find old_store_details in {filepath}')

    # 2. Inject methods
    if 'COPILOT_FESTIVALS_DATA' not in content:
        if target_closing in content:
            content = content.replace(target_closing, new_closing, 1)
            print(f'Injected festival methods into {filepath}')
        else:
            print(f'Could not find target_closing in {filepath}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Injection complete!')
