const initSqlJs = require('sql.js');
const fs = require('fs');

async function checkDetails() {
  const SQL = await initSqlJs();
  const dbPath = 'G:/dell intel core i7 pc data/SKS new fetchable/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db';
  const filebuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(filebuffer);

  // VouType counts in Transactions
  const vouTypes = db.exec('SELECT VouType, COUNT(*), SUM(Amount) FROM Transactions GROUP BY VouType');
  console.log('VouTypes in Transactions:', JSON.stringify(vouTypes[0].values, null, 2));

  // Sample TransInventories
  const ti = db.exec('SELECT TransId, BillNo, NetAmount, SubTotal, Profit FROM TransInventories ORDER BY TransId DESC LIMIT 5');
  console.log('TransInventories sample:', JSON.stringify(ti[0].values, null, 2));

  // Transactions joined with TransInventories for sales
  const salesSummary = db.exec(`
    SELECT 
      COUNT(*) as total_bills,
      SUM(ti.NetAmount) as total_sales,
      SUM(ti.Profit) as total_profit
    FROM Transactions t
    JOIN TransInventories ti ON t.Id = ti.TransId
    WHERE t.IsActive = 1
  `);
  console.log('Overall Sales Summary in 2026-2027:', JSON.stringify(salesSummary[0].values, null, 2));

  // Date range of transactions in 2026-2027 db
  const dateRange = db.exec('SELECT MIN(VoucherDate), MAX(VoucherDate), COUNT(*) FROM Transactions');
  console.log('Date range:', JSON.stringify(dateRange[0].values));

  // Product counts
  const prodCount = db.exec('SELECT COUNT(*) FROM Products WHERE IsActive = 1');
  console.log('Active Products Count:', prodCount[0].values[0][0]);
}

checkDetails().catch(console.error);
