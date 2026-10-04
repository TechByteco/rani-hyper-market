/**
 * Rani Hyper Market - Modern Backend Service & Database Bridge
 * Built on the National Hypermarket Architecture
 */
const fs = require('fs');
const path = require('path');

class HypermarketBackend {
  constructor() {
    this.catalogPath = path.join(__dirname, 'products_catalog.json');
    this.doubleSidedPath = path.join(__dirname, 'double_sided_products.json');
    this.sqliteExe = 'C:/SKS Market/sqlite3.exe';
    this.dbPath = 'C:/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db';
    this.initDatabaseSchema();
  }

  initDatabaseSchema() {
    if (process.platform === 'win32' && fs.existsSync(this.sqliteExe) && fs.existsSync(this.dbPath)) {
      try {
        const { execFileSync } = require('child_process');
        const schemaSql = `
          CREATE TABLE IF NOT EXISTS ProductImagesMaster (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            barcode TEXT,
            front_image TEXT,
            back_image TEXT,
            updated_at TEXT,
            UNIQUE(product_id)
          );
        `;
        execFileSync(this.sqliteExe, [this.dbPath, schemaSql]);
      } catch (e) {
        console.warn('SQLite schema init warning:', e.message);
      }
    }
  }

  loadCatalog() {
    try {
      if (fs.existsSync(this.catalogPath)) {
        return JSON.parse(fs.readFileSync(this.catalogPath, 'utf8'));
      }
    } catch (e) {}
    return [];
  }

  loadDoubleSidedEntries() {
    try {
      if (fs.existsSync(this.doubleSidedPath)) {
        return JSON.parse(fs.readFileSync(this.doubleSidedPath, 'utf8'));
      }
    } catch (e) {}
    return [];
  }

  getProducts({ search = '', category = '', page = 1, limit = 50 }) {
    const catalog = this.loadCatalog();
    const dsEntries = this.loadDoubleSidedEntries();
    
    // Create quick lookup for dual-sided products
    const dsMap = new Map();
    dsEntries.forEach(d => {
      if (d.front && d.back) {
        dsMap.set(d.title.toLowerCase().trim(), d);
      }
    });

    let filtered = catalog;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) || 
        (p.barcode && p.barcode.includes(q))
      );
    }

    if (category) {
      const cat = category.toLowerCase();
      filtered = filtered.filter(p => p.category && p.category.toLowerCase().includes(cat));
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit).map(p => {
      let backImg = null;
      const tLower = (p.title || '').toLowerCase();
      for (const [key, val] of dsMap.entries()) {
        if (tLower.includes(key) || key.includes(tLower)) {
          backImg = val.back;
          break;
        }
      }

      return {
        id: p.id,
        title: p.title,
        price: parseFloat(p.price) || 0,
        mrp: parseFloat(p.mrp) || ((parseFloat(p.price) || 0) * 1.25),
        stock: p.stock || 50,
        unit: p.unit || '1 unit',
        category: p.category || 'GROCERY',
        barcode: p.barcode || '',
        front_image: p.image_url || p.image || null,
        back_image: backImg,
        is_double_sided: !!backImg
      };
    });

    return {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit),
      products: items
    };
  }

  getProductById(id) {
    const catalog = this.loadCatalog();
    const prod = catalog.find(p => String(p.id) === String(id));
    if (!prod) return null;
    return prod;
  }
}

module.exports = new HypermarketBackend();
