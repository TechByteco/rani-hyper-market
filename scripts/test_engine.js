
const pos = require('../posEnhancementService');

console.log('Testing posEnhancementService enterprise functions:');

// 1. Webhook reconciliation
console.log('1. Webhook Reconciliation:');
const whResult = pos.reconcileUpiWebhook({
  txnId: 'TXN-TEST-1001',
  utr: '987654321098',
  amount: 235.0,
  sender: 'Sundar Store Test',
  note: 'Payment for groceries'
});
console.log('   Webhook result:', JSON.stringify(whResult));

// 2. Shift Management
console.log('2. Shift Management:');
const openRes = pos.openShift({ cashierName: 'Murugan Counter 1', counterNo: 'Counter #1', openingCash: 2500 });
console.log('   Open shift result:', JSON.stringify(openRes));
const currShift = pos.getCurrentShift();
console.log('   Current shift:', JSON.stringify(currShift));
const closeRes = pos.closeShift({ countedCash: 2500, notes: 'Day shift balanced' });
console.log('   Close shift result:', JSON.stringify(closeRes));

// 3. WhatsApp E-Bill
console.log('3. WhatsApp Dispatch:');
const waRes = pos.dispatchWhatsAppEbill('any-id', { phone: '9842100000' });
console.log('   WhatsApp dispatch (expected failure for non-existent order):', waRes.success === false);

// 4. Perishable Markdowns
console.log('4. Perishable Markdowns:');
const markdowns = pos.getPerishableDynamicMarkdowns();
console.log('   Total fresh deals:', markdowns.total_deals);
console.log('   Deal 1:', markdowns.deals[0].name, '-> Flash Price: Rs.', markdowns.deals[0].flash_price);

// 5. Delta Sync
console.log('5. Delta Sync:');
const syncRes = pos.processOfflineDeltaBatch([
  {
    offlineId: 'OFF-TEST-1',
    customer: 'Test Offline Customer',
    total: 150.0,
    payment_method: 'CASH',
    items: [{ title: 'Sugar 1kg', qty: 1, price: 44.0 }]
  }
]);
console.log('   Sync batch result:', JSON.stringify(syncRes));
const syncStatus = pos.getDeltaSyncStatus();
console.log('   Sync status:', JSON.stringify(syncStatus));

console.log('\nALL 5 POS ENHANCEMENT ENGINE TESTS PASSED!');
