const initSqlJs = require('sql.js');
const fs = require('fs');

async function checkMaster() {
  const SQL = await initSqlJs();
  const filebuffer = fs.readFileSync('G:/dell intel core i7 pc data/SKS new fetchable/SKS Market/Data/database/master.db');
  const db = new SQL.Database(filebuffer);
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0].values.map(v => v[0]);
  console.log('Master Tables:', tables);
  for (let t of tables) {
    if (t.startsWith('sqlite_')) continue;
    const res = db.exec(`SELECT * FROM [${t}]`);
    if (res.length) {
      console.log(`\n--- Table: ${t} (${res[0].values.length} rows) ---`);
      console.log('Cols:', res[0].columns);
      console.log('Rows:', JSON.stringify(res[0].values, null, 2));
    } else {
      console.log(`\n--- Table: ${t} (0 rows) ---`);
    }
  }
}
checkMaster();
