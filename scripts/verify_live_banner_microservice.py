import urllib.request
import json
import time

BASE_URL = "https://rani-hyper-market.vercel.app"

def test_endpoint(name, url, method="GET", payload=None, expected_content_type=None):
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
            content_length = res.headers.get('Content-Length', 'N/A')
            x_render_time = res.headers.get('X-Render-Time-Ms', 'N/A')
            body = res.read()
            
            print(f"Status Code:      {status}")
            print(f"Content-Type:     {content_type}")
            print(f"Content-Length:   {len(body)} bytes (~{len(body)/1024:.1f} KB)")
            print(f"X-Render-Time-Ms: {x_render_time}")
            print(f"Total Network RTT: {elapsed_ms:.1f} ms")
            
            if 'application/json' in content_type:
                try:
                    parsed = json.loads(body.decode('utf-8'))
                    print("JSON Summary:")
                    for k, v in list(parsed.items())[:8]:
                        val_str = str(v)
                        if len(val_str) > 80:
                            val_str = val_str[:77] + '...'
                        print(f"  • {k}: {val_str}")
                    return True, parsed
                except Exception as e:
                    print(f"Failed to parse JSON: {e}")
            else:
                print(f"Binary Buffer received successfully ({len(body)} bytes)")
                return True, body
                
    except Exception as e:
        print(f"FAILED: {e}")
        return False, str(e)

if __name__ == '__main__':
    print("Initiating Live Production Verification of Banner Generation Microservice...")
    
    # 1. Test Presets
    ok1, res1 = test_endpoint(
        "1. Banner Presets Endpoint",
        f"{BASE_URL}/api/banner/presets"
    )
    
    # 2. Test Square Render as JSON
    ok2, res2 = test_endpoint(
        "2. Square 1080x1080 WebP (JSON Output)",
        f"{BASE_URL}/api/banner/render?layout=square&asJson=true"
    )
    
    # 3. Test Landscape Binary Stream
    ok3, res3 = test_endpoint(
        "3. Landscape 1200x628 WebP (Binary Stream)",
        f"{BASE_URL}/api/banner/render?layout=landscape&format=webp"
    )
    
    # 4. Test Custom POST Banner Generation
    custom_payload = {
        "englishTitle": "Theni Cardamom City Pure Cow Ghee (500ml)",
        "tamilTitle": "தேனி ஏலக்காய் நகரம் மணமணக்கும் தூய பசும்பால் நெய் (500மி.லி)",
        "mrp": 395,
        "offerPrice": 339,
        "savingsText": "₹56 நேரடி தள்ளுபடி!",
        "badgeText": "🪔 தீப திருநாள் ஸ்பெஷல்",
        "layout": "square",
        "format": "webp",
        "asJson": True
    }
    ok4, res4 = test_endpoint(
        "4. Custom POST Banner Generation",
        f"{BASE_URL}/api/banner/render",
        method="POST",
        payload=custom_payload
    )
    
    # 5. Test Copywriter Integration with Format D
    ok5, res5 = test_endpoint(
        "5. Vernacular Copywriter Pipeline with Format D Banner",
        f"{BASE_URL}/api/copywriter/generate?productName=Bodi+Ponni+Rice+25kg&mrp=1450&promoPrice=1299"
    )

    print("\n==========================================")
    print("ALL TESTS COMPLETED!")
    print(f"Results: 1={ok1}, 2={ok2}, 3={ok3}, 4={ok4}, 5={ok5}")
    print("==========================================")
