/**
 * services/deliveryDriverService.js
 * 
 * Mobile Web Portal & Real-Time Communications Service for Store Delivery Drivers
 * Rani Hyper Market — Main Road, Bodinayakanur & Theni District
 * 
 * Features:
 * 1. Delivery Driver Roster & Active Shifts (4 dedicated drivers)
 * 2. Assigned Order Queue with Google Maps Turn-by-Turn Navigation & Masked Calling
 * 3. Dynamic PhonePe / GPay UPI Intent & QR Code Generator
 * 4. Automated 3-Stage Customer WhatsApp Notification Engine:
 *    - Order Packed: "Your Rani Hypermarket order #XXXX is packed and leaving the store."
 *    - Out for Delivery: "[Rider] is on his way to your doorstep. Estimated arrival: X minutes."
 *    - Delivered: "Delivered! Thank you for supporting your local Bodinayakanur supermarket."
 */

const fs = require('fs');
const path = require('path');

// Store Hub Coordinates (Main Road, Bodinayakanur)
const STORE_HUB = {
  name: 'Rani Hyper Market (Main Depot)',
  address: 'Main Road, Bodinayakanur, Theni Dist, TN 625513',
  lat: 10.0104,
  lng: 77.3496,
  upiVpa: 'saalimin21@oksbi',
  payeeName: 'Rani Hyper Market'
};

// 4 Dedicated Store Delivery Drivers
let DRIVER_FLEET = [
  {
    id: 'RIDER-01',
    name: 'K. Selvam',
    tamilName: 'கே. செல்வம்',
    phone: '+91 94421 88123',
    vehicle: 'TVS XL Heavy Duty (TN-60-AZ-1122)',
    vehicleType: 'Heavy Utility Two-Wheeler',
    shiftStatus: 'ON_DUTY',
    rating: 4.9,
    completedTripsToday: 14,
    currentManifestId: 'MNF-BODI-20261123-01',
    primaryCluster: 'Ward 1 (Central Transit & Bus Stand)'
  },
  {
    id: 'RIDER-02',
    name: 'M. Manikandan',
    tamilName: 'எம். மணிகண்டன்',
    phone: '+91 98422 44556',
    vehicle: 'Honda Activa 6G (TN-60-BY-3344)',
    vehicleType: 'Two-Wheeler Scooter',
    shiftStatus: 'ON_DUTY',
    rating: 4.85,
    completedTripsToday: 11,
    currentManifestId: 'MNF-BODI-20261123-02',
    primaryCluster: 'Ward 3 (Subramanya Siva Nagar & North)'
  },
  {
    id: 'RIDER-03',
    name: 'P. Vignesh',
    tamilName: 'பி. விக்னேஷ்',
    phone: '+91 97881 22334',
    vehicle: 'Hero Splendor Plus (TN-60-CX-5566)',
    vehicleType: 'Two-Wheeler Commuter',
    shiftStatus: 'ON_DUTY',
    rating: 4.95,
    completedTripsToday: 16,
    currentManifestId: 'MNF-BODI-20261123-03',
    primaryCluster: 'Ward 7 (Periyandavar Puram & East)'
  },
  {
    id: 'RIDER-04',
    name: 'R. Karthik',
    tamilName: 'ஆர். கார்த்திக்',
    phone: '+91 99443 66778',
    vehicle: 'Ather 450X EV (TN-60-EV-7788)',
    vehicleType: 'Electric Scooter (Zero Emissions)',
    shiftStatus: 'ON_DUTY',
    rating: 5.0,
    completedTripsToday: 9,
    currentManifestId: 'MNF-BODI-20261123-04',
    primaryCluster: 'Ward 12 (Paramasivan Temple Area & West)'
  }
];

// In-Memory Driver Delivery Orders Store
let DRIVER_ORDERS_STORE = [
  {
    orderId: 'WA-9401',
    assignedRiderId: 'RIDER-02', // M. Manikandan
    stopSequence: 1,
    customerName: 'Murugan Bodi',
    customerPhone: '+91 98421 11223',
    maskedPhone: '+91 98*** **223',
    deliveryAddress: '34, Subramanya Siva Nagar 1st Cross, Bodinayakanur',
    landmark: 'Near Subramanya Siva Statue',
    ward: 'Ward 3 (North-East)',
    lat: 10.0162,
    lng: 77.3518,
    distanceKm: 0.69,
    etaMinutes: 12,
    itemsCount: 2,
    itemsSummary: 'Bodi Deluxe Ponni Rice (25kg), Aavin Pure Ghee (500ml)',
    totalAmount: 1639.00,
    isCod: true,
    paymentStatus: 'PENDING_CASH', // PENDING_CASH | PAID_ONLINE | CASH_COLLECTED | UPI_COLLECTED
    orderStatus: 'OUT_FOR_DELIVERY', // PACKED | OUT_FOR_DELIVERY | DELIVERED
    statusHistory: [
      { status: 'PACKED', timestamp: '2026-11-23T06:10:00.000Z' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-11-23T06:14:00.000Z' }
    ]
  },
  {
    orderId: 'WA-9402',
    assignedRiderId: 'RIDER-02', // M. Manikandan
    stopSequence: 2,
    customerName: 'P. Arumugam',
    customerPhone: '+91 98422 55667',
    maskedPhone: '+91 98*** **667',
    deliveryAddress: '12, Subramanya Siva Nagar East, Bodinayakanur',
    landmark: 'Opposite Municipal Water Tank',
    ward: 'Ward 3 (North-East)',
    lat: 10.0175,
    lng: 77.3530,
    distanceKm: 0.85,
    etaMinutes: 18,
    itemsCount: 3,
    itemsSummary: 'Surf Excel Detergent (1kg), Vim Gel (500ml), Tata Salt (1kg)',
    totalAmount: 303.00,
    isCod: true,
    paymentStatus: 'PENDING_CASH',
    orderStatus: 'PACKED',
    statusHistory: [
      { status: 'PACKED', timestamp: '2026-11-23T06:12:00.000Z' }
    ]
  },
  {
    orderId: 'WA-9403',
    assignedRiderId: 'RIDER-03', // P. Vignesh
    stopSequence: 1,
    customerName: 'K. Rajendran',
    customerPhone: '+91 94431 22334',
    maskedPhone: '+91 94*** **334',
    deliveryAddress: '88, Periyandavar Puram 2nd Street, Bodinayakanur',
    landmark: 'Near Mariamman Temple Arch',
    ward: 'Ward 7 (Central-East)',
    lat: 10.0125,
    lng: 77.3565,
    distanceKm: 1.20,
    etaMinutes: 14,
    itemsCount: 2,
    itemsSummary: 'Gold Winner Sunflower Oil (1L x 2), Tata Salt (1kg)',
    totalAmount: 298.00,
    isCod: false,
    paymentStatus: 'PAID_ONLINE',
    orderStatus: 'OUT_FOR_DELIVERY',
    statusHistory: [
      { status: 'PACKED', timestamp: '2026-11-23T06:05:00.000Z' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-11-23T06:15:00.000Z' }
    ]
  },
  {
    orderId: 'WA-9404',
    assignedRiderId: 'RIDER-03', // P. Vignesh
    stopSequence: 2,
    customerName: 'R. Karpagam',
    customerPhone: '+91 97882 66778',
    maskedPhone: '+91 97*** **778',
    deliveryAddress: '45, Periyandavar Puram North, Bodinayakanur',
    landmark: 'Near Kamaraj Higher Secondary School',
    ward: 'Ward 7 (Central-East)',
    lat: 10.0140,
    lng: 77.3580,
    distanceKm: 1.45,
    etaMinutes: 22,
    itemsCount: 2,
    itemsSummary: 'Bodi Ponni Boiled Rice (25kg), GRB Cow Ghee (500ml)',
    totalAmount: 1694.00,
    isCod: true,
    paymentStatus: 'PENDING_CASH',
    orderStatus: 'PACKED',
    statusHistory: [
      { status: 'PACKED', timestamp: '2026-11-23T06:08:00.000Z' }
    ]
  },
  {
    orderId: 'WA-9405',
    assignedRiderId: 'RIDER-04', // R. Karthik
    stopSequence: 1,
    customerName: 'S. Meenakshi',
    customerPhone: '+91 97881 33445',
    maskedPhone: '+91 97*** **445',
    deliveryAddress: '15, Paramasivan Temple Sannathi Street, Bodinayakanur',
    landmark: 'Paramasivan Kovil South Entrance',
    ward: 'Ward 12 (South-West)',
    lat: 10.0065,
    lng: 77.3450,
    distanceKm: 0.91,
    etaMinutes: 10,
    itemsCount: 3,
    itemsSummary: 'Aachi Chilli Powder (500g), Udhayam Toor Dal (1kg), Turmeric Powder',
    totalAmount: 560.00,
    isCod: true,
    paymentStatus: 'PENDING_CASH',
    orderStatus: 'OUT_FOR_DELIVERY',
    statusHistory: [
      { status: 'PACKED', timestamp: '2026-11-23T06:02:00.000Z' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-11-23T06:12:00.000Z' }
    ]
  },
  {
    orderId: 'WA-9406',
    assignedRiderId: 'RIDER-04', // R. Karthik
    stopSequence: 2,
    customerName: 'T. Dhanalakshmi',
    customerPhone: '+91 99445 88990',
    maskedPhone: '+91 99*** **990',
    deliveryAddress: '29, Paramasivan Temple West Car Street, Bodinayakanur',
    landmark: 'Behind Annadhana Mandapam',
    ward: 'Ward 12 (South-West)',
    lat: 10.0055,
    lng: 77.3435,
    distanceKm: 1.15,
    etaMinutes: 16,
    itemsCount: 2,
    itemsSummary: 'Idhayam Gingelly Oil (500ml), Aachi Turmeric Powder (200g)',
    totalAmount: 250.00,
    isCod: true,
    paymentStatus: 'PENDING_CASH',
    orderStatus: 'PACKED',
    statusHistory: [
      { status: 'PACKED', timestamp: '2026-11-23T06:06:00.000Z' }
    ]
  },
  {
    orderId: 'WA-9407',
    assignedRiderId: 'RIDER-01', // K. Selvam
    stopSequence: 1,
    customerName: 'V. Sundaram',
    customerPhone: '+91 99443 44556',
    maskedPhone: '+91 99*** **556',
    deliveryAddress: '102, Bus Stand Main Road, Bodinayakanur',
    landmark: 'Near Daily Thanthi Office',
    ward: 'Ward 1 (Central Transit)',
    lat: 10.0095,
    lng: 77.3475,
    distanceKm: 0.70,
    etaMinutes: 8,
    itemsCount: 2,
    itemsSummary: 'Bodi Cardamom Special Tea (500g), Sugar S-30 (5kg)',
    totalAmount: 480.00,
    isCod: true,
    paymentStatus: 'PENDING_CASH',
    orderStatus: 'OUT_FOR_DELIVERY',
    statusHistory: [
      { status: 'PACKED', timestamp: '2026-11-23T06:00:00.000Z' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-11-23T06:10:00.000Z' }
    ]
  }
];

// Customer WhatsApp Notification Journal (Audit Trail)
let NOTIFICATION_LOG = [];

/**
 * Mask Phone Number for Screen Privacy (+91 98421 11223 -> +91 98*** **223)
 */
function maskPhoneNumber(phone) {
  if (!phone) return '+91 ***** *****';
  const clean = phone.replace(/[^\d]/g, '');
  if (clean.length >= 10) {
    const last10 = clean.slice(-10);
    return `+91 ${last10.slice(0, 2)}*** **${last10.slice(7)}`;
  }
  return phone;
}

/**
 * Generate NPCI Standard UPI Intent URL & Payment Metadata
 */
function generateUpiPaymentDetails(order) {
  const amount = parseFloat(order.totalAmount || 0).toFixed(2);
  const note = `Order ${order.orderId} Rani Hypermarket`;
  const encodedNote = encodeURIComponent(note);
  const encodedPayee = encodeURIComponent(STORE_HUB.payeeName);
  
  // NPCI UPI URI Specification
  const upiIntentUrl = `upi://pay?pa=${STORE_HUB.upiVpa}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;
  
  // App-Specific Deep Links
  const phonePeIntentUrl = `phonepe://pay?pa=${STORE_HUB.upiVpa}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;
  const gPayIntentUrl = `tez://upi/pay?pa=${STORE_HUB.upiVpa}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;
  const paytmIntentUrl = `paytmmp://pay?pa=${STORE_HUB.upiVpa}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;

  // High-Resolution Fallback QR Code Image (QRServer CDN)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(upiIntentUrl)}`;

  return {
    merchantVpa: STORE_HUB.upiVpa,
    payeeName: STORE_HUB.payeeName,
    amountInr: parseFloat(amount),
    transactionNote: note,
    upiIntentUrl,
    phonePeIntentUrl,
    gPayIntentUrl,
    paytmIntentUrl,
    qrCodeUrl
  };
}

/**
 * Build Turn-by-Turn Google Maps Navigation Link
 */
function generateGoogleMapsNavigationUrl(order) {
  if (order.lat && order.lng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${STORE_HUB.lat},${STORE_HUB.lng}&destination=${order.lat},${order.lng}&travelmode=two_wheeler`;
  }
  const cleanAddr = encodeURIComponent(`${order.deliveryAddress || ''}, Bodinayakanur, Tamil Nadu`);
  return `https://www.google.com/maps/dir/?api=1&destination=${cleanAddr}&travelmode=two_wheeler`;
}

/**
 * Automated WhatsApp Customer Notification Templates
 * Event 1: Order Packed
 * Event 2: Out for Delivery
 * Event 3: Delivered
 */
function buildCustomerWhatsAppNotification(event, order, rider) {
  const orderId = order.orderId;
  const riderName = rider ? rider.name : 'Your Delivery Partner';
  const riderPhone = rider ? rider.phone : '+91 94421 88123';
  const etaMinutes = order.etaMinutes || 12;

  let textEnglish = '';
  let textTamil = '';
  let templateCode = '';

  switch (event) {
    case 'PACKED':
      templateCode = 'order_packed_v1';
      textEnglish = `Your Rani Hypermarket order #${orderId} is packed and leaving the store.`;
      textTamil = `வணக்கம்! உங்கள் ராணி ஹைப்பர் மார்க்கெட் ஆர்டர் #${orderId} பேக் செய்யப்பட்டு கடையிலிருந்து புறப்பட தயாராக உள்ளது.`;
      break;

    case 'OUT_FOR_DELIVERY':
      templateCode = 'out_for_delivery_v1';
      textEnglish = `${riderName} is on his way to your doorstep. Estimated arrival: ${etaMinutes} minutes.`;
      textTamil = `வணக்கம்! ${riderName} உங்கள் வீட்டிற்கு டெலிவரி செய்ய புறப்பட்டுவிட்டார். வரும் நேரம்: ${etaMinutes} நிமிடங்கள்.`;
      break;

    case 'DELIVERED':
      templateCode = 'order_delivered_v1';
      textEnglish = `Delivered! Thank you for supporting your local Bodinayakanur supermarket.`;
      textTamil = `டெலிவரி செய்யப்பட்டது! உங்கள் உள்ளூர் போடிநாயக்கனூர் ராணி ஹைப்பர் மார்க்கெட்டை ஆதரித்ததற்கு மனமார்ந்த நன்றி.`;
      break;

    default:
      templateCode = 'order_update_v1';
      textEnglish = `Your Rani Hypermarket order #${orderId} status has been updated to ${event}.`;
      textTamil = `உங்கள் ராணி ஹைப்பர் மார்க்கெட் ஆர்டர் #${orderId} நிலை மாற்றப்பட்டுள்ளது.`;
  }

  // Combined Bilingual Payload for WhatsApp Web or Meta Cloud API
  const fullBilingualMessage = 
`🛒 *RANI HYPER MARKET — BODINAYAKANUR*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${textEnglish}

${textTamil}

📦 *Order ID:* #${orderId}
🛵 *Delivery Boy:* ${riderName} (${riderPhone})
${event === 'DELIVERED' ? '🧾 *E-Bill Link:* https://rani-hyper-market.vercel.app/orders.html?inv=' + orderId : '⏱️ *SLA:* 30-Minute Dark Store Express'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Main Road, Bodinayakanur • 77088 34547_`;

  const cleanCustomerPhone = (order.customerPhone || '').replace(/[^\d]/g, '');
  const targetPhone = cleanCustomerPhone.length === 10 ? '91' + cleanCustomerPhone : cleanCustomerPhone;
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(fullBilingualMessage)}`;

  return {
    event,
    templateCode,
    orderId,
    customerPhone: order.customerPhone,
    maskedPhone: order.maskedPhone,
    textEnglish,
    textTamil,
    fullBilingualMessage,
    whatsappUrl,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get All Drivers with Status and Stats
 */
function getDriverFleet() {
  return DRIVER_FLEET.map(d => {
    const activeOrders = DRIVER_ORDERS_STORE.filter(
      o => o.assignedRiderId === d.id && o.orderStatus !== 'DELIVERED'
    );
    const deliveredToday = DRIVER_ORDERS_STORE.filter(
      o => o.assignedRiderId === d.id && o.orderStatus === 'DELIVERED'
    ).length;

    return {
      ...d,
      activeOrdersCount: activeOrders.length,
      deliveredTodayCount: d.completedTripsToday + deliveredToday
    };
  });
}

/**
 * Get Orders for a Specific Driver
 */
function getDriverOrders(riderId) {
  const targetRiderId = riderId || 'RIDER-02'; // Default to Manikandan
  const rider = DRIVER_FLEET.find(d => d.id === targetRiderId) || DRIVER_FLEET[1];

  const orders = DRIVER_ORDERS_STORE.filter(o => o.assignedRiderId === targetRiderId);

  // Enrich each order with dynamic UPI, Maps URL, and Phone Call Action
  const enriched = orders.map(order => {
    const upi = generateUpiPaymentDetails(order);
    const navUrl = generateGoogleMapsNavigationUrl(order);

    return {
      ...order,
      callLink: `tel:${order.customerPhone.replace(/\s+/g, '')}`,
      googleMapsNavigationUrl: navUrl,
      upiPayment: upi,
      customerWhatsAppUrl: {
        packed: buildCustomerWhatsAppNotification('PACKED', order, rider).whatsappUrl,
        outForDelivery: buildCustomerWhatsAppNotification('OUT_FOR_DELIVERY', order, rider).whatsappUrl,
        delivered: buildCustomerWhatsAppNotification('DELIVERED', order, rider).whatsappUrl
      }
    };
  });

  // Calculate Shift Financials
  const codPendingTotal = enriched
    .filter(o => o.isCod && o.paymentStatus === 'PENDING_CASH')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const collectedTotal = enriched
    .filter(o => o.paymentStatus === 'CASH_COLLECTED' || o.paymentStatus === 'UPI_COLLECTED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    success: true,
    rider,
    manifestId: rider.currentManifestId,
    totalAssignedOrders: enriched.length,
    pendingDeliveriesCount: enriched.filter(o => o.orderStatus !== 'DELIVERED').length,
    completedDeliveriesCount: enriched.filter(o => o.orderStatus === 'DELIVERED').length,
    codCashPendingInr: codPendingTotal,
    cashCollectedInr: collectedTotal,
    orders: enriched
  };
}

/**
 * Update Order Status (PACKED -> OUT_FOR_DELIVERY -> DELIVERED)
 * Triggers Automated WhatsApp Notification Payload
 */
function updateOrderStatus(orderId, newStatus, riderId, paymentUpdate) {
  const order = DRIVER_ORDERS_STORE.find(o => o.orderId === orderId);
  if (!order) {
    return { success: false, error: `Order #${orderId} not found in driver queue` };
  }

  const validStatuses = ['PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: `Invalid status ${newStatus}. Must be one of: ${validStatuses.join(', ')}` };
  }

  order.orderStatus = newStatus;
  order.statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString()
  });

  // Handle Cash / UPI Payment update
  if (paymentUpdate) {
    if (paymentUpdate === 'CASH_COLLECTED') {
      order.paymentStatus = 'CASH_COLLECTED';
    } else if (paymentUpdate === 'UPI_COLLECTED') {
      order.paymentStatus = 'UPI_COLLECTED';
    }
  } else if (newStatus === 'DELIVERED' && order.isCod && order.paymentStatus === 'PENDING_CASH') {
    // Default to Cash Collected on delivery if not specified
    order.paymentStatus = 'CASH_COLLECTED';
  }

  const targetRiderId = riderId || order.assignedRiderId;
  const rider = DRIVER_FLEET.find(d => d.id === targetRiderId) || DRIVER_FLEET[0];

  // Automatically Build the Triggered WhatsApp Notification
  const notification = buildCustomerWhatsAppNotification(newStatus, order, rider);
  NOTIFICATION_LOG.unshift(notification);

  return {
    success: true,
    message: `Order #${orderId} flipped to ${newStatus}`,
    orderId,
    newStatus,
    paymentStatus: order.paymentStatus,
    notification,
    order
  };
}

/**
 * Record Payment Collection (Cash or UPI)
 */
function recordPaymentCollection(orderId, paymentMethod, amount) {
  const order = DRIVER_ORDERS_STORE.find(o => o.orderId === orderId);
  if (!order) {
    return { success: false, error: `Order #${orderId} not found` };
  }

  const method = String(paymentMethod || '').toUpperCase();
  if (method.includes('UPI')) {
    order.paymentStatus = 'UPI_COLLECTED';
  } else {
    order.paymentStatus = 'CASH_COLLECTED';
  }

  const upi = generateUpiPaymentDetails(order);

  return {
    success: true,
    orderId: order.orderId,
    paymentStatus: order.paymentStatus,
    amountCollected: amount || order.totalAmount,
    timestamp: new Date().toISOString(),
    upi
  };
}

module.exports = {
  STORE_HUB,
  DRIVER_FLEET,
  getDriverFleet,
  getDriverOrders,
  updateOrderStatus,
  recordPaymentCollection,
  generateUpiPaymentDetails,
  buildCustomerWhatsAppNotification,
  getNotificationLogs: () => [...NOTIFICATION_LOG],
  maskPhoneNumber
};
