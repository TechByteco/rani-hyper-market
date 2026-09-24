const initSqlJs = require('sql.js');
const fs = require('fs');

async function testProducts() {
  const SQL = await initSqlJs();
  const dbPath = 'G:/dell intel core i7 pc data/SKS new fetchable/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db';
  const filebuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(filebuffer);

  const query = `
    SELECT 
      p.Id as id,
      p.Name as title,
      pv.Mrp as mrp,
      pv.SalesRate as price,
      pv.PurchaseRate as cost,
      pv.Stock as stock,
      pv.Code as barcode,
      pv.Units as unit
    FROM Products p
    JOIN ProductVarients pv ON p.Id = pv.ProductId
    WHERE p.IsActive = 1 AND pv.SalesRate > 0
    LIMIT 20
  `;
  const res = db.exec(query);
  console.log('Columns:', res[0].columns);
  console.log('Sample rows:');
  res[0].values.forEach(v => console.log(v));

  // Count active products with SalesRate > 0
  const countRes = db.exec(`
    SELECT COUNT(*) 
    FROM Products p
    JOIN ProductVarients pv ON p.Id = pv.ProductId
    WHERE p.IsActive = 1 AND pv.SalesRate > 0
  `);
  console.log('Total active sellable products:', countRes[0].values[0][0]);
}

testProducts().catch(console.error);
