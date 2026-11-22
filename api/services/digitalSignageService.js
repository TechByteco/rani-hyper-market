/**
 * In-Store Digital Signage Broadcaster & MQTT IoT Service
 * Rani Hyper Market, Main Road, Bodinayakanur & Theni District, Tamil Nadu
 * 
 * Hardware Target: Raspberry Pi / Android TV sticks powering 43-inch overhead HDMI displays
 * Architecture:
 * 1. MQTT Broker connection over local supermarket Wi-Fi (broker.local:1883, topic: store/display/promo)
 * 2. Real-time Server-Sent Events (SSE) broadcaster for Chromium kiosk web displays
 * 3. Agent 2 & 3 Flash Deal listener & dispatcher with Tamil speech synthesis metadata
 * 4. Offline playlist cache & screen heartbeat monitor
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Universal Root Resolver for Dual-Copy Parity
function resolveAppRoot() {
  const candidates = [
    process.cwd(),
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '..', '..')
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'products_catalog.json'))) {
      return c;
    }
  }
  return process.cwd();
}

// Default Offline Promotional Playlist (High-Affinity Combos & Store Specials)
const DEFAULT_PROMOTIONAL_SLIDES = [
  {
    id: 'SLIDE-COMBO-01',
    type: 'BASKET_COMBO',
    badge: '🔥 மெகா காம்போ சேமிப்பு ஆஃபர் - MEGA COMBO',
    title: 'Ponni Boiled Rice 25kg + Gold Winner Sunflower Oil 1L + Toor Dal 1kg',
    tamil_title: 'முதல் தர பொன்னி அரிசி 25kg + சூரியகாந்தி எண்ணெய் 1L + துவரம் பருப்பு 1kg',
    mrp: 1740,
    offer_price: 1549,
    savings: 191,
    discount_pct: 11,
    image_url: 'https://images.openfoodfacts.org/images/products/000/008/900/2940/front_en.7.400.jpg',
    tagline_tamil: 'இல்லத்தரசிகளின் மாத மளிகை பட்ஜெட் சேமிப்பு காம்போ!',
    aisle: 'Aisle 01: Rice & Cooking Essentials',
    duration_seconds: 10,
    bg_gradient: 'from-emerald-950 via-slate-900 to-teal-950',
    audio_tamil: 'ராணி ஹைப்பர் மார்க்கெட் சிறப்பு காம்போ ஆஃபர்! பொன்னி அரிசி 25 கிலோ, சூரியகாந்தி எண்ணெய் மற்றும் துவரம் பருப்பு காம்போ பேக் வெறும் 1549 ரூபாய்க்கு கிடைக்கிறது!'
  },
  {
    id: 'SLIDE-CARDAMOM-02',
    type: 'LOCAL_SPECIALTY',
    badge: '🌿 போடி மலை நேரடி கொள்முதல் - BODI CARDAMOM SPECIAL',
    title: 'Bodinayakanur Grade-1 Green Cardamom (Green Gold) 100g',
    tamil_title: 'போடி மலை முதல் தர பச்சை ஏலக்காய் 100g (ஏலக்காய் நகரம் சிறப்பு)',
    mrp: 350,
    offer_price: 279,
    savings: 71,
    discount_pct: 20,
    image_url: 'images/rani_logo.png',
    tagline_tamil: 'மணமணக்கும் போடி மலை விவசாயிகளிடம் நேரடி கொள்முதல்!',
    aisle: 'Aisle 03: Spices & Mandi Aromatics',
    duration_seconds: 10,
    bg_gradient: 'from-amber-950 via-neutral-900 to-yellow-950',
    audio_tamil: 'போடி நகரின் பிரசித்தி பெற்ற முதல் தர பச்சை ஏலக்காய் 100 கிராம் அதிரடி தள்ளுபடி விலையில் வெறும் 279 ரூபாய்க்கு கிடைக்கிறது!'
  },
  {
    id: 'SLIDE-BATTER-03',
    type: 'DAILY_STAPLE',
    badge: '🥣 காலை உணவு மளிகை பேக் - IDLI BATTER COMBO',
    title: 'Idli Rice 5kg + White Urad Dal 1kg',
    tamil_title: 'பஞ்சு போன்ற இட்லிக்கு: இட்லி அரிசி 5kg + வெள்ளை உருட்டு உளுந்து 1kg',
    mrp: 380,
    offer_price: 315,
    savings: 65,
    discount_pct: 17,
    image_url: 'images/rani_logo.png',
    tagline_tamil: 'பஞ்சு போல மென்மையான இட்லி, மொறுமொறு தோசைக்கு உகந்தது!',
    aisle: 'Aisle 01: Rice & Pulses',
    duration_seconds: 10,
    bg_gradient: 'from-blue-950 via-slate-900 to-indigo-950',
    audio_tamil: 'பஞ்சு போன்ற இட்லிக்கு சிறந்த இட்லி அரிசி மற்றும் உருட்டு உளுந்து காம்போ சிறப்பு தள்ளுபடி விலையில் உடனே வாங்குங்கள்!'
  },
  {
    id: 'SLIDE-COFFEE-04',
    type: 'BEVERAGE_SAVER',
    badge: '☕ சுறுசுறுப்பான காலை பொழுது - FILTER COFFEE SAVER',
    title: 'Narasus / Bru Filter Coffee 500g + Dairy Fresh Milk 1L',
    tamil_title: 'டிகிரி ஃபில்டர் காபி தூள் 500g + புதிய பசும்பால் 1L',
    mrp: 290,
    offer_price: 245,
    savings: 45,
    discount_pct: 16,
    image_url: 'images/rani_logo.png',
    tagline_tamil: 'மணமணக்கும் அசல் டிகிரி காபி அனுபவம் நம்ம போடி ராணியில்!',
    aisle: 'Aisle 04: Beverages & Dairy',
    duration_seconds: 10,
    bg_gradient: 'from-stone-950 via-neutral-900 to-amber-950',
    audio_tamil: 'மணமணக்கும் ஃபில்டர் காபி தூள் மற்றும் புதிய பால் சேமிப்பு காம்போ பேக் இப்போது சிறப்பு சலுகை விலையில்!'
  }
];

class DigitalSignageService extends EventEmitter {
  constructor() {
    super();
    this.rootDir = resolveAppRoot();
    this.storagePath = path.join(this.rootDir, 'data', 'digital_signage_state.json');
    this.brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://broker.local:1883';
    this.topic = 'store/display/promo';
    this.alertsTopic = 'store/display/alerts';

    this.currentFlashDeal = null;
    this.promotionalSlides = [...DEFAULT_PROMOTIONAL_SLIDES];
    this.connectedDisplays = new Map(); // displayId -> { id, aisle, ip, fps, lastSeen }
    this.sseClients = new Set(); // Set of active HTTP Response streams
    this.mqttClient = null;
    this.mqttConnected = false;

    this.initMqtt();
    this.initAgent3Listener();
    this.loadState();
  }

  /**
   * Load persisted state if exists
   */
  loadState() {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf8');
        const state = JSON.parse(raw);
        if (state.currentFlashDeal && new Date(state.currentFlashDeal.expires_at) > new Date()) {
          this.currentFlashDeal = state.currentFlashDeal;
        }
        if (Array.isArray(state.customSlides) && state.customSlides.length > 0) {
          this.promotionalSlides = [...state.customSlides, ...DEFAULT_PROMOTIONAL_SLIDES];
        }
      }
    } catch (e) {
      console.warn('[DigitalSignage] Load state notice:', e.message);
    }
  }

  /**
   * Persist active state to disk
   */
  saveState() {
    try {
      const dataDir = path.dirname(this.storagePath);
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(this.storagePath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        currentFlashDeal: this.currentFlashDeal,
        connectedDisplaysCount: this.connectedDisplays.size
      }, null, 2), 'utf8');
    } catch (e) {}
  }

  /**
   * Initialize MQTT client connection over local supermarket Wi-Fi
   */
  initMqtt() {
    let mqtt = null;
    try {
      mqtt = require('mqtt');
    } catch (e) {
      console.warn('[DigitalSignage] MQTT library not available, operating in embedded SSE/EventBus mode.');
      return;
    }

    try {
      this.mqttClient = mqtt.connect(this.brokerUrl, {
        clientId: `RaniSignageBroadcaster_${Math.random().toString(16).slice(2, 8)}`,
        reconnectPeriod: 5000,
        connectTimeout: 3000,
        clean: true
      });

      this.mqttClient.on('connect', () => {
        this.mqttConnected = true;
        console.log(`[DigitalSignage] Connected to Local Supermarket MQTT Broker at ${this.brokerUrl}`);
        this.mqttClient.subscribe([this.topic, this.alertsTopic], (err) => {
          if (!err) {
            console.log(`[DigitalSignage] Subscribed to MQTT topics: ${this.topic}, ${this.alertsTopic}`);
          }
        });
      });

      this.mqttClient.on('message', (topic, message) => {
        try {
          const parsed = JSON.parse(message.toString());
          console.log(`[DigitalSignage] Inbound MQTT message on [${topic}]:`, parsed.product_name || parsed.title);
          this.handleInboundMqttDeal(parsed);
        } catch (err) {
          console.error('[DigitalSignage] MQTT Parse error:', err.message);
        }
      });

      this.mqttClient.on('error', (err) => {
        this.mqttConnected = false;
        // Suppress repeated connection logs on dev machines without broker
      });

      this.mqttClient.on('offline', () => {
        this.mqttConnected = false;
      });
    } catch (err) {
      console.warn('[DigitalSignage] MQTT init warning:', err.message);
    }
  }

  /**
   * Hook into Agent 3 OmniChannelDispatcher signageEmitter
   */
  initAgent3Listener() {
    try {
      let omni = null;
      try {
        omni = require('./omniChannelOrchestratorService');
      } catch (e) {
        try {
          omni = require('../services/omniChannelOrchestratorService');
        } catch (e2) {}
      }

      if (omni && omni.signageEmitter) {
        omni.signageEmitter.on('promo', (deal) => {
          console.log('[DigitalSignage] Inbound promo broadcast received from Agent 3 / OmniChannelDispatcher:', deal.product_name);
          this.publishFlashDeal(deal, { origin: 'AGENT_3_OMNI_DISPATCHER' });
        });
      }
    } catch (e) {
      console.warn('[DigitalSignage] Agent 3 listener notice:', e.message);
    }
  }

  /**
   * Publish a high-priority Flash Deal across all overhead screens
   * Example: "Next 30 mins: 1kg Sugar @ ₹19 on purchases above ₹500"
   */
  publishFlashDeal(input = {}, options = {}) {
    const now = new Date();
    const validityMins = Number(input.validity_minutes || input.duration_minutes || 30);
    const expiresAt = new Date(now.getTime() + validityMins * 60 * 1000).toISOString();

    const productName = input.product_name || input.productName || '1kg Premium Sugar';
    const mrp = Number(input.mrp || 48);
    const promoPrice = Number(input.promo_price || input.promoPrice || 19);
    const savings = Number(input.savings || (mrp - promoPrice));
    const discountPct = Number(input.discount_pct || Math.round((savings / mrp) * 100));

    // Dynamic Tamil copy tailored for overhead supermarket announcements
    const tamilTitle = input.tamil_title || input.tamilTitle || `1 கிலோ சர்க்கரை வெறும் ₹${promoPrice} மட்டுமே!`;
    const conditions = input.conditions || input.condition_text || 'ரூ.500க்கு மேல் மளிகை வாங்கும் போது (On purchases above ₹500)';
    
    // Spoken Audio Announcement in Tamil for Web Speech API
    const audioTamil = input.audio_tamil || input.audioTamil || 
      `கவனத்திற்கு! அடுத்த ${validityMins} நிமிடங்களுக்கு மட்டும்: ரூ.500க்கு மேல் மளிகை வாங்கும் போது, 1 கிலோ சர்க்கரை வெறும் ${promoPrice} ரூபாய் மட்டுமே! போடி ராணி ஹைப்பர் மார்க்கெட்டில் உடனே வாங்கி மகிழுங்கள்!`;

    const flashDeal = {
      id: `FLASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'FLASH_DEAL',
      priority: 'HIGH_URGENT',
      product_name: productName,
      tamil_title: tamilTitle,
      mrp: mrp,
      promo_price: promoPrice,
      savings: savings,
      discount_pct: discountPct,
      conditions: conditions,
      badge_text: input.badge_text || `⚡ அடுத்த ${validityMins} நிமிடங்களுக்கு மட்டும் - அதிரடி ஃப்ளாஷ் ஆஃபர்! ⚡`,
      validity_minutes: validityMins,
      published_at: now.toISOString(),
      expires_at: expiresAt,
      audio_chime: 'BELL_DING_DONG_DUAL',
      audio_tamil: audioTamil,
      audio_english: `Attention shoppers! Next ${validityMins} minutes flash deal: 1kg Sugar at just ${promoPrice} Rupees on purchases above 500 Rupees!`,
      bg_gradient: input.bg_gradient || 'from-rose-950 via-red-900 to-amber-950',
      border_pulse: true,
      counter_redemption: 'Cashier Counter 01, 02 & Main Billing Desk',
      origin: options.origin || 'SYSTEM'
    };

    this.currentFlashDeal = flashDeal;
    this.saveState();

    // 1. Publish to local supermarket Wi-Fi MQTT broker (broker.local:1883)
    if (this.mqttClient && this.mqttConnected) {
      try {
        this.mqttClient.publish(this.topic, JSON.stringify(flashDeal), { qos: 1 });
      } catch (e) {}
    }

    // 2. Broadcast via Server-Sent Events (SSE) to all active HDMI kiosk screens
    this.broadcastSse('flash_deal', flashDeal);

    // Emit local event
    this.emit('flash_deal', flashDeal);

    return {
      success: true,
      deal_id: flashDeal.id,
      published_to_mqtt: this.mqttConnected,
      connected_screens_count: this.sseClients.size,
      flashDeal
    };
  }

  /**
   * Inbound MQTT deal handler
   */
  handleInboundMqttDeal(parsed) {
    if (parsed.type === 'FLASH_DEAL' || parsed.promo_price || parsed.promoPrice) {
      this.publishFlashDeal(parsed, { origin: 'INBOUND_MQTT_BROKER' });
    }
  }

  /**
   * Get Active Presentation State (returns Flash Deal if unexpired, else rotational deck)
   */
  getActiveState(aisle = 'ALL') {
    const now = new Date();
    let isFlashActive = false;

    if (this.currentFlashDeal) {
      const expires = new Date(this.currentFlashDeal.expires_at);
      if (expires > now) {
        isFlashActive = true;
      } else {
        this.currentFlashDeal = null;
        this.saveState();
      }
    }

    return {
      server_time: now.toISOString(),
      mqtt_connected: this.mqttConnected,
      mqtt_broker: this.brokerUrl,
      topic: this.topic,
      is_flash_active: isFlashActive,
      active_flash_deal: isFlashActive ? this.currentFlashDeal : null,
      playlist: this.promotionalSlides,
      displays_online: this.connectedDisplays.size
    };
  }

  /**
   * Register Server-Sent Events (SSE) client from Raspberry Pi / Android TV kiosk
   */
  addSseClient(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Send initial greeting & active state
    const initialState = this.getActiveState();
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'CONNECTED', broker: this.brokerUrl, initialState })}\n\n`);

    this.sseClients.add(res);

    // Keep-alive heartbeat ping every 15 seconds
    const heartbeatTimer = setInterval(() => {
      res.write(`event: ping\ndata: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeatTimer);
      this.sseClients.delete(res);
    });
  }

  /**
   * Broadcast SSE event to all connected screens
   */
  broadcastSse(eventName, data) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of this.sseClients) {
      try {
        res.write(payload);
      } catch (e) {
        this.sseClients.delete(res);
      }
    }
  }

  /**
   * Record display heartbeat from Raspberry Pi / Android TV screen
   */
  recordHeartbeat(data) {
    const displayId = data.displayId || data.screen_id || `SCREEN_${data.aisle || 'AISLE_01'}`;
    const displayInfo = {
      displayId,
      aisle: data.aisle || 'Aisle 01: Central Corridor',
      resolution: data.resolution || '1920x1080',
      userAgent: data.userAgent || 'Chromium Kiosk',
      fps: data.fps || 60,
      mode: data.mode || 'ONLINE',
      ip: data.ip || '192.168.1.105',
      lastSeen: new Date().toISOString()
    };
    this.connectedDisplays.set(displayId, displayInfo);
    return { success: true, displayId, registeredDisplays: this.connectedDisplays.size };
  }

  /**
   * Get connected displays list
   */
  getConnectedDisplays() {
    return Array.from(this.connectedDisplays.values());
  }
}

// Singleton instances
const digitalSignageInstance = new DigitalSignageService();

module.exports = {
  DigitalSignageService,
  digitalSignageService: digitalSignageInstance,
  DEFAULT_PROMOTIONAL_SLIDES
};
