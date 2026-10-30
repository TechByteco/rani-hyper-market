const https = require('https');

setTimeout(() => {
  https.get('https://rani-hyper-market.vercel.app/products_catalog.json?v=' + Date.now(), res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const data = JSON.parse(d);
        const iodex = data.find(x => x.id === 9);
        const bodypain = data.find(x => x.id === 10);
        const sensodyne = data.find(x => x.id === 16);
        console.log('Status:', res.statusCode);
        console.log('Product 9 image:', iodex?.image_url);
        console.log('Product 10 image:', bodypain?.image_url);
        console.log('Product 16 image:', sensodyne?.image_url);
      } catch(e) {
        console.log('Still building...');
      }
    });
  });
}, 20000);
