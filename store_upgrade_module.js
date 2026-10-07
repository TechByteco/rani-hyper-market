// Rani Hyper Market - Modern PWA, In-Store Barcode Scanner & IndexedDB Offline Catalog Engine

/* ════════════════════════════════════════════════════════════════
   ⚡ 1. INDEXEDDB INSTANT OFFLINE CATALOG CACHING
   ════════════════════════════════════════════════════════════════ */
const RaniCatalogDB = {
  dbName: 'RaniStoreCatalogDB_v1',
  storeName: 'catalog',
  _openDB: function() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('IndexedDB unsupported'));
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  },
  getCatalog: async function() {
    try {
      const db = await this._openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get('products');
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => resolve(null);
      });
    } catch(e) { return null; }
  },
  saveCatalog: async function(products) {
    try {
      if (!products || !Array.isArray(products) || products.length === 0) return;
      const db = await this._openDB();
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.put({ key: 'products', data: products, timestamp: Date.now() });
    } catch(e) {}
  }
};

/* ════════════════════════════════════════════════════════════════
   📱 2. IN-STORE MOBILE BARCODE SCANNER CONTROLLER
   ════════════════════════════════════════════════════════════════ */
let scannerStream = null;
let scannerAnimFrame = null;
let scannerTorchActive = false;
let scannerCurrentFacingMode = 'environment';
let scannerDetectedProduct = null;
let scannerQty = 1;
let zxingReader = null;

function playScannerBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // 880 Hz standard supermarket chime
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch(e) {}
}

function triggerHapticFeedback() {
  try {
    if (navigator.vibrate) {
      navigator.vibrate([70, 30, 70]);
    }
  } catch(e) {}
}

async function openBarcodeScanner() {
  const modal = document.getElementById('barcode-scanner-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  resetScannerResultCard();
  await startScannerCamera();
}

function closeBarcodeScanner() {
  stopScannerCamera();
  const modal = document.getElementById('barcode-scanner-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

async function startScannerCamera() {
  const video = document.getElementById('barcode-video');
  const statusEl = document.getElementById('scanner-status');
  if (!video) return;

  if (scannerStream) {
    scannerStream.getTracks().forEach(t => t.stop());
    scannerStream = null;
  }

  if (statusEl) {
    statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Starting camera...';
  }

  try {
    const constraints = {
      video: {
        facingMode: { ideal: scannerCurrentFacingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    scannerStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = scannerStream;
    await video.play();

    if (statusEl) {
      statusEl.innerHTML = '<i class="fa-solid fa-crosshairs animate-pulse mr-1"></i> Align barcode inside the frame';
    }

    startBarcodeDetectionLoop();
  } catch (err) {
    console.error('Camera access error:', err);
    if (statusEl) {
      statusEl.innerHTML = '<span class="text-rose-400 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Camera permission needed. Type barcode below.</span>';
    }
  }
}

function stopScannerCamera() {
  if (scannerAnimFrame) {
    cancelAnimationFrame(scannerAnimFrame);
    scannerAnimFrame = null;
  }
  if (scannerStream) {
    scannerStream.getTracks().forEach(t => t.stop());
    scannerStream = null;
  }
  scannerTorchActive = false;
  const torchBtn = document.getElementById('scanner-torch-btn');
  if (torchBtn) torchBtn.classList.remove('bg-amber-400', 'text-gray-900');
}

async function toggleScannerTorch() {
  if (!scannerStream) return;
  const track = scannerStream.getVideoTracks()[0];
  if (!track) return;
  try {
    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    if (!capabilities.torch) {
      alert('Torch/Flashlight is not supported on this camera/device.');
      return;
    }
    scannerTorchActive = !scannerTorchActive;
    await track.applyConstraints({
      advanced: [{ torch: scannerTorchActive }]
    });
    const torchBtn = document.getElementById('scanner-torch-btn');
    if (torchBtn) {
      if (scannerTorchActive) {
        torchBtn.classList.add('bg-amber-400', 'text-gray-900');
      } else {
        torchBtn.classList.remove('bg-amber-400', 'text-gray-900');
      }
    }
  } catch(e) {
    console.warn('Torch constraint error:', e);
  }
}

async function switchScannerCamera() {
  scannerCurrentFacingMode = (scannerCurrentFacingMode === 'environment') ? 'user' : 'environment';
  await startScannerCamera();
}

function startBarcodeDetectionLoop() {
  const video = document.getElementById('barcode-video');
  const canvas = document.getElementById('barcode-canvas');
  if (!video) return;

  const hasNativeDetector = ('BarcodeDetector' in window);
  let nativeDetector = null;

  if (hasNativeDetector) {
    try {
      nativeDetector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code']
      });
    } catch(e) {
      nativeDetector = null;
    }
  }

  // Fallback to ZXing if native detector not present
  if (!nativeDetector && !window.ZXing && !zxingReader) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@zxing/library@latest/umd/index.min.js';
    script.onload = () => {
      try {
        if (window.ZXing) {
          zxingReader = new window.ZXing.BrowserMultiFormatReader();
        }
      } catch(e) {}
    };
    document.head.appendChild(script);
  }

  let lastScanTime = 0;

  async function loop(timestamp) {
    if (!scannerStream || video.paused || video.ended) return;

    if (timestamp - lastScanTime > 150 && video.readyState === video.HAVE_ENOUGH_DATA) {
      lastScanTime = timestamp;

      if (nativeDetector) {
        try {
          const barcodes = await nativeDetector.detect(video);
          if (barcodes && barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            if (rawValue) {
              onBarcodeScanned(rawValue);
              return;
            }
          }
        } catch(e) {}
      } else if (window.ZXing && zxingReader && canvas) {
        try {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const result = zxingReader.decodeFromImageElement(canvas);
          if (result && result.text) {
            onBarcodeScanned(result.text);
            return;
          }
        } catch(e) {}
      }
    }

    scannerAnimFrame = requestAnimationFrame(loop);
  }

  scannerAnimFrame = requestAnimationFrame(loop);
}

function onBarcodeScanned(barcodeStr) {
  const cleanCode = String(barcodeStr).trim();
  if (!cleanCode) return;

  playScannerBeep();
  triggerHapticFeedback();

  const match = findProductByBarcode(cleanCode);
  displayScannedProductCard(match, cleanCode);
}

function findProductByBarcode(code) {
  if (!window.allProducts || window.allProducts.length === 0) return null;
  const target = String(code).trim().toLowerCase();
  
  // Exact barcode / GTIN match
  let found = window.allProducts.find(p => {
    const b = (p.barcode || p.gtin || '').toString().trim().toLowerCase();
    return b && b === target;
  });
  if (found) return found;

  // SKU / ID match
  found = window.allProducts.find(p => String(p.id) === target || String(p.sku || '').toLowerCase() === target);
  if (found) return found;

  // Normalization of leading zeros (e.g. 13-digit EAN vs 12-digit UPC)
  const numericOnly = target.replace(/^0+/, '');
  if (numericOnly.length >= 6) {
    found = window.allProducts.find(p => {
      const b = (p.barcode || p.gtin || '').toString().trim().replace(/^0+/, '');
      return b && b === numericOnly;
    });
  }
  return found || null;
}

function displayScannedProductCard(product, rawCode) {
  const card = document.getElementById('scanned-product-card');
  const statusEl = document.getElementById('scanner-status');
  if (!card) return;

  scannerDetectedProduct = product;
  scannerQty = 1;

  if (product) {
    const finalImg = (typeof getRelevantProductImage === 'function')
      ? getRelevantProductImage(product.title, product.image_url, product.id)
      : (product.image_url || product.image || '/images/rani_logo.png');

    const price = parseFloat(product.price) || 0;
    const mrp = parseFloat(product.mrp) || (price * 1.25);
    const savings = Math.max(0, mrp - price);
    const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    if (statusEl) {
      statusEl.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i> Product Found!</span>';
    }

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${finalImg}" alt="${product.title}" class="w-16 h-16 object-contain rounded-2xl bg-gray-50 border border-gray-100 p-1 shrink-0" onerror="this.src='/images/rani_logo.png'">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-full">BARCODE MATCH</span>
            ${product.stock > 0 ? '<span class="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">In Stock</span>' : '<span class="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Out of Stock</span>'}
          </div>
          <h4 class="text-xs font-black text-gray-900 truncate mt-0.5">${product.title}</h4>
          <p class="text-[10px] text-gray-500 font-mono">Barcode: ${rawCode} ${product.unit ? '• ' + product.unit : ''}</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-sm font-black text-emerald-700">₹${price.toFixed(2)}</span>
            ${savings > 0 ? `<span class="text-[11px] text-gray-400 line-through">₹${mrp.toFixed(2)}</span><span class="text-[10px] text-rose-600 font-bold">Save ₹${savings.toFixed(2)} (${discountPct}%)</span>` : ''}
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
        <div class="flex items-center bg-gray-100 rounded-xl p-1 gap-2">
          <button type="button" onclick="adjustScannerQty(-1)" class="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-gray-700 active:scale-90 shadow-xs text-xs cursor-pointer">-</button>
          <span id="scanner-qty-val" class="text-xs font-black w-5 text-center">1</span>
          <button type="button" onclick="adjustScannerQty(1)" class="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-gray-700 active:scale-90 shadow-xs text-xs cursor-pointer">+</button>
        </div>
        <button type="button" onclick="addScannedProductToCartAction()" class="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
        <button type="button" onclick="resumeScanning()" class="py-2 px-3 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer" title="Scan next product">
          <i class="fa-solid fa-rotate-right"></i> Next
        </button>
      </div>
    `;
    card.classList.remove('hidden');
  } else {
    if (statusEl) {
      statusEl.innerHTML = '<span class="text-amber-400 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Barcode detected, searching store...</span>';
    }

    card.innerHTML = `
      <div class="text-center py-2">
        <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 text-base">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <h4 class="text-xs font-extrabold text-gray-900">Barcode: ${rawCode}</h4>
        <p class="text-[11px] text-gray-500 mt-1">This barcode is not yet linked in our online catalog.</p>
        <div class="flex items-center justify-center gap-2 mt-3">
          <button type="button" onclick="searchStoreForBarcode('${rawCode}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer">
            Search Online Store
          </button>
          <button type="button" onclick="resumeScanning()" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer">
            Scan Again
          </button>
        </div>
      </div>
    `;
    card.classList.remove('hidden');
  }
}

function adjustScannerQty(delta) {
  scannerQty += delta;
  if (scannerQty < 1) scannerQty = 1;
  const el = document.getElementById('scanner-qty-val');
  if (el) el.innerText = scannerQty;
}

function addScannedProductToCartAction() {
  if (!scannerDetectedProduct) return;
  const p = scannerDetectedProduct;
  const qty = scannerQty;
  const finalImg = (typeof getRelevantProductImage === 'function')
    ? getRelevantProductImage(p.title, p.image_url, p.id)
    : (p.image_url || p.image || '/images/rani_logo.png');

  if (!window.cart) window.cart = [];
  const existing = window.cart.find(x => String(x.id) === String(p.id));
  if (existing) {
    existing.quantity += qty;
  } else {
    window.cart.push({
      ...p,
      id: p.id,
      image_url: finalImg,
      quantity: qty
    });
  }

  try {
    localStorage.setItem('nsn_cart', JSON.stringify(window.cart));
  } catch(e) {}

  if (typeof updateCartUI === 'function') updateCartUI();
  if (typeof syncAllCardSteppers === 'function') syncAllCardSteppers();
  if (typeof showSideCartToast === 'function') showSideCartToast({ ...p, image_url: finalImg, quantity: qty });
  if (typeof playCartChime === 'function') playCartChime();

  const statusEl = document.getElementById('scanner-status');
  if (statusEl) {
    statusEl.innerHTML = `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-check-double mr-1"></i> Added ${qty}x ${p.title} to Cart!</span>`;
  }

  setTimeout(() => {
    resumeScanning();
  }, 1200);
}

function resumeScanning() {
  resetScannerResultCard();
  const statusEl = document.getElementById('scanner-status');
  if (statusEl) {
    statusEl.innerHTML = '<i class="fa-solid fa-crosshairs animate-pulse mr-1"></i> Align barcode inside the frame';
  }
  startBarcodeDetectionLoop();
}

function resetScannerResultCard() {
  const card = document.getElementById('scanned-product-card');
  if (card) {
    card.classList.add('hidden');
    card.innerHTML = '';
  }
  scannerDetectedProduct = null;
  scannerQty = 1;
}

function submitManualBarcode() {
  const input = document.getElementById('manual-barcode-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  onBarcodeScanned(val);
  input.value = '';
}

function searchStoreForBarcode(code) {
  closeBarcodeScanner();
  const inp = document.getElementById('search-input');
  if (inp) {
    inp.value = code;
    if (typeof filterProducts === 'function') filterProducts();
  }
}

/* ════════════════════════════════════════════════════════════════
   📱 3. PROGRESSIVE WEB APP (PWA) INSTALL CONTROLLER & SERVICE WORKER
   ════════════════════════════════════════════════════════════════ */
let pwaDeferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  pwaDeferredPrompt = e;
  
  const dismissedTime = localStorage.getItem('rani_pwa_dismissed');
  if (dismissedTime && (Date.now() - parseInt(dismissedTime, 10) < 7 * 24 * 60 * 60 * 1000)) {
    return;
  }

  setTimeout(() => {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.classList.remove('hidden');
  }, 3000);
});

async function installPWAApp() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.classList.add('hidden');
  if (!pwaDeferredPrompt) {
    alert('To install Rani Hyper Market on iPhone:\n1. Tap the Share button ⎋ at bottom\n2. Select "Add to Home Screen" ➕');
    return;
  }
  pwaDeferredPrompt.prompt();
  await pwaDeferredPrompt.userChoice;
  pwaDeferredPrompt = null;
}

function dismissPWABanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.classList.add('hidden');
  try {
    localStorage.setItem('rani_pwa_dismissed', String(Date.now()));
  } catch(e) {}
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
