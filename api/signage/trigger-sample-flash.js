const { digitalSignageService } = require('../services/digitalSignageService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const sampleDeal = {
      product_name: '1kg Premium Sugar (தூய வெள்ளை சர்க்கரை)',
      tamil_title: '1 கிலோ சர்க்கரை வெறும் ₹19 மட்டுமே!',
      mrp: 48,
      promo_price: 19,
      savings: 29,
      discount_pct: 60,
      validity_minutes: 30,
      conditions: 'ரூ.500க்கு மேல் மளிகை வாங்கும் போது (On purchases above ₹500)',
      badge_text: '⚡ அடுத்த 30 நிமிடங்களுக்கு மட்டும் - அதிரடி ஃப்ளாஷ் ஆஃபர்! ⚡',
      audio_tamil: 'கவனத்திற்கு! அடுத்த 30 நிமிடங்களுக்கு மட்டும்: ரூ.500க்கு மேல் மளிகை வாங்கும் போது, 1 கிலோ சர்க்கரை வெறும் 19 ரூபாய் மட்டுமே! போடி ராணி ஹைப்பர் மார்க்கெட்டில் உடனே வாங்கி மகிழுங்கள்!',
      audio_english: 'Attention shoppers! Next 30 minutes flash deal: 1kg Sugar at just 19 Rupees on bills above 500 Rupees!'
    };

    const result = digitalSignageService.publishFlashDeal(sampleDeal, { origin: 'SAMPLE_TRIGGER_ENDPOINT' });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
