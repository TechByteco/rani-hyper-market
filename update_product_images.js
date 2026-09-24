const fs = require('fs');

const IMAGE_MAP = {
  // 1. Dairy
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
  butter_cheese: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
  ghee: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
  ice_cream: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80',

  // 2. Beverages
  tea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
  coffee: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
  juice: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
  soft_drink: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',

  // 3. Rice, Grains & Pulses
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  dhall: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=400&q=80',
  sundal_peas: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=400&q=80',

  // 4. Flours, Noodles & Bakery
  semia_noodles: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80',
  flour: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  oats: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=400&q=80',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
  biscuit: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80',
  chocolate: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80',
  chips_snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
  dates_nuts: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  honey_sweet: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',

  // 5. Spices, Masalas & Seasonings
  spices_masala: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
  chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80',
  turmeric: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
  salt_sugar: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80',
  pickle: 'https://images.unsplash.com/photo-1625937329388-3e4e94b293d0?auto=format&fit=crop&w=400&q=80',
  appalam: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',

  // 6. Oils
  cooking_oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  coconut_oil: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=400&q=80',

  // 7. Personal & Oral Care
  toothpaste: 'https://images.unsplash.com/photo-1559591937-e105342a9833?auto=format&fit=crop&w=400&q=80',
  toothbrush: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80',
  soap: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=400&q=80',
  shampoo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
  hair_oil: 'https://images.unsplash.com/photo-1608248597359-bb3f2f81cf8a?auto=format&fit=crop&w=400&q=80',
  skincare_cream: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  body_spray: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80',
  baby_care: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
  balm_health: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  eno_digestive: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',

  // 8. Cleaning & Home
  detergent: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&q=80',
  dishwash: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80',
  cleaner_harpic: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=400&q=80',
  pest_control: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=400&q=80',
  pooja_agarbatti: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=400&q=80',

  // 9. Stationery
  stationery: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80',

  // 10. Fruits & Vegetables
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',

  // 11. Default Grocery
  default_grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
};

function assignImageByTitle(title) {
  const t = (title || '').toLowerCase();

  // 1. Oral care first (brush, paste) to avoid conflict with "bru" in coffee
  if (t.includes('brush') || t.includes('toothbrush')) return IMAGE_MAP.toothbrush;
  if (t.includes('sensodyne') || t.includes('colgate') || t.includes('paste') || t.includes('pepsodent') || t.includes('close up') || t.includes('oral') || t.includes('dant kanti')) return IMAGE_MAP.toothpaste;

  // 2. Health & Relief
  if (t.includes('iodex') || t.includes('vicks') || t.includes('balm') || t.includes('amrutanjan') || t.includes('amurutanjan') || t.includes('pain') || t.includes('ointment') || t.includes('moov') || t.includes('volini')) return IMAGE_MAP.balm_health;
  if (t.includes('eno') || t.includes('digestive') || t.includes('glucose') || t.includes('band aid') || t.includes('dettol') || t.includes('cotton') || t.includes('antiseptic')) return IMAGE_MAP.eno_digestive;

  // 3. Dairy
  if (t.includes('ice cream') || t.includes('icecream') || t.includes('kulfi')) return IMAGE_MAP.ice_cream;
  if (t.includes('paneer')) return IMAGE_MAP.paneer;
  if (t.includes('ghee')) return IMAGE_MAP.ghee;
  if (t.includes('butter') || t.includes('cheese')) return IMAGE_MAP.butter_cheese;
  if (t.includes('milk') || t.includes('curd') || t.includes('dairy') || t.includes('arokya') || t.includes('amul') || t.includes('cavin') || t.includes('yogurt')) return IMAGE_MAP.milk;

  // 4. Tea & Coffee (use regex for \bbru\b)
  if (/\b(coffee|bru|nescafe|sunrise|filter coffee)\b/.test(t)) return IMAGE_MAP.coffee;
  if (/\b(tea|chai|dustea|chakra gold|avt|taj mahal|red label|3 roses)\b/.test(t) || t.includes('dust tea') || t.includes('tea bag')) return IMAGE_MAP.tea;

  // 5. Beverages & Drinks
  if (t.includes('juice') || t.includes('maaza') || t.includes('frooti') || t.includes('slice') || t.includes('mango') || t.includes('orange') || t.includes('lemon') || t.includes('squash')) return IMAGE_MAP.juice;
  if (t.includes('coke') || t.includes('pepsi') || t.includes('soda') || t.includes('7up') || t.includes('bovonto') || t.includes('mirinda') || t.includes('fanta') || t.includes('sprite') || t.includes('drink') || t.includes('beverage')) return IMAGE_MAP.soft_drink;

  // 6. Rice, Pulses & Grains
  if (t.includes('rice') || t.includes('ponni') || t.includes('basmati') || t.includes('arisi') || t.includes('seeraga')) return IMAGE_MAP.rice;
  if (t.includes('paruppu') || t.includes('parupu') || t.includes('dhall') || t.includes('dhal') || t.includes('uluthu') || t.includes('ulundhu') || t.includes('thuvaram') || t.includes('moong') || t.includes('toor') || t.includes('urad') || t.includes('payaru') || t.includes('gram') || t.includes('lentil')) return IMAGE_MAP.dhall;
  if (t.includes('sundal') || t.includes('channa') || t.includes('chana') || t.includes('pattani') || t.includes('kadalai') || t.includes('peas') || t.includes('chickpea')) return IMAGE_MAP.sundal_peas;

  // 7. Flours & Vermicelli
  if (t.includes('semia') || t.includes('semiya') || t.includes('vermicelli') || t.includes('noodle') || t.includes('maggi') || t.includes('pasta') || t.includes('macaroni') || t.includes('chowmein')) return IMAGE_MAP.semia_noodles;
  if (t.includes('oats') || t.includes('quaker') || t.includes('muesli') || t.includes('cornflakes')) return IMAGE_MAP.oats;
  if (t.includes('flour') || t.includes('mavu') || t.includes('rava') || t.includes('maida') || t.includes('atta') || t.includes('sooji') || t.includes('wheat') || t.includes('puttu') || t.includes('puttupodi') || t.includes('appam') || t.includes('idli') || t.includes('dosa') || t.includes('besan')) return IMAGE_MAP.flour;

  // 8. Spices, Masalas & Seasonings
  if (t.includes('chilli') || t.includes('pepper') || t.includes('milagai') || t.includes('milagu') || t.includes('paprika')) return IMAGE_MAP.chilli;
  if (t.includes('turmeric') || t.includes('manjal')) return IMAGE_MAP.turmeric;
  if (t.includes('masala') || t.includes('sambar') || t.includes('rasam') || t.includes('sakthi') || t.includes('aachi') || t.includes('gravy') || t.includes('powder') || t.includes('jeera') || t.includes('cumin') || t.includes('coriander') || t.includes('mustard') || t.includes('kadugu') || t.includes('garam') || t.includes('curry') || t.includes('biryani') || t.includes('garlic paste') || t.includes('ginger paste')) return IMAGE_MAP.spices_masala;
  if (t.includes('salt') || t.includes('sugar') || t.includes('jaggery') || t.includes('vellam') || t.includes('panagkarkandu') || t.includes('kalkandu') || t.includes('sakkarai')) return IMAGE_MAP.salt_sugar;
  if (t.includes('honey') || t.includes('thean') || t.includes('jam') || t.includes('kissan')) return IMAGE_MAP.honey_sweet;
  if (t.includes('pickle') || t.includes('urugai') || t.includes('achar') || t.includes('thokku')) return IMAGE_MAP.pickle;
  if (t.includes('appalam') || t.includes('papad') || t.includes('vadam')) return IMAGE_MAP.appalam;

  // 9. Oils
  if (t.includes('coconut oil') || (t.includes('coconut') && !t.includes('biscuit'))) return IMAGE_MAP.coconut_oil;
  if (t.includes('oil') || t.includes('deepam') || t.includes('gingelly') || t.includes('sunflower') || t.includes('vanaspati') || t.includes('dalda') || t.includes('groundnut') || t.includes('sesame') || t.includes('mustard oil')) return IMAGE_MAP.cooking_oil;

  // 10. Personal Care & Soaps
  if (t.includes('shampoo') || t.includes('karthicka') || t.includes('meera') || t.includes('clinic') || t.includes('head & shoulders') || t.includes('sunsilk') || t.includes('dove shampoo') || t.includes('pantene') || t.includes('conditioner')) return IMAGE_MAP.shampoo;
  if (t.includes('soap') || t.includes('bath') || t.includes('hamam') || t.includes('lifebuoy') || t.includes('medimix') || t.includes('lux') || t.includes('cinthol') || t.includes('sandal') || t.includes('pears') || t.includes('mysore sandal') || t.includes('dettol soap')) return IMAGE_MAP.soap;
  if (t.includes('hair') || t.includes('thailam') || t.includes('amla') || t.includes('vatika') || t.includes('parachute') || t.includes('bajaj almond')) return IMAGE_MAP.hair_oil;
  if (t.includes('cream') || t.includes('glow') || t.includes('fair') || t.includes('lotion') || t.includes('vaseline') || t.includes('talc') || t.includes('ponds') || t.includes('facewash') || t.includes('face wash') || t.includes('garnier') || t.includes('rose water') || t.includes('nivea') || t.includes('moisturizer')) return IMAGE_MAP.skincare_cream;
  if (t.includes('spray') || t.includes('fogg') || t.includes('deo') || t.includes('deodorant') || t.includes('perfume') || t.includes('scent') || t.includes('axe') || t.includes('wild stone')) return IMAGE_MAP.body_spray;
  if (t.includes('baby') || t.includes('himalaya') || t.includes('johnson') || t.includes('diaper') || t.includes('pampers')) return IMAGE_MAP.baby_care;

  // 11. Snacks, Biscuits & Confectionery
  if (t.includes('biscuit') || t.includes('cookie') || t.includes('britannia') || t.includes('parle') || t.includes('marie') || t.includes('rusk') || t.includes('good day') || t.includes('bourbon') || t.includes('50-50') || t.includes('oreo')) return IMAGE_MAP.biscuit;
  if (t.includes('choco') || t.includes('chocolate') || t.includes('cadbury') || t.includes('kitkat') || t.includes('dairy milk') || t.includes('5 star') || t.includes('munch') || t.includes('perk') || t.includes('candy') || t.includes('toffee')) return IMAGE_MAP.chocolate;
  if (t.includes('cake') || t.includes('muffin') || t.includes('pastry') || t.includes('pie') || t.includes('plum cake')) return IMAGE_MAP.cake;
  if (t.includes('chips') || t.includes('crisps') || t.includes('mixture') || t.includes('murukku') || t.includes('snack') || t.includes('lays') || t.includes('kurkure') || t.includes('bingo') || t.includes('sev') || t.includes('namkeen')) return IMAGE_MAP.chips_snacks;
  if (t.includes('dates') || t.includes('lion dates') || t.includes('badam') || t.includes('cashew') || t.includes('nut') || t.includes('pista') || t.includes('almond') || t.includes('walnut') || t.includes('raisin') || t.includes('kishmish')) return IMAGE_MAP.dates_nuts;

  // 12. Cleaning & Household
  if (t.includes('detergent') || t.includes('surf') || t.includes('ariel') || t.includes('rin') || t.includes('tide') || t.includes('washing') || t.includes('wheel') || t.includes('ala') || t.includes('comfort') || t.includes('revive') || t.includes('ujala') || t.includes('fabric')) return IMAGE_MAP.detergent;
  if (t.includes('dishwash') || t.includes('vim') || t.includes('pril') || t.includes('exo') || t.includes('scrub') || t.includes('utensil') || t.includes('scouring')) return IMAGE_MAP.dishwash;
  if (t.includes('cleaner') || t.includes('harpic') || t.includes('lizol') || t.includes('colin') || t.includes('phenyl') || t.includes('bleach') || t.includes('floor') || t.includes('toilet') || t.includes('glass cleaner')) return IMAGE_MAP.cleaner_harpic;
  if (t.includes('hit') || t.includes('all out') || t.includes('good knight') || t.includes('mortein') || t.includes('mosquito') || t.includes('coil') || t.includes('cockroach') || t.includes('chalk')) return IMAGE_MAP.pest_control;
  if (t.includes('agarbatti') || t.includes('agarbathi') || t.includes('sambrani') || t.includes('camphor') || t.includes('pooja') || t.includes('dhoop') || t.includes('mangaldeep') || t.includes('cycle') || t.includes('karpooram')) return IMAGE_MAP.pooja_agarbatti;

  // 13. Stationery
  if (t.includes('pen') || t.includes('pencil') || t.includes('doms') || t.includes('flair') || t.includes('notebook') || t.includes('eraser') || t.includes('sharpener') || t.includes('scale') || t.includes('ruler') || t.includes('crayon') || t.includes('marker') || t.includes('sketch') || t.includes('stationery') || t.includes('glue') || t.includes('fevicol')) return IMAGE_MAP.stationery;

  // 14. Fruits & Vegetables
  if (t.includes('apple') || t.includes('banana') || t.includes('grape') || t.includes('orange fruit') || t.includes('pomegranate') || t.includes('fruit')) return IMAGE_MAP.fruits;
  if (t.includes('tomato') || t.includes('onion') || t.includes('potato') || t.includes('garlic') || t.includes('ginger') || t.includes('vegetable') || t.includes('vengayam') || t.includes('thakkali') || t.includes('urulai')) return IMAGE_MAP.vegetables;

  return IMAGE_MAP.default_grocery;
}

// 1. Update rani_products.json
console.log('Reading rani_products.json...');
const prods = JSON.parse(fs.readFileSync('rani_products.json', 'utf8'));

let updatedCount = 0;
prods.forEach(p => {
  const newImg = assignImageByTitle(p.title);
  p.image_url = newImg;
  updatedCount++;
});

fs.writeFileSync('rani_products.json', JSON.stringify(prods));
console.log(`Updated images for all ${updatedCount} products in rani_products.json!`);

// Print sample of updated products
console.log('\nSample Verified Products:');
prods.slice(0, 20).forEach(p => {
  console.log(`- ${p.title} -> ${p.image_url.split('?')[0]}`);
});
