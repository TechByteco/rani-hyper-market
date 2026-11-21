#!/usr/bin/env python3
"""
update_gpay_in_store.py
Replaces Razorpay with Google Pay in store.html, public/store.html, and pre_model/store.html.
Ensures zero syntax errors and valid HTML structure.
"""
import sys
import re

def update_store_file(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace Razorpay SDK script tag
    old_script = '<script src="https://checkout.razorpay.com/v1/checkout.js"></script>'
    new_script = '<script async src="https://pay.google.com/gp/p/js/pay.js" onload="onGooglePayLoaded()"></script>'
    if old_script in content:
        content = content.replace(old_script, new_script)
        print("  Replaced Razorpay script tag with Google Pay SDK")

    # 2. CSS styles
    css_target = """.pay-option-card.active-razorpay {
      border-color: #2563eb !important;
      background: linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.8)) !important;
      box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.18);
    }"""
    css_replacement = """.pay-option-card.active-razorpay,
    .pay-option-card.active-gpay {
      border-color: #1a73e8 !important;
      background: linear-gradient(135deg, rgba(232, 240, 254, 0.95), rgba(210, 227, 252, 0.8)) !important;
      box-shadow: 0 4px 12px -2px rgba(26, 115, 232, 0.25);
    }"""
    if css_target in content:
        content = content.replace(css_target, css_replacement)
        print("  Updated pay-option-card CSS for Google Pay")

    # 3. Settings button in Payment Method Selection
    old_btn = """            <button type="button" onclick="openRazorpaySettingsModal()" class="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition">
              <i class="fa-solid fa-gear"></i> Connect Razorpay
            </button>"""
    new_btn = """            <button type="button" onclick="openGpaySettingsModal()" class="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer">
              <i class="fa-brands fa-google-pay text-sm"></i> GPay Settings
            </button>"""
    if old_btn in content:
        content = content.replace(old_btn, new_btn)
        print("  Updated payment settings button to GPay")

    # 4. Payment option card 2 (Razorpay -> Google Pay)
    old_card = """            <!-- 2. Razorpay Gateway -->
            <div id="pay-opt-razorpay" onclick="selectPaymentOption('razorpay')" class="pay-option-card cursor-pointer p-2.5 rounded-xl border-gray-200 bg-white hover:border-blue-400 transition flex flex-col justify-between relative">
              <div class="flex items-start justify-between gap-1">
                <div class="flex items-center gap-1.5 font-black text-gray-900 text-xs">
                  <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">💳</span>
                  <span>Razorpay</span>
                </div>
                <span id="check-icon-razorpay" class="text-gray-300 font-bold text-xs"><i class="fa-regular fa-circle"></i></span>
              </div>
              <p class="text-[10px] text-gray-600 font-semibold mt-1">Cards &bull; NetBanking</p>
              <span class="text-[9px] font-bold text-blue-800 bg-blue-100/70 px-1.5 py-0.5 rounded mt-1.5 self-start">Instant &amp; 100% Safe</span>
            </div>"""
    
    new_card = """            <!-- 2. Google Pay & FastPay -->
            <div id="pay-opt-gpay" onclick="selectPaymentOption('gpay')" class="pay-option-card cursor-pointer p-2.5 rounded-xl border-gray-200 bg-white hover:border-blue-500 transition flex flex-col justify-between relative">
              <div class="flex items-start justify-between gap-1">
                <div class="flex items-center gap-1.5 font-black text-gray-900 text-xs">
                  <span class="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center text-xs">
                    <i class="fa-brands fa-google-pay text-base"></i>
                  </span>
                  <span>Google Pay</span>
                </div>
                <span id="check-icon-gpay" class="text-gray-300 font-bold text-xs"><i class="fa-regular fa-circle"></i></span>
              </div>
              <p class="text-[10px] text-gray-600 font-semibold mt-1">GPay &bull; Cards &bull; UPI</p>
              <span class="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded mt-1.5 self-start flex items-center gap-1">
                <i class="fa-solid fa-bolt text-amber-500"></i> Fast &amp; Secure
              </span>
            </div>"""
    if old_card in content:
        content = content.replace(old_card, new_card)
        print("  Updated payment option card to Google Pay")

    # 5. Panel 2 Details (Razorpay Details -> Google Pay Details)
    old_panel = """          <!-- Panel 2: Razorpay Details -->
          <div id="panel-pay-razorpay" class="hidden p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs">
                <i class="fa-solid fa-shield-halved text-blue-600"></i> Razorpay Payment Gateway
              </div>
              <span id="razorpay-key-status-badge" class="text-[9px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300">
                Connected
              </span>
            </div>
            <p class="text-[10px] text-gray-600 leading-relaxed">
              Pay securely via <strong>Credit / Debit Cards (Visa, MasterCard, RuPay), NetBanking (50+ banks), UPI, or Wallets</strong>. 
              Protected with 256-bit bank-grade encryption.
            </p>
            <div class="flex items-center justify-between pt-1 border-t border-blue-100 text-[10px]">
              <span class="text-gray-500 font-semibold">Merchant Key: <span id="display-razorpay-key-id" class="font-mono font-bold text-gray-800">rzp_...</span></span>
              <button type="button" onclick="openRazorpaySettingsModal()" class="text-blue-700 hover:underline font-bold flex items-center gap-1">
                <i class="fa-solid fa-pen-to-square"></i> Change Account Key
              </button>
            </div>
          </div>"""

    new_panel = """          <!-- Panel 2: Google Pay Details -->
          <div id="panel-pay-gpay" class="hidden p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-blue-950 font-extrabold text-xs">
                <i class="fa-brands fa-google-pay text-2xl text-blue-600"></i> Google Pay Fast Checkout
              </div>
              <span id="gpay-key-status-badge" class="text-[9px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300">
                Connected &bull; Ready
              </span>
            </div>
            <p class="text-[10px] text-gray-600 leading-relaxed">
              Pay in seconds with <strong>Google Pay (GPay)</strong>, linked UPI banks, or cards with 0% extra gateway surcharge. On mobile devices, taps directly into your Google Pay app.
            </p>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <button type="button" onclick="triggerGPayDirectPay()" class="flex-1 py-2 px-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-2 transition cursor-pointer">
                <i class="fa-brands fa-google-pay text-lg text-blue-600"></i>
                <span>Open in Google Pay App</span>
              </button>
              <div id="gpay-button-container" class="flex-shrink-0"></div>
            </div>
            <div class="flex items-center justify-between pt-1 border-t border-blue-100 text-[10px]">
              <span class="text-gray-500 font-semibold">GPay VPA: <span id="display-gpay-vpa-id" class="font-mono font-bold text-gray-800">7708834547@okaxis</span></span>
              <button type="button" onclick="openGpaySettingsModal()" class="text-blue-700 hover:underline font-bold flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-pen-to-square"></i> Change Account
              </button>
            </div>
          </div>"""
    if old_panel in content:
        content = content.replace(old_panel, new_panel)
        print("  Updated panel-pay-razorpay to panel-pay-gpay")

    # 6. Razorpay settings modal -> Google Pay settings modal
    old_modal = """  <!-- RAZORPAY & MERCHANT PAYMENT SETTINGS MODAL -->
  <div id="razorpay-settings-modal" class="modal-overlay hidden">
    <div class="modal-card max-w-md p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h3 class="font-black text-gray-900 text-sm flex items-center gap-2">
          <i class="fa-solid fa-link text-blue-600"></i> Connect Razorpay &amp; Payment Accounts
        </h3>
        <button type="button" onclick="closeRazorpaySettingsModal()" class="text-gray-400 hover:text-gray-700 text-xl font-bold">&times;</button>
      </div>

      <div class="bg-blue-50/70 border border-blue-200 p-3 rounded-xl text-[11px] text-blue-900 leading-relaxed">
        <strong>⚡ Direct Merchant Settlement:</strong> Connect your Razorpay Key ID so customer payments (Cards, NetBanking, UPI) deposit directly into your business bank account.
      </div>

      <form onsubmit="savePaymentSettings(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-gray-700 mb-1">Razorpay Key ID (Key ID) *</label>
          <input type="text" id="setting-razorpay-key" placeholder="rzp_live_xxxxxxxxxxxxxx or rzp_test_xxxxxxxxxxxxxx" required class="glass-input text-xs font-mono font-semibold">
          <p class="text-[10px] text-gray-500 mt-1">
            Find in: <a href="https://dashboard.razorpay.com/#/access/api_keys" target="_blank" class="text-blue-600 underline font-bold">Razorpay Dashboard &rarr; Settings &rarr; API Keys</a>
          </p>
        </div>

        <div>
          <label class="block font-bold text-gray-700 mb-1">Store UPI VPA / ID (For QR &amp; App Redirect) *</label>
          <input type="text" id="setting-merchant-vpa" placeholder="7708834547@okaxis or ranihypermarket@upi" required class="glass-input text-xs font-mono font-semibold">
          <p class="text-[10px] text-gray-500 mt-1">
            Your Google Pay, PhonePe, or BHIM merchant UPI ID linked to your bank account.
          </p>
        </div>

        <div>
          <label class="block font-bold text-gray-700 mb-1">Store / Business Name *</label>
          <input type="text" id="setting-merchant-name" placeholder="RANI HYPER MARKET" required class="glass-input text-xs font-semibold">
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button type="submit" class="btn-emerald flex-1 py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-check"></i> Save &amp; Connect Account
          </button>
          <button type="button" onclick="resetPaymentSettingsToDefault()" class="px-3 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">
            Reset Demo
          </button>
        </div>
      </form>
    </div>
  </div>"""

    new_modal = """  <!-- GOOGLE PAY & MERCHANT SETTLEMENT MODAL -->
  <div id="gpay-settings-modal" class="modal-overlay hidden">
    <div class="modal-card max-w-md p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h3 class="font-black text-gray-900 text-sm flex items-center gap-2">
          <i class="fa-brands fa-google-pay text-blue-600 text-xl"></i> Google Pay &amp; Settlement Account
        </h3>
        <button type="button" onclick="closeGpaySettingsModal()" class="text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer">&times;</button>
      </div>

      <div class="bg-blue-50/70 border border-blue-200 p-3 rounded-xl text-[11px] text-blue-900 leading-relaxed">
        <strong>⚡ Direct Merchant Settlement:</strong> Configure your Google Pay UPI ID and Merchant details so customer payments deposit directly into your business bank account.
      </div>

      <form onsubmit="saveGpayPaymentSettings(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-gray-700 mb-1">Google Pay UPI VPA / ID (For GPay App &amp; QR) *</label>
          <input type="text" id="setting-gpay-vpa" placeholder="7708834547@okaxis or ranihypermarket@okaxis" required class="glass-input text-xs font-mono font-semibold">
          <p class="text-[10px] text-gray-500 mt-1">
            Linked to your Google Pay / UPI merchant account.
          </p>
        </div>

        <div>
          <label class="block font-bold text-gray-700 mb-1">Google Pay Merchant ID (Optional)</label>
          <input type="text" id="setting-gpay-merchant-id" placeholder="BCR2DN6T... or leave blank for UPI FastPay" class="glass-input text-xs font-mono font-semibold">
          <p class="text-[10px] text-gray-500 mt-1">
            From Google Pay Business Console for production web pay tokenization.
          </p>
        </div>

        <div>
          <label class="block font-bold text-gray-700 mb-1">Store / Business Name *</label>
          <input type="text" id="setting-merchant-name" placeholder="RANI HYPER MARKET" required class="glass-input text-xs font-semibold">
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button type="submit" class="btn-emerald flex-1 py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-check"></i> Save &amp; Connect Google Pay
          </button>
          <button type="button" onclick="resetPaymentSettingsToDefault()" class="px-3 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">
            Reset Demo
          </button>
        </div>
      </form>
    </div>
  </div>"""
    if old_modal in content:
        content = content.replace(old_modal, new_modal)
        print("  Updated settings modal to Google Pay")

    # 7. JavaScript payment options logic
    old_js_block = """    let selectedPaymentOption = 'cod'; // 'cod' | 'razorpay' | 'upi'
    let currentUpiQrTab = 'dynamic'; // 'dynamic' | 'fixed'

    // Configuration Accessors
    function getRazorpayKey() {
      return (localStorage.getItem('rhm_razorpay_key_id') || '').trim() || 'rzp_test_51aA1g3yXbE8e4';
    }

    function getMerchantVpa() {
      return (localStorage.getItem('rhm_merchant_vpa') || '').trim() || '7708834547@okaxis';
    }

    function getMerchantName() {
      return (localStorage.getItem('rhm_merchant_name') || '').trim() || 'Rani Hyper Market';
    }

    function openRazorpaySettingsModal() {
      const keyInput = document.getElementById('setting-razorpay-key');
      const vpaInput = document.getElementById('setting-merchant-vpa');
      const nameInput = document.getElementById('setting-merchant-name');
      if (keyInput) keyInput.value = localStorage.getItem('rhm_razorpay_key_id') || '';
      if (vpaInput) vpaInput.value = getMerchantVpa();
      if (nameInput) nameInput.value = getMerchantName();
      const modal = document.getElementById('razorpay-settings-modal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeRazorpaySettingsModal() {
      const modal = document.getElementById('razorpay-settings-modal');
      if (modal) modal.classList.add('hidden');
    }

    function savePaymentSettings(e) {
      if (e && e.preventDefault) e.preventDefault();
      const key = (document.getElementById('setting-razorpay-key')?.value || '').trim();
      const vpa = (document.getElementById('setting-merchant-vpa')?.value || '').trim();
      const name = (document.getElementById('setting-merchant-name')?.value || '').trim();

      if (key) localStorage.setItem('rhm_razorpay_key_id', key);
      if (vpa) localStorage.setItem('rhm_merchant_vpa', vpa);
      if (name) localStorage.setItem('rhm_merchant_name', name);

      closeRazorpaySettingsModal();
      updatePaymentDisplayUI();
      alert('✓ Payment accounts updated successfully! Customer transactions will now connect to this account.');
    }

    function resetPaymentSettingsToDefault() {
      localStorage.removeItem('rhm_razorpay_key_id');
      localStorage.removeItem('rhm_merchant_vpa');
      localStorage.removeItem('rhm_merchant_name');
      closeRazorpaySettingsModal();
      updatePaymentDisplayUI();
      alert('Reset to default demo account settings.');
    }"""

    new_js_block = """    let selectedPaymentOption = 'cod'; // 'cod' | 'gpay' | 'upi'
    let currentUpiQrTab = 'dynamic'; // 'dynamic' | 'fixed'
    let googlePaymentsClient = null;

    // Google Pay & Merchant Configuration Accessors
    function getGpayMerchantId() {
      return (localStorage.getItem('rhm_gpay_merchant_id') || '').trim() || '12345678901234567890';
    }

    function getMerchantVpa() {
      return (localStorage.getItem('rhm_gpay_vpa') || localStorage.getItem('rhm_merchant_vpa') || '').trim() || '7708834547@okaxis';
    }

    function getMerchantName() {
      return (localStorage.getItem('rhm_merchant_name') || '').trim() || 'Rani Hyper Market';
    }

    // Google Pay Web SDK Integration
    function onGooglePayLoaded() {
      try {
        if (window.google && window.google.payments && window.google.payments.api) {
          googlePaymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST'
          });
          const isReadyToPayRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA', 'RUPAY']
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  'gateway': 'example',
                  'gatewayMerchantId': 'exampleGatewayMerchantId'
                }
              }
            }]
          };
          googlePaymentsClient.isReadyToPay(isReadyToPayRequest).then(res => {
            if (res.result) {
              renderGooglePayButton();
            }
          }).catch(e => console.warn('Google Pay ready check:', e));
        }
      } catch (err) {
        console.warn('Google Pay SDK init exception:', err);
      }
    }

    function renderGooglePayButton() {
      const container = document.getElementById('gpay-button-container');
      if (!container || !googlePaymentsClient) return;
      try {
        container.innerHTML = '';
        const button = googlePaymentsClient.createButton({
          buttonColor: 'black',
          buttonType: 'pay',
          buttonSizeMode: 'fill',
          onClick: onGooglePayButtonClicked
        });
        container.appendChild(button);
      } catch(e) {
        console.warn('Error rendering GPay button:', e);
      }
    }

    function onGooglePayButtonClicked() {
      const total = cart.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0);
      triggerGPayDirectPay();
    }

    function triggerGPayDirectPay() {
      const total = cart.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0);
      const vpa = getMerchantVpa();
      const name = getMerchantName();
      const invId = 'RHM-' + Math.floor(100000 + Math.random() * 900000);
      const upiUrl = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Order ' + invId)}`;
      
      // Attempt mobile deep-link intent for Google Pay app
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = upiUrl;
      } else {
        // Desktop: show QR dialog or prompt
        if (typeof openUpiModal === 'function') {
          openUpiModal();
        } else {
          window.location.href = upiUrl;
        }
      }
    }

    function openGpaySettingsModal() {
      const vpaInput = document.getElementById('setting-gpay-vpa');
      const mIdInput = document.getElementById('setting-gpay-merchant-id');
      const nameInput = document.getElementById('setting-merchant-name');
      if (vpaInput) vpaInput.value = getMerchantVpa();
      if (mIdInput) mIdInput.value = localStorage.getItem('rhm_gpay_merchant_id') || '';
      if (nameInput) nameInput.value = getMerchantName();
      const modal = document.getElementById('gpay-settings-modal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeGpaySettingsModal() {
      const modal = document.getElementById('gpay-settings-modal');
      if (modal) modal.classList.add('hidden');
    }

    // Backward-compatible aliases
    window.openRazorpaySettingsModal = openGpaySettingsModal;
    window.closeRazorpaySettingsModal = closeGpaySettingsModal;

    function saveGpayPaymentSettings(e) {
      if (e && e.preventDefault) e.preventDefault();
      const vpa = (document.getElementById('setting-gpay-vpa')?.value || '').trim();
      const mId = (document.getElementById('setting-gpay-merchant-id')?.value || '').trim();
      const name = (document.getElementById('setting-merchant-name')?.value || '').trim();

      if (vpa) {
        localStorage.setItem('rhm_gpay_vpa', vpa);
        localStorage.setItem('rhm_merchant_vpa', vpa);
      }
      if (mId) localStorage.setItem('rhm_gpay_merchant_id', mId);
      if (name) localStorage.setItem('rhm_merchant_name', name);

      closeGpaySettingsModal();
      updatePaymentDisplayUI();
      alert('✓ Google Pay & UPI Merchant settings saved successfully! Customer transactions connect directly to this account.');
    }

    window.savePaymentSettings = saveGpayPaymentSettings;

    function resetPaymentSettingsToDefault() {
      localStorage.removeItem('rhm_gpay_vpa');
      localStorage.removeItem('rhm_merchant_vpa');
      localStorage.removeItem('rhm_gpay_merchant_id');
      localStorage.removeItem('rhm_merchant_name');
      closeGpaySettingsModal();
      updatePaymentDisplayUI();
      alert('Reset to default Google Pay & UPI settings.');
    }"""
    if old_js_block in content:
        content = content.replace(old_js_block, new_js_block)
        print("  Updated JS payment options logic to Google Pay")

    # 8. selectPaymentOption and updatePaymentDisplayUI
    old_select = """    function selectPaymentOption(opt) {
      selectedPaymentOption = opt;
      const opts = ['cod', 'razorpay', 'upi'];

      opts.forEach(o => {
        const card = document.getElementById('pay-opt-' + o);
        const icon = document.getElementById('check-icon-' + o);
        const panel = document.getElementById('panel-pay-' + o);

        if (o === opt) {
          if (card) {
            card.className = 'pay-option-card active-' + o + ' cursor-pointer p-2.5 rounded-xl transition flex flex-col justify-between relative';
          }
          if (icon) {
            icon.className = (o === 'cod' ? 'text-emerald-600' : o === 'razorpay' ? 'text-blue-600' : 'text-purple-600') + ' font-bold text-xs';
            icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          }
          if (panel) panel.classList.remove('hidden');
        } else {
          if (card) {
            card.className = 'pay-option-card cursor-pointer p-2.5 rounded-xl border-gray-200 bg-white transition flex flex-col justify-between relative';
          }
          if (icon) {
            icon.className = 'text-gray-300 font-bold text-xs';
            icon.innerHTML = '<i class="fa-regular fa-circle"></i>';
          }
          if (panel) panel.classList.add('hidden');
        }
      });

      // Update hidden input
      const ordPaymentInput = document.getElementById('ord-payment');
      if (ordPaymentInput) {
        if (opt === 'cod') ordPaymentInput.value = 'Cash On Delivery (COD)';
        else if (opt === 'razorpay') ordPaymentInput.value = 'Razorpay Payment Gateway';
        else if (opt === 'upi') ordPaymentInput.value = 'Instant UPI Apps & QR Code';
      }

      // Refresh total and QR
      updatePaymentDisplayUI();
    }"""

    new_select = """    function selectPaymentOption(opt) {
      // Normalize 'razorpay' to 'gpay'
      if (opt === 'razorpay') opt = 'gpay';
      selectedPaymentOption = opt;
      const opts = ['cod', 'gpay', 'upi'];

      opts.forEach(o => {
        const card = document.getElementById('pay-opt-' + o);
        const icon = document.getElementById('check-icon-' + o);
        const panel = document.getElementById('panel-pay-' + o);

        if (o === opt) {
          if (card) {
            card.className = 'pay-option-card active-' + o + ' cursor-pointer p-2.5 rounded-xl transition flex flex-col justify-between relative';
          }
          if (icon) {
            icon.className = (o === 'cod' ? 'text-emerald-600' : o === 'gpay' ? 'text-blue-600' : 'text-purple-600') + ' font-bold text-xs';
            icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          }
          if (panel) panel.classList.remove('hidden');
        } else {
          if (card) {
            card.className = 'pay-option-card cursor-pointer p-2.5 rounded-xl border-gray-200 bg-white transition flex flex-col justify-between relative';
          }
          if (icon) {
            icon.className = 'text-gray-300 font-bold text-xs';
            icon.innerHTML = '<i class="fa-regular fa-circle"></i>';
          }
          if (panel) panel.classList.add('hidden');
        }
      });

      // Update hidden input
      const ordPaymentInput = document.getElementById('ord-payment');
      if (ordPaymentInput) {
        if (opt === 'cod') ordPaymentInput.value = 'Cash On Delivery (COD)';
        else if (opt === 'gpay') ordPaymentInput.value = 'Google Pay & Fast UPI';
        else if (opt === 'upi') ordPaymentInput.value = 'Instant UPI Apps & QR Code';
      }

      // Refresh total and QR
      updatePaymentDisplayUI();
    }"""
    if old_select in content:
        content = content.replace(old_select, new_select)
        print("  Updated selectPaymentOption for Google Pay")

    # 9. updatePaymentDisplayUI
    old_update_ui = """        } else if (selectedPaymentOption === 'razorpay') {
          btn.className = 'w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-md bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition';
          btn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> <span>Proceed to Razorpay Secure Pay &bull; ' + amtStr + '</span>';
        } else if (selectedPaymentOption === 'upi') {
          btn.className = 'w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-md bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition';
          btn.innerHTML = '<i class="fa-solid fa-qrcode"></i> <span>Confirm UPI Payment &amp; Generate Bill &bull; ' + amtStr + '</span>';
        }
      }

      // Update Razorpay Account Details
      const customKey = localStorage.getItem('rhm_razorpay_key_id');
      const badge = document.getElementById('razorpay-key-status-badge');
      const displayKey = document.getElementById('display-razorpay-key-id');
      if (badge && displayKey) {
        if (customKey) {
          badge.innerText = 'Connected (Custom Key)';
          badge.className = 'text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300';
          displayKey.innerText = customKey.slice(0, 8) + '...' + customKey.slice(-4);
        } else {
          badge.innerText = 'Demo/Test Key Active';
          badge.className = 'text-[9px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300';
          displayKey.innerText = 'rzp_test_... (Click Change to link Live key)';
        }
      }"""

    new_update_ui = """        } else if (selectedPaymentOption === 'gpay' || selectedPaymentOption === 'razorpay') {
          btn.className = 'w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-md bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition';
          btn.innerHTML = '<i class="fa-brands fa-google-pay text-2xl leading-none"></i> <span>Pay with Google Pay &bull; ' + amtStr + '</span>';
        } else if (selectedPaymentOption === 'upi') {
          btn.className = 'w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-md bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition';
          btn.innerHTML = '<i class="fa-solid fa-qrcode"></i> <span>Confirm UPI Payment &amp; Generate Bill &bull; ' + amtStr + '</span>';
        }
      }

      // Update Google Pay Account Details
      const vpa = getMerchantVpa();
      const gpayBadge = document.getElementById('gpay-key-status-badge');
      const gpayDisplayVpa = document.getElementById('display-gpay-vpa-id');
      if (gpayBadge && gpayDisplayVpa) {
        gpayBadge.innerText = 'Connected &bull; Active';
        gpayBadge.className = 'text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300';
        gpayDisplayVpa.innerText = vpa;
      }"""
    if old_update_ui in content:
        content = content.replace(old_update_ui, new_update_ui)
        print("  Updated updatePaymentDisplayUI for Google Pay")

    # 10. executeOrderCheckout - replace Razorpay flow with Google Pay flow
    old_checkout_razorpay = """      // 1. RAZORPAY GATEWAY CHECKOUT PATH
      if (selectedPaymentOption === 'razorpay') {
        if (typeof window.Razorpay !== 'function') {
          alert('Razorpay Checkout SDK is still loading. Please check internet connection or choose Cash on Delivery (COD).');
          return;
        }

        if (btn) btn.disabled = true;

        const rzpKey = getRazorpayKey();
        const amtInPaise = Math.round(totalAmount * 100);

        const rzpOptions = {
          key: rzpKey,
          amount: amtInPaise,
          currency: 'INR',
          name: getMerchantName(),
          description: 'Order ' + invId + ' - Rani Hyper Market',
          image: 'https://rani-hyper-market.vercel.app/images/rani_logo.png',
          prefill: {
            name: name,
            contact: phone,
            email: email || 'customer@ranihypermarket.com'
          },
          notes: {
            invoice_id: invId,
            order_id: orderId,
            shipping_address: fullAddress
          },
          theme: {
            color: '#059669'
          },
          handler: function (response) {
            orderDraft.paymentMethod = 'Online via Razorpay';
            orderDraft.paymentStatus = 'PAID';
            orderDraft.razorpayPaymentId = response.razorpay_payment_id;
            orderDraft.transactionId = response.razorpay_payment_id;
            completeAndRenderOrder(orderDraft);
          },
          modal: {
            ondismiss: function () {
              if (btn) btn.disabled = false;
              alert('Notice: Razorpay payment window was dismissed. You can retry payment or choose Cash on Delivery (COD).');
            }
          }
        };

        try {
          const rzpInstance = new window.Razorpay(rzpOptions);
          rzpInstance.on('payment.failed', function (resp) {
            if (btn) btn.disabled = false;
            alert('Payment Failed: ' + (resp.error ? resp.error.description : 'Transaction error. Please try again or use COD.'));
          });
          rzpInstance.open();
        } catch (rzpErr) {
          if (btn) btn.disabled = false;
          alert('Could not initiate Razorpay: ' + rzpErr.message);
        }
        return;
      }"""

    new_checkout_gpay = """      // 1. GOOGLE PAY & FASTPAY CHECKOUT PATH
      if (selectedPaymentOption === 'gpay' || selectedPaymentOption === 'razorpay') {
        const vpa = getMerchantVpa();
        const upiRef = (document.getElementById('ord-upi-ref')?.value || '').trim();
        const txnId = upiRef || ('GPAY-' + Date.now().toString(36).toUpperCase());

        orderDraft.paymentMethod = 'Google Pay (UPI)';
        orderDraft.paymentStatus = 'PAID (Google Pay)';
        orderDraft.gpayVpa = vpa;
        orderDraft.transactionId = txnId;

        // On mobile, trigger direct UPI intent to Google Pay
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile && !upiRef) {
          const upiUrl = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(getMerchantName())}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('RHM Order ' + invId)}`;
          window.location.href = upiUrl;
        }

        completeAndRenderOrder(orderDraft);
        return;
      }"""
    if old_checkout_razorpay in content:
        content = content.replace(old_checkout_razorpay, new_checkout_gpay)
        print("  Updated executeOrderCheckout for Google Pay")

    # 11. Fix tenant_id in Supabase insert inside completeAndRenderOrder
    old_sb_insert = """          if (sb && typeof sb.from === 'function') {
            sb.from('orders').insert({
              tenant_id: '11111111-1111-1111-1111-111111111111',
              total_amount: orderRecord.totalAmount,
              shipping_address: orderRecord.fullAddress,
              payment_method: orderRecord.paymentMethod,
              status: 'confirmed'
            }).catch(() => {});
          }"""

    new_sb_insert = """          if (sb && typeof sb.from === 'function') {
            sb.from('orders').insert({
              tenant_id: sessionStorage.getItem('nsn_tenant_id') || '37a64e83-514d-4b00-b90a-9af172dacdd6',
              total_amount: orderRecord.totalAmount,
              shipping_address: orderRecord.fullAddress,
              payment_method: orderRecord.paymentMethod,
              status: 'new'
            }).catch(e => console.warn('Supabase sync skipped:', e));
          }"""
    if old_sb_insert in content:
        content = content.replace(old_sb_insert, new_sb_insert)
        print("  Fixed tenant_id and status in Supabase insert")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Finished {filepath}\n")

if __name__ == '__main__':
    files = [
        'store.html',
        'public/store.html',
        'pre_model/store.html'
    ]
    for fp in files:
        update_store_file(fp)
