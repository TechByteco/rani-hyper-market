const initSqlJs = require('sql.js');
const fs = require('fs');

async function testSalesOrders() {
  const SQL = await initSqlJs();
  const dbPath = 'G:/dell intel core i7 pc data/SKS new fetchable/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db';
  const filebuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(filebuffer);

  // Join Transactions with TransInventories and AccountLedgers
  const sales = db.exec(`
    SELECT 
      t.Id,
      t.VoucherNo,
      t.VoucherDate,
      t.CreatedOn,
      ti.NetAmount,
      ti.SubTotal,
      ti.Profit,
      al.Name as CustomerName,
      al.PhoneNumber as CustomerPhone
    FROM Transactions t
    JOIN TransInventories ti ON t.Id = ti.TransId
    LEFT JOIN AccountLedgers al ON t.LedgerId = al.Id
    ORDER BY t.Id DESC
    LIMIT 10
  `);
  console.log('Sample Sales Orders:');
  sales[0].values.forEach(v => console.log(v));

  // Get line items for latest transaction
  const latestId = sales[0].values[0][0];
  const items = db.exec(`
    SELECT 
      tp.VarientId,
      p.Name as ProductName,
      tp.Quantity,
      tp.Price,
      tp.Mrp,
      tp.Amount,
      tp.Profit
    FROM TransProducts tp
    LEFT JOIN ProductVarients pv ON tp.VarientId = pv.Id
    LEFT JOIN Products p ON pv.ProductId = p.Id
    WHERE tp.TransId = ${latestId}
  `);
  console.log(`\nItems for Transaction ${latestId}:`);
  if (items.length) {
    items[0].values.forEach(v => console.log(v));
  }
}

testSalesOrders().catch(console.error);
