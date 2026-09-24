const initSqlJs = require('sql.js');
const fs = require('fs');

async function checkTenant() {
  const SQL = await initSqlJs();
  const dbPath = 'G:/dell intel core i7 pc data/SKS new fetchable/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db';
  const filebuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(filebuffer);
  
  // Inspect Products
  const pSample = db.exec('SELECT * FROM Products LIMIT 5');
  console.log('Products Cols:', pSample[0].columns);
  console.log('Products Sample:', JSON.stringify(pSample[0].values, null, 2));

  // Inspect ProductVarients
  const pvSample = db.exec('SELECT * FROM ProductVarients LIMIT 5');
  console.log('ProductVarients Cols:', pvSample[0].columns);
  console.log('ProductVarients Sample:', JSON.stringify(pvSample[0].values, null, 2));

  // Inspect Transactions / Sales
  const tSample = db.exec('SELECT * FROM Transactions ORDER BY Id DESC LIMIT 5');
  console.log('Transactions Cols:', tSample[0].columns);
  console.log('Transactions Sample:', JSON.stringify(tSample[0].values, null, 2));

  // Total sales calculation
  const totalSalesRes = db.exec('SELECT COUNT(*), SUM(TotalAmount), SUM(NetProfit) FROM Transactions WHERE TransactionType = 1');
  console.log('Sales Transactions Summary:', JSON.stringify(totalSalesRes[0].values));
  
  // What TransactionTypes exist?
  const tTypes = db.exec('SELECT TransactionType, COUNT(*), SUM(TotalAmount) FROM Transactions GROUP BY TransactionType');
  console.log('Transaction Types Breakdown:', JSON.stringify(tTypes[0].values));
}

checkTenant().catch(console.error);
