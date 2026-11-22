/**
 * Rani Hypermarket - Dead-Stock Capital Recovery & Dynamic Bundling Service
 * Role: Inventory Optimization & Financial Recovery Specialist
 * Location: Main Road, Bodinayakanur, Theni District, Tamil Nadu
 * 
 * Mathematical Formulation:
 *   Capital Locked = Unsold Stock Units * Landed Cost
 *   Liquidation Discount = Min(MarginAboveLandedCost, HoldingCostPerMonth * MonthsStagnant)
 *   Bundle Price = FastMover_Price + (DeadStock_LandedCost * 1.02)
 *   Bundle Gross Profit = Bundle Price - (FastMover_LandedCost + DeadStock_LandedCost) > 0
 *   Capital Recovery = DeadStock_LandedCost * 1.02 (102.0% >= 98% Recovery)
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const CANDIDATE_JSON_PATHS = [
  path.join(__dirname, '..', 'data', 'dead_stock_bundles.json'),
  path.join(__dirname, '..', 'public', 'dead_stock_bundles.json'),
  path.join(__dirname, '..', 'api', 'data', 'dead_stock_bundles.json'),
  path.join(__dirname, '..', 'dead_stock_bundles.json'),
  path.join(process.cwd(), 'data', 'dead_stock_bundles.json'),
  path.join(process.cwd(), 'dead_stock_bundles.json')
];

/**
 * Load latest dead-stock bundles from file queue
 */
function loadDeadStockData() {
  for (const jsonPath of CANDIDATE_JSON_PATHS) {
    try {
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.portfolio_recovery_metrics && parsed.bundles) {
          return { data: parsed, sourcePath: jsonPath };
        }
      }
    } catch (e) {
      // Continue to next path
    }
  }

  return {
    data: {
      metadata: {
        algorithm: 'Dead-Stock Capital Recovery & Dynamic Bundling Engine',
        version: '1.0.0',
        total_catalog_skus_scanned: 0,
        dead_stock_skus_identified: 0,
        bundles_generated: 0
      },
      portfolio_recovery_metrics: {
        total_dead_capital_locked: 0,
        total_capital_recovered: 0,
        overall_capital_recovery_pct: 0,
        total_bundle_gross_profit: 0
      },
      bundles: []
    },
    sourcePath: null
  };
}

/**
 * Get comprehensive Dead Stock & Capital Recovery Portfolio Summary
 */
function getDeadStockPortfolio() {
  const { data, sourcePath } = loadDeadStockData();
  return {
    success: true,
    metadata: {
      ...data.metadata,
      source_file: sourcePath ? path.basename(sourcePath) : 'default'
    },
    metrics: data.portfolio_recovery_metrics || {},
    bundles_count: data.bundles ? data.bundles.length : 0,
    top_bundles: (data.bundles || []).slice(0, 10)
  };
}

/**
 * Get filtered and paginated bundles
 */
function getBundles(options = {}) {
  const { data } = loadDeadStockData();
  let list = data.bundles || [];

  const {
    search,
    category,
    minDiscount,
    minLocked,
    page = 1,
    limit = 20,
    sortBy = 'capital_locked_desc'
  } = options;

  if (category && category !== 'ALL') {
    list = list.filter(b => 
      (b.stagnant_sku && b.stagnant_sku.category === category) ||
      (b.anchor_sku && b.anchor_sku.category === category)
    );
  }

  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(b =>
      (b.bundle_title && b.bundle_title.toLowerCase().includes(q)) ||
      (b.stagnant_sku && b.stagnant_sku.name.toLowerCase().includes(q)) ||
      (b.anchor_sku && b.anchor_sku.name.toLowerCase().includes(q))
    );
  }

  if (minDiscount !== undefined) {
    list = list.filter(b => b.financials.customer_discount_pct >= Number(minDiscount));
  }
  if (minLocked !== undefined) {
    list = list.filter(b => b.stagnant_sku.capital_locked >= Number(minLocked));
  }

  // Sorting
  if (sortBy === 'discount_desc') {
    list.sort((a, b) => b.financials.customer_discount_pct - a.financials.customer_discount_pct);
  } else if (sortBy === 'profit_desc') {
    list.sort((a, b) => b.financials.bundle_gross_profit - a.financials.bundle_gross_profit);
  } else if (sortBy === 'price_asc') {
    list.sort((a, b) => a.financials.bundle_price - b.financials.bundle_price);
  } else {
    // Default: Highest capital locked
    list.sort((a, b) => b.stagnant_sku.capital_locked - a.stagnant_sku.capital_locked);
  }

  const total = list.length;
  const p = Math.max(1, Number(page));
  const l = Math.max(1, Number(limit));
  const offset = (p - 1) * l;
  const paginated = list.slice(offset, offset + l);

  return {
    success: true,
    total,
    page: p,
    limit: l,
    total_pages: Math.ceil(total / l),
    bundles: paginated
  };
}

/**
 * Trigger daily scan and re-bundling
 */
function triggerInventoryScan() {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, '..', 'scripts', 'generate_dead_stock_recovery.py');
    const cmd = `python "${scriptPath}"`;

    exec(cmd, { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
      if (err) {
        console.error('Dead-Stock Scan Warning:', stderr || err.message);
        return resolve({
          success: true,
          scanned: false,
          note: 'Using cached high-precision dead-stock state.',
          portfolio: getDeadStockPortfolio()
        });
      }

      console.log('Dead-Stock Capital Recovery Algorithm executed successfully.');
      resolve({
        success: true,
        scanned: true,
        scanned_at: new Date().toISOString(),
        portfolio: getDeadStockPortfolio()
      });
    });
  });
}

/**
 * Initialize 24-hour daily inventory scanning daemon
 */
function initDailyInventoryScanScheduler() {
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  setInterval(async () => {
    try {
      console.log('[AUTONOMOUS DEAD-STOCK SCANNER] Running scheduled 24-hour inventory recovery scan...');
      await triggerInventoryScan();
    } catch (e) {
      console.warn('[AUTONOMOUS DEAD-STOCK SCANNER] Notice:', e.message);
    }
  }, TWENTY_FOUR_HOURS_MS);

  console.log('[AUTONOMOUS DEAD-STOCK SCANNER] Daily dead-stock capital recovery daemon initialized.');
}

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'test') {
  initDailyInventoryScanScheduler();
}

module.exports = {
  loadDeadStockData,
  getDeadStockPortfolio,
  getBundles,
  triggerInventoryScan,
  initDailyInventoryScanScheduler
};
