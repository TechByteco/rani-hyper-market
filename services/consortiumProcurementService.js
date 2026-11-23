/**
 * Centralized Group-Buying Consortium Procurement Service
 * collective of 15 independent regional supermarkets across Theni, Madurai, and Dindigul districts.
 * 
 * Solves the scale asymmetry against national conglomerates (Reliance Retail, D-Mart)
 * by pooling 14-day staple demand, negotiating bulk mill-gate pricing (6% to 9% below distributor rates),
 * automatically splitting Bills of Lading (BoL) across direct delivery trucks,
 * and computing per-store net profit margin improvements.
 */

const fs = require('fs');
const path = require('path');

// 15 Regional Supermarket Consortium Members
const CONSORTIUM_MEMBERS = [
  {
    storeCode: 'RANI-THN-01',
    storeName: 'Rani Hyper Market (Bodinayakanur Flagship Hub)',
    district: 'Theni',
    city: 'Bodinayakanur',
    storeType: 'FLAGSHIP_HUB',
    totalAreaSqFt: 18500,
    dailyFootfallAvg: 1450,
    demandWeight: 1.45,
    address: 'Main Road, Bodinayakanur, Theni District - 625513',
    gstin: '33BAGPN1341C1ZC',
    dockBayCapacity: '2 Heavy Trucks (16T)'
  },
  {
    storeCode: 'RANI-THN-02',
    storeName: 'Rani Hyper Market - Theni Main Bazaar',
    district: 'Theni',
    city: 'Theni',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 6500,
    dailyFootfallAvg: 1100,
    demandWeight: 1.10,
    address: '42, Madurai Road, Theni Bazaar - 625531',
    gstin: '33BAGPN1341C2ZD',
    dockBayCapacity: '1 Medium Truck (10T)'
  },
  {
    storeCode: 'RANI-THN-03',
    storeName: 'Rani Supermarket - Periyakulam Branch',
    district: 'Theni',
    city: 'Periyakulam',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 5200,
    dailyFootfallAvg: 850,
    demandWeight: 0.85,
    address: '118, South Street, Near New Bus Stand, Periyakulam - 625601',
    gstin: '33BAGPN1341C3ZE',
    dockBayCapacity: '1 Medium Truck (10T)'
  },
  {
    storeCode: 'RANI-THN-04',
    storeName: 'Rani Express Mart - Chinnamanur',
    district: 'Theni',
    city: 'Chinnamanur',
    storeType: 'BRANCH_EXPRESS',
    totalAreaSqFt: 3800,
    dailyFootfallAvg: 620,
    demandWeight: 0.62,
    address: '15, High School Road, Chinnamanur - 625515',
    gstin: '33BAGPN1341C4ZF',
    dockBayCapacity: '1 Light Vehicle (4T)'
  },
  {
    storeCode: 'RANI-THN-05',
    storeName: 'Rani Valley Hypermarket - Cumbum',
    district: 'Theni',
    city: 'Cumbum',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 8200,
    dailyFootfallAvg: 1250,
    demandWeight: 1.25,
    address: '88, LF Road, Cumbum Valley - 625516',
    gstin: '33BAGPN1341C5ZG',
    dockBayCapacity: '1 Medium Truck (10T)'
  },
  {
    storeCode: 'RANI-THN-06',
    storeName: 'Rani Supermarket - Uthamapalayam',
    district: 'Theni',
    city: 'Uthamapalayam',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 4100,
    dailyFootfallAvg: 580,
    demandWeight: 0.58,
    address: '7, Main Road, Uthamapalayam - 625533',
    gstin: '33BAGPN1341C6ZH',
    dockBayCapacity: '1 Light Vehicle (4T)'
  },
  {
    storeCode: 'RANI-THN-07',
    storeName: 'Rani Mart - Andipatti',
    district: 'Theni',
    city: 'Andipatti',
    storeType: 'BRANCH_EXPRESS',
    totalAreaSqFt: 3400,
    dailyFootfallAvg: 490,
    demandWeight: 0.49,
    address: '22, Madurai-Theni NH Road, Andipatti - 625512',
    gstin: '33BAGPN1341C7ZJ',
    dockBayCapacity: '1 Light Vehicle (4T)'
  },
  {
    storeCode: 'RANI-MDU-01',
    storeName: 'Rani Hypermarket - Madurai Simmakkal Central',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 9500,
    dailyFootfallAvg: 1650,
    demandWeight: 1.65,
    address: '104, Vakkil New Street, Simmakkal, Madurai - 625001',
    gstin: '33BAGPN1341C8ZK',
    dockBayCapacity: '1 Heavy Truck (16T)'
  },
  {
    storeCode: 'RANI-MDU-02',
    storeName: 'Rani Wholesale & Retail Hub - Madurai Mattuthavani',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'SECONDARY_HUB',
    totalAreaSqFt: 22000,
    dailyFootfallAvg: 2400,
    demandWeight: 2.40,
    address: 'Plot 12-15, Mattuthavani Integrated Wholesale Complex, Madurai - 625007',
    gstin: '33BAGPN1341C9ZL',
    dockBayCapacity: '3 Heavy Trucks (16T)'
  },
  {
    storeCode: 'RANI-MDU-03',
    storeName: 'Rani Gourmet Mart - Madurai Anna Nagar',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 7800,
    dailyFootfallAvg: 1300,
    demandWeight: 1.30,
    address: '45, 80 Feet Road, Anna Nagar, Madurai - 625020',
    gstin: '33BAGPN1341CAZM',
    dockBayCapacity: '1 Medium Truck (10T)'
  },
  {
    storeCode: 'RANI-MDU-04',
    storeName: 'Rani Supermarket - Madurai Thirunagar',
    district: 'Madurai',
    city: 'Madurai',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 5600,
    dailyFootfallAvg: 780,
    demandWeight: 0.78,
    address: '19, 1st Stop, GST Road, Thirunagar, Madurai - 625006',
    gstin: '33BAGPN1341CBZN',
    dockBayCapacity: '1 Light Vehicle (4T)'
  },
  {
    storeCode: 'RANI-DGL-01',
    storeName: 'Rani Hypermarket - Dindigul Main Road',
    district: 'Dindigul',
    city: 'Dindigul',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 11000,
    dailyFootfallAvg: 1550,
    demandWeight: 1.55,
    address: '76, Palani Road, Near Clock Tower, Dindigul - 624001',
    gstin: '33BAGPN1341CCZP',
    dockBayCapacity: '1 Heavy Truck (16T)'
  },
  {
    storeCode: 'RANI-DGL-02',
    storeName: 'Rani Supermarket - Palani Temple Town',
    district: 'Dindigul',
    city: 'Palani',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 7200,
    dailyFootfallAvg: 1400,
    demandWeight: 1.40,
    address: '32, Adivaram Road, Palani - 624601',
    gstin: '33BAGPN1341CDZQ',
    dockBayCapacity: '1 Medium Truck (10T)'
  },
  {
    storeCode: 'RANI-DGL-03',
    storeName: 'Rani Agro Mart - Oddanchatram',
    district: 'Dindigul',
    city: 'Oddanchatram',
    storeType: 'BRANCH_RETAIL',
    totalAreaSqFt: 6000,
    dailyFootfallAvg: 980,
    demandWeight: 0.98,
    address: '18, Vegetable Market Bypass, Oddanchatram - 624619',
    gstin: '33BAGPN1341CEZR',
    dockBayCapacity: '1 Medium Truck (10T)'
  },
  {
    storeCode: 'RANI-DGL-04',
    storeName: 'Rani Transit Mart - Batlagundu',
    district: 'Dindigul',
    city: 'Batlagundu',
    storeType: 'BRANCH_EXPRESS',
    totalAreaSqFt: 4500,
    dailyFootfallAvg: 720,
    demandWeight: 0.72,
    address: '12, Dindigul-Kodaikanal Ghat Road, Batlagundu - 624202',
    gstin: '33BAGPN1341CFZS',
    dockBayCapacity: '1 Light Vehicle (4T)'
  }
];

// Commodity Master for Consortium Bulk Procurement
const COMMODITIES = [
  {
    id: 'COMM-TOOR-DAL-A',
    name: 'Toor Dal Grade-A (Desi Fatka / Ooty Supreme)',
    tamilName: 'ஊட்டி சுப்ரீம் துவரம் பருப்பு (கிரேடு-ஏ)',
    category: 'Pulses & Dals',
    packageForm: '1kg Pouch / 50kg Jute Bag',
    unitOfMeasure: 'Metric Tons',
    totalTargetDemandMt: 42.0, // Exactly 42 Metric Tons as per specification
    hsnCode: '07136000',
    gstRatePct: 0,
    retailSellingPricePerKg: 178.00,
    distributorTier3PricePerKg: 165.00,
    millHub: 'Tirunelveli & Andhra Pulses Mandi',
    primaryOriginMills: [
      {
        millId: 'MILL-TNV-01',
        millName: 'Nellai Agro & Dhal Processing Mills',
        location: 'Tirunelveli Agro Corridor, Tamil Nadu',
        distanceKm: 142,
        quotedBulkMillRatePerKg: 151.80, // 8.00% discount
        discountPct: 8.00,
        moqMt: 25.0,
        qualityGrade: 'Export Grade Fatka (Sortex 99.8% Clean)',
        leadTimeDays: 2
      },
      {
        millId: 'MILL-GNT-01',
        millName: 'Sri Venkateswara Pulses Corporation',
        location: 'Guntur Mandi, Andhra Pradesh',
        distanceKm: 680,
        quotedBulkMillRatePerKg: 150.50, // 8.79% discount
        discountPct: 8.79,
        moqMt: 40.0,
        qualityGrade: 'Desi Polished Unpolished Blend',
        leadTimeDays: 3
      }
    ]
  },
  {
    id: 'COMM-PONNI-RICE-25KG',
    name: 'Bodi Royal Ponni Boiled Rice (25kg Sacks)',
    tamilName: 'போடி ராயல் பொன்னி புழுங்கல் அரிசி (25kg)',
    category: 'Staples & Grains',
    packageForm: '25kg Poly-Woven Sack',
    unitOfMeasure: 'Metric Tons',
    totalTargetDemandMt: 115.0, // 4,600 sacks
    hsnCode: '10063010',
    gstRatePct: 0,
    retailSellingPricePerKg: 58.00, // ₹1450 / 25kg
    distributorTier3PricePerKg: 51.20, // ₹1280 / 25kg
    millHub: 'Thanjavur Delta Rice Belt',
    primaryOriginMills: [
      {
        millId: 'MILL-TNJ-01',
        millName: 'Thanjavur Delta Modern Rice Mill Syndicate',
        location: 'Cauvery Basin, Thanjavur, Tamil Nadu',
        distanceKm: 195,
        quotedBulkMillRatePerKg: 47.20, // ₹1180 / 25kg (7.81% discount)
        discountPct: 7.81,
        moqMt: 50.0,
        qualityGrade: '1-Year Aged Single Boiled Deluxe Ponni',
        leadTimeDays: 2
      }
    ]
  },
  {
    id: 'COMM-OIL-SUNFLOWER-5L',
    name: 'Gold Winner Refined Sunflower Oil (5L Cans)',
    tamilName: 'கோல்ட் வின்னர் சுத்திகரிக்கப்பட்ட சூரியகாந்தி எண்ணெய் (5L)',
    category: 'Edible Oils',
    packageForm: '5L Food-Grade HDPE Can',
    unitOfMeasure: 'Metric Tons',
    totalTargetDemandMt: 32.0, // 6,400 cans (approx 32,000 Litres)
    hsnCode: '15121910',
    gstRatePct: 5,
    retailSellingPricePerKg: 175.00, // ₹875 / 5L
    distributorTier3PricePerKg: 125.00, // ₹625 / 5L
    millHub: 'Kangeyam / Erode Oil Extraction Zone',
    primaryOriginMills: [
      {
        millId: 'MILL-KGM-01',
        millName: 'Kangeyam Agro Oil Refineries & Extraction',
        location: 'Kangeyam, Tiruppur/Erode, Tamil Nadu',
        distanceKm: 168,
        quotedBulkMillRatePerKg: 115.60, // ₹578 / 5L (7.52% discount)
        discountPct: 7.52,
        moqMt: 20.0,
        qualityGrade: 'Triple Refined with Vit A & D Fortification',
        leadTimeDays: 2
      }
    ]
  },
  {
    id: 'COMM-SUGAR-CRYSTAL-1KG',
    name: 'Fine Crystal White Sugar (M-Grade)',
    tamilName: 'எம்-கிரேடு சுத்தமான வெள்ளை சர்க்கரை (1kg)',
    category: 'Staples & Grains',
    packageForm: '1kg Pouch / 50kg Sugar Sack',
    unitOfMeasure: 'Metric Tons',
    totalTargetDemandMt: 36.0, // 36,000 kg
    hsnCode: '17019990',
    gstRatePct: 5,
    retailSellingPricePerKg: 52.00,
    distributorTier3PricePerKg: 44.50,
    millHub: 'Tirunelveli & Theni Sugar Cooperative Belt',
    primaryOriginMills: [
      {
        millId: 'MILL-DHR-01',
        millName: 'Dharani Sugar Mills & Distilleries',
        location: 'Vasudevanallur / Tirunelveli, Tamil Nadu',
        distanceKm: 115,
        quotedBulkMillRatePerKg: 41.20, // 7.42% discount
        discountPct: 7.42,
        moqMt: 25.0,
        qualityGrade: 'Sparkling M-30 Fine Crystal Cane Sugar',
        leadTimeDays: 1
      }
    ]
  },
  {
    id: 'COMM-ATTA-WHEAT-5KG',
    name: 'Aashirvaad Shudh Chakki Whole Wheat Atta (5kg)',
    tamilName: 'ஆசிர்வாத் சுத் சக்கி கோதுமை மாவு (5kg)',
    category: 'Staples & Grains',
    packageForm: '5kg Heavy Poly Bag',
    unitOfMeasure: 'Metric Tons',
    totalTargetDemandMt: 28.0, // 5,600 bags
    hsnCode: '11010000',
    gstRatePct: 5,
    retailSellingPricePerKg: 57.00, // ₹285 / 5kg
    distributorTier3PricePerKg: 47.00, // ₹235 / 5kg
    millHub: 'Rajahmundry / Vijayawada Flour Mills (AP)',
    primaryOriginMills: [
      {
        millId: 'MILL-VJW-01',
        millName: 'Deccan Roller Flour & Chakki Mills',
        location: 'Vijayawada Industrial Zone, Andhra Pradesh',
        distanceKm: 720,
        quotedBulkMillRatePerKg: 43.30, // ₹216.50 / 5kg (7.87% discount)
        discountPct: 7.87,
        moqMt: 20.0,
        qualityGrade: '100% Shudh MP Sharbati Grain Flour',
        leadTimeDays: 3
      }
    ]
  },
  {
    id: 'COMM-CHILLI-GUNTUR-1KG',
    name: 'Guntur Teja Stemless Red Chilli (Grade-1)',
    tamilName: 'குண்டூர் தேஜா காம்பு நீக்கிய வத்தல் மிளகாய்',
    category: 'Spices & Condiments',
    packageForm: '1kg Pouch / 25kg Bale',
    unitOfMeasure: 'Metric Tons',
    totalTargetDemandMt: 14.0, // 14,000 kg
    hsnCode: '09042110',
    gstRatePct: 5,
    retailSellingPricePerKg: 280.00,
    distributorTier3PricePerKg: 240.00,
    millHub: 'Guntur Asia Largest Chilli Yard (AP)',
    primaryOriginMills: [
      {
        millId: 'MILL-GNT-02',
        millName: 'Guntur Spices Export & Cold Storage Hub',
        location: 'Mirchi Yard, Guntur, Andhra Pradesh',
        distanceKm: 685,
        quotedBulkMillRatePerKg: 219.60, // 8.50% discount
        discountPct: 8.50,
        moqMt: 10.0,
        qualityGrade: 'Deep Red SHU 75,000+ Stemless Selected',
        leadTimeDays: 3
      }
    ]
  }
];

// Truck Logistics Fleet Configurations for Multi-Drop Regional Route Splitting
const DISPATCH_ROUTES = [
  {
    routeId: 'ROUTE-THN-CORE',
    routeName: 'Route Alpha: Theni Central & Mother Dock Corridor',
    truckType: '10-Wheeler Heavy Freight (16 Metric Ton Capacity)',
    vehicleNumber: 'TN-60-AZ-4512',
    driverName: 'Murugesan K.',
    driverPhone: '+91 94421 55667',
    distanceKm: 85,
    drops: [
      { storeCode: 'RANI-THN-01', dropSeq: 1, allocationPct: 8.46 }, // Bodinayakanur Mother Hub
      { storeCode: 'RANI-THN-02', dropSeq: 2, allocationPct: 6.42 }, // Theni Main Bazaar
      { storeCode: 'RANI-THN-07', dropSeq: 3, allocationPct: 2.86 }, // Andipatti
      { storeCode: 'RANI-THN-03', dropSeq: 4, allocationPct: 4.96 }  // Periyakulam
    ]
  },
  {
    routeId: 'ROUTE-THN-VALLEY',
    routeName: 'Route Bravo: Cumbum Valley Agricultural Belt',
    truckType: '6-Wheeler Medium Freight (10 Metric Ton Capacity)',
    vehicleNumber: 'TN-60-BY-9102',
    driverName: 'Selvamurugan P.',
    driverPhone: '+91 98421 33412',
    distanceKm: 110,
    drops: [
      { storeCode: 'RANI-THN-04', dropSeq: 1, allocationPct: 3.62 }, // Chinnamanur
      { storeCode: 'RANI-THN-06', dropSeq: 2, allocationPct: 3.39 }, // Uthamapalayam
      { storeCode: 'RANI-THN-05', dropSeq: 3, allocationPct: 7.30 }  // Cumbum
    ]
  },
  {
    routeId: 'ROUTE-MDU-URBAN',
    routeName: 'Route Charlie: Madurai Metro & Secondary Hub Corridor',
    truckType: '10-Wheeler Heavy Freight (16 Metric Ton Capacity)',
    vehicleNumber: 'TN-58-CX-7788',
    driverName: 'Dharmarajan T.',
    driverPhone: '+91 97890 12890',
    distanceKm: 145,
    drops: [
      { storeCode: 'RANI-MDU-02', dropSeq: 1, allocationPct: 14.01 }, // Mattuthavani Secondary Hub
      { storeCode: 'RANI-MDU-01', dropSeq: 2, allocationPct: 9.63 },  // Simmakkal Central
      { storeCode: 'RANI-MDU-03', dropSeq: 3, allocationPct: 7.59 },  // Anna Nagar Gourmet
      { storeCode: 'RANI-MDU-04', dropSeq: 4, allocationPct: 4.55 }   // Thirunagar
    ]
  },
  {
    routeId: 'ROUTE-DGL-HIGHWAY',
    routeName: 'Route Delta: NH-83 Dindigul & Temple Town Freight Line',
    truckType: '10-Wheeler Heavy Freight (14 Metric Ton Capacity)',
    vehicleNumber: 'TN-57-DY-3341',
    driverName: 'Muthupandi V.',
    driverPhone: '+91 94432 99876',
    distanceKm: 175,
    drops: [
      { storeCode: 'RANI-DGL-04', dropSeq: 1, allocationPct: 4.20 }, // Batlagundu Transit
      { storeCode: 'RANI-DGL-01', dropSeq: 2, allocationPct: 9.05 }, // Dindigul Main Road
      { storeCode: 'RANI-DGL-03', dropSeq: 3, allocationPct: 5.72 }, // Oddanchatram Agro
      { storeCode: 'RANI-DGL-02', dropSeq: 4, allocationPct: 8.17 }  // Palani Temple Town
    ]
  }
];

/**
 * 1. Calculate 14-Day Projected Staple Demand across all 15 stores
 */
function aggregate14DayConsortiumDemand() {
  const totalWeight = CONSORTIUM_MEMBERS.reduce((sum, s) => sum + s.demandWeight, 0);

  const aggregatedCommodities = COMMODITIES.map(comm => {
    const storeBreakdown = CONSORTIUM_MEMBERS.map(store => {
      // Store allocation proportional to demand weight
      const storeShare = store.demandWeight / totalWeight;
      const allocatedMt = Math.round(comm.totalTargetDemandMt * storeShare * 100) / 100;
      const allocatedKg = Math.round(allocatedMt * 1000);
      
      const distributorCostInr = Math.round(allocatedKg * comm.distributorTier3PricePerKg);
      const bestMill = comm.primaryOriginMills[0];
      const bulkMillCostInr = Math.round(allocatedKg * bestMill.quotedBulkMillRatePerKg);
      const netSavingsInr = distributorCostInr - bulkMillCostInr;
      const retailRevenueInr = Math.round(allocatedKg * comm.retailSellingPricePerKg);

      const baselineMarginPct = Math.round(((retailRevenueInr - distributorCostInr) / retailRevenueInr) * 1000) / 10;
      const consortiumMarginPct = Math.round(((retailRevenueInr - bulkMillCostInr) / retailRevenueInr) * 1000) / 10;
      const marginExpansionPct = Math.round((consortiumMarginPct - baselineMarginPct) * 10) / 10;

      return {
        storeCode: store.storeCode,
        storeName: store.storeName,
        district: store.district,
        city: store.city,
        allocatedDemandMt: allocatedMt,
        allocatedDemandKg: allocatedKg,
        distributorCostInr,
        bulkMillCostInr,
        netSavingsInr,
        retailRevenueInr,
        baselineMarginPct,
        consortiumMarginPct,
        marginExpansionPct
      };
    });

    const totalAllocatedKg = storeBreakdown.reduce((sum, s) => sum + s.allocatedDemandKg, 0);
    const totalDistributorCostInr = storeBreakdown.reduce((sum, s) => sum + s.distributorCostInr, 0);
    const totalBulkMillCostInr = storeBreakdown.reduce((sum, s) => sum + s.bulkMillCostInr, 0);
    const totalSavingsInr = totalDistributorCostInr - totalBulkMillCostInr;
    const totalRetailRevenueInr = storeBreakdown.reduce((sum, s) => sum + s.retailRevenueInr, 0);
    const avgDiscountPct = Math.round(((totalDistributorCostInr - totalBulkMillCostInr) / totalDistributorCostInr) * 1000) / 10;

    return {
      commodityId: comm.id,
      commodityName: comm.name,
      tamilName: comm.tamilName,
      category: comm.category,
      packageForm: comm.packageForm,
      totalDemandMt: comm.totalTargetDemandMt,
      totalDemandKg: totalAllocatedKg,
      millHub: comm.millHub,
      distributorRatePerKg: comm.distributorTier3PricePerKg,
      bestQuotedMillRatePerKg: comm.primaryOriginMills[0].quotedBulkMillRatePerKg,
      negotiatedDiscountPct: avgDiscountPct,
      totalDistributorCostInr,
      totalBulkMillCostInr,
      totalSavingsInr,
      totalRetailRevenueInr,
      storeBreakdown
    };
  });

  const totalConsortiumMt = aggregatedCommodities.reduce((sum, c) => sum + c.totalDemandMt, 0);
  const totalConsortiumSavingsInr = aggregatedCommodities.reduce((sum, c) => sum + c.totalSavingsInr, 0);
  const totalDistributorOutlayInr = aggregatedCommodities.reduce((sum, c) => sum + c.totalDistributorCostInr, 0);
  const totalMillOutlayInr = aggregatedCommodities.reduce((sum, c) => sum + c.totalBulkMillCostInr, 0);
  const overallDiscountPct = Math.round(((totalDistributorOutlayInr - totalMillOutlayInr) / totalDistributorOutlayInr) * 1000) / 10;

  return {
    success: true,
    consortiumScope: '15 Regional Supermarkets Collective (Theni, Madurai, Dindigul)',
    timeHorizon: '14-Day Staple Replenishment Cycle',
    totalSupermarkets: CONSORTIUM_MEMBERS.length,
    totalCommodityCount: aggregatedCommodities.length,
    totalConsortiumDemandMt: totalConsortiumMt,
    totalDistributorOutlayInr,
    totalMillOutlayInr,
    total14DayConsortiumSavingsInr: totalConsortiumSavingsInr,
    annualizedProjectedSavingsInr: Math.round((totalConsortiumSavingsInr / 14) * 365),
    overallConsortiumDiscountPct: overallDiscountPct,
    commodities: aggregatedCommodities
  };
}

/**
 * 2. Direct Mandi Bidding Terminal: Unified Requests for Proposal (RFPs)
 */
function getMandiBiddingTerminal() {
  const demandData = aggregate14DayConsortiumDemand();

  const rfpTenders = demandData.commodities.map((c, idx) => {
    const rawComm = COMMODITIES.find(item => item.id === c.commodityId);
    const rfpNumber = `RFP-CONSORTIUM-2026-${String(idx + 1).padStart(3, '0')}`;
    
    // Evaluate quotes from mills in Tirunelveli, Thanjavur, Andhra Pradesh
    const millQuotes = (rawComm.primaryOriginMills || []).map(mill => {
      const singleStoreDistributorCost = Math.round(c.totalDemandKg * c.distributorRatePerKg);
      const bulkMillCost = Math.round(c.totalDemandKg * mill.quotedBulkMillRatePerKg);
      const totalSavings = singleStoreDistributorCost - bulkMillCost;

      return {
        millId: mill.millId,
        millName: mill.millName,
        originRegion: mill.location,
        distanceKm: mill.distanceKm,
        quotedBulkMillRatePerKg: mill.quotedBulkMillRatePerKg,
        distributorRatePerKg: c.distributorRatePerKg,
        discountBelowDistributorPct: mill.discountPct,
        minOrderQuantityMt: mill.moqMt,
        consortiumOrderVolumeMt: c.totalDemandMt,
        moqSatisfied: c.totalDemandMt >= mill.moqMt,
        totalTenderValueInr: bulkMillCost,
        consortiumSavingsInr: totalSavings,
        qualityCertification: mill.qualityGrade,
        dispatchLeadTimeDays: mill.leadTimeDays,
        bidStatus: 'BEST_VALUE_LOCKED'
      };
    });

    const winningBid = millQuotes[0];

    return {
      rfpNumber,
      commodityId: c.commodityId,
      commodityName: c.commodityName,
      totalVolumeTenderedMt: c.totalDemandMt,
      totalVolumeTenderedKg: c.totalDemandKg,
      targetDestinationCount: 15,
      benchmarkDistributorCostInr: c.totalDistributorCostInr,
      winningBid: winningBid,
      biddingStatus: 'CONTRACT_AWARDED',
      awardedMillName: winningBid ? winningBid.millName : 'Pending',
      awardedMillOrigin: winningBid ? winningBid.originRegion : 'Pending',
      negotiatedDiscountPct: winningBid ? winningBid.discountBelowDistributorPct : 0,
      totalConsortiumSavingsInr: winningBid ? winningBid.consortiumSavingsInr : 0,
      paymentTerms: 'RTGS on Certified Weighbridge Bill of Lading (Net 7)',
      issuingEntity: 'Rani Hyper Market Collective Procurement Consortium'
    };
  });

  return {
    success: true,
    terminalStatus: 'ACTIVE_BIDDING_SESSION',
    originZonesCovered: [
      'Tirunelveli Agro Corridor (Tamil Nadu)',
      'Thanjavur Cauvery Delta Rice Belt (Tamil Nadu)',
      'Guntur Mirchi & Spices Yard (Andhra Pradesh)',
      'Kangeyam Edible Oil Refineries (Tamil Nadu)',
      'Vijayawada Roller Flour Mills (Andhra Pradesh)'
    ],
    rfpTenders
  };
}

/**
 * 3. Split Bills of Lading (BoL) and Logistics Truck Dispatch
 */
function generateSplitBillsOfLading(commodityId = 'COMM-TOOR-DAL-A') {
  const comm = COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
  const demandData = aggregate14DayConsortiumDemand();
  const commDemand = demandData.commodities.find(c => c.commodityId === comm.id);

  const bestMill = comm.primaryOriginMills[0];
  const masterBolNumber = `BOL-MASTER-2026-${comm.id.replace('COMM-', '')}-001`;

  let truckDispatches = DISPATCH_ROUTES.map((route, routeIdx) => {
    let routeAllocatedKg = 0;
    let routeValueInr = 0;

    const subBols = route.drops.map(drop => {
      const storeItem = commDemand.storeBreakdown.find(s => s.storeCode === drop.storeCode);
      const allocatedKg = storeItem ? storeItem.allocatedDemandKg : 0;
      const allocatedMt = Math.round((allocatedKg / 1000) * 100) / 100;
      const landedCostInr = Math.round(allocatedKg * bestMill.quotedBulkMillRatePerKg);
      const distributorCostInr = Math.round(allocatedKg * comm.distributorTier3PricePerKg);
      const savingsInr = distributorCostInr - landedCostInr;

      routeAllocatedKg += allocatedKg;
      routeValueInr += landedCostInr;

      const subBolNumber = `BOL-SPLIT-${route.routeId.replace('ROUTE-', '')}-${drop.storeCode}-${String(drop.dropSeq).padStart(2, '0')}`;

      return {
        subBolNumber,
        dropSequence: drop.dropSeq,
        storeCode: drop.storeCode,
        storeName: storeItem ? storeItem.storeName : drop.storeCode,
        district: storeItem ? storeItem.district : 'Theni',
        city: storeItem ? storeItem.city : 'Tamil Nadu',
        allocatedVolumeMt: allocatedMt,
        allocatedVolumeKg: allocatedKg,
        freightUnitCostPerKg: bestMill.quotedBulkMillRatePerKg,
        storeLandedValueInr: landedCostInr,
        distributorEquivalentCostInr: distributorCostInr,
        storeDirectSavingsInr: savingsInr,
        eWayBillNumber: `EWB-3312-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        dispatchStatus: 'MANIFESTED_READY_FOR_HAUL'
      };
    });

    return {
      dispatchId: `DISP-2026-${route.routeId}-${String(routeIdx + 1).padStart(3, '0')}`,
      routeId: route.routeId,
      routeName: route.routeName,
      truckType: route.truckType,
      vehicleRegistrationNumber: route.vehicleNumber,
      driverName: route.driverName,
      driverContactPhone: route.driverPhone,
      routeDistanceKm: route.distanceKm,
      totalTruckLoadMt: Math.round((routeAllocatedKg / 1000) * 100) / 100,
      totalTruckLoadKg: routeAllocatedKg,
      totalConsignmentValueInr: routeValueInr,
      multiDropSequence: subBols
    };
  });

  return {
    success: true,
    masterBillOfLading: {
      masterBolNumber,
      originMillName: bestMill.millName,
      originMillLocation: bestMill.location,
      commodityName: comm.name,
      totalConsignmentWeightMt: comm.totalTargetDemandMt,
      totalConsignmentWeightKg: Math.round(comm.totalTargetDemandMt * 1000),
      directMillRatePerKg: bestMill.quotedBulkMillRatePerKg,
      totalMasterInvoiceInr: Math.round(comm.totalTargetDemandMt * 1000 * bestMill.quotedBulkMillRatePerKg),
      totalConsortiumSavingsInr: commDemand ? commDemand.totalSavingsInr : 0,
      negotiatedDiscountPct: bestMill.discountPct
    },
    totalTrucksDispatched: truckDispatches.length,
    truckDispatches
  };
}

/**
 * 4. Net Profit Margin Improvement per Tenant Store
 */
function getTenantProfitMarginImprovements() {
  const demandData = aggregate14DayConsortiumDemand();

  // Aggregate savings across all 6 commodities per store
  const storeImprovementMap = {};

  CONSORTIUM_MEMBERS.forEach(store => {
    storeImprovementMap[store.storeCode] = {
      storeCode: store.storeCode,
      storeName: store.storeName,
      district: store.district,
      city: store.city,
      totalAreaSqFt: store.totalAreaSqFt,
      dailyFootfallAvg: store.dailyFootfallAvg,
      storeType: store.storeType,
      total14DayDemandKg: 0,
      totalDistributorCostInr: 0,
      totalBulkMillCostInr: 0,
      totalRetailRevenueInr: 0,
      commodityBreakdown: []
    };
  });

  demandData.commodities.forEach(comm => {
    comm.storeBreakdown.forEach(s => {
      const entry = storeImprovementMap[s.storeCode];
      if (entry) {
        entry.total14DayDemandKg += s.allocatedDemandKg;
        entry.totalDistributorCostInr += s.distributorCostInr;
        entry.totalBulkMillCostInr += s.bulkMillCostInr;
        entry.totalRetailRevenueInr += s.retailRevenueInr;
        entry.commodityBreakdown.push({
          commodityName: comm.commodityName,
          allocatedDemandKg: s.allocatedDemandKg,
          distributorCostInr: s.distributorCostInr,
          bulkMillCostInr: s.bulkMillCostInr,
          netSavingsInr: s.netSavingsInr,
          baselineMarginPct: s.baselineMarginPct,
          consortiumMarginPct: s.consortiumMarginPct,
          marginExpansionPct: s.marginExpansionPct
        });
      }
    });
  });

  const storeRankings = Object.values(storeImprovementMap).map(store => {
    const net14DaySavingsInr = store.totalDistributorCostInr - store.totalBulkMillCostInr;
    const monthlyProjectedSavingsInr = Math.round((net14DaySavingsInr / 14) * 30);
    const annualizedSavingsInr = Math.round((net14DaySavingsInr / 14) * 365);

    const oldGrossMarginPct = Math.round(((store.totalRetailRevenueInr - store.totalDistributorCostInr) / store.totalRetailRevenueInr) * 1000) / 10;
    const consortiumGrossMarginPct = Math.round(((store.totalRetailRevenueInr - store.totalBulkMillCostInr) / store.totalRetailRevenueInr) * 1000) / 10;
    const netMarginExpansionPct = Math.round((consortiumGrossMarginPct - oldGrossMarginPct) * 10) / 10;

    return {
      storeCode: store.storeCode,
      storeName: store.storeName,
      district: store.district,
      city: store.city,
      storeType: store.storeType,
      totalAreaSqFt: store.totalAreaSqFt,
      dailyFootfallAvg: store.dailyFootfallAvg,
      total14DayDemandKg: store.total14DayDemandKg,
      totalDistributorCostInr: store.totalDistributorCostInr,
      totalBulkMillCostInr: store.totalBulkMillCostInr,
      net14DaySavingsInr,
      monthlyProjectedSavingsInr,
      annualizedSavingsInr,
      totalRetailRevenueInr: store.totalRetailRevenueInr,
      oldGrossMarginPct,
      consortiumGrossMarginPct,
      netMarginExpansionPct,
      commodityBreakdown: store.commodityBreakdown
    };
  });

  // Sort descending by savings
  storeRankings.sort((a, b) => b.net14DaySavingsInr - a.net14DaySavingsInr);

  const totalNetwork14DaySavingsInr = storeRankings.reduce((sum, s) => sum + s.net14DaySavingsInr, 0);
  const totalNetworkAnnualizedSavingsInr = storeRankings.reduce((sum, s) => sum + s.annualizedSavingsInr, 0);
  const avgMarginExpansionPct = Math.round((storeRankings.reduce((sum, s) => sum + s.netMarginExpansionPct, 0) / storeRankings.length) * 10) / 10;

  return {
    success: true,
    consortiumCount: storeRankings.length,
    totalNetwork14DaySavingsInr,
    totalNetworkMonthlySavingsInr: Math.round((totalNetwork14DaySavingsInr / 14) * 30),
    totalNetworkAnnualizedSavingsInr,
    averageGrossMarginExpansionPct: avgMarginExpansionPct,
    storeRankings
  };
}

module.exports = {
  CONSORTIUM_MEMBERS,
  COMMODITIES,
  DISPATCH_ROUTES,
  aggregate14DayConsortiumDemand,
  getMandiBiddingTerminal,
  generateSplitBillsOfLading,
  getTenantProfitMarginImprovements
};
