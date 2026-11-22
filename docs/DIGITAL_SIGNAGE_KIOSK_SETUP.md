# In-Store Overhead Digital Signage System Setup Guide
**Rani Hyper Market, Main Road, Bodinayakanur & Theni District, Tamil Nadu**  
**Hardware Platform:** Raspberry Pi 3/4/5 & Android TV Sticks (43" 1080p/4K Overhead HDMI Displays)  
**Kiosk Application Route:** `https://rani-hyper-market.vercel.app/display/overhead-promos` or `http://192.168.1.15:5500/display/overhead-promos`  
**Local MQTT Broker:** `broker.local:1883` (TCP) and `broker.local:9001` (WebSocket)  
**Topic:** `store/display/promo`  

---

## 1. Hardware Architecture & Network Topology

```
             ┌─────────────────────────────────────────────────────────┐
             │       Store Central Server & Marketing Agent 2 / 3      │
             │       (Node.js Daemon / Vercel Cloud Hub)               │
             └────────────────────────────┬────────────────────────────┘
                                          │
                                          │ MQTT Publish ('store/display/promo')
                                          │ or Server-Sent Events (SSE)
                                          ▼
             ┌─────────────────────────────────────────────────────────┐
             │    Local Supermarket Wi-Fi Router (SSID: RaniHyperNet)  │
             │           mDNS Hostname: broker.local (192.168.1.1)     │
             └──────┬─────────────────────┬─────────────────────┬──────┘
                    │                     │                     │
                    ▼                     ▼                     ▼
          ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
          │  Raspberry Pi #1  │ │  Raspberry Pi #2  │ │  Android TV #3    │
          │  Aisle 01 (Rice)  │ │  Aisle 02 (Oils)  │ │  Aisle 03 (Spices)│
          │  Chromium Kiosk   │ │  Chromium Kiosk   │ │  Chromium Kiosk   │
          └─────────┬─────────┘ └─────────┬─────────┘ └─────────┬─────────┘
                    │ HDMI                │ HDMI                │ HDMI
                    ▼                     ▼                     ▼
          ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
          │  43" Overhead TV  │ │  43" Overhead TV  │ │  43" Overhead TV  │
          │  (Aisle Ceiling)  │ │  (Aisle Ceiling)  │ │  (Aisle Ceiling)  │
          └───────────────────┘ └───────────────────┘ └───────────────────┘
```

---

## 2. Raspberry Pi Chromium Kiosk Autostart Setup

For Raspberry Pi 3 B+, Pi 4 B, or Pi 5 running **Raspberry Pi OS with Desktop**:

### Step 1: Install Required Utilities & Disable Screen Blanking
Open terminal or SSH into the Raspberry Pi (`pi@raspberrypi.local`):

```bash
sudo apt-get update
sudo apt-get install -y chromium-browser x11-xserver-utils unclutter
```

Disable screen saver and HDMI power management:
```bash
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```
Append the following lines to disable screen timeout:
```ini
@xset s off
@xset -dpms
@xset s noblank
@unclutter -idle 0.5 -root
```

### Step 2: Configure Kiosk Autostart Script
Create the kiosk launcher:
```bash
mkdir -p /home/pi/kiosk
nano /home/pi/kiosk/kiosk.sh
```

Paste the following shell script:
```bash
#!/bin/bash
# Rani Hypermarket Overhead Signage Launcher
xset s off
xset -dpms
xset s noblank
unclutter -idle 1 -root &

# Wait for Wi-Fi network connection
sleep 5

# Set audio volume to 90% on HDMI
amixer set Master 90% || true

# Launch Chromium in Fullscreen Kiosk Mode
# Replace aisle=01 with specific aisle number (01 to 06)
AISLE_ID="01"
DISPLAY_URL="https://rani-hyper-market.vercel.app/display/overhead-promos?aisle=${AISLE_ID}&screen=SCREEN_AISLE_${AISLE_ID}&audio=true"

# If local LAN server is present, prefer local IP:
# DISPLAY_URL="http://192.168.1.15:5500/display/overhead-promos?aisle=${AISLE_ID}&screen=SCREEN_AISLE_${AISLE_ID}&audio=true"

chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-translate \
  --disable-features=Translate \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --autoplay-policy=no-user-gesture-required \
  --check-for-update-interval=31536000 \
  "$DISPLAY_URL"
```

Make the script executable:
```bash
chmod +x /home/pi/kiosk/kiosk.sh
```

### Step 3: Enable Auto-Launch on Boot
Add the launcher to LXDE autostart:
```bash
echo "@/home/pi/kiosk/kiosk.sh" >> /home/pi/.config/lxsession/LXDE-pi/autostart
```
Reboot to test:
```bash
sudo reboot
```

---

## 3. Android TV Stick / Fire TV Stick Setup

For Xiaomi Mi TV Stick, Realme 4K Google TV Stick, or Amazon Fire TV Stick:

1. **Option A: Fully Kiosk Browser (Recommended for Production)**
   - Install **Fully Kiosk Browser & Launcher** from Google Play Store or APK sideload.
   - Set Start URL to:
     `https://rani-hyper-market.vercel.app/display/overhead-promos?aisle=02&screen=ANDROID_STICK_02`
   - In Settings:
     * Enable **Kiosk Mode** (Locks hardware home and back buttons).
     * Enable **Run on Boot**.
     * Enable **Autoplay Audio without User Gesture**.
     * Disable Screen Off / Sleep Timer.
2. **Option B: Native Chromium / Android WebView App**
   - Open Chromium or TV Bro Browser.
   - Navigate to the URL and press `F` or click the Fullscreen icon in the bottom-right toolbar.

---

## 4. Local Mosquitto MQTT Broker Configuration

If running a local Mosquitto MQTT broker on the store router or server PC (`broker.local`):

Edit `/etc/mosquitto/mosquitto.conf`:
```conf
# Standard TCP Listener for Python / Node.js
listener 1883
allow_anonymous true

# WebSocket Listener for Chromium Web Displays
listener 9001
protocol websockets
allow_anonymous true
```

Restart Mosquitto:
```bash
sudo systemctl restart mosquitto
```

---

## 5. Instant Flash Deal Broadcast & Audio Chime Protocol

### Triggering via REST API (Cashier Manager or Agent 2 & 3)
```bash
curl -X POST https://rani-hyper-market.vercel.app/api/signage/publish-deal \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "1kg Premium Sugar",
    "tamil_title": "1 கிலோ சர்க்கரை வெறும் ₹19 மட்டுமே!",
    "mrp": 48,
    "promo_price": 19,
    "savings": 29,
    "discount_pct": 60,
    "validity_minutes": 30,
    "conditions": "ரூ.500க்கு மேல் மளிகை வாங்கும் போது (Purchases above ₹500)",
    "badge_text": "⚡ அடுத்த 30 நிமிடங்களுக்கு மட்டும் - அதிரடி ஃப்ளாஷ் ஆஃபர்! ⚡",
    "audio_tamil": "கவனத்திற்கு! அடுத்த 30 நிமிடங்களுக்கு மட்டும்: ரூ.500க்கு மேல் மளிகை வாங்கும் போது, 1 கிலோ சர்க்கரை வெறும் 19 ரூபாய் மட்டுமே! போடி ராணி ஹைப்பர் மார்க்கெட்டில் உடனே வாங்கி மகிழுங்கள்!"
  }'
```

### 1-Click Technician Test Endpoint
Open in any browser or curl:
```bash
curl https://rani-hyper-market.vercel.app/api/signage/trigger-sample-flash
```

---

## 6. Offline Fallback & Disconnect Behavior

1. **Local Slide Cycling:** When Wi-Fi or MQTT disconnects, the display immediately switches to the local cache stored in `localStorage` without black screens or error dialogs.
2. **Auto-Reconnect Loop:** The display attempts reconnecting to `/api/signage/stream` and MQTT over WebSocket every 3 seconds.
3. **Status Pill Indication:** The top right status badge changes from pulsing green (`MQTT Live: broker.local`) to pulsing amber (`Offline Fallback: Local Cache Active`).
