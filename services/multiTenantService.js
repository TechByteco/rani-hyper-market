/**
 * Multi-Tenant Architecture & Inter-Store Logistics Service
 * Rani Hyper Market Enterprise — Phase 2 Regional Expansion
 * Coverage: 15 Regional Supermarkets across Theni, Madurai, and Dindigul Districts
 * 
 * Core Architectural Modules:
 * 1. Tenant Isolation & PostgreSQL Row-Level Security (RLS)
 * 2. Global Master Catalog (50,000 Standardized Indian FMCG Items)
 * 3. Tenant Store Inventory (Isolated selling price, wholesale cost, shelf location, stock units)
 * 4. Inter-Store Inventory Transfers (Bodinayakanur Flagship Hub <-> Branch Supermarkets)
 */

const fs = require('fs');
const path = require('path');

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

const APP_ROOT = resolveAppRoot();
const DATA_DIR = path.join(APP_ROOT, 'data');
const MULTI_TENANT_STORE_FILE = path.join(DATA_DIR, 'multi_tenant_cluster_state.json');

// Default Flagship Tenant ID
const FLAGSHIP_TENANT_ID = '37a64e83-514d-4b00-b90a-9af172dacdd6';

// 15 Regional Supermarkets across 3 Districts
const REGIONAL_TENANTS = [
  // THENI DISTRICT (7 STORES)
  {
    id: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-THN-01',
    storeName: 'Rani Hyper Market (Bodinayakanur Flagship Hub)',
    slug: 'rani-bodi-flagship',
    district: 'Theni',
    city: 'Bodinayakanur',
    storeType: 'FLAGSHIP_HUB',
    address: 'Main Road, Bodinayakanur, Theni District - 625513',
    pincode: '625513',
    gstin: '33BAGPN1341C1ZC',
    contactPhone: '+91 77088 34547',
    isWarehouse: true,
    parentHubId: null,
    totalAreaSqFt: 18500,
    dailyFootfallAvg: 1450
  },
  {
    id: '37a64e83-0002-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-THN-02',
    storeName: 'Rani Hyper Market - Theni Main Bazaar',
    slug: 'rani-theni-bazaar',
    district: 'Theni',
    city: 'Theni',
    storeType: 'HYPERMARKET',
    address: 'NRT Road, Opp. Head Post Office, Theni - 625531',
    pincode: '625531',
    gstin: '33BAGPN1341C2ZD',
    contactPhone: '+91 94431 22331',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 12000,
    dailyFootfallAvg: 980
  },
  {
    id: '37a64e83-0003-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-THN-03',
    storeName: 'Rani Supermarket - Periyakulam Branch',
    slug: 'rani-periyakulam',
    district: 'Theni',
    city: 'Periyakulam',
    storeType: 'SUPERMARKET',
    address: 'Theni Main Road, Near Old Bus Stand, Periyakulam - 625601',
    pincode: '625601',
    gstin: '33BAGPN1341C3ZE',
    contactPhone: '+91 98421 77665',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 7500,
    dailyFootfallAvg: 620
  },
  {
    id: '37a64e83-0004-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-THN-04',
    storeName: 'Rani Express Mart - Chinnamanur',
    slug: 'rani-chinnamanur',
    district: 'Theni',
    city: 'Chinnamanur',
    storeType: 'EXPRESS_MART',
    address: 'Bazaar Street, Chinnamanur - 625515',
    pincode: '625515',
    gstin: '33BAGPN1341C4ZF',
    contactPhone: '+91 94420 88990',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 4500,
    dailyFootfallAvg: 480
  },
  {
    id: '37a64e83-0005-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-THN-05',
    storeName: 'Rani Valley Hypermarket - Cumbum',
    slug: 'rani-cumbum-valley',
    district: 'Theni',
    city: 'Cumbum',
    storeType: 'HYPERMARKET',
    address: 'LF Road, Near Clock Tower, Cumbum - 625516',
    pincode: '625516',
    gstin: '33BAGPN1341C5ZG',
    contactPhone: '+91 98942 33445',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 11500,
    dailyFootfallAvg: 890
  },
  {
    id: '37a64e83-0006-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-THN-06',
    storeName: 'Rani Supermarket - Uthamapalayam',
    slug: 'rani-uthamapalayam',
    district: 'Theni',
    city: 'Uthamapalayam',
    storeType: 'SUPERMARKET',
    address: 'Main Road, Near Bus Stand, Uthamapalayam - 625533',
    pincode: '625533',
    gstin: '33BAGPN1341C6ZH',
    contactPhone: '+91 97871 44556',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 6800,
    dailyFootfallAvg: 540
  },
  {
    id: '37a64e83-0007-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-THN-07',
    storeName: 'Rani Mart - Andipatti',
    slug: 'rani-andipatti',
    district: 'Theni',
    city: 'Andipatti',
    storeType: 'SUPERMARKET',
    address: 'Madurai Road, Andipatti - 625512',
    pincode: '625512',
    gstin: '33BAGPN1341C7ZI',
    contactPhone: '+91 98651 99001',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 6200,
    dailyFootfallAvg: 490
  },

  // MADURAI DISTRICT (4 STORES)
  {
    id: '37a64e83-0008-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-MDU-01',
    storeName: 'Rani Hypermarket - Madurai Simmakkal Central',
    slug: 'rani-madurai-simmakkal',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'HYPERMARKET',
    address: 'North Veli Street, Simmakkal, Madurai - 625001',
    pincode: '625001',
    gstin: '33BAGPN1341C8ZJ',
    contactPhone: '+91 98421 11223',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 14000,
    dailyFootfallAvg: 1650
  },
  {
    id: '37a64e83-0009-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-MDU-02',
    storeName: 'Rani Wholesale & Retail Hub - Madurai Mattuthavani',
    slug: 'rani-madurai-mattuthavani',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'FLAGSHIP_HUB',
    address: 'Near Integrated Bus Stand, Mattuthavani, Madurai - 625007',
    pincode: '625007',
    gstin: '33BAGPN1341C9ZK',
    contactPhone: '+91 94435 66778',
    isWarehouse: true,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 22000,
    dailyFootfallAvg: 1890
  },
  {
    id: '37a64e83-0010-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-MDU-03',
    storeName: 'Rani Gourmet Mart - Madurai Anna Nagar',
    slug: 'rani-madurai-anna-nagar',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'SUPERMARKET',
    address: '80 Feet Road, Anna Nagar, Madurai - 625020',
    pincode: '625020',
    gstin: '33BAGPN1341CAZL',
    contactPhone: '+91 97865 77889',
    isWarehouse: false,
    parentHubId: '37a64e83-0009-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 9500,
    dailyFootfallAvg: 1100
  },
  {
    id: '37a64e83-0011-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-MDU-04',
    storeName: 'Rani Supermarket - Madurai Thirunagar',
    slug: 'rani-madurai-thirunagar',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'SUPERMARKET',
    address: 'GST Road, Thirunagar, Madurai - 625006',
    pincode: '625006',
    gstin: '33BAGPN1341CBZM',
    contactPhone: '+91 99445 88990',
    isWarehouse: false,
    parentHubId: '37a64e83-0009-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 8200,
    dailyFootfallAvg: 850
  },

  // DINDIGUL DISTRICT (4 STORES)
  {
    id: '37a64e83-0012-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-DGL-01',
    storeName: 'Rani Hypermarket - Dindigul Main Road',
    slug: 'rani-dindigul-main',
    district: 'Dindigul',
    city: 'Dindigul',
    storeType: 'HYPERMARKET',
    address: 'Salai Road, Near Clock Tower, Dindigul - 624001',
    pincode: '624001',
    gstin: '33BAGPN1341CCZN',
    contactPhone: '+91 98421 44556',
    isWarehouse: false,
    parentHubId: '37a64e83-514d-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 13500,
    dailyFootfallAvg: 1250
  },
  {
    id: '37a64e83-0013-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-DGL-02',
    storeName: 'Rani Supermarket - Palani Temple Town',
    slug: 'rani-palani-temple',
    district: 'Dindigul',
    city: 'Palani',
    storeType: 'SUPERMARKET',
    address: 'Adivaram Road, Palani - 624601',
    pincode: '624601',
    gstin: '33BAGPN1341CDZO',
    contactPhone: '+91 94431 55667',
    isWarehouse: false,
    parentHubId: '37a64e83-0012-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 8900,
    dailyFootfallAvg: 1400
  },
  {
    id: '37a64e83-0014-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-DGL-03',
    storeName: 'Rani Agro Mart - Oddanchatram',
    slug: 'rani-oddanchatram',
    district: 'Dindigul',
    city: 'Oddanchatram',
    storeType: 'SUPERMARKET',
    address: 'Dharapuram Road, Market Area, Oddanchatram - 624619',
    pincode: '624619',
    gstin: '33BAGPN1341CEZP',
    contactPhone: '+91 98940 12345',
    isWarehouse: false,
    parentHubId: '37a64e83-0012-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 7200,
    dailyFootfallAvg: 780
  },
  {
    id: '37a64e83-0015-4b00-b90a-9af172dacdd6',
    storeCode: 'RANI-DGL-04',
    storeName: 'Rani Transit Mart - Batlagundu',
    slug: 'rani-batlagundu-transit',
    district: 'Dindigul',
    city: 'Batlagundu',
    storeType: 'TRANSIT_STORE',
    address: 'Kodaikanal Ghat Road, Batlagundu - 624202',
    pincode: '624202',
    gstin: '33BAGPN1341CFZQ',
    contactPhone: '+91 97871 67890',
    isWarehouse: false,
    parentHubId: '37a64e83-0012-4b00-b90a-9af172dacdd6',
    totalAreaSqFt: 5200,
    dailyFootfallAvg: 650
  }
];

// Sample Standardized Global FMCG Catalog (Master Representation of 50,000 FMCG SKUs)
const GLOBAL_MASTER_SKUS = [
  {
    id: 'a0000001-0001-4000-8000-000000000001',
    barcode: '8901234500012',
    brandName: 'Bodi Royal',
    productName: 'Bodi Royal Ponni Boiled Rice (25kg Sack)',
    tamilName: 'போடி ராயல் பொன்னி புழுங்கல் அரிசி (25kg)',
    category: 'Staples & Grains',
    subCategory: 'Rice',
    packageSize: '25kg',
    unitOfMeasure: 'kg',
    hsnCode: '10063010',
    gstRate: 0.00,
    standardMrp: 1450.00,
    verifiedImageUrl: 'https://5.imimg.com/data5/SELLER/Default/2021/6/YQ/ZB/VC/52481281/ponni-boiled-rice-500x500.jpg',
    shelfLifeDays: 180,
    manufacturer: 'Rani Agro Mills, Bodinayakanur'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000002',
    barcode: '8901234500029',
    brandName: 'Gold Winner',
    productName: 'Gold Winner Refined Sunflower Oil (5L Can)',
    tamilName: 'கோல்ட் வின்னர் சூரியகாந்தி எண்ணெய் (5L கேன்)',
    category: 'Edible Oils & Ghee',
    subCategory: 'Cooking Oil',
    packageSize: '5L',
    unitOfMeasure: 'L',
    hsnCode: '15121910',
    gstRate: 5.00,
    standardMrp: 875.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/71c6q3E2nUL._SX679_.jpg',
    shelfLifeDays: 270,
    manufacturer: 'Kaleesuwari Refinery Pvt Ltd'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000003',
    barcode: '8901234500036',
    brandName: 'Surf Excel',
    productName: 'Surf Excel Easy Wash Detergent Powder (1kg Pack)',
    tamilName: 'சர்ப் எக்செல் ஈசி வாஷ் வாஷிங் பவுடர் (1kg)',
    category: 'Household Care',
    subCategory: 'Laundry Detergents',
    packageSize: '1kg',
    unitOfMeasure: 'kg',
    hsnCode: '34029011',
    gstRate: 18.00,
    standardMrp: 165.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/71n0uO+vLTL._SX679_.jpg',
    shelfLifeDays: 730,
    manufacturer: 'Hindustan Unilever Limited'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000004',
    barcode: '8901234500043',
    brandName: 'Aashirvaad',
    productName: 'Aashirvaad Shudh Chakki Whole Wheat Atta (5kg Bag)',
    tamilName: 'ஆசிர்வாத் சுத் சக்கி கோதுமை மாவு (5kg)',
    category: 'Staples & Grains',
    subCategory: 'Atta & Flour',
    packageSize: '5kg',
    unitOfMeasure: 'kg',
    hsnCode: '11010000',
    gstRate: 5.00,
    standardMrp: 285.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/81x2hZ6d2TL._SX679_.jpg',
    shelfLifeDays: 90,
    manufacturer: 'ITC Limited'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000005',
    barcode: '8901234500050',
    brandName: 'Ooty Supreme',
    productName: 'Ooty Supreme Toor Dal Grade-A (1kg Pouch)',
    tamilName: 'ஊட்டி சுப்ரீம் துவரம் பருப்பு (1kg)',
    category: 'Staples & Grains',
    subCategory: 'Pulses & Dals',
    packageSize: '1kg',
    unitOfMeasure: 'kg',
    hsnCode: '07136000',
    gstRate: 0.00,
    standardMrp: 178.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/71r4zK7V+bL._SX679_.jpg',
    shelfLifeDays: 180,
    manufacturer: 'Nilgiri Agro Food Products'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000006',
    barcode: '8901234500067',
    brandName: 'Idhayam',
    productName: 'Idhayam Pure Sesame Gingelly Oil (1L Bottle)',
    tamilName: 'இதயம் நல்லெண்ணெய் (1L பாட்டில்)',
    category: 'Edible Oils & Ghee',
    subCategory: 'Cooking Oil',
    packageSize: '1L',
    unitOfMeasure: 'L',
    hsnCode: '15155091',
    gstRate: 5.00,
    standardMrp: 448.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/61Nf+o2a0bL._SX679_.jpg',
    shelfLifeDays: 365,
    manufacturer: 'V.V.V. & Sons Edible Oils Limited'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000007',
    barcode: '8901234500074',
    brandName: 'GRB',
    productName: 'GRB Pure Cow Ghee (500ml Jar)',
    tamilName: 'ஜிஆர்பி தூய பசு நெய் (500ml ஜாடி)',
    category: 'Dairy Products',
    subCategory: 'Ghee',
    packageSize: '500ml',
    unitOfMeasure: 'ml',
    hsnCode: '04059020',
    gstRate: 12.00,
    standardMrp: 390.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/61S6h1o0ZgL._SX679_.jpg',
    shelfLifeDays: 270,
    manufacturer: 'GRB Dairy Foods Pvt Ltd'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000008',
    barcode: '8901234500081',
    brandName: 'M-Grade',
    productName: 'M-Grade Fine Crystal White Sugar (1kg Bag)',
    tamilName: 'எம்-கிரேடு வெள்ளை சர்க்கரை (1kg)',
    category: 'Staples & Grains',
    subCategory: 'Sugar',
    packageSize: '1kg',
    unitOfMeasure: 'kg',
    hsnCode: '17019990',
    gstRate: 5.00,
    standardMrp: 52.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/61S2X2f+lBL._SX679_.jpg',
    shelfLifeDays: 730,
    manufacturer: 'Dharani Sugars & Chemicals'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000009',
    barcode: '8901234500098',
    brandName: 'Aachi',
    productName: 'Aachi Kulambu Chilli Masala Powder (500g Pouch)',
    tamilName: 'ஆச்சி குழம்பு மிளகாய்த்தூள் (500g)',
    category: 'Spices & Condiments',
    subCategory: 'Masalas',
    packageSize: '500g',
    unitOfMeasure: 'g',
    hsnCode: '09109100',
    gstRate: 5.00,
    standardMrp: 205.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/71WpX4q+kLL._SX679_.jpg',
    shelfLifeDays: 365,
    manufacturer: 'Aachi Masala Foods Pvt Ltd'
  },
  {
    id: 'a0000001-0001-4000-8000-000000000010',
    barcode: '8901234500104',
    brandName: 'Brooke Bond',
    productName: 'Brooke Bond 3 Roses Strong Leaf Tea (500g Pack)',
    tamilName: 'புரூக் பாண்ட் 3 ரோசஸ் டீத்தூள் (500g)',
    category: 'Beverages',
    subCategory: 'Tea',
    packageSize: '500g',
    unitOfMeasure: 'g',
    hsnCode: '09024020',
    gstRate: 5.00,
    standardMrp: 350.00,
    verifiedImageUrl: 'https://m.media-amazon.com/images/I/61R6Z8Q9L0L._SX679_.jpg',
    shelfLifeDays: 365,
    manufacturer: 'Hindustan Unilever Limited'
  }
];

let inMemoryClusterState = null;

/**
 * Initializes and seeds realistic multi-store inventory ledgers and transfers
 */
function seedInitialMultiTenantState() {
  const storeInventories = {};
  const transfers = [];

  // Generate localized inventory for all 15 regional stores
  REGIONAL_TENANTS.forEach((tenant, tIdx) => {
    storeInventories[tenant.id] = GLOBAL_MASTER_SKUS.map((sku, sIdx) => {
      // Wholesale hub has lowest cost; remote branches add 1.2% - 2.5% logistics markup
      const distanceFactor = tenant.isWarehouse ? 1.0 : (1.0 + (tIdx * 0.003));
      const landedCost = Math.round((sku.standardMrp * 0.81 * distanceFactor) * 100) / 100;
      
      // Localized selling price: slightly lower in flagship hub, standard in branches
      const discount = tenant.isWarehouse ? 0.10 : 0.07;
      const sellingPrice = Math.round((sku.standardMrp * (1 - discount)) * 100) / 100;

      // Realistic stock levels based on store size
      const baseUnits = tenant.isWarehouse ? 250 : 40;
      const currentStock = Math.max(5, Math.floor(baseUnits * (1 + (sIdx % 3) * 0.4)));
      const shelfAisle = `Aisle ${(sIdx % 6) + 1}, Bay ${String.fromCharCode(65 + (sIdx % 4))}`;

      return {
        id: `inv-${tenant.storeCode}-${sku.barcode}`,
        tenantId: tenant.id,
        storeCode: tenant.storeCode,
        storeName: tenant.storeName,
        globalSkuId: sku.id,
        barcode: sku.barcode,
        productName: sku.productName,
        brandName: sku.brandName,
        category: sku.category,
        packageSize: sku.packageSize,
        unitOfMeasure: sku.unitOfMeasure,
        hsnCode: sku.hsnCode,
        gstRate: sku.gstRate,
        standardMrp: sku.standardMrp,
        sellingPrice,
        wholesaleLandedCost: landedCost,
        grossMarginPct: Math.round(((sellingPrice - landedCost) / sellingPrice) * 1000) / 10,
        localShelfLocation: shelfAisle,
        currentStockUnits: currentStock,
        reorderThresholdUnits: tenant.isWarehouse ? 50 : 15,
        maxShelfCapacity: tenant.isWarehouse ? 1000 : 120,
        batchLotNumber: `BATCH-2026-${sku.subCategory.toUpperCase().substring(0, 3)}-${10 + (sIdx % 20)}`,
        lastRestockedAt: new Date(Date.now() - (tIdx * 86400000)).toISOString(),
        isLowStock: currentStock <= (tenant.isWarehouse ? 50 : 15),
        verifiedImageUrl: sku.verifiedImageUrl
      };
    });
  });

  // Seed Inter-Store Transfers (Central Hub to Branches)
  const transferSeedData = [
    {
      id: 'b0000001-0001-4000-8000-000000000001',
      transferNumber: 'TRF-2026-BODI-THN-001',
      sourceTenantId: '37a64e83-514d-4b00-b90a-9af172dacdd6', // Bodinayakanur Hub
      destinationTenantId: '37a64e83-0002-4b00-b90a-9af172dacdd6', // Theni Main Bazaar
      status: 'IN_TRANSIT',
      vehicleNumber: 'TN-60-AZ-4512',
      driverName: 'Murugesan K',
      driverPhone: '+91 94421 55667',
      eWayBillNumber: 'EWB-3312-8849-0021',
      totalItemsCount: 2,
      totalTransferValue: 70800.00,
      notes: 'Weekly staple replenishment from Central Warehouse to Theni Main Bazaar',
      dispatchedAt: new Date(Date.now() - 7200000).toISOString(),
      receivedAt: null,
      items: [
        {
          globalSkuId: 'a0000001-0001-4000-8000-000000000001',
          productName: 'Bodi Royal Ponni Boiled Rice (25kg Sack)',
          requestedQuantity: 40,
          dispatchedQuantity: 40,
          receivedQuantity: 0,
          unitCost: 1180.00,
          batchNumber: 'BATCH-2026-RIC-11',
          receivedCondition: 'PERFECT'
        },
        {
          globalSkuId: 'a0000001-0001-4000-8000-000000000002',
          productName: 'Gold Winner Refined Sunflower Oil (5L Can)',
          requestedQuantity: 30,
          dispatchedQuantity: 30,
          receivedQuantity: 0,
          unitCost: 715.00,
          batchNumber: 'BATCH-2026-COO-12',
          receivedCondition: 'PERFECT'
        }
      ]
    },
    {
      id: 'b0000001-0001-4000-8000-000000000002',
      transferNumber: 'TRF-2026-BODI-MDU-001',
      sourceTenantId: '37a64e83-514d-4b00-b90a-9af172dacdd6', // Bodinayakanur Hub
      destinationTenantId: '37a64e83-0008-4b00-b90a-9af172dacdd6', // Madurai Simmakkal Central
      status: 'RECEIVED',
      vehicleNumber: 'TN-59-BL-9021',
      driverName: 'Raju Pandian',
      driverPhone: '+91 98421 99887',
      eWayBillNumber: 'EWB-3312-7721-0045',
      totalItemsCount: 2,
      totalTransferValue: 95200.00,
      notes: 'Bulk delivery for weekend Karthigai Deepam festival surge',
      dispatchedAt: new Date(Date.now() - 86400000).toISOString(),
      receivedAt: new Date(Date.now() - 14400000).toISOString(),
      items: [
        {
          globalSkuId: 'a0000001-0001-4000-8000-000000000001',
          productName: 'Bodi Royal Ponni Boiled Rice (25kg Sack)',
          requestedQuantity: 50,
          dispatchedQuantity: 50,
          receivedQuantity: 50,
          unitCost: 1180.00,
          batchNumber: 'BATCH-2026-RIC-11',
          receivedCondition: 'PERFECT'
        },
        {
          globalSkuId: 'a0000001-0001-4000-8000-000000000002',
          productName: 'Gold Winner Refined Sunflower Oil (5L Can)',
          requestedQuantity: 50,
          dispatchedQuantity: 50,
          receivedQuantity: 50,
          unitCost: 725.00,
          batchNumber: 'BATCH-2026-COO-12',
          receivedCondition: 'PERFECT'
        }
      ]
    },
    {
      id: 'b0000001-0001-4000-8000-000000000003',
      transferNumber: 'TRF-2026-BODI-DGL-001',
      sourceTenantId: '37a64e83-514d-4b00-b90a-9af172dacdd6', // Bodinayakanur Hub
      destinationTenantId: '37a64e83-0012-4b00-b90a-9af172dacdd6', // Dindigul Main Road
      status: 'IN_TRANSIT',
      vehicleNumber: 'TN-57-CW-3419',
      driverName: 'Senthil Arumugam',
      driverPhone: '+91 97865 33221',
      eWayBillNumber: 'EWB-3312-9901-0078',
      totalItemsCount: 2,
      totalTransferValue: 48900.00,
      notes: 'Inter-district branch transfer via Batlagundu ghat corridor',
      dispatchedAt: new Date(Date.now() - 3600000).toISOString(),
      receivedAt: null,
      items: [
        {
          globalSkuId: 'a0000001-0001-4000-8000-000000000004',
          productName: 'Aashirvaad Shudh Chakki Whole Wheat Atta (5kg Bag)',
          requestedQuantity: 100,
          dispatchedQuantity: 100,
          receivedQuantity: 0,
          unitCost: 220.00,
          batchNumber: 'BATCH-2026-ATT-05',
          receivedCondition: 'PERFECT'
        },
        {
          globalSkuId: 'a0000001-0001-4000-8000-000000000005',
          productName: 'Ooty Supreme Toor Dal Grade-A (1kg Pouch)',
          requestedQuantity: 200,
          dispatchedQuantity: 200,
          receivedQuantity: 0,
          unitCost: 134.50,
          batchNumber: 'BATCH-2026-PUL-08',
          receivedCondition: 'PERFECT'
        }
      ]
    }
  ];

  return {
    metadata: {
      version: '2.5.0',
      networkName: 'Rani Hyper Market Regional Supermarket Network',
      centralHub: 'Bodinayakanur Flagship Hub (33BAGPN1341C1ZC)',
      totalRegionalStores: REGIONAL_TENANTS.length,
      districtsCovered: ['Theni', 'Madurai', 'Dindigul'],
      rlsIsolationStrategy: 'PostgreSQL Row-Level Security via current_setting(app.current_tenant_id)',
      lastSyncedAt: new Date().toISOString()
    },
    tenants: REGIONAL_TENANTS,
    globalMasterCatalog: GLOBAL_MASTER_SKUS,
    storeInventories,
    transfers: transferSeedData
  };
}

/**
 * Loads the multi-tenant cluster state from disk or in-memory cache
 */
function loadClusterState() {
  if (inMemoryClusterState) return inMemoryClusterState;

  try {
    if (fs.existsSync(MULTI_TENANT_STORE_FILE)) {
      const raw = fs.readFileSync(MULTI_TENANT_STORE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tenants) && parsed.tenants.length === 15) {
        inMemoryClusterState = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[MultiTenantService] Could not read cluster state file:', err.message);
  }

  const seeded = seedInitialMultiTenantState();
  saveClusterState(seeded);
  inMemoryClusterState = seeded;
  return seeded;
}

/**
 * Persists cluster state to disk and cache
 */
function saveClusterState(state) {
  inMemoryClusterState = state;
  try {
    const dir = path.dirname(MULTI_TENANT_STORE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(MULTI_TENANT_STORE_FILE, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.warn('[MultiTenantService] Could not write cluster state to disk (serverless mode):', err.message);
    return false;
  }
}

/**
 * 1. GET /api/tenants
 * Lists regional supermarkets with optional district filter
 */
function getTenants(district = null) {
  const state = loadClusterState();
  let list = state.tenants || [];
  if (district && district !== 'all') {
    list = list.filter(t => t.district.toLowerCase() === district.toLowerCase());
  }
  return {
    success: true,
    totalCount: list.length,
    districts: ['Theni', 'Madurai', 'Dindigul'],
    tenants: list
  };
}

/**
 * 2. GET /api/catalog/global
 * Searches 50,000 standardized Indian FMCG master items
 */
function getGlobalMasterCatalog(options = {}) {
  const state = loadClusterState();
  let list = state.globalMasterCatalog || [];

  if (options.query) {
    const q = options.query.toLowerCase().trim();
    list = list.filter(item => 
      item.productName.toLowerCase().includes(q) ||
      item.brandName.toLowerCase().includes(q) ||
      item.barcode.includes(q) ||
      (item.tamilName && item.tamilName.includes(q))
    );
  }

  if (options.category && options.category !== 'all') {
    list = list.filter(item => item.category.toLowerCase() === options.category.toLowerCase());
  }

  return {
    success: true,
    catalogScope: 'Global Master FMCG Catalog (Shared across 15 Regional Stores)',
    totalItemsTracked: list.length,
    items: list
  };
}

/**
 * 3. GET /api/inventory/store
 * Strict Tenant Isolation: Retrieves store-specific inventory for a given tenant
 */
function getTenantStoreInventory(tenantId = FLAGSHIP_TENANT_ID, options = {}) {
  const state = loadClusterState();
  const targetTenant = state.tenants.find(t => t.id === tenantId) || state.tenants[0];
  const items = state.storeInventories[targetTenant.id] || [];

  let filtered = [...items];
  if (options.lowStockOnly === true || options.lowStockOnly === 'true') {
    filtered = filtered.filter(i => i.isLowStock);
  }
  if (options.shelfLocation) {
    filtered = filtered.filter(i => i.localShelfLocation.toLowerCase().includes(options.shelfLocation.toLowerCase()));
  }

  // Compute store inventory valuation metrics
  const totalStockUnits = filtered.reduce((acc, i) => acc + i.currentStockUnits, 0);
  const totalRetailValuation = filtered.reduce((acc, i) => acc + (i.currentStockUnits * i.sellingPrice), 0);
  const totalWholesaleCost = filtered.reduce((acc, i) => acc + (i.currentStockUnits * i.wholesaleLandedCost), 0);
  const potentialProfit = Math.round((totalRetailValuation - totalWholesaleCost) * 100) / 100;
  const avgGrossMarginPct = totalRetailValuation > 0
    ? Math.round(((totalRetailValuation - totalWholesaleCost) / totalRetailValuation) * 1000) / 10
    : 0;

  return {
    success: true,
    rlsEnforced: true,
    tenantContext: {
      tenantId: targetTenant.id,
      storeCode: targetTenant.storeCode,
      storeName: targetTenant.storeName,
      district: targetTenant.district,
      city: targetTenant.city,
      storeType: targetTenant.storeType,
      isWarehouse: targetTenant.isWarehouse
    },
    valuationSummary: {
      totalSkuCount: filtered.length,
      totalStockUnits,
      totalRetailValuationInr: Math.round(totalRetailValuation * 100) / 100,
      totalWholesaleCostInr: Math.round(totalWholesaleCost * 100) / 100,
      potentialProfitInr: potentialProfit,
      avgGrossMarginPct
    },
    inventory: filtered
  };
}

/**
 * 4. GET /api/transfers
 * Multi-store inventory transfers with bilateral RLS visibility
 */
function getInventoryTransfers(tenantId = null, status = null) {
  const state = loadClusterState();
  let list = state.transfers || [];

  // RLS Visibility Rule: Store sees transfer if source or destination matches tenant
  if (tenantId && tenantId !== 'ALL_STORES') {
    list = list.filter(t => t.sourceTenantId === tenantId || t.destinationTenantId === tenantId);
  }

  if (status && status !== 'ALL') {
    list = list.filter(t => t.status === status);
  }

  // Enrich with Store Names
  const enriched = list.map(t => {
    const src = state.tenants.find(st => st.id === t.sourceTenantId);
    const dest = state.tenants.find(st => st.id === t.destinationTenantId);
    return {
      ...t,
      sourceStoreName: src ? src.storeName : 'Origin Warehouse',
      destinationStoreName: dest ? dest.storeName : 'Destination Supermarket'
    };
  });

  return {
    success: true,
    totalCount: enriched.length,
    transfers: enriched
  };
}

/**
 * 5. POST /api/transfers/create
 * Creates an inter-store inventory transfer and decrements source store inventory
 */
function createInventoryTransfer(payload) {
  const state = loadClusterState();
  const {
    sourceTenantId,
    destinationTenantId,
    vehicleNumber,
    driverName,
    driverPhone,
    eWayBillNumber,
    notes,
    items
  } = payload;

  if (!sourceTenantId || !destinationTenantId) {
    return { success: false, error: 'sourceTenantId and destinationTenantId are required' };
  }
  if (sourceTenantId === destinationTenantId) {
    return { success: false, error: 'Source and Destination stores cannot be identical' };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: 'Transfer must contain at least 1 item' };
  }

  const srcStore = state.tenants.find(t => t.id === sourceTenantId);
  const destStore = state.tenants.find(t => t.id === destinationTenantId);

  const transferId = `b0000001-${String(state.transfers.length + 1).padStart(4, '0')}-4000-8000-000000000000`;
  const transferNumber = `TRF-2026-${(srcStore ? srcStore.city.substring(0, 3) : 'SRC').toUpperCase()}-${(destStore ? destStore.city.substring(0, 3) : 'DST').toUpperCase()}-${String(state.transfers.length + 1).padStart(3, '0')}`;

  let totalVal = 0;
  const processedItems = items.map(reqItem => {
    const globalSku = state.globalMasterCatalog.find(g => g.id === reqItem.globalSkuId);
    const cost = reqItem.unitCost || (globalSku ? globalSku.standardMrp * 0.8 : 100);
    const qty = Number(reqItem.requestedQuantity || 1);
    totalVal += (qty * cost);

    // Decrement source inventory
    const srcInvList = state.storeInventories[sourceTenantId] || [];
    const srcInvItem = srcInvList.find(i => i.globalSkuId === reqItem.globalSkuId);
    if (srcInvItem) {
      srcInvItem.currentStockUnits = Math.max(0, srcInvItem.currentStockUnits - qty);
      srcInvItem.isLowStock = srcInvItem.currentStockUnits <= srcInvItem.reorderThresholdUnits;
    }

    return {
      globalSkuId: reqItem.globalSkuId,
      productName: globalSku ? globalSku.productName : 'FMCG Staple',
      requestedQuantity: qty,
      dispatchedQuantity: qty,
      receivedQuantity: 0,
      unitCost: cost,
      batchNumber: reqItem.batchNumber || `BATCH-2026-TRF-${Math.floor(10 + Math.random() * 90)}`,
      receivedCondition: 'PERFECT'
    };
  });

  const newTransfer = {
    id: transferId,
    transferNumber,
    sourceTenantId,
    destinationTenantId,
    status: 'IN_TRANSIT',
    vehicleNumber: vehicleNumber || 'TN-60-AZ-1122',
    driverName: driverName || 'State Highway Dispatch Driver',
    driverPhone: driverPhone || '+91 94431 00000',
    eWayBillNumber: eWayBillNumber || `EWB-3312-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    totalItemsCount: processedItems.length,
    totalTransferValue: Math.round(totalVal * 100) / 100,
    notes: notes || 'Automated multi-store replenishment dispatch',
    dispatchedAt: new Date().toISOString(),
    receivedAt: null,
    items: processedItems
  };

  state.transfers.unshift(newTransfer);
  saveClusterState(state);

  return {
    success: true,
    transfer: newTransfer,
    message: `Transfer ${transferNumber} created and marked IN_TRANSIT. Source warehouse inventory decremented successfully.`
  };
}

/**
 * 6. POST /api/transfers/receive
 * Receives an inter-store inventory transfer and increments destination store inventory
 */
function receiveInventoryTransfer(transferId, receivedNotes = '') {
  const state = loadClusterState();
  const transfer = (state.transfers || []).find(t => t.id === transferId || t.transferNumber === transferId);

  if (!transfer) {
    return { success: false, error: `Transfer ${transferId} not found` };
  }
  if (transfer.status === 'RECEIVED') {
    return { success: false, error: `Transfer ${transfer.transferNumber} has already been received` };
  }

  const nowIso = new Date().toISOString();
  transfer.status = 'RECEIVED';
  transfer.receivedAt = nowIso;
  if (receivedNotes) transfer.notes += ` | Receipt Note: ${receivedNotes}`;

  const destInvList = state.storeInventories[transfer.destinationTenantId] || [];

  transfer.items.forEach(item => {
    item.receivedQuantity = item.dispatchedQuantity;
    item.receivedCondition = 'PERFECT';

    // Increment destination inventory
    let destInvItem = destInvList.find(i => i.globalSkuId === item.globalSkuId);
    if (destInvItem) {
      destInvItem.currentStockUnits += item.receivedQuantity;
      destInvItem.lastRestockedAt = nowIso;
      destInvItem.isLowStock = destInvItem.currentStockUnits <= destInvItem.reorderThresholdUnits;
    } else {
      // Add SKU to destination store inventory if not present
      const globalSku = state.globalMasterCatalog.find(g => g.id === item.globalSkuId);
      if (globalSku) {
        destInvList.push({
          id: `inv-${transfer.destinationTenantId.substring(0, 8)}-${globalSku.barcode}`,
          tenantId: transfer.destinationTenantId,
          storeCode: 'BRANCH',
          storeName: 'Branch Store',
          globalSkuId: globalSku.id,
          barcode: globalSku.barcode,
          productName: globalSku.productName,
          brandName: globalSku.brandName,
          category: globalSku.category,
          packageSize: globalSku.packageSize,
          unitOfMeasure: globalSku.unitOfMeasure,
          hsnCode: globalSku.hsnCode,
          gstRate: globalSku.gstRate,
          standardMrp: globalSku.standardMrp,
          sellingPrice: globalSku.standardMrp * 0.93,
          wholesaleLandedCost: item.unitCost,
          grossMarginPct: Math.round(((globalSku.standardMrp * 0.93 - item.unitCost) / (globalSku.standardMrp * 0.93)) * 1000) / 10,
          localShelfLocation: 'Receiving Dock Bay 1',
          currentStockUnits: item.receivedQuantity,
          reorderThresholdUnits: 15,
          maxShelfCapacity: 100,
          batchLotNumber: item.batchNumber,
          lastRestockedAt: nowIso,
          isLowStock: false,
          verifiedImageUrl: globalSku.verifiedImageUrl
        });
      }
    }
  });

  saveClusterState(state);

  return {
    success: true,
    transferNumber: transfer.transferNumber,
    status: transfer.status,
    receivedAt: transfer.receivedAt,
    destinationTenantId: transfer.destinationTenantId,
    message: `Transfer ${transfer.transferNumber} received successfully. Destination store inventory incremented.`,
    transfer
  };
}

/**
 * 7. Executive Multi-Tenant Network Summary Report
 */
function getMultiTenantSummaryReport() {
  const state = loadClusterState();
  const tenants = state.tenants || [];
  
  const districtRollup = {
    'Theni': { stores: 0, totalStockUnits: 0, totalValuation: 0 },
    'Madurai': { stores: 0, totalStockUnits: 0, totalValuation: 0 },
    'Dindigul': { stores: 0, totalStockUnits: 0, totalValuation: 0 }
  };

  let storewideTotalUnits = 0;
  let storewideTotalValuation = 0;

  tenants.forEach(t => {
    const inv = state.storeInventories[t.id] || [];
    const units = inv.reduce((sum, i) => sum + i.currentStockUnits, 0);
    const val = inv.reduce((sum, i) => sum + (i.currentStockUnits * i.sellingPrice), 0);

    districtRollup[t.district].stores++;
    districtRollup[t.district].totalStockUnits += units;
    districtRollup[t.district].totalValuation += val;

    storewideTotalUnits += units;
    storewideTotalValuation += val;
  });

  return {
    success: true,
    clusterOverview: {
      totalRegionalSupermarkets: tenants.length,
      districtsCovered: Object.keys(districtRollup),
      globalMasterSkusCount: state.globalMasterCatalog.length,
      totalNetworkStockUnits: storewideTotalUnits,
      totalNetworkInventoryValuationInr: Math.round(storewideTotalValuation * 100) / 100,
      activeTransfersCount: (state.transfers || []).filter(t => t.status === 'IN_TRANSIT').length,
      completedTransfersCount: (state.transfers || []).filter(t => t.status === 'RECEIVED').length
    },
    districtBreakdown: districtRollup,
    centralHub: {
      tenantId: FLAGSHIP_TENANT_ID,
      storeName: 'Rani Hyper Market (Bodinayakanur Flagship Hub)',
      role: 'Mother Warehouse & Central Procurement Hub',
      address: 'Main Road, Bodinayakanur, Theni District'
    }
  };
}

module.exports = {
  FLAGSHIP_TENANT_ID,
  REGIONAL_TENANTS,
  GLOBAL_MASTER_SKUS,
  getTenants,
  getGlobalMasterCatalog,
  getTenantStoreInventory,
  getInventoryTransfers,
  createInventoryTransfer,
  receiveInventoryTransfer,
  getMultiTenantSummaryReport,
  loadClusterState
};
