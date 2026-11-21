import os

with open('analyticsService.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's locate the exact start and end of getHistoricalFestivalAnalysis and getFestivalCalendarMatrix
start_needle = 'function getHistoricalFestivalAnalysis(targetId) {'
if start_needle not in code:
    print('Error: start_needle not found in analyticsService.js')
    exit(1)

matrix_needle = 'function getFestivalCalendarMatrix() {'
if matrix_needle not in code:
    print('Error: matrix_needle not found in analyticsService.js')
    exit(1)

# Find end of getFestivalCalendarMatrix
# It ends right before module.exports = {
end_needle = 'module.exports = {'
end_idx = code.find(end_needle, code.find(matrix_needle))
if end_idx == -1:
    print('Error: module.exports not found')
    exit(1)

start_idx = code.find(start_needle)

new_code_block = '''function getHistoricalFestivalAnalysis(targetId) {
  const now = Date.now();
  if (_festivalAnalysisCache.size > 0 && (now - _festivalCacheTime < 300000)) {
    if (targetId && _festivalAnalysisCache.has(targetId)) {
      return _festivalAnalysisCache.get(targetId);
    } else if (!targetId || targetId === 'all') {
      return Array.from(_festivalAnalysisCache.values());
    }
  }

  const currentStockSql = "SELECT p.Name as name, pv.Stock as stock, pv.SalesRate as sales_rate, pv.PurchaseRate as purchase_rate, pv.Units as unit FROM ProductVariants pv JOIN Products p ON pv.ProductId = p.Id WHERE p.IsActive = 1;";
  const currentStockRows = queryHistoricalDb(HISTORICAL_DB_PATHS['2026'], currentStockSql);
  const currentStockMap = new Map();
  currentStockRows.forEach(r => {
    if (r.name) {
      currentStockMap.set(r.name.trim().toLowerCase(), {
        stock: parseInt(r.stock, 10) || 0,
        price: parseFloat(r.sales_rate || 0),
        cost: parseFloat(r.purchase_rate || (r.sales_rate ? r.sales_rate * 0.75 : 0)),
        unit: r.unit || 'Unit'
      });
    }
  });

  // Fast path: Return empirical SQLite-mined dataset for all 34 festivals across 5 FYs
  if (MINED_FESTIVAL_EMPIRICAL_DATA) {
    const festKeys = Object.keys(MINED_FESTIVAL_EMPIRICAL_DATA);
    let resolvedKey = null;
    if (targetId && targetId !== 'all') {
      const tid = targetId.toLowerCase().trim().replace(/[\\s\\-_]+/g, '_');
      if (MINED_FESTIVAL_EMPIRICAL_DATA[tid]) {
        resolvedKey = tid;
      } else {
        const synonymMap = {
          'pongal': 'pongal_harvest',
          'mattu_pongal': 'mattu_kanum_pongal',
          'kanum_pongal': 'mattu_kanum_pongal',
          'bhogi': 'bhogi_festival',
          'shivaratri': 'maha_shivaratri',
          'shivarathri': 'maha_shivaratri',
          'poosam': 'thai_poosam',
          'thaipoosam': 'thai_poosam',
          'chithirai': 'chithirai_thiruvizha',
          'puthandu': 'tamil_new_year',
          'tamil_new_year': 'tamil_new_year',
          'easter': 'easter_good_friday',
          'good_friday': 'easter_good_friday',
          'mariamman': 'mariamman_koozh_thiruvizha',
          'koozh': 'mariamman_koozh_thiruvizha',
          'school': 'school_reopening_rush',
          'bakrid': 'bakrid_eid',
          'eid': 'bakrid_eid',
          'aadi': 'aadi_18_perukku',
          'aadi18': 'aadi_18_perukku',
          'perukku': 'aadi_18_perukku',
          'aadi_velli': 'aadi_velli_pooja',
          'varalakshmi': 'varalakshmi_vratham',
          'krishna': 'krishna_jayanthi',
          'gokulashtami': 'krishna_jayanthi',
          'vinayakar': 'vinayakar_chaturthi',
          'ganesh': 'vinayakar_chaturthi',
          'onam': 'onam_sadhya',
          'navaratri': 'navaratri_sundal_days',
          'golu': 'navaratri_sundal_days',
          'sundal': 'navaratri_sundal_days',
          'ayudha': 'ayudha_pooja',
          'saraswathi': 'ayudha_pooja',
          'ayutha': 'ayudha_pooja',
          'deepavali': 'deepavali',
          'diwali': 'deepavali',
          'karthigai': 'karthigai_deepam',
          'deepam': 'karthigai_deepam',
          'margazhi': 'margazhi_temple_month',
          'christmas': 'christmas_newyear',
          'new_year': 'new_year_day',
          'newyear': 'new_year_day',
          'payday': 'payday_cycle',
          'salary': 'payday_cycle'
        };
        for (const [syn, k] of Object.entries(synonymMap)) {
          if (tid.includes(syn) || syn.includes(tid)) {
            resolvedKey = k;
            break;
          }
        }
        if (!resolvedKey) {
          resolvedKey = festKeys.find(k => k.includes(tid) || tid.includes(k)) || 'karthigai_deepam';
        }
      }
    }

    const formatFest = (k) => {
      const d = MINED_FESTIVAL_EMPIRICAL_DATA[k];
      if (!d) return null;
      const meta = d.meta || {};
      const windows = meta.windows || {};
      const masterFest = (ALL_YEAR_FESTIVALS || []).find(f => f.id === k) || {};
      
      const stockList = (d.recommended_stock_needs || []).map(item => {
        const sh = item.sales_history || {};
        const lookup = currentStockMap.get((item.name || '').trim().toLowerCase()) || {};
        const curStock = lookup.stock !== undefined ? lookup.stock : (item.currentStock || 0);
        const recOrder = item.recommended_order_qty || 25;
        const netToOrder = Math.max(0, recOrder - curStock);
        return {
          name: item.name,
          price: item.price || lookup.price || 50,
          cost: item.cost || lookup.cost || 40,
          unit: item.unit || lookup.unit || 'Unit',
          currentStock: curStock,
          qty2022: sh['2022'] || 0,
          qty2023: sh['2023'] || 0,
          qty2024: sh['2024'] || 0,
          qty2025: sh['2025'] || 0,
          qty2026: sh['2026'] || 0,
          avgHistoricalQty: item.avg_historical_qty || 0,
          recommendedOrderQty: recOrder,
          netToOrder,
          estPurchaseBudget: item.est_purchase_budget || Math.round(recOrder * (item.cost || 40)),
          estGrossRevenue: item.est_projected_revenue || Math.round(recOrder * (item.price || 50)),
          estProfit: item.est_profit || Math.round((item.est_projected_revenue || (recOrder * 50)) - (item.est_purchase_budget || (recOrder * 40))),
          priority: item.priority || 'NORMAL'
        };
      });

      const totalBudget = stockList.reduce((acc, c) => acc + (c.estPurchaseBudget || 0), 0);
      const totalRev = stockList.reduce((acc, c) => acc + (c.estGrossRevenue || 0), 0);
      
      const mD26 = masterFest.datesByYear && masterFest.datesByYear['2026'];
      const date2026 = masterFest.date2026 || (typeof mD26 === 'object' ? mD26.date : mD26) || (windows['2026'] ? windows['2026'][1] : '2026-11-24');
      let cutoff2026 = masterFest.cutoff2026 || (typeof mD26 === 'object' ? mD26.cutoff : null);
      if (!cutoff2026 && date2026 && date2026.startsWith('2026-')) {
        const dObj = new Date(date2026);
        dObj.setDate(dObj.getDate() - 7);
        cutoff2026 = dObj.toISOString().slice(0, 10);
      }

      const dByYearOut = {};
      ['2022', '2023', '2024', '2025', '2026', '2027', '2028'].forEach(yr => {
        const mYr = masterFest.datesByYear && masterFest.datesByYear[yr];
        if (mYr) {
          dByYearOut[yr] = typeof mYr === 'object' ? mYr.date : mYr;
        } else if (windows[yr]) {
          dByYearOut[yr] = windows[yr][1] || windows[yr][0];
        } else {
          dByYearOut[yr] = '-';
        }
      });

      return {
        festivalId: k,
        name: masterFest.name || meta.name || k,
        tamilName: masterFest.tamilName || meta.tamil || '',
        fullName: masterFest.fullName || meta.name || k,
        tier: masterFest.tier || meta.tier || 'Peak',
        calendarRule: masterFest.calendarRule || meta.rule || '',
        category: masterFest.category || meta.category || '',
        date2026,
        cutoff2026,
        datesByYear: dByYearOut,
        surgeExpected: masterFest.surgePercent || (meta.tier && meta.tier.includes('+') ? '+' + meta.tier.split('+')[1].split(')')[0] : '+95%'),
        tag: masterFest.tag || meta.tier || 'Festival Surge',
        yearlyMetrics: d.yearly_metrics || {},
        topProducts: d.all_time_top_products || [],
        totalProductsAnalyzed: stockList.length,
        totalRecommendedBudget: totalBudget,
        totalProjectedRevenue: totalRev,
        estProfit: totalRev - totalBudget,
        stockNeedList: stockList
      };
    };

    if (resolvedKey) {
      return formatFest(resolvedKey);
    }
    if (!targetId || targetId === 'all') {
      const list = festKeys.map(k => formatFest(k)).filter(Boolean);
      return list.sort((a, b) => {
        const da = a.date2026 || '9999';
        const db = b.date2026 || '9999';
        return da.localeCompare(db);
      });
    }
  }

  // Fallback if MINED_FESTIVAL_EMPIRICAL_DATA is null
  const allAnalyses = [];
  const festivalsToProcess = (targetId && targetId !== 'all')
    ? FESTIVAL_CALENDAR_CONFIG.filter(f => f.id === targetId || f.name.toLowerCase().includes(targetId.toLowerCase()))
    : FESTIVAL_CALENDAR_CONFIG;

  festivalsToProcess.forEach(fest => {
    const dByYear = fest.datesByYear || {};
    const finalStockList = Array.isArray(fest.stockNeedList) ? fest.stockNeedList : [];
    const totalRecommendedBudget = finalStockList.reduce((acc, c) => acc + (c.estPurchaseBudget || 0), 0);
    const totalProjectedRevenue = finalStockList.reduce((acc, c) => acc + (c.estGrossRevenue || (c.recommendedOrderQty * c.price) || 0), 0);

    const mD26 = dByYear['2026'];
    const date2026 = fest.date2026 || (typeof mD26 === 'object' ? mD26.date : mD26) || '2026-11-24';
    const cutoff2026 = fest.cutoff2026 || (typeof mD26 === 'object' ? mD26.cutoff : null) || '2026-11-18';

    const dByYearOut = {};
    ['2022', '2023', '2024', '2025', '2026', '2027', '2028'].forEach(yr => {
      const mYr = dByYear[yr];
      dByYearOut[yr] = mYr ? (typeof mYr === 'object' ? mYr.date : mYr) : '-';
    });

    const analysis = {
      festivalId: fest.id,
      name: fest.name,
      tamilName: fest.tamilName || '',
      fullName: fest.fullName,
      month: fest.month,
      monthName: fest.monthName,
      quarter: fest.quarter,
      calendarRule: fest.calendarRule,
      date2026,
      cutoff2026,
      datesByYear: dByYearOut,
      surgeExpected: fest.surgePercent || '+95%',
      tag: fest.tag || 'Festival Surge',
      totalProductsAnalyzed: finalStockList.length,
      totalRecommendedBudget,
      totalProjectedRevenue,
      estProfit: totalProjectedRevenue - totalRecommendedBudget,
      stockNeedList: finalStockList
    };

    _festivalAnalysisCache.set(fest.id, analysis);
    allAnalyses.push(analysis);
  });

  _festivalCacheTime = now;

  if (targetId && _festivalAnalysisCache.has(targetId)) {
    return _festivalAnalysisCache.get(targetId);
  }
  return allAnalyses;
}

function getFestivalCalendarMatrix() {
  return FESTIVAL_CALENDAR_CONFIG.map(f => ({
    id: f.id,
    name: f.name,
    tamilName: f.tamilName || '',
    fullName: f.fullName,
    month: f.month,
    monthName: f.monthName,
    quarter: f.quarter,
    calendarRule: f.calendarRule,
    tag: f.tag,
    tier: f.tier || 'Standard',
    surgeExpected: f.surgePercent || f.surgeExpected,
    dates: {
      '2022': f.datesByYear?.['2022']?.date || (typeof f.datesByYear?.['2022'] === 'string' ? f.datesByYear['2022'] : '-'),
      '2023': f.datesByYear?.['2023']?.date || (typeof f.datesByYear?.['2023'] === 'string' ? f.datesByYear['2023'] : '-'),
      '2024': f.datesByYear?.['2024']?.date || (typeof f.datesByYear?.['2024'] === 'string' ? f.datesByYear['2024'] : '-'),
      '2025': f.datesByYear?.['2025']?.date || (typeof f.datesByYear?.['2025'] === 'string' ? f.datesByYear['2025'] : '-'),
      '2026': f.datesByYear?.['2026']?.date || f.date2026 || (typeof f.datesByYear?.['2026'] === 'string' ? f.datesByYear['2026'] : '-'),
      '2027': f.datesByYear?.['2027']?.date || (typeof f.datesByYear?.['2027'] === 'string' ? f.datesByYear['2027'] : '-'),
      '2028': f.datesByYear?.['2028']?.date || (typeof f.datesByYear?.['2028'] === 'string' ? f.datesByYear['2028'] : '-')
    },
    date2026: f.date2026 || f.datesByYear?.['2026']?.date || '-',
    cutoff2026: f.cutoff2026 || f.datesByYear?.['2026']?.cutoff || '-'
  }));
}

'''

patched_code = code[:start_idx] + new_code_block + code[end_idx:]

with open('analyticsService.js', 'w', encoding='utf-8') as f:
    f.write(patched_code)

print(f"Successfully patched analyticsService.js! ({len(patched_code)} bytes)")
