const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function exportAllData() {
  console.log('--- Starting Rani Hyper Market Data Extraction ---');
  const SQL = await initSqlJs();
  const dbDir = 'C:/SKS Market/Data/database';
  const tenantUuid = '37a64e83-514d-4b00-b90a-9af172dacdd6';
  const masterPath = path.join(dbDir, 'master.db');
  const activeDbPath = path.join(dbDir, tenantUuid, '9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db');

  const zipPath = 'G:/dell intel core i7 pc data/SKS new fetchable/Full Backup RANI HYPER MARKET on 12-Sep-2026.zip';
  let zipStats = null;
  if (fs.existsSync(zipPath)) {
    const s = fs.statSync(zipPath);
    zipStats = {
      name: 'Full Backup RANI HYPER MARKET on 12-Sep-2026.zip',
      sizeBytes: s.size,
      sizeMb: (s.size / (1024 * 1024)).toFixed(2) + ' MB',
      modified: s.mtime.toISOString(),
      path: zipPath
    };
  }

  // 1. Master DB extraction
  const masterBuf = fs.readFileSync(masterPath);
  const mDb = new SQL.Database(masterBuf);
  const entityRes = mDb.exec("SELECT * FROM Entities WHERE Id = 1")[0];
  const eCols = entityRes.columns;
  const eRow = entityRes.values[0];
  const entity = {};
  eCols.forEach((c, idx) => entity[c] = eRow[idx]);

  const profile = {
    tenant_id: tenantUuid,
    username: 'rani',
    store_name: entity.Name || 'RANI HYPER MARKET',
    tagline: 'Fresh Farm Groceries & Everyday Supermarket',
    announcement: 'ðŸŽ‰ Welcome to RANI HYPER MARKET! Delivery Free!! Best wholesale & retail rates.',
    address: (entity.AddressLine || '93, Sundara pandian street, Anwar complex, Near Kottai Karuppasamy Kovil, Bodinayakanur').replace(/\n/g, ', '),
    phone: entity.PhoneNumber || '77088 34547, 88073 34547',
    email: entity.Email || 'rani.hypermarket@gmail.com',
    tax_number: entity.TaxNumber || '33BAGPN1341C1ZC',
    hours: 'Mon - Sun: 7:00 AM - 10:00 PM',
    about: 'Welcome to RANI HYPER MARKET! Located at Anwar Complex, Sundara Pandian Street, Bodinayakanur. We offer complete grocery, dairy, and household essentials at the best rates with free delivery.',
    hero_img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
    backup_info: zipStats,
    source_database: '9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
    financial_year: '2026-2027'
  };

  fs.writeFileSync('rani_store_profile.json', JSON.stringify(profile, null, 2));
  console.log('Saved rani_store_profile.json');

  // 2. Active DB Extraction
  const dbBuf = fs.readFileSync(activeDbPath);
  const db = new SQL.Database(dbBuf);

  // 2a. Products
  console.log('Extracting Products...');
  const prodQuery = `
    SELECT 
      p.Id as id,
      p.Name as title,
      pv.Mrp as mrp,
      pv.SalesRate as price,
      pv.PurchaseRate as cost,
      pv.Stock as stock,
      pv.Code as barcode,
      pv.Units as unit,
      pv.Id as variant_id
    FROM Products p
    JOIN ProductVarients pv ON p.Id = pv.ProductId
    WHERE p.IsActive = 1 AND pv.SalesRate > 0
    ORDER BY p.Id ASC
  `;
  const pRes = db.exec(prodQuery)[0];
  const products = [];
  const pCols = pRes.columns;
  for (let r of pRes.values) {
    const item = {};
    pCols.forEach((c, i) => item[c] = r[i]);
    // clean title
    item.title = item.title ? item.title.trim() : 'Product';
    item.price = parseFloat(item.price || 0);
    item.mrp = parseFloat(item.mrp || (item.price * 1.25));
    item.cost = parseFloat(item.cost || (item.price * 0.7));
    item.stock = parseInt(item.stock) || 50;
    item.unit = item.unit || '1 unit';
    item.image_url = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200';
    products.push(item);
  }
  console.log(`Extracted ${products.length} products.`);
  fs.writeFileSync('rani_products.json', JSON.stringify(products));
  console.log('Saved rani_products.json');

  // 2b. Customers from AccountLedgers
  console.log('Extracting Customers...');
  const custQuery = `
    SELECT 
      Id, Name, PhoneNumber, AddressLine, City, Pincode
    FROM AccountLedgers
    WHERE PhoneNumber IS NOT NULL AND PhoneNumber != ''
  `;
  const cRes = db.exec(custQuery)[0];
  const customers = [];
  if (cRes) {
    for (let r of cRes.values) {
      customers.push({
        id: r[0],
        name: (r[1] || 'Customer').trim(),
        phone: (r[2] || '').trim(),
        address: [r[3], r[4], r[5]].filter(Boolean).join(', ') || 'Bodinayakanur',
        frequency: 0,
        totalSpent: 0,
        lastOrder: null
      });
    }
  }
  console.log(`Extracted ${customers.length} customers.`);

  // 2c. Transactions / Orders
  console.log('Extracting Transactions...');
  const txQuery = `
    SELECT 
      t.Id as trans_id,
      t.VoucherNo as voucher_no,
      t.VoucherDate as voucher_date,
      t.CreatedOn as created_on,
      ti.NetAmount as net_amount,
      ti.SubTotal as sub_total,
      ti.Profit as profit,
      al.Name as customer_name,
      al.PhoneNumber as customer_phone,
      al.AddressLine as customer_address,
      t.IsActive
    FROM Transactions t
    JOIN TransInventories ti ON t.Id = ti.TransId
    LEFT JOIN AccountLedgers al ON t.LedgerId = al.Id
    WHERE t.IsActive = 1
    ORDER BY t.Id DESC
  `;
  const txRes = db.exec(txQuery)[0];
  const orders = [];
  const dayWiseStats = {};
  const monthWiseStats = {};

  let totalSales = 0;
  let totalProfit = 0;
  let totalCost = 0;

  if (txRes) {
    const cols = txRes.columns;
    for (let r of txRes.values) {
      const o = {};
      cols.forEach((c, idx) => o[c] = r[idx]);

      const netAmt = parseFloat(o.net_amount || 0);
      const profit = parseFloat(o.profit || 0);
      const cost = Math.max(0, netAmt - profit);

      totalSales += netAmt;
      totalProfit += profit;
      totalCost += cost;

      const dateStr = o.voucher_date; // YYYY-MM-DD
      const createdIso = o.created_on ? o.created_on.replace(' ', 'T') + 'Z' : (dateStr + 'T12:00:00Z');

      // Day group
      if (!dayWiseStats[dateStr]) {
        dayWiseStats[dateStr] = { date: dateStr, count: 0, sales: 0, cost: 0, profit: 0 };
      }
      dayWiseStats[dateStr].count += 1;
      dayWiseStats[dateStr].sales += netAmt;
      dayWiseStats[dateStr].cost += cost;
      dayWiseStats[dateStr].profit += profit;

      // Month group
      const mStr = dateStr.slice(0, 7); // YYYY-MM
      if (!monthWiseStats[mStr]) {
        monthWiseStats[mStr] = { month: mStr, count: 0, sales: 0, cost: 0, profit: 0 };
      }
      monthWiseStats[mStr].count += 1;
      monthWiseStats[mStr].sales += netAmt;
      monthWiseStats[mStr].cost += cost;
      monthWiseStats[mStr].profit += profit;

      const cName = o.customer_name && o.customer_name !== 'Cash Party' ? o.customer_name.trim() : 'Walk-in Customer';
      const cPhone = o.customer_phone || '9876543210';
      const cAddr = o.customer_address || 'Bodinayakanur Town';

      orders.push({
        id: 'RANI-' + o.voucher_no,
        db_id: o.trans_id,
        voucher_no: o.voucher_no,
        voucher_date: o.voucher_date,
        created_at: createdIso,
        status: 'delivered',
        payment_method: 'Cash / Counter POS',
        total_amount: netAmt,
        cost: cost,
        profit: profit,
        customer_name: cName,
        customer_phone: cPhone,
        shipping_address: `${cName} | Ph: ${cPhone} | ${cAddr}`,
        product_summary: `POS Retail Bill #${o.voucher_no}`
      });
    }
  }

  console.log(`Extracted ${orders.length} orders.`);
  console.log(`Total Sales: â‚¹${totalSales.toFixed(2)}, Total Profit: â‚¹${totalProfit.toFixed(2)}`);

  // Update customer order frequencies
  const custPhoneMap = {};
  customers.forEach(c => custPhoneMap[c.phone] = c);

  orders.forEach(o => {
    if (o.customer_phone && custPhoneMap[o.customer_phone]) {
      const c = custPhoneMap[o.customer_phone];
      c.frequency += 1;
      c.totalSpent += o.total_amount;
      if (!c.lastOrder || new Date(o.created_at) > new Date(c.lastOrder)) {
        c.lastOrder = o.created_at;
      }
    }
  });

  // Sample top 500 recent orders for quick dashboard loading + complete stats
  const recentOrders = orders.slice(0, 500);

  fs.writeFileSync('rani_orders.json', JSON.stringify(recentOrders));
  fs.writeFileSync('rani_customers.json', JSON.stringify(customers));

  const analytics = {
    totalOrders: orders.length,
    totalSales: totalSales,
    totalCost: totalCost,
    totalProfit: totalProfit,
    dayWise: dayWiseStats,
    monthWise: monthWiseStats
  };
  fs.writeFileSync('rani_analytics.json', JSON.stringify(analytics, null, 2));

  console.log('Saved rani_orders.json, rani_customers.json, rani_analytics.json');
  console.log('--- Data Extraction Completed Successfully! ---');
}

exportAllData().catch(console.error);

