const initSqlJs = require('sql.js');
const fs = require('fs');

async function testLedgers() {
  const SQL = await initSqlJs();
  const dbPath = 'G:/dell intel core i7 pc data/SKS new fetchable/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db';
  const filebuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(filebuffer);

  // Sample customers
  const sample = db.exec(`
    SELECT Id, Name, PhoneNumber, AddressLine, City, Pincode 
    FROM AccountLedgers 
    WHERE PhoneNumber IS NOT NULL AND PhoneNumber != '' 
    LIMIT 15
  `);
  console.log('Customers with PhoneNumber:');
  sample[0].values.forEach(v => console.log(v));

  // Count customers with phone
  const count = db.exec("SELECT COUNT(*) FROM AccountLedgers WHERE PhoneNumber IS NOT NULL AND PhoneNumber != ''");
  console.log('Total customers with phone:', count[0].values[0][0]);
}

testLedgers().catch(console.error);
