for fp in ['orders.html', 'public/orders.html']:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    target = "title=\"Send WhatsApp Status Alert to Customer\""
    idx = content.find(target)
    if idx != -1:
        end_btn = content.find('</button>', idx) + 9
        if 'sendWhatsAppEbill' not in content[end_btn:end_btn+300]:
            ebill_btn = """
              <button type="button" onclick="sendWhatsAppEbill('${order.id}')" title="Send Official WhatsApp Tax Invoice E-Bill" class="px-2 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold border border-green-700 flex items-center gap-1 transition active:scale-95 cursor-pointer">
                <i class="fa-solid fa-receipt text-yellow-300"></i>
                <span class="hidden sm:inline">E-Bill</span>
              </button>"""
            content = content[:end_btn] + ebill_btn + content[end_btn:]
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Added E-Bill button to {fp}")
        else:
            print(f"E-Bill button already present in {fp}")
    else:
        print(f"Target not found in {fp}")
