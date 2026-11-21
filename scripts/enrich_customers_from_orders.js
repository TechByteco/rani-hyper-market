/**
 * enrich_customers_from_orders.js
 * Aggregates customer spend from rani_orders.json into rani_customers.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// Load all data
const ordersRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'rani_orders.json'), 'utf8'));
const orders = Array.isArray(ordersRaw) ? ordersRaw : (ordersRaw.value || ordersRaw.orders || []);

const custRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'rani_customers.json'), 'utf8'));
const customers = Array.isArray(custRaw) ? custRaw : (custRaw.value || []);

console.log(`Orders loaded: ${orders.length}`);
console.log(`Customers loaded: ${customers.length}`);

// Aggregate spend by name + phone from orders
const spendByPhone = {};
const spendByName = {};

for (const o of orders) {
  const name = (o.customer_name || '').trim();
  const phone = String(o.customer_phone || '').replace(/\D/g, '').slice(-10);
  const amount = parseFloat(o.total_amount || o.total || 0);
  
  if (!name || name === 'Walk-in Customer' || phone === '9876543210') continue;
  
  // Index by phone
  if (phone && phone.length >= 8) {
    if (!spendByPhone[phone]) spendByPhone[phone] = { total: 0, count: 0, lastDate: null, name };
    spendByPhone[phone].total += amount;
    spendByPhone[phone].count += 1;
    const d = o.voucher_date || o.created_at || '';
    if (d && (!spendByPhone[phone].lastDate || d > spendByPhone[phone].lastDate)) {
      spendByPhone[phone].lastDate = d.substring(0, 10);
    }
  }
  
  // Also index by name (case-insensitive)
  const nameKey = name.toLowerCase().trim();
  if (!spendByName[nameKey]) spendByName[nameKey] = { total: 0, count: 0, lastDate: null, name, phone };
  spendByName[nameKey].total += amount;
  spendByName[nameKey].count += 1;
  const d2 = o.voucher_date || o.created_at || '';
  if (d2 && (!spendByName[nameKey].lastDate || d2 > spendByName[nameKey].lastDate)) {
    spendByName[nameKey].lastDate = d2.substring(0, 10);
  }
}

console.log(`Unique phones with spend: ${Object.keys(spendByPhone).length}`);
console.log(`Unique names with spend: ${Object.keys(spendByName).length}`);

// Top 5 from name index:
const topNames = Object.entries(spendByName).sort((a,b) => b[1].total - a[1].total).slice(0,5);
console.log('\nTop spenders from orders:');
topNames.forEach(([k, v]) => console.log(`  ${v.name}: ₹${v.total.toFixed(2)} (${v.count} orders)`));

// Enrich customers
let enriched = 0;
let newAdded = 0;

const enrichedCustomers = customers.map(c => {
  const cPhone = String(c.phone || '').replace(/\D/g, '').slice(-10);
  const cName = (c.name || '').toLowerCase().trim();
  
  let data = null;
  if (cPhone && cPhone.length >= 8 && spendByPhone[cPhone]) {
    data = spendByPhone[cPhone];
  } else if (cName && spendByName[cName]) {
    data = spendByName[cName];
  }
  
  if (data && data.total > 0) {
    const prevSpent = parseFloat(c.totalSpent) || 0;
    if (data.total > prevSpent || data.count > (c.frequency || 0)) {
      enriched++;
      return {
        ...c,
        totalSpent: Math.round((data.total + prevSpent) * 100) / 100, // Add existing + new
        frequency: Math.max(data.count, c.frequency || 0),
        lastOrder: data.lastDate || c.lastOrder
      };
    }
  }
  return c;
});

// Also add any new customers found in orders that aren't in the list
const existingPhones = new Set(customers.map(c => String(c.phone || '').replace(/\D/g, '').slice(-10)));
const existingNames = new Set(customers.map(c => (c.name || '').toLowerCase().trim()));

let maxId = Math.max(...customers.map(c => parseInt(c.id) || 0), 0);

for (const [nameKey, data] of Object.entries(spendByName)) {
  const phone = data.phone.replace(/\D/g, '').slice(-10);
  if (!existingPhones.has(phone) && !existingNames.has(nameKey)) {
    maxId++;
    enrichedCustomers.push({
      id: maxId,
      name: data.name,
      phone: phone,
      address: 'Bodinayakanur',
      frequency: data.count,
      totalSpent: Math.round(data.total * 100) / 100,
      lastOrder: data.lastDate
    });
    newAdded++;
    existingPhones.add(phone);
    existingNames.add(nameKey);
  }
}

console.log(`\nEnriched: ${enriched} existing customers`);
console.log(`New customers added: ${newAdded}`);
console.log(`Total customers: ${enrichedCustomers.length}`);

// Sort by totalSpent descending to put top customers first
enrichedCustomers.sort((a,b) => (parseFloat(b.totalSpent)||0) - (parseFloat(a.totalSpent)||0));

// Show top 10
console.log('\nTop 10 customers after enrichment:');
enrichedCustomers.filter(c => (parseFloat(c.totalSpent)||0) > 0).slice(0, 10).forEach((c, i) => {
  console.log(`  ${i+1}. ${c.name}: ₹${(parseFloat(c.totalSpent)||0).toFixed(2)} (${c.frequency || 0} orders)`);
});

// Save
const output = JSON.stringify(enrichedCustomers, null, 2);
fs.writeFileSync(path.join(ROOT, 'rani_customers.json'), output, 'utf8');
console.log('\n✅ Written: rani_customers.json');

// Copy to public
fs.mkdirSync(PUBLIC, { recursive: true });
fs.copyFileSync(path.join(ROOT, 'rani_customers.json'), path.join(PUBLIC, 'rani_customers.json'));
console.log('✅ Synced: public/rani_customers.json');
