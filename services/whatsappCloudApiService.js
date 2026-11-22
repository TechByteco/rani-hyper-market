/**
 * Official Meta WhatsApp Cloud API Integration & Conversational Commerce Service
 * Rani Hypermarket (SNS Market) • Bodinayakanur & Theni District, Tamil Nadu
 * 
 * Features:
 * 1. WhatsApp Interactive Messages:
 *    - type: "button" with 1-Tap Ordering ("Order with 1-Tap (உடனே ஆர்டர் செய்யுங்கள்)")
 *    - type: "list" / "product_list" for interactive staple grocery catalog
 * 2. Inbound Webhook Handler:
 *    - Process incoming customer responses (Text, Button Clicks, Shared Location)
 *    - Haversine GPS radius verification vs Bodinayakanur store (8km express delivery zone)
 *    - Cashier POS order ticket auto-generation: "WhatsApp Order #WA-XXXX received from [Phone]"
 * 3. HSM Template Management:
 *    - Pre-approved Transactional Formats (order confirmation, dispatch, e-bill receipt)
 *    - Pre-approved Marketing Formats (festival surge, payday ration, clearance bundles)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ══════════════════════════════════════════════════════════════════
// STORE CONFIGURATION & GEOGRAPHIC DELIVERY BOUNDARIES
// ══════════════════════════════════════════════════════════════════

const STORE_CONFIG = {
  name: 'Rani Hypermarket (ராணி மார்க்கெட்)',
  hotline: '77088 34547',
  phoneFormatted: '+91 77088 34547',
  address: 'Main Road, Bodinayakanur, Theni District, Tamil Nadu 625513',
  coords: {
    lat: 10.0104, // Bodinayakanur Main Road
    lng: 77.3496,
    maxRadiusKm: 8.0, // 8 km delivery radius
    expressWindowMinutes: '30-45 Mins'
  },
  deliveryZones: [
    { name: 'Bodi Town Core (0-3 km)', eta: '25-35 mins', fee: 0 },
    { name: 'Bodi Suburbs & Estates (3-8 km)', eta: '35-45 mins', fee: 0 },
    { name: 'Theni Outskirts (>8 km)', eta: 'Scheduled Slot / Courier', fee: 50 }
  ]
};

// In-Memory conversation & ticket audit trail
const recentConversations = [];
const activeCustomerSessions = new Map();

// ══════════════════════════════════════════════════════════════════
// 1. HAVERSINE GPS DISTANCE & 8KM DELIVERY RADIUS VERIFIER
// ══════════════════════════════════════════════════════════════════

/**
 * Calculates Great-Circle distance between two coordinates in Kilometers
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 100) / 100;
}

/**
 * Verifies whether customer's shared GPS coordinates fall within 8km delivery zone
 */
function verifyDeliveryRadius(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (isNaN(lat) || isNaN(lng)) {
    return {
      isValid: false,
      error: 'Invalid latitude or longitude provided'
    };
  }

  const distanceKm = calculateDistanceKm(STORE_CONFIG.coords.lat, STORE_CONFIG.coords.lng, lat, lng);
  const isWithinRadius = distanceKm <= STORE_CONFIG.coords.maxRadiusKm;

  return {
    isValid: true,
    customerCoords: { lat, lng },
    storeCoords: { lat: STORE_CONFIG.coords.lat, lng: STORE_CONFIG.coords.lng },
    distanceKm,
    maxRadiusKm: STORE_CONFIG.coords.maxRadiusKm,
    isWithinRadius,
    deliveryZone: isWithinRadius ? 'Bodinayakanur Express Delivery (8km Zone)' : 'Extended Theni District Zone',
    deliveryEta: isWithinRadius ? '30–45 Minutes' : 'Same-Day / Next-Day Scheduled Delivery',
    tamilNotice: isWithinRadius
      ? `📍 நன்றி! உங்கள் இருப்பிடம் உறுதி செய்யப்பட்டது (தூரம்: ${distanceKm} கி.மீ). நீங்கள் போடி ராணி மார்க்கெட்டின் 8 கி.மீ எக்ஸ்பிரஸ் டெலிவரி எல்லைக்குள் உள்ளீர்கள்! 30-45 நிமிடங்களில் டோர் டெலிவரி செய்யப்படும்.`
      : `📍 உங்கள் இருப்பிடம் போடி ராணி மார்க்கெட்டிலிருந்து ${distanceKm} கி.மீ தொலைவில் உள்ளது (8 கி.மீ நேரடி எக்ஸ்பிரஸ் வரம்பை விட அதிகம்). சிறப்பு கொரியர் அல்லது ஸ்டோர் பிக்கப் மூலம் பெறலாம். உதவிக்கு: 77088 34547.`
  };
}

// ══════════════════════════════════════════════════════════════════
// 2. CASHIER POS ORDER TICKET AUTO-GENERATION
// ══════════════════════════════════════════════════════════════════

/**
 * Auto-generates an official Order Ticket in Cashier POS
 * e.g., "WhatsApp Order #WA-XXXX received from [Phone]"
 */
async function autoGeneratePosOrderTicket({
  phone,
  customerName,
  items = [],
  totalAmount = 0,
  locationData = null,
  sourceNotes = '',
  paymentMethod = 'Cash on Delivery'
}) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '') || '917708834547';
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const orderId = `WA-${orderNum}`;
  const invId = `RANI-WA-${orderNum}`;

  let shippingAddress = 'Bodinayakanur (WhatsApp Order)';
  if (locationData && locationData.isWithinRadius) {
    shippingAddress = `Bodi 8km Zone (GPS: ${locationData.customerCoords.lat.toFixed(4)}, ${locationData.customerCoords.lng.toFixed(4)} • ${locationData.distanceKm} km from store)`;
  } else if (locationData) {
    shippingAddress = `Extended Zone (GPS: ${locationData.customerCoords.lat.toFixed(4)}, ${locationData.customerCoords.lng.toFixed(4)} • ${locationData.distanceKm} km)`;
  }

  const defaultItems = [
    {
      id: 101,
      name: 'Bodi Special Deluxe Ponni Boiled Rice (25kg)',
      title: 'Bodi Special Deluxe Ponni Boiled Rice (25kg)',
      quantity: 1,
      price: 1299,
      mrp: 1450,
      savings: 151
    }
  ];

  const orderItems = (items && items.length > 0) ? items : defaultItems;
  const calculatedTotal = totalAmount || orderItems.reduce((s, i) => s + (Number(i.price) * (Number(i.quantity) || 1)), 0);
  const calculatedGross = orderItems.reduce((s, i) => s + ((Number(i.mrp) || Number(i.price) * 1.15) * (Number(i.quantity) || 1)), 0);
  const calculatedSavings = Math.max(0, calculatedGross - calculatedTotal);

  const ticketTitle = `WhatsApp Order #${orderId} received from ${cleanPhone}`;

  const posOrderPayload = {
    id: orderId,
    orderId: orderId,
    invId: invId,
    voucher_no: invId,
    order_no: orderId,
    customer_name: customerName || `WhatsApp Customer (${cleanPhone.slice(-4)})`,
    customer_phone: cleanPhone,
    phone: cleanPhone,
    shipping_address: shippingAddress,
    delivery_notes: `${ticketTitle}. ${sourceNotes}`,
    timeslot: locationData && locationData.isWithinRadius ? 'Express Delivery (30-45 mins)' : 'Standard Delivery (Today)',
    items: orderItems,
    total_amount: calculatedTotal,
    gross_mrp: calculatedGross,
    total_savings: calculatedSavings,
    payment_method: paymentMethod || 'Cash on Delivery',
    payment_status: paymentMethod === 'Cash on Delivery' ? 'Pending COD Collection' : 'Paid Online (UPI)',
    status: 'new',
    source: 'WhatsApp Conversational Commerce',
    ticket_title: ticketTitle,
    gps_verification: locationData || null,
    created_at: new Date().toISOString(),
    timestamp: Date.now()
  };

  // Persist directly to POS Enhancement Service
  let posSaved = false;
  try {
    const posEnhancement = require('./posEnhancementService');
    if (typeof posEnhancement.saveOnlineOrder === 'function') {
      await posEnhancement.saveOnlineOrder(posOrderPayload);
      posSaved = true;
    }
  } catch (e1) {
    try {
      const posEnhancement = require('../posEnhancementService');
      if (typeof posEnhancement.saveOnlineOrder === 'function') {
        await posEnhancement.saveOnlineOrder(posOrderPayload);
        posSaved = true;
      }
    } catch (e2) {
      console.warn('POS service direct fallback in WhatsApp service:', e2.message);
    }
  }

  // Fallback: write to local data file if POS service didn't save
  if (!posSaved) {
    try {
      const candidatePaths = [
        path.join(process.cwd(), 'data', 'online_orders.json'),
        path.join(process.cwd(), 'public', 'online_orders.json'),
        path.join(__dirname, '..', 'data', 'online_orders.json'),
        path.join(__dirname, '..', 'public', 'online_orders.json')
      ];
      for (const cp of candidatePaths) {
        if (fs.existsSync(cp)) {
          const list = JSON.parse(fs.readFileSync(cp, 'utf8') || '[]');
          list.unshift(posOrderPayload);
          fs.writeFileSync(cp, JSON.stringify(list, null, 2), 'utf8');
          break;
        }
      }
    } catch (e) {}
  }

  // Record into memory audit feed
  recentConversations.unshift({
    timestamp: new Date().toISOString(),
    direction: 'INBOUND_ORDER',
    type: 'ORDER_TICKET_GENERATED',
    phone: cleanPhone,
    orderId,
    ticketText: ticketTitle,
    totalAmount: calculatedTotal,
    status: 'NEW_ORDER_LOGGED_IN_POS',
    itemSummary: orderItems.map(i => `${i.title || i.name} (${i.quantity || 1}x)`).join(', ')
  });

  return {
    success: true,
    orderId,
    ticketText: ticketTitle,
    order: posOrderPayload
  };
}

// ══════════════════════════════════════════════════════════════════
// 3. WHATSAPP INTERACTIVE MESSAGES (BUTTONS & PRODUCT LISTS)
// ══════════════════════════════════════════════════════════════════

/**
 * Pre-defined Bodinayakanur top commodity list for interactive menus
 */
const CATALOG_COMMODITIES = [
  {
    skuId: 'ponni_rice_25kg',
    title: 'Bodi Deluxe Ponni Rice (25kg)',
    tamilTitle: 'முதல் தர போடி டீலக்ஸ் பொன்னி புழுங்கல் அரிசி (25 கிலோ)',
    mrp: 1450,
    offerPrice: 1299,
    savingsText: '₹151 நேரடி சேமிப்பு!',
    category: 'Staples'
  },
  {
    skuId: 'sunflower_oil_5l',
    title: 'Gold Winner Sunflower Oil (5L Can)',
    tamilTitle: 'கோல்ட் வின்னர் சுத்திகரிக்கப்பட்ட சூரியகாந்தி எண்ணெய் (5 லிட்டர்)',
    mrp: 780,
    offerPrice: 669,
    savingsText: '₹111 தள்ளுபடி!',
    category: 'Edible Oils'
  },
  {
    skuId: 'grb_ghee_500ml',
    title: 'GRB Pure Cow Ghee (500ml)',
    tamilTitle: 'ஜி.ஆர்.பி மணமணக்கும் சுத்தமான பசும்பால் நெய் (500மி.லி)',
    mrp: 395,
    offerPrice: 339,
    savingsText: '₹56 சேமிப்பு!',
    category: 'Dairy'
  },
  {
    skuId: 'bovonto_combo',
    title: 'Bovonto Grape Soft Drink (2L x 2)',
    tamilTitle: 'தென் மாவட்டங்களின் ஃபேவரிட் போவோண்டோ காம்போ (2L x 2)',
    mrp: 190,
    offerPrice: 159,
    savingsText: '₹31 காம்போ சேமிப்பு!',
    category: 'Beverages'
  },
  {
    skuId: 'cardamom_tea',
    title: 'Bodi Cardamom & Premium Tea Pack',
    tamilTitle: 'போடி ஏலக்காய் நகரம் மணமணக்கும் ஸ்பெஷல் டீத்தூள் பேக்',
    mrp: 320,
    offerPrice: 249,
    savingsText: '₹71 தள்ளுபடி!',
    category: 'Tea & Spices'
  }
];

/**
 * Builds Meta WhatsApp Cloud API payload: Interactive Button Message
 * Action: "Order with 1-Tap (உடனே ஆர்டர் செய்யுங்கள்)"
 */
function buildInteractiveButtonMessage(to, options = {}) {
  const recipient = (to || '').replace(/[^0-9]/g, '') || '917708834547';
  const sku = CATALOG_COMMODITIES.find(c => c.skuId === options.skuId) || CATALOG_COMMODITIES[0];

  const englishTitle = options.englishTitle || sku.title;
  const tamilTitle = options.tamilTitle || sku.tamilTitle;
  const mrp = options.mrp || sku.mrp;
  const offerPrice = options.offerPrice || sku.offerPrice;
  const savingsText = options.savingsText || sku.savingsText;
  const badgeText = options.badgeText || '👑 இல்லத்தரசிகளின் முதன்மை தேர்வு';
  const skuId = options.skuId || sku.skuId;

  // Banner URL for WhatsApp Rich Card Header
  const bannerUrl = options.bannerUrl || 
    `https://rani-hyper-market.vercel.app/api/banner/render?layout=square&format=webp&englishTitle=${encodeURIComponent(englishTitle)}&mrp=${mrp}&offerPrice=${offerPrice}`;

  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: {
          link: bannerUrl
        }
      },
      body: {
        text: `🌾 *${badgeText}*\n\n*${tamilTitle}*\n\n• வழக்கமான MRP: ~₹${mrp}~\n• இன்றைய சிறப்பு விலை: *₹${offerPrice}*\n• நேரடி சேமிப்பு: *${savingsText}*\n\nநம்ம போடி ராணி மார்க்கெட் வழங்கும் சிறப்பு சலுகை! போடி மற்றும் 8 கி.மீ சுற்றளவில் 30-45 நிமிடங்களில் டோர் டெலிவரி.`
      },
      footer: {
        text: 'Rani Hypermarket • Bodinayakanur • 77088 34547'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: `quick_order_${skuId}`,
              title: 'Order with 1-Tap' // Meta 20-character maximum requirement
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'share_delivery_location',
              title: '📍 இருப்பிடம் அனுப்பு'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'browse_catalog_menu',
              title: '🛒 முழு பட்டியல்'
            }
          }
        ]
      }
    }
  };
}

/**
 * Builds Meta WhatsApp Cloud API payload: Interactive Product List / Catalog Message
 */
function buildInteractiveProductList(to, options = {}) {
  const recipient = (to || '').replace(/[^0-9]/g, '') || '917708834547';

  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: '🛍️ ராணி ஹைப்பர் மார்க்கெட் மளிகை பட்டியல்'
      },
      body: {
        text: 'வணக்கம்! நம்ம போடி ராணி மார்க்கெட்டின் டாப் மளிகை காம்போ ஆஃபர்கள் இதோ. தங்களுக்கு தேவையான பொருளை தேர்வு செய்து 1-Tap இல் உடனே ஆர்டர் செய்யுங்கள் (8 கி.மீ சுற்றளவில் 30 நிமிட டெலிவரி).'
      },
      footer: {
        text: 'Bodinayakanur • Doorstep Delivery: 77088 34547'
      },
      action: {
        button: 'ஆர்டர் செய்யுங்கள்',
        sections: [
          {
            title: '🌾 அத்தியாவசிய அரிசி & பருப்பு',
            rows: [
              {
                id: 'quick_order_ponni_rice_25kg',
                title: 'டீலக்ஸ் பொன்னி அரிசி 25kg',
                description: 'MRP ₹1,450 | ஆஃபர் ₹1,299 (₹151 சேமிப்பு)'
              },
              {
                id: 'quick_order_cardamom_tea',
                title: 'போடி ஏலக்காய் டீ பேக்',
                description: 'MRP ₹320 | ஆஃபர் ₹249 (₹71 தள்ளுபடி)'
              }
            ]
          },
          {
            title: '🌻 சமையல் எண்ணெய் & நெய்',
            rows: [
              {
                id: 'quick_order_sunflower_oil_5l',
                title: 'கோல்ட் வின்னர் ஆயில் 5L',
                description: 'MRP ₹780 | ஆஃபர் ₹669 (₹111 சேமிப்பு)'
              },
              {
                id: 'quick_order_grb_ghee_500ml',
                title: 'GRB பசும்பால் நெய் 500ml',
                description: 'MRP ₹395 | ஆஃபர் ₹339 (₹56 சேமிப்பு)'
              }
            ]
          },
          {
            title: '🍇 குளிர்பானங்கள் & ஸ்பெஷல்',
            rows: [
              {
                id: 'quick_order_bovonto_combo',
                title: 'போவோண்டோ காம்போ (2L x 2)',
                description: 'MRP ₹190 | ஆஃபர் ₹159 (₹31 சேமிப்பு)'
              }
            ]
          }
        ]
      }
    }
  };
}

// ══════════════════════════════════════════════════════════════════
// 4. HSM TEMPLATE MANAGEMENT (TRANSACTIONAL & MARKETING FORMATS)
// ══════════════════════════════════════════════════════════════════

const HSM_TEMPLATES = {
  // Transactional Templates
  order_confirmation_v1: {
    name: 'order_confirmation_v1',
    category: 'TRANSACTIONAL',
    status: 'APPROVED',
    languages: ['ta', 'en_US'],
    description: 'Instant WhatsApp order ticket confirmation with bill amount and delivery slot',
    templateText: 'நம்ம போடி ராணி மார்க்கெட்: தங்களின் ஆர்டர் #{{1}} வெற்றிகரமாக பதிவு செய்யப்பட்டது! மொத்த தொகை: ₹{{2}}. டெலிவரி நேரம்: {{3}}. கண்காணிப்பு: {{4}}. உதவிக்கு: 77088 34547.',
    parametersCount: 4,
    parameterDescriptions: ['Order ID (e.g., WA-4821)', 'Total Amount (e.g., 1299)', 'Delivery ETA (e.g., 30-45 Mins)', 'Live Track URL']
  },
  delivery_dispatch_v1: {
    name: 'delivery_dispatch_v1',
    category: 'SHIPPING_UPDATE',
    status: 'APPROVED',
    languages: ['ta', 'en_US'],
    description: 'Real-time out-for-delivery alert with driver phone number and 8km zone ETA',
    templateText: 'வணக்கம் {{1}}! தங்கள் ஆர்டர் #{{2}} ராணி மார்க்கெட்டிலிருந்து புறப்பட்டுவிட்டது. டெலிவரி பார்ட்னர்: {{3}} (Ph: {{4}}). 30 நிமிடங்களில் உங்கள் இல்லம் வந்து சேரும்!',
    parametersCount: 4,
    parameterDescriptions: ['Customer Name', 'Order ID', 'Driver Name', 'Driver Contact Phone']
  },
  ebill_receipt_v1: {
    name: 'ebill_receipt_v1',
    category: 'ACCOUNT_UPDATE',
    status: 'APPROVED',
    languages: ['ta', 'en_US'],
    description: 'Official digital GST e-bill download link for instant mobile receipts',
    templateText: 'ராணி ஹைப்பர் மார்க்கெட் ஜிஎஸ்டி மின்னணு ரசீது (E-Bill): பில் எண் #{{1}}, தொகை: ₹{{2}}. ரசீதை பதிவிறக்கம் செய்ய: {{3}}. தங்கள் ஆதரவிற்கு நன்றி!',
    parametersCount: 3,
    parameterDescriptions: ['Voucher / Invoice No', 'Bill Total INR', 'E-Bill Download Link']
  },

  // Marketing Templates
  festival_surge_blast_v1: {
    name: 'festival_surge_blast_v1',
    category: 'MARKETING',
    status: 'APPROVED',
    languages: ['ta', 'en_US'],
    description: 'Festival surge announcement with high-contrast price badge and 1-Tap order action',
    templateText: '🌾 போடி இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு திருவிழா! {{1}} சிறப்பு சலுகை: {{2}} MRP ~₹{{3}}~ தள்ளுபடி விலையில் *₹{{4}}* மட்டுமே! (நேரடி சேமிப்பு ₹{{5}}). உடனே 1-Tap இல் ஆர்டர் செய்ய கீழே உள்ள பட்டனை அழுத்தவும்.',
    parametersCount: 5,
    parameterDescriptions: ['Festival Name', 'Product Title', 'MRP', 'Offer Price', 'Savings Amount']
  },
  payday_ration_saver_v1: {
    name: 'payday_ration_saver_v1',
    category: 'MARKETING',
    status: 'APPROVED',
    languages: ['ta', 'en_US'],
    description: 'Monthly 1st–5th salary ration discount campaign',
    templateText: 'மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா! நம்ம போடி ராணி மார்க்கெட்டில் 1 முதல் 5ம் தேதி வரை அனைத்து மளிகை பொருட்களுக்கும் அதிரடி தள்ளுபடி. ஆர்டர் செய்ய: 77088 34547.',
    parametersCount: 0,
    parameterDescriptions: []
  },
  dead_stock_clearance_v1: {
    name: 'dead_stock_clearance_v1',
    category: 'MARKETING',
    status: 'APPROVED',
    languages: ['ta', 'en_US'],
    description: 'High-affinity clearance bundle promotion',
    templateText: 'ராணி மார்க்கெட் மெகா காம்போ சேமிப்பு ஆஃபர்! {{1}} வாங்குபவர்களுக்கு {{2}} சிறப்பு தள்ளுபடி விலையில் *₹{{3}}* மட்டுமே! ஸ்டாக் உள்ளவரை மட்டுமே.',
    parametersCount: 3,
    parameterDescriptions: ['Anchor SKU Name', 'Clearance SKU Name', 'Bundle Discount Price']
  }
};

/**
 * Compiles an HSM template with dynamic variables
 */
function renderHsmTemplate(templateName, variables = []) {
  const tpl = HSM_TEMPLATES[templateName];
  if (!tpl) {
    throw new Error(`HSM Template "${templateName}" not found in registry`);
  }

  let text = tpl.templateText;
  variables.forEach((val, index) => {
    const placeholder = new RegExp(`\\{\\{${index + 1}\\}\\}`, 'g');
    text = text.replace(placeholder, String(val));
  });

  return {
    template: tpl.name,
    category: tpl.category,
    status: tpl.status,
    compiledText: text,
    variablesUsed: variables
  };
}

/**
 * Returns all registered HSM templates
 */
function getHsmTemplates() {
  return Object.values(HSM_TEMPLATES);
}

// ══════════════════════════════════════════════════════════════════
// 5. INBOUND WEBHOOK PROCESSOR (TEXT, BUTTONS & GPS LOCATION)
// ══════════════════════════════════════════════════════════════════

/**
 * Handles incoming Meta WhatsApp Cloud API Webhook payloads
 */
async function handleInboundWebhook(body = {}) {
  const results = [];

  // Parse standard Meta Cloud API entry envelope
  const entries = body.entry || [];
  if (!Array.isArray(entries) || entries.length === 0) {
    // Check if direct single message passed
    if (body.from || body.message || body.location || body.button) {
      return [await processSingleInboundEvent(body)];
    }
    return { success: false, error: 'No message entries found in webhook payload' };
  }

  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      const val = change.value || {};
      const messages = val.messages || [];
      const contacts = val.contacts || [];
      const contactName = (contacts[0] && contacts[0].profile) ? contacts[0].profile.name : 'Valued Customer';

      for (const msg of messages) {
        const processed = await processMessageObject(msg, contactName);
        results.push(processed);
      }
    }
  }

  return {
    success: true,
    processedCount: results.length,
    results
  };
}

/**
 * Internal processor for a single WhatsApp message object
 */
async function processMessageObject(msg = {}, contactName = 'Valued Customer') {
  const fromPhone = (msg.from || '').replace(/[^0-9]/g, '') || '917708834547';
  const msgType = msg.type || 'text';

  // ── CASE 1: SHARED GPS LOCATION ──
  if (msgType === 'location') {
    const loc = msg.location || {};
    const lat = loc.latitude;
    const lng = loc.longitude;
    const radiusCheck = verifyDeliveryRadius(lat, lng);

    // Save location to active customer session
    activeCustomerSessions.set(fromPhone, {
      lastLocation: radiusCheck,
      contactName,
      updatedAt: Date.now()
    });

    // Auto-generate order ticket if customer has pending item, or acknowledge location
    let posOrder = null;
    if (radiusCheck.isWithinRadius) {
      posOrder = await autoGeneratePosOrderTicket({
        phone: fromPhone,
        customerName: contactName,
        locationData: radiusCheck,
        sourceNotes: 'Auto-verified within Bodinayakanur 8km express zone via GPS.'
      });
    }

    const replyText = radiusCheck.isWithinRadius
      ? `📍 *எக்ஸ்பிரஸ் டெலிவரி உறுதி செய்யப்பட்டது!*\n\n${radiusCheck.tamilNotice}\n\n• ஆர்டர் எண்: *${posOrder ? posOrder.orderId : 'WA-PENDING'}*\n• டெலிவரி நேரம்: *30-45 நிமிடங்கள்*\n• கேஷியர் கவுண்டருக்கு ஆர்டர் டிக்கெட் அனுப்பப்பட்டது!\n\nபொருட்கள் தயாராகிறது. நன்றி!`
      : `📍 *டெலிவரி அறிவிப்பு:*\n\n${radiusCheck.tamilNotice}\n\nதங்கள் ஆர்டரை உறுதி செய்ய அழைக்கவும்: 77088 34547.`;

    const auditEntry = {
      timestamp: new Date().toISOString(),
      direction: 'INBOUND',
      type: 'GPS_LOCATION',
      from: fromPhone,
      contactName,
      coordinates: { lat, lng },
      radiusCheck,
      orderGenerated: Boolean(posOrder),
      orderId: posOrder ? posOrder.orderId : null,
      autoReply: replyText
    };
    recentConversations.unshift(auditEntry);

    return {
      type: 'location',
      from: fromPhone,
      radiusCheck,
      orderTicket: posOrder ? posOrder.ticketText : null,
      orderId: posOrder ? posOrder.orderId : null,
      replyMessage: replyText
    };
  }

  // ── CASE 2: INTERACTIVE BUTTON CLICK ──
  if (msgType === 'interactive') {
    const inter = msg.interactive || {};
    const interType = inter.type;

    if (interType === 'button_reply') {
      const btn = inter.button_reply || {};
      const btnId = btn.id || '';
      const btnTitle = btn.title || '';

      // Check for 1-Tap Quick Order
      if (btnId.startsWith('quick_order_') || btnTitle.toLowerCase().includes('order') || btnTitle.includes('ஆர்டர்')) {
        const skuId = btnId.replace('quick_order_', '');
        const sku = CATALOG_COMMODITIES.find(c => c.skuId === skuId) || CATALOG_COMMODITIES[0];

        const session = activeCustomerSessions.get(fromPhone);
        const locationData = session ? session.lastLocation : null;

        // Auto-generate order ticket in Cashier POS!
        const posOrder = await autoGeneratePosOrderTicket({
          phone: fromPhone,
          customerName: contactName,
          items: [
            {
              id: 101,
              name: sku.title,
              title: sku.title,
              quantity: 1,
              price: sku.offerPrice,
              mrp: sku.mrp,
              savings: sku.mrp - sku.offerPrice
            }
          ],
          totalAmount: sku.offerPrice,
          locationData: locationData,
          sourceNotes: `1-Tap Order Button Clicked (${sku.title})`
        });

        const replyText = `🎉 *வாழ்த்துகள்! தங்கள் ஆர்டர் உறுதியானது!*\n\n${posOrder.ticketText}\n\n• பொருள்: *${sku.tamilTitle}*\n• செலுத்த வேண்டிய தொகை: *₹${sku.offerPrice}* (COD / GPay)\n• நேரடி சேமிப்பு: *₹${sku.mrp - sku.offerPrice}*\n\n📍 துல்லியமான 30-நிமிட டெலிவரிக்கு உங்கள் WhatsApp-ல் 'Share Location' (📍) மூலம் இருப்பிடத்தை பகிருங்கள்!`;

        const auditEntry = {
          timestamp: new Date().toISOString(),
          direction: 'INBOUND',
          type: 'BUTTON_CLICK',
          from: fromPhone,
          contactName,
          buttonId: btnId,
          buttonTitle: btnTitle,
          orderTicket: posOrder.ticketText,
          orderId: posOrder.orderId,
          autoReply: replyText
        };
        recentConversations.unshift(auditEntry);

        return {
          type: 'button_reply',
          from: fromPhone,
          buttonId: btnId,
          orderId: posOrder.orderId,
          ticketText: posOrder.ticketText,
          replyMessage: replyText
        };
      }

      // Check for Share Location request
      if (btnId === 'share_delivery_location') {
        const replyText = '📍 தயவுசெய்து உங்கள் WhatsApp-ல் கீழே உள்ள பேப்பர்-கிளிப் (📎) அல்லது பிளஸ் (+) பட்டனை அழுத்தி "Location" (📍) என்பதை தேர்வு செய்து பகிருங்கள். 8 கி.மீ சுற்றளவை சரிபார்த்து 30 நிமிடங்களில் கொண்டு சேர்க்கிறோம்!';
        return {
          type: 'button_reply',
          from: fromPhone,
          buttonId: btnId,
          replyMessage: replyText
        };
      }

      // Check for Catalog Menu
      if (btnId === 'browse_catalog_menu') {
        return {
          type: 'button_reply',
          from: fromPhone,
          buttonId: btnId,
          sendCatalog: true,
          catalogPayload: buildInteractiveProductList(fromPhone)
        };
      }
    }

    // List Reply
    if (interType === 'list_reply') {
      const row = inter.list_reply || {};
      const rowId = row.id || '';
      const skuId = rowId.replace('quick_order_', '');
      const sku = CATALOG_COMMODITIES.find(c => c.skuId === skuId) || CATALOG_COMMODITIES[0];

      const posOrder = await autoGeneratePosOrderTicket({
        phone: fromPhone,
        customerName: contactName,
        items: [{ id: 101, name: sku.title, title: sku.title, quantity: 1, price: sku.offerPrice, mrp: sku.mrp }],
        totalAmount: sku.offerPrice,
        sourceNotes: `Interactive Catalog List Selection (${sku.title})`
      });

      const replyText = `🛍️ *ஆர்டர் பதிவு செய்யப்பட்டது!*\n\n${posOrder.ticketText}\n\n• பொருள்: *${sku.tamilTitle}*\n• சலுகை விலை: *₹${sku.offerPrice}*\n• கேஷியர் பில்லிங் கவுண்டருக்கு அனுப்பப்பட்டது.\n\n30-45 நிமிடங்களில் டோர் டெலிவரி செய்யப்படும்.`;

      return {
        type: 'list_reply',
        from: fromPhone,
        rowId,
        orderId: posOrder.orderId,
        ticketText: posOrder.ticketText,
        replyMessage: replyText
      };
    }
  }

  // ── CASE 3: STANDARD TEXT MESSAGE ──
  const textBody = ((msg.text && msg.text.body) || '').trim();
  const lower = textBody.toLowerCase();

  // If text mentions order or specific commodities
  if (lower.includes('order') || lower.includes('ஆர்டர்') || lower.includes('rice') || lower.includes('oil') || lower.includes('மளிகை')) {
    return {
      type: 'text_order_intent',
      from: fromPhone,
      originalText: textBody,
      interactiveMessage: buildInteractiveButtonMessage(fromPhone, {
        badgeText: '👑 போடி ராணி மார்க்கெட் - 1-Tap ஆர்டர்'
      })
    };
  }

  // Greeting
  const greetingReply = `வணக்கம் ${contactName}! நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டிற்கு வரவேற்கிறோம். 🌾\n\n1-Tap இல் மளிகை பொருட்கள் ஆர்டர் செய்ய, அல்லது போடி 8 கி.மீ சுற்றளவில் இலவச டோர் டெலிவரி பெற கீழே உள்ள ஆப்ஷன்களை பயன்படுத்தலாம்:\n\n1️⃣ மளிகை பட்டியல் காண: "CATALOG"\n2️⃣ 8km டெலிவரி சரிபார்க்க: "LOCATION"\n3️⃣ உதவிக்கு: 77088 34547`;

  recentConversations.unshift({
    timestamp: new Date().toISOString(),
    direction: 'INBOUND',
    type: 'TEXT_MESSAGE',
    from: fromPhone,
    contactName,
    text: textBody,
    autoReply: greetingReply
  });

  return {
    type: 'text',
    from: fromPhone,
    originalText: textBody,
    replyMessage: greetingReply
  };
}

/**
 * Direct simulator helper for testing webhooks and simulating live customer responses
 */
async function simulateInboundMessage(payload = {}) {
  const from = payload.from || payload.phone || '917708834547';
  const name = payload.contactName || payload.name || 'Bodi Shopper';
  const type = payload.type || 'text';

  const mockMetaEnvelope = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'WHATSAPP_ACCOUNT_ID',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '917708834547', phone_number_id: 'RANI_PHONE_ID' },
              contacts: [{ profile: { name: name }, wa_id: from }],
              messages: [
                type === 'location'
                  ? {
                      from,
                      id: 'wamid.simulated_loc_' + Date.now(),
                      timestamp: String(Math.floor(Date.now() / 1000)),
                      type: 'location',
                      location: {
                        latitude: payload.latitude !== undefined ? payload.latitude : STORE_CONFIG.coords.lat + 0.015,
                        longitude: payload.longitude !== undefined ? payload.longitude : STORE_CONFIG.coords.lng + 0.015,
                        name: payload.locationName || 'Customer GPS Pin'
                      }
                    }
                  : type === 'button_reply'
                  ? {
                      from,
                      id: 'wamid.simulated_btn_' + Date.now(),
                      timestamp: String(Math.floor(Date.now() / 1000)),
                      type: 'interactive',
                      interactive: {
                        type: 'button_reply',
                        button_reply: {
                          id: payload.buttonId || 'quick_order_ponni_rice_25kg',
                          title: payload.buttonTitle || 'Order with 1-Tap'
                        }
                      }
                    }
                  : {
                      from,
                      id: 'wamid.simulated_txt_' + Date.now(),
                      timestamp: String(Math.floor(Date.now() / 1000)),
                      type: 'text',
                      text: { body: payload.text || 'Order Ponni Rice 25kg' }
                    }
              ]
            },
            field: 'messages'
          }
        ]
      }
    ]
  };

  return await handleInboundWebhook(mockMetaEnvelope);
}

/**
 * Returns recent conversation history
 */
function getRecentConversations(limit = 20) {
  return recentConversations.slice(0, limit);
}

module.exports = {
  STORE_CONFIG,
  CATALOG_COMMODITIES,
  HSM_TEMPLATES,
  calculateDistanceKm,
  verifyDeliveryRadius,
  autoGeneratePosOrderTicket,
  buildInteractiveButtonMessage,
  buildInteractiveProductList,
  renderHsmTemplate,
  getHsmTemplates,
  handleInboundWebhook,
  simulateInboundMessage,
  getRecentConversations
};
