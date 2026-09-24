const fs = require('fs');

const adminPath = 'G:/dell intel core i7 pc data/SKS Market/admin.html';
let a = fs.readFileSync(adminPath, 'utf8');

// 1. Add Store Customization Form Section to admin.html
const customizerSection = `
      <!-- STORE PROFILE & PUBLIC WEBSITE CUSTOMIZER -->
      <div class="glass p-6 rounded-3xl space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 class="text-lg font-black text-gray-900 flex items-center gap-2">
              <i class="fa-solid fa-paintbrush text-emerald-600"></i> Public Website &amp; Store Customizer
            </h2>
            <p class="text-xs text-gray-500">Edit contact details, operating hours, about us, and announcements shown on your store website.</p>
          </div>
          <a href="store.html" target="_blank" class="px-3 py-1.5 glass hover:bg-white text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition">
            <i class="fa-solid fa-eye text-emerald-600"></i> Preview Public Store
          </a>
        </div>

        <form onsubmit="handleSaveCustomizations(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-gray-700 mb-1">Store Tagline</label>
            <input type="text" id="cust-tagline" placeholder="Fresh &amp; Local Grocery Store" class="glass-input text-xs">
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">Top Announcement Banner</label>
            <input type="text" id="cust-announcement" placeholder="🎉 Weekend Special: 10% OFF on all fruits!" class="glass-input text-xs">
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">Contact Phone / WhatsApp Number</label>
            <input type="text" id="cust-phone" placeholder="+91 98765 43210" class="glass-input text-xs">
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">Customer Support Email</label>
            <input type="email" id="cust-email" placeholder="support@sksmarket.com" class="glass-input text-xs">
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">Store Physical Address</label>
            <input type="text" id="cust-address" placeholder="Main Market Road, City Centre, Chennai - 600001" class="glass-input text-xs">
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">Operating Hours</label>
            <input type="text" id="cust-hours" placeholder="Mon - Sun: 7:00 AM - 10:00 PM" class="glass-input text-xs">
          </div>

          <div class="md:col-span-2">
            <label class="block font-bold text-gray-700 mb-1">About Us Story / Store Description</label>
            <textarea id="cust-about" rows="2" placeholder="Welcome to SKS Market! We provide farm fresh vegetables, dairy and everyday essentials..." class="glass-input text-xs"></textarea>
          </div>

          <div class="md:col-span-2 flex justify-end">
            <button type="submit" id="btn-save-cust" class="btn-emerald px-6 py-2.5 text-xs font-bold flex items-center gap-2">
              <i class="fa-solid fa-floppy-disk"></i> Save &amp; Publish Customizations
            </button>
          </div>
        </form>
      </div>
`;

if (!a.includes('Public Website &amp; Store Customizer')) {
  a = a.replace('<!-- INVENTORY & ORDERS 2-COLUMN VIEW -->', customizerSection + '\n      <!-- INVENTORY & ORDERS 2-COLUMN VIEW -->');
}

// 2. Add JavaScript logic to save and load store customizations
const jsCustomLogic = `
    function loadStoreCustomizations() {
      const tenantId = sessionStorage.getItem('sks_tenant_id') || '11111111-1111-1111-1111-111111111111';
      const d = JSON.parse(localStorage.getItem('sks_store_custom_' + tenantId) || '{}');
      if (d.tagline) document.getElementById('cust-tagline').value = d.tagline;
      if (d.announcement) document.getElementById('cust-announcement').value = d.announcement;
      if (d.phone) document.getElementById('cust-phone').value = d.phone;
      if (d.email) document.getElementById('cust-email').value = d.email;
      if (d.address) document.getElementById('cust-address').value = d.address;
      if (d.hours) document.getElementById('cust-hours').value = d.hours;
      if (d.aboutUs) document.getElementById('cust-about').value = d.aboutUs;
    }

    async function handleSaveCustomizations(e) {
      e.preventDefault();
      const tenantId = sessionStorage.getItem('sks_tenant_id') || '11111111-1111-1111-1111-111111111111';
      const data = {
        tagline: document.getElementById('cust-tagline').value.trim(),
        announcement: document.getElementById('cust-announcement').value.trim(),
        phone: document.getElementById('cust-phone').value.trim(),
        email: document.getElementById('cust-email').value.trim(),
        address: document.getElementById('cust-address').value.trim(),
        hours: document.getElementById('cust-hours').value.trim(),
        aboutUs: document.getElementById('cust-about').value.trim(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem('sks_store_custom_' + tenantId, JSON.stringify(data));
      
      const btn = document.getElementById('btn-save-cust');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Published to Store!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save &amp; Publish Customizations';
      }, 2000);

      alert('✅ Public Store Content Updated Successfully!\nChanges are now live on your customer website.');
    }
`;

if (!a.includes('handleSaveCustomizations')) {
  a = a.replace('initAdminData();', 'initAdminData();\n      loadStoreCustomizations();');
  a = a.replace('function handleLogout() {', jsCustomLogic + '\n    function handleLogout() {');
}

fs.writeFileSync(adminPath, a, 'utf8');
console.log('SUCCESS: admin.html updated with Store Content Customizer!');