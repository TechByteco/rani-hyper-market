const fs = require('fs');

// 1. UPGRADE STORE.HTML & INDEX.HTML
const storePath = 'G:/dell intel core i7 pc data/SKS Market/store.html';
let s = fs.readFileSync(storePath, 'utf8');

const sideToastCSS = `
    #side-cart-toast {
      position: fixed;
      top: 84px;
      right: 20px;
      z-index: 9999;
      width: 320px;
      max-width: calc(100vw - 32px);
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(28px) saturate(200%);
      -webkit-backdrop-filter: blur(28px);
      border: 1.5px solid rgba(16, 185, 129, 0.45);
      border-radius: 20px;
      padding: 14px;
      box-shadow: 0 16px 48px rgba(16, 185, 129, 0.22), 0 4px 18px rgba(0,0,0,0.08);
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      pointer-events: none;
    }
    #side-cart-toast.show {
      transform: translateX(0);
      opacity: 1;
      pointer-events: auto;
    }
`;

if (!s.includes('#side-cart-toast')) {
  s = s.replace('</style>', sideToastCSS + '\n  </style>');
}

const toastMarkup = `
  <!-- SLIDE-IN SIDE CART TOAST NOTIFICATION -->
  <div id="side-cart-toast">
    <div class="flex items-start gap-3">
      <img id="st-img" src="" class="w-12 h-12 rounded-xl object-cover border border-emerald-100 shadow-sm flex-shrink-0">
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <i class="fa-solid fa-check text-[8px]"></i> Added to Cart
          </span>
          <button onclick="hideSideToast()" class="text-gray-400 hover:text-gray-600 text-sm font-bold">&times;</button>
        </div>
        <h5 id="st-title" class="font-extrabold text-gray-900 text-xs truncate mt-1">Product Title</h5>
        <p id="st-price" class="text-xs font-bold text-emerald-800">₹0.00</p>
      </div>
    </div>
    <div class="mt-2.5 flex gap-2">
      <button onclick="toggleCart(); hideSideToast();" class="btn-emerald flex-1 py-1.5 text-xs font-bold">
        View Cart (<span id="st-cart-count">0</span>)
      </button>
      <button onclick="hideSideToast()" class="px-2.5 py-1.5 glass hover:bg-white text-gray-600 text-xs font-bold rounded-xl">
        Close
      </button>
    </div>
  </div>

  <!-- ANNOUNCEMENT BANNER -->
  <div id="announcement-banner" class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-center py-2 px-4 text-xs font-bold shadow-sm relative z-40 flex items-center justify-center gap-2">
    <i class="fa-solid fa-bullhorn text-amber-300"></i>
    <span id="announcement-text">🎉 Special Offer: Fresh farm vegetables & organic groceries available today!</span>
  </div>
`;

if (!s.includes('id="side-cart-toast"')) {
  s = s.replace('<body class="relative min-h-screen flex flex-col justify-between">', '<body class="relative min-h-screen flex flex-col justify-between">' + toastMarkup);
}

const aboutSection = `
    <!-- ABOUT US & CONTACT INFO (CUSTOMIZED BY ADMIN) -->
    <section class="max-w-7xl mx-auto w-full px-6 pb-14">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass p-7 rounded-3xl space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <div>
              <h3 class="text-base font-black text-gray-900">About Our Store</h3>
              <p class="text-xs text-gray-500">Quality, Trust &amp; Freshness</p>
            </div>
          </div>
          <p id="about-us-text" class="text-xs text-gray-600 leading-relaxed">
            Welcome to SKS Market! We are dedicated to providing the freshest groceries, farm produce, and everyday essentials directly to your home.
          </p>
        </div>

        <div class="glass p-7 rounded-3xl space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div>
              <h3 class="text-base font-black text-gray-900">Contact &amp; Store Hours</h3>
              <p class="text-xs text-gray-500">We are here to assist you anytime</p>
            </div>
          </div>

          <div class="space-y-2 text-xs text-gray-700 font-semibold">
            <div class="flex items-start gap-2">
              <i class="fa-solid fa-location-dot text-emerald-600 mt-0.5"></i>
              <span id="contact-address">SKS Market Main Store, City Centre</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-phone text-emerald-600"></i>
              <span id="contact-phone">+91 98765 43210</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-envelope text-emerald-600"></i>
              <span id="contact-email">support@sksmarket.com</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-clock text-amber-600"></i>
              <span id="contact-hours">Mon - Sun: 7:00 AM - 10:00 PM</span>
            </div>
          </div>

          <div class="pt-2 flex gap-3">
            <a id="btn-whatsapp-chat" href="https://wa.me/919876543210" target="_blank" class="btn-emerald flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 text-center">
              <i class="fa-brands fa-whatsapp text-sm"></i> Chat on WhatsApp
            </a>
            <a id="btn-call-store" href="tel:+919876543210" class="px-4 py-2 glass hover:bg-white text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
              <i class="fa-solid fa-phone text-xs text-emerald-600"></i> Call Store
            </a>
          </div>
        </div>
      </div>
    </section>
`;

if (!s.includes('About Our Store')) {
  s = s.replace('<!-- FOOTER -->', aboutSection + '\n    <!-- FOOTER -->');
}

const jsPatch = `
    let sideToastTimer;
    function showSideCartToast(product) {
      clearTimeout(sideToastTimer);
      document.getElementById('st-img').src = product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100';
      document.getElementById('st-title').innerText = product.title;
      document.getElementById('st-price').innerText = '₹' + product.price + ' / ' + (product.unit || 'item');
      document.getElementById('st-cart-count').innerText = cart.reduce((s, i) => s + i.quantity, 0);

      const toast = document.getElementById('side-cart-toast');
      toast.classList.add('show');
      sideToastTimer = setTimeout(() => { hideSideToast(); }, 4500);
    }

    function hideSideToast() {
      document.getElementById('side-cart-toast').classList.remove('show');
    }

    function applyStoreCustomizations(tenantId) {
      try {
        const d = JSON.parse(localStorage.getItem('sks_store_custom_' + tenantId) || '{}');
        if (d.tagline) document.getElementById('store-tagline').innerText = d.tagline;
        if (d.aboutUs) document.getElementById('about-us-text').innerText = d.aboutUs;
        if (d.address) document.getElementById('contact-address').innerText = d.address;
        if (d.phone) {
          document.getElementById('contact-phone').innerText = d.phone;
          document.getElementById('btn-call-store').href = 'tel:' + d.phone.replace(/[^0-9+]/g,'');
          document.getElementById('btn-whatsapp-chat').href = 'https://wa.me/' + d.phone.replace(/[^0-9]/g,'');
        }
        if (d.email) document.getElementById('contact-email').innerText = d.email;
        if (d.hours) document.getElementById('contact-hours').innerText = d.hours;
        if (d.announcement) document.getElementById('announcement-text').innerText = d.announcement;
      } catch(e){}
    }
`;

if (!s.includes('showSideCartToast')) {
  s = s.replace('function addToCart(productId) {', jsPatch + '\n    function addToCart(productId) {');
  s = s.replace('updateCartUI();', 'updateCartUI();\n      showSideCartToast(p);');
  s = s.replace('loadStoreProducts();', 'loadStoreProducts();\n      applyStoreCustomizations(currentStore ? currentStore.id : "11111111-1111-1111-1111-111111111111");');
}

fs.writeFileSync(storePath, s, 'utf8');
fs.writeFileSync('G:/dell intel core i7 pc data/SKS Market/index.html', s, 'utf8');
console.log('SUCCESS: store.html & index.html upgraded with Side Toast and Custom Sections!');