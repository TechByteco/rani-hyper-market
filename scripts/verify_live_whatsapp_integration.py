import urllib.request
import json
import time

BASE_URL = "https://rani-hyper-market.vercel.app"

def test_endpoint(name, url, method="GET", payload=None):
    print(f"\n==========================================")
    print(f"Testing {name}: {method} {url}")
    print(f"==========================================")
    
    t0 = time.time()
    req = urllib.request.Request(url, method=method)
    if payload:
        data = json.dumps(payload).encode('utf-8')
        req.add_header('Content-Type', 'application/json')
        req.data = data
        
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            elapsed_ms = (time.time() - t0) * 1000
            status = res.status
            content_type = res.headers.get('Content-Type', '')
            body = res.read().decode('utf-8')
            
            print(f"Status Code:      {status}")
            print(f"Content-Type:     {content_type}")
            print(f"Total Network RTT: {elapsed_ms:.1f} ms")
            
            if 'application/json' in content_type:
                parsed = json.loads(body)
                print("JSON Summary:")
                for k, v in list(parsed.items())[:6]:
                    val_str = str(v)
                    if len(val_str) > 80:
                        val_str = val_str[:77] + '...'
                    print(f"  • {k}: {val_str}")
                return True, parsed
            else:
                print(f"Plain Text Response: {body.strip()}")
                return True, body.strip()
                
    except Exception as e:
        print(f"FAILED: {e}")
        return False, str(e)

if __name__ == '__main__':
    print("Initiating Live Production Verification of Meta WhatsApp Cloud API Integration...")
    
    # 1. Webhook Verification (hub.challenge)
    ok1, res1 = test_endpoint(
        "1. Meta Webhook Verification (GET hub.challenge)",
        f"{BASE_URL}/api/webhook/whatsapp?hub.mode=subscribe&hub.challenge=VERIFY_SUCCESS_77088&hub.verify_token=rani_hypermarket_wa_verify_2026"
    )
    
    # 2. HSM Templates Registry
    ok2, res2 = test_endpoint(
        "2. Pre-Approved HSM Templates (GET)",
        f"{BASE_URL}/api/whatsapp/templates"
    )
    
    # 3. GPS Location Radius Verification (8km Zone)
    ok3, res3 = test_endpoint(
        "3. GPS Radius Verification: Bodi Town Core (10.0125, 77.3485)",
        f"{BASE_URL}/api/whatsapp/verify-location",
        method="POST",
        payload={"lat": 10.0125, "lng": 77.3485}
    )
    
    # 4. Interactive 1-Tap Message Builder
    ok4, res4 = test_endpoint(
        "4. Interactive Button Builder (POST)",
        f"{BASE_URL}/api/whatsapp/send-interactive",
        method="POST",
        payload={"to": "917708834547", "skuId": "ponni_rice_25kg", "type": "button"}
    )
    
    # 5. Inbound Webhook Simulator (1-Tap Order Button Click)
    ok5, res5 = test_endpoint(
        "5. Inbound Webhook Event: 1-Tap Quick Order",
        f"{BASE_URL}/api/whatsapp/simulate-inbound",
        method="POST",
        payload={
            "phone": "919842155555",
            "contactName": "Vasanth (Bodi Shopper)",
            "type": "button_reply",
            "buttonId": "quick_order_ponni_rice_25kg",
            "buttonTitle": "Order with 1-Tap"
        }
    )
    
    # 6. Verify Cashier POS Orders Feed
    ok6, res6 = test_endpoint(
        "6. Cashier POS Orders Feed (/api/orders)",
        f"{BASE_URL}/api/orders?status=all"
    )

    print("\n==========================================")
    print("ALL TESTS COMPLETED!")
    print(f"Results: 1={ok1}, 2={ok2}, 3={ok3}, 4={ok4}, 5={ok5}, 6={ok6}")
    print("==========================================")
