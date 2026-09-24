const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function inspectDb(dbPath) {
  console.log('\n========================================');
  console.log('Inspecting:', dbPath);
  console.log('========================================');
  try {
    const SQL = await initSqlJs();
    const filebuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(filebuffer);
    
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    if (!tables.length) {
      console.log('No tables found.');
      return;
    }
    const names = tables[0].values.map(v => v[0]);
    console.log('Tables found:', names.length);
    for (let name of names) {
      if (name.startsWith('sqlite_')) continue;
      try {
        const countRes = db.exec(`SELECT COUNT(*) FROM [${name}]`);
        const count = countRes[0] ? countRes[0].values[0][0] : 0;
        console.log(`  Table: ${name} (${count} rows)`);
        
        // Print sample of user / store / company / product / bill tables
        const lower = name.toLowerCase();
        if (lower.includes('user') || lower.includes('admin') || lower.includes('store') || lower.includes('comp') || lower.includes('tenant') || lower.includes('setting')) {
          const sample = db.exec(`SELECT * FROM [${name}] LIMIT 5`);
          if (sample.length) {
            console.log('    Columns:', sample[0].columns);
            console.log('    Sample data:', JSON.stringify(sample[0].values));
          }
        }
      } catch (e) {
        console.log(`  Error querying ${name}:`, e.message);
      }
    }
  } catch (err) {
    console.error('Failed to inspect DB:', err.message);
  }
}

async function main() {
  const baseDir = 'G:/dell intel core i7 pc data/SKS new fetchable/SKS Market/Data/database';
  await inspectDb(path.join(baseDir, 'master.db'));
  
  const tenantDir = path.join(baseDir, '37a64e83-514d-4b00-b90a-9af172dacdd6');
  if (fs.existsSync(tenantDir)) {
    const files = fs.readdirSync(tenantDir).filter(f => f.endsWith('.db'));
    for (let f of files) {
      await inspectDb(path.join(tenantDir, f));
    }
  }
}

main();
