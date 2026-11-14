const initSqlJs = require('sql.js');
const fs = require('fs');

async function processAllLedgers() {
  const SQL = await initSqlJs();
  const dbFiles = [
    './data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
    './data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/92c79395-c73b-4280-90f9-dfa651b3de01_2025-2026.db',
    './data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db',
    './data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db',
    './data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/51cd71bd-6eed-4502-8d0c-ad8a42436fd6_2022-2023.db'
  ];

  const customerMap = {};

  for (const dbPath of dbFiles) {
    if (!fs.existsSync(dbPath)) continue;
    console.log('Reading DB:', dbPath);
    const buf = fs.readFileSync(dbPath);
    const db = new SQL.Database(buf);

    // Read ledgers
    try {
      const ledgers = db.exec(`SELECT Id, Name, PhoneNumber, AddressLine, City FROM AccountLedgers WHERE PhoneNumber IS NOT NULL AND PhoneNumber != ''`);
      if (ledgers.length && ledgers[0].values) {
        for (const row of ledgers[0].values) {
          const [id, name, phone, address, city] = row;
          const key = (phone || name).trim().toLowerCase();
          if (!customerMap[key]) {
            customerMap[key] = {
              id,
              name: (name || '').trim(),
              phone: (phone || '').trim(),
              address: (address || city || 'Bodinayakanur').trim(),
              frequency: 0,
              totalSpent: 0,
              lastOrder: null
            };
          }
        }
      }
    } catch (e) {
      console.error('Ledger err:', e.message);
    }

    // Read transactions
    try {
      const trans = db.exec(`
        SELECT 
          al.Name, 
          al.PhoneNumber, 
          t.VoucherDate, 
          ti.NetAmount 
        FROM Transactions t
        JOIN TransInventories ti ON t.Id = ti.TransId
        JOIN AccountLedgers al ON t.LedgerId = al.Id
        WHERE al.Name NOT LIKE '%Cash%' AND al.Name NOT LIKE '%Counter%' AND al.Name NOT LIKE '%Sales%'
      `);
      if (trans.length && trans[0].values) {
        for (const row of trans[0].values) {
          const [name, phone, vdate, amount] = row;
          const key = (phone || name || '').trim().toLowerCase();
          if (!key) continue;
          if (!customerMap[key]) {
            customerMap[key] = {
              id: Object.keys(customerMap).length + 1,
              name: (name || '').trim(),
              phone: (phone || '').trim(),
              address: 'Bodinayakanur',
              frequency: 0,
              totalSpent: 0,
              lastOrder: null
            };
          }
          customerMap[key].frequency += 1;
          customerMap[key].totalSpent += (parseFloat(amount) || 0);
          if (!customerMap[key].lastOrder || vdate > customerMap[key].lastOrder) {
            customerMap[key].lastOrder = vdate;
          }
        }
      }
    } catch (e) {
      console.error('Trans err:', e.message);
    }
  }

  const list = Object.values(customerMap);
  list.sort((a, b) => b.totalSpent - a.totalSpent);
  console.log('Total customers tracked:', list.length);
  console.log('Top 15 customers across all FYs:');
  console.log(JSON.stringify(list.slice(0, 15), null, 2));

  fs.writeFileSync('rani_customers.json', JSON.stringify(list, null, 2));
  fs.writeFileSync('public/rani_customers.json', JSON.stringify(list, null, 2));
  console.log('Successfully updated rani_customers.json and public/rani_customers.json!');
}

processAllLedgers().catch(console.error);
