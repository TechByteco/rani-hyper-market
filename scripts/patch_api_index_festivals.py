import os

with open('api/index.js', 'r', encoding='utf-8') as f:
    code = f.read()

s_needle = "if (reqPath === '/api/ai/festival-stock-needs' || reqPath === '/api/ai/historical-festival-sales') {"
e_needle = "if (reqPath === '/api/ai/festival-calendar-matrix') {"

s_idx = code.find(s_needle)
e_idx = code.find(e_needle)

if s_idx == -1 or e_idx == -1:
    print(f"Error: needles not found. s_idx={s_idx}, e_idx={e_idx}")
    exit(1)

new_fest_block = '''if (reqPath === '/api/ai/festival-stock-needs' || reqPath === '/api/ai/historical-festival-sales') {
      const festivalId = queryParams.get('festivalId') || queryParams.get('id') || null;
      if (analyticsService && typeof analyticsService.getHistoricalFestivalAnalysis === 'function') {
        try { return sendJson(200, analyticsService.getHistoricalFestivalAnalysis(festivalId)); } catch {}
      }
      
      const allMaster = (festivalMaster && festivalMaster.ALL_YEAR_FESTIVALS) ? festivalMaster.ALL_YEAR_FESTIVALS : [];
      
      if (minedFestivalData) {
        const festKeys = Object.keys(minedFestivalData);
        let festKey = null;
        if (festivalId && festivalId !== 'all') {
          const tid = festivalId.toLowerCase().trim().replace(/[\\s\\-_]+/g, '_');
          if (minedFestivalData[tid]) {
            festKey = tid;
          } else {
            const synonymMap = {
              'pongal': 'pongal_harvest', 'mattu_pongal': 'mattu_kanum_pongal', 'kanum_pongal': 'mattu_kanum_pongal',
              'bhogi': 'bhogi_festival', 'shivaratri': 'maha_shivaratri', 'poosam': 'thai_poosam',
              'chithirai': 'chithirai_thiruvizha', 'puthandu': 'tamil_new_year', 'tamil_new_year': 'tamil_new_year',
              'easter': 'easter_good_friday', 'mariamman': 'mariamman_koozh_thiruvizha', 'school': 'school_reopening_rush',
              'bakrid': 'bakrid_eid', 'aadi': 'aadi_18_perukku', 'perukku': 'aadi_18_perukku', 'aadi_velli': 'aadi_velli_pooja',
              'varalakshmi': 'varalakshmi_vratham', 'krishna': 'krishna_jayanthi', 'vinayakar': 'vinayakar_chaturthi',
              'ganesh': 'vinayakar_chaturthi', 'onam': 'onam_sadhya', 'navaratri': 'navaratri_sundal_days',
              'ayudha': 'ayudha_pooja', 'deepavali': 'deepavali', 'diwali': 'deepavali', 'karthigai': 'karthigai_deepam',
              'deepam': 'karthigai_deepam', 'margazhi': 'margazhi_temple_month', 'christmas': 'christmas_newyear',
              'new_year': 'new_year_day', 'payday': 'payday_cycle'
            };
            for (const [syn, k] of Object.entries(synonymMap)) {
              if (tid.includes(syn) || syn.includes(tid)) {
                festKey = k;
                break;
              }
            }
            if (!festKey) {
              festKey = festKeys.find(k => k.includes(tid) || tid.includes(k)) || 'karthigai_deepam';
            }
          }
        }

        const formatFestItem = (k) => {
          const d = minedFestivalData[k];
          if (!d) return null;
          const meta = d.meta || {};
          const windows = meta.windows || {};
          const masterFest = allMaster.find(f => f.id === k) || {};
          
          const stockList = (d.recommended_stock_needs || []).map(item => {
            const sh = item.sales_history || {};
            const recOrder = item.recommended_order_qty || 25;
            return {
              name: item.name,
              price: item.price || 50,
              cost: item.cost || 40,
              unit: item.unit || 'Unit',
              currentStock: item.currentStock || 0,
              qty2022: sh['2022'] || 0,
              qty2023: sh['2023'] || 0,
              qty2024: sh['2024'] || 0,
              qty2025: sh['2025'] || 0,
              qty2026: sh['2026'] || 0,
              avgHistoricalQty: item.avg_historical_qty || 0,
              recommendedOrderQty: recOrder,
              netToOrder: Math.max(0, recOrder - (item.currentStock || 0)),
              estPurchaseBudget: item.est_purchase_budget || Math.round(recOrder * 40),
              estGrossRevenue: item.est_projected_revenue || Math.round(recOrder * 50),
              estProfit: item.est_profit || Math.round(recOrder * 10),
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

        if (festKey) {
          return sendJson(200, formatFestItem(festKey));
        }
        if (!festivalId || festivalId === 'all') {
          const list = festKeys.map(k => formatFestItem(k)).filter(Boolean);
          list.sort((a, b) => (a.date2026 || '9999').localeCompare(b.date2026 || '9999'));
          return sendJson(200, list);
        }
      }

      return sendJson(200, { festivalId: festivalId || 'deepavali', stockNeedList: [] });
    }

    '''

patched = code[:s_idx] + new_fest_block + code[e_idx:]
with open('api/index.js', 'w', encoding='utf-8') as f:
    f.write(patched)

print(f"Successfully patched api/index.js! ({len(patched)} bytes)")
