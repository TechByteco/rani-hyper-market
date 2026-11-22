import json
import os

print("=== GENERATING MODULAR TAMIL REGIONAL VOICE CONFIGURATION ===")

voice_config = {
  "metadata": {
    "title": "Rani Hypermarket - Bodinayakanur & Theni District Tamil Regional Voice Configuration",
    "version": "2.0.0",
    "role": "Cultural Linguist & Tamil Prompt Engineer",
    "target_geography": {
      "region": "Theni District, Western Ghats Foothills",
      "towns": ["Bodinayakanur (Cardamom City)", "Theni", "Cumbum", "Periyakulam", "Chinnamanur", "Uthamapalayam", "Bodi Mettu"],
      "market_identity": "ஏலக்காய் நகரம் போடிநாயக்கனூர் (Cardamom City) & கம்பம் பள்ளத்தாக்கு (Cumbum Valley)"
    },
    "store_context": {
      "store_name": "ராணி ஹைப்பர் மார்க்கெட்",
      "location": "மெயின் ரோடு, போடிநாயக்கனூர், தேனி மாவட்டம்",
      "phone": "77088 34547",
      "delivery_promise": "போடி நகர் முழுவதும் 30 நிமிடத்தில் இலவச டோர் டெலிவரி"
    }
  },
  "regional_cultural_dictionary": {
    "local_terroir_and_specialties": {
      "cardamom": {
        "tamil": "போடி மணமணக்கும் ஏலக்காய்",
        "cultural_anchor": "ஏலக்காய் நகரம் போடிநாயக்கனூர்",
        "culinary_notes": "மேற்கு தொடர்ச்சி மலையின் நறுமணம் வீசும் போடி ஏலக்காய், பாயாசம், தேநீர் மற்றும் இனிப்புகளுக்கு பிரத்யேக வாசம் தரும் அசல் தரம்.",
        "marketing_badge": "🌱 போடி ஸ்பெஷல் பச்சை ஏலக்காய்"
      },
      "cumbum_grapes": {
        "tamil": "கம்பம் பள்ளத்தாக்கு பன்னீர் திராட்சை",
        "cultural_anchor": "கம்பம் பள்ளத்தாக்கு திராட்சை தோட்டங்கள்",
        "culinary_notes": "வருடம் முழுவதும் இயற்கை இனிப்போடு விளையும் தேனி மாவட்டத்தின் பெருமைமிகு பன்னீர் திராட்சை.",
        "marketing_badge": "🍇 கம்பம் பன்னீர் திராட்சை"
      },
      "theni_banana": {
        "tamil": "தேனி நாட்டு செவ்வாழை & நேந்திரம்",
        "cultural_anchor": "தேனி செழிப்பான வாழை தோப்புகள்",
        "culinary_notes": "குழந்தைகளுக்கும் இல்ல விசேஷங்களுக்கும் உகந்த ஊட்டச்சத்து மிகுந்த பழங்கள்."
      },
      "bodi_pepper_and_spices": {
        "tamil": "போடி மெட்டு மலை மிளகு & பட்டை கிராம்பு",
        "cultural_anchor": "போடிமெட்டு மலைத்தோட்ட வாசனை",
        "culinary_notes": "காரசாரமான அசைவ சமையலுக்கு அசல் மலைத்தோட்ட மசாலா வாசனை."
      }
    },
    "culinary_traditions_and_cooking_references": {
      "chettinad_madurai_kuzhambu": {
        "tamil_title": "செட்டிநாடு & மதுரை ஸ்டைல் காரக்குழம்பு / மீன் குழம்பு",
        "copy_hooks": [
          "நம்ம ஊரு ஸ்டைலில் மணமணக்கும் மதுரை காரக்குழம்பு மற்றும் வறுத்தரைத்த மசாலா",
          "செட்டிநாடு கைமணத்தில் நயமான காரசாரமான அசைவ குழம்பு",
          "நாக்கில் எச்சில் ஊறும் காரக்குழம்புக்கு முதல் தர சின்ன வெங்காயம் & நல்லெண்ணெய்"
        ],
        "essential_skus": ["சின்ன வெங்காயம்", "நாட்டு தக்காளி", "நல்லெண்ணெய்", "வறுத்தரைத்த மசாலா தூள்", "புளி", "கடுகு வெந்தயம்"]
      },
      "traditional_filter_coffee_decoction": {
        "tamil_title": "அசல் கும்பகோணம் & போடி டிகிரி பில்டர் காபி டிக்காஷன்",
        "copy_hooks": [
          "காலையில கண் விழிச்சதும் சுடச்சுட மணக்கும் டிகிரி பில்டர் காபி டிக்காஷன்",
          "முதல் தர காபி கொட்டை வறுவல் - நறுமணமிக்க பிரெஷ் டிக்காஷன் சுவை",
          "உடம்புக்கு புத்துணர்ச்சி தரும் திக்கான பசும்பால் பில்டர் காபி"
        ],
        "essential_skus": ["பில்டர் காபி தூள்", "பசும்பால்", "நாட்டு சர்க்கரை", "வெள்ள சர்க்கரை"]
      },
      "sunday_non_veg_curry_meal_prep": {
        "tamil_title": "ஞாயிறு அசைவ விருந்து (மட்டன் சுக்கா / நாட்டுக்கோழி குழம்பு / பிரியாணி)",
        "copy_hooks": [
          "ஞாயிறு அசைவ விருந்துக்கான மசாலா பொருட்கள் மற்றும் எண்ணெய் வகைகள்...",
          "நாளைக்கு மட்டன் பிரியாணி தூள் பறக்க போகுது! சீரக சம்பா அரிசி முதல் மசாலா வரை...",
          "அம்மியில் அரைச்ச மாதிரி காரசாரமான நாட்டுக்கோழி வறுவல் மற்றும் மட்டன் குழம்பு"
        ],
        "essential_skus": ["சீரக சம்பா அரிசி", "சுத்தமான தேங்காய் எண்ணெய் / கடலை எண்ணெய்", "இஞ்சி பூண்டு பேஸ்ட்", "பட்டை கிராம்பு ஏலக்காய்", "மட்டன் சிக்கன் மசாலா தூள்"]
      },
      "tiffin_staples": {
        "tamil_title": "பஞ்சு போன்ற மல்லிகைப் பூ இட்லி & மொறுமொறு தோசை",
        "copy_hooks": [
          "சுடச்சுட பஞ்சு போன்ற மல்லிகைப் பூ இட்லிக்கு திக்கான சாம்பார் & தேங்காய் சட்னி",
          "நெய் மணம் கமழும் மொறுமொறு ரோஸ்ட் தோசை மாவு"
        ],
        "essential_skus": ["இட்லி அரிசி", "உளுந்து", "சுத்தமான நெய்", "கடலைப்பருப்பு"]
      }
    },
    "dialect_vocabulary_rules": {
      "prohibited_corporate_terms": [
        {"banned": "மகிழ்ச்சியான சேமிப்பு", "reason": "Literal translation of 'Happy Savings', completely unnatural in Tamil"},
        {"banned": "இன்பமான கொள்முதல்", "reason": "Literal translation of 'Happy Purchasing'"},
        {"banned": "விலை வீழ்ச்சி", "reason": "Stock market translation for price drop, sounds like market crash"},
        {"banned": "ஷாப்பிங் செய்யுங்கள்", "reason": "Corporate English transliteration"},
        {"banned": "தள்ளுபடி பெறவும்", "reason": "Robotic imperative tone"},
        {"banned": "இப்போதே வாங்குங்கள்", "reason": "Overly clinical corporate command"}
      ],
      "preferred_regional_phrases": [
        {"tamil": "நம்ம போடி ராணி மார்க்கெட்டில்", "usage": "Store identity with warm community pride"},
        {"tamil": "இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு", "usage": "Honoring the homemaker budget manager"},
        {"tamil": "கைநிறைய மிச்சம்", "usage": "Tangible hand-holding cash savings"},
        {"tamil": "முதல் தர நயமான தரம்", "usage": "Traditional grocery quality stamp"},
        {"tamil": "கலப்படமில்லாத சுத்தமான வீட்டு மளிகை", "usage": "Purity promise"},
        {"tamil": "போடிக்குள் இலவச டோர் டெலிவரி", "usage": "Warm customer doorstep service"},
        {"tamil": "அள்ளிச் செல்லுங்கள்", "usage": "Traditional festive buying enthusiasm"}
      ]
    }
  },
  "dynamic_daypart_and_calendar_templates": {
    "saturday_morning": {
      "template_id": "SATURDAY_WEEKEND_MEAT_PREP",
      "trigger_condition": "Saturday 06:00 AM - 02:00 PM or weekend meat preparation context",
      "headline": "ஞாயிறு அசைவ விருந்துக்கான மசாலா பொருட்கள் மற்றும் எண்ணெய் வகைகள்...",
      "opening_hook": "போடி இல்லத்தரசிகளே! நாளை ஞாயிற்றுக்கிழமை வீட்டுல அசைவ விருந்தா? நயமான மட்டன் சுக்கா, நாட்டுக்கோழி குழம்பு மற்றும் சீரக சம்பா பிரியாணிக்கு தேவையான அத்தனை மசாலா பொருட்கள் மற்றும் சமையல் எண்ணெய் வகைகள் நம்ம ராணி மார்க்கெட்டில் அதிரடி தள்ளுபடியில்!",
      "dlt_sms_lead": "போடி ராணி மார்க்கெட்: ஞாயிறு அசைவ விருந்து ஸ்பெஷல்!",
      "whatsapp_lead": "🍗 *ஞாயிறு அசைவ விருந்து ஸ்பெஷல் - போடி ராணி மார்க்கெட் அதிரடி ஆஃபர்!* 🍛",
      "culinary_cue": "அம்மியில் அரைத்த செட்டிநாடு/மதுரை காரக்குழம்பு மசாலா மற்றும் மணமணக்கும் போடி ஏலக்காய் பட்டை கிராம்பு",
      "urgency_hook": "வார இறுதி சமையல் மளிகையை இன்றே வாங்கி வையுங்கள் - கூட்டம் கூடும் முன் முந்துங்கள்!"
    },
    "monthly_salary_days": {
      "template_id": "MONTHLY_1ST_TO_5TH_PROVISIONS",
      "trigger_condition": "1st to 5th of any month or monthly salary grocery shopping context",
      "headline": "மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா...",
      "opening_hook": "மாதம் பிறந்துடுச்சு, பட்ஜெட்டை மிச்சப்படுத்த நம்ம போடி ராணி மார்க்கெட் இருக்க பயமேன்! ஒட்டுமொத்த மாத மளிகை லிஸ்ட்டுக்கும் நேரடி மொத்த விலை தள்ளுபடி!",
      "dlt_sms_lead": "போடி ராணி மார்க்கெட்: மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா!",
      "whatsapp_lead": "🌾 *மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா - நம்ம போடி ராணி மார்க்கெட்டில்!* 💰",
      "culinary_cue": "25 கிலோ கர்நாடகா பொன்னி அரிசி, 5 லிட்டர் சமையல் எண்ணெய் முதல் தினசரி சமையல் பருப்பு மசாலா வரை",
      "urgency_hook": "முழு மாச வீட்டு மளிகையையும் ஒரே பில்லில் அள்ளிச் செல்லுங்கள் - கைநிறைய மிச்சம்!"
    },
    "thursday_evening": {
      "template_id": "THURSDAY_PROVISIONS_RESERVATION",
      "trigger_condition": "Thursday 04:30 PM - 08:30 PM or weekend grocery planning context",
      "headline": "வார இறுதி சமையல் மளிகை முன்கூட்டியே புக் செய்யுங்கள்!",
      "opening_hook": "வெள்ளி, சனி, ஞாயிறு வார இறுதி குடும்ப சமையலுக்கு தேவையான அத்தியாவசிய மளிகை பொருட்கள் தட்டுப்பாடின்றி உங்கள் வீடு தேடி வர உடனே புக் செய்யுங்கள்!",
      "dlt_sms_lead": "போடி ராணி மார்க்கெட்: வார இறுதி குடும்ப மளிகை ஆஃபர்!",
      "whatsapp_lead": "🛒 *வார இறுதி குடும்ப மளிகை முன்கூட்டியே புக் செய்யுங்கள்!* 🚚",
      "culinary_cue": "குடும்ப சமையலுக்கு தேவையான 5kg இட்லி அரிசி மற்றும் 1L சன்பிளவர் ஆயில் காம்போ",
      "urgency_hook": "போடி நகர் முழுவதும் 30 நிமிடத்தில் இலவச டோர் டெலிவரி!"
    },
    "daily_morning_dairy": {
      "template_id": "DAILY_MORNING_DAIRY_COFFEE",
      "trigger_condition": "Daily 06:00 AM - 09:30 AM or morning coffee/milk context",
      "headline": "சுடச்சுட மணக்கும் டிகிரி பில்டர் காபி & பிரெஷ் பால் ஆஃபர்!",
      "opening_hook": "சுப உதயம் போடி மக்களே! காலைப் பொழுது இனிதே துவங்க சுடச்சுட மணக்கும் பில்டர் காபி டிக்காஷன் மற்றும் பஞ்சு போன்ற மல்லிகைப் பூ இட்லி மாவு...",
      "dlt_sms_lead": "போடி ராணி மார்க்கெட்: காலை காபி & இட்லி மாவு பிரெஷ் ஆஃபர்!",
      "whatsapp_lead": "☕ *சுடச்சுட மணக்கும் டிகிரி பில்டர் காபி & பிரெஷ் பால் - போடி ராணி மார்க்கெட்!* 🥛",
      "culinary_cue": "திக்கான பில்டர் காபி டிக்காஷன், ஆரோக்கியா/ஆவின் பால் மற்றும் சூடான இட்லி மாவு",
      "urgency_hook": "காலை 7 மணிக்கே உங்கள் வீடு தேடி வரும் பிரெஷ் பால் பாக்கெட் & மளிகை!"
    }
  },
  "gemini_system_prompt_master": {
    "system_instructions": "You are the Senior Vernacular Copywriter & Cultural Linguist for Rani Hypermarket on Main Road, Bodinayakanur, Theni District, Tamil Nadu. You write warm, persuasive, colloquial Tamil grocery advertising deeply attuned to local Cardamom City (ஏலக்காய் நகரம்) and Cumbum Valley (கம்பம் பள்ளத்தாக்கு) households.\n\nCRITICAL CULTURAL GUARDRAILS:\n1. STRICTLY PROHIBIT robotic corporate machine-translated English (NEVER write 'மகிழ்ச்சியான சேமிப்பு', 'இன்பமான கொள்முதல்', 'விலை வீழ்ச்சி', 'ஷாப்பிங் செய்யுங்கள்', or 'தள்ளுபடி பெறவும்').\n2. EMPLOY authentic Bodinayakanur and Theni grocery trade dialect:\n   - 'நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டில்'\n   - 'இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு'\n   - 'கைநிறைய மிச்சம்'\n   - 'முதல் தர நயமான தரம்'\n   - 'கலப்படமில்லாத சுத்தமான வீட்டு மளிகை'\n   - 'போடி நகர் முழுவதும் 30 நிமிடத்தில் இலவச டோர் டெலிவரி'\n3. WEAVE IN LOCAL CULINARY TRADITIONS & TERROIR:\n   - Local Cardamom: 'போடி மணமணக்கும் ஏலக்காய்' (Cardamom City pride)\n   - Cumbum Valley: 'கம்பம் பள்ளத்தாக்கு பன்னீர் திராட்சை'\n   - Culinary preparations: Chettinad/Madurai style Kuzhambu ('மதுரை காரக்குழம்பு', 'செட்டிநாடு வறுத்தரைத்த மசாலா'), traditional filter coffee decoction ('சுடச்சுட மணக்கும் டிகிரி பில்டர் காபி டிக்காஷன்'), and Sunday mutton/chicken non-veg curry meal prep ('ஞாயிறு அசைவ விருந்துக்கான மசாலா பொருட்கள் மற்றும் எண்ணெய் வகைகள்').\n4. DYNAMIC TONE TEMPLATES:\n   - If Saturday Morning / Non-veg context: Headline MUST open with 'ஞாயிறு அசைவ விருந்துக்கான மசாலா பொருட்கள் மற்றும் எண்ணெய் வகைகள்...'\n   - If 1st-5th of the month / monthly salary: Headline MUST open with 'மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா...'\n5. SYNCHRONIZED THREE-TIER OUTPUT SCHEMA:\n   - Format A (sms_tamil): EXACTLY <= 160 characters (DLT-compliant with phone & link).\n   - Format B (whatsapp_tamil): High-converting markdown with bold prices (*₹...*), bullet points, and 1-tap ordering link.\n   - Format C (instagram_caption): Engaging reel/feed caption with local hashtags (#Bodinayakanur, #TheniDistrict, #CardamomCity, #RaniHyperMarket).\n   - Format D (preview_render): Responsive HTML email/social card mockup."
  }
}

paths = [
  'tamil_regional_voice_config.json',
  'data/tamil_regional_voice_config.json',
  'public/tamil_regional_voice_config.json',
  'api/data/tamil_regional_voice_config.json'
]

for p in paths:
  os.makedirs(os.path.dirname(p) if os.path.dirname(p) else '.', exist_ok=True)
  with open(p, 'w', encoding='utf-8') as f:
    json.dump(voice_config, f, indent=2, ensure_ascii=False)
  print(f"[OK] Wrote {p} ({round(os.path.getsize(p) / 1024, 1)} KB)")

print("=== VOICE CONFIGURATION GENERATION COMPLETE ===")
