import re

print("=== INJECTING AGENT 3 & AGENT 4 SUITE INTO ai-analytics.html ===")

agent3_4_html = """
    <!-- ========================================================================= -->
    <!-- AGENT 3: OMNI-CHANNEL DISPATCHER & AGENT 4: CONTINUOUS RL OPTIMIZER SUITE -->
    <!-- ========================================================================= -->
    <div id="agent3-4-orchestrator-section" class="bg-gray-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
      <div class="absolute -top-16 -right-16 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header & Status Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Agent 3: Omni-Channel Dispatcher
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
              Agent 4: Continuous RL Optimizer
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Thompson Sampling Active
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              7,179 SKUs Feed Synced
            </span>
          </div>
          <h2 class="text-xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>📡 Real-Time Multi-Channel Dispatch &amp; Reinforcement Learning Loop</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1 max-w-3xl">
            Executes autonomous promotional dispatches via <b>Meta WhatsApp Cloud API</b>, updates <b>Google Merchant XML feed (7,179 SKUs)</b>, and broadcasts live to <b>Counter Signage Screens via MQTT</b> (<code>topic: store/display/promo</code>). <b>Agent 4</b> continuously optimizes discount depth (-2% to +5%) and delivery hour (07:30 AM vs 05:30 PM) via <b>Thompson Sampling Multi-Armed Bandit</b>.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <button onclick="triggerAutonomousOrchestrationLoop()" id="btn-run-loop" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-xs font-black text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-2">
            <i data-lucide="play" class="w-4 h-4 fill-white"></i>
            <span>Execute RL Closed Loop</span>
          </button>
          <a href="/google-merchant-feed.xml" target="_blank" class="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 border border-gray-700 transition flex items-center gap-1.5">
            <i data-lucide="rss" class="w-4 h-4 text-amber-400"></i>
            <span>Merchant XML</span>
          </a>
        </div>
      </div>

      <!-- Telemetry Strip: 3 Rolling Windows (24h, 48h, 7d) -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <i data-lucide="activity" class="w-3.5 h-3.5 text-indigo-400"></i>
            Live Retail Telemetry (24-Hour, 48-Hour &amp; 7-Day Rolling Windows)
          </span>
          <span class="text-[10px] text-gray-500 font-mono">Synced from POS Bills &amp; WhatsApp Clicks</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Window 1: 24 Hours -->
          <div class="bg-gray-950/70 border border-indigo-500/20 rounded-xl p-4 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase text-indigo-300">24-Hour Velocity Window</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 font-mono">Immediate</span>
            </div>
            <div class="mt-2 flex items-baseline justify-between">
              <div>
                <span class="text-2xl font-black text-white" id="tel-cr-24h">17.4%</span>
                <span class="text-xs text-gray-400 ml-1">CR (148 Bills)</span>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-emerald-400 block" id="tel-lift-24h">+₹17,400 Lift</span>
                <span class="text-[10px] text-gray-500" id="tel-profit-24h">Profit: ₹5,220</span>
              </div>
            </div>
            <div class="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div class="bg-indigo-500 h-full rounded-full" style="width: 74%"></div>
            </div>
          </div>

          <!-- Window 2: 48 Hours -->
          <div class="bg-gray-950/70 border border-purple-500/20 rounded-xl p-4 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase text-purple-300">48-Hour Weekend Surge</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 font-mono">Short-Term</span>
            </div>
            <div class="mt-2 flex items-baseline justify-between">
              <div>
                <span class="text-2xl font-black text-white" id="tel-cr-48h">16.4%</span>
                <span class="text-xs text-gray-400 ml-1">CR (298 Bills)</span>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-emerald-400 block" id="tel-lift-48h">+₹33,600 Lift</span>
                <span class="text-[10px] text-gray-500" id="tel-profit-48h">Profit: ₹9,880</span>
              </div>
            </div>
            <div class="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div class="bg-purple-500 h-full rounded-full" style="width: 68%"></div>
            </div>
          </div>

          <!-- Window 3: 7 Days -->
          <div class="bg-gray-950/70 border border-emerald-500/20 rounded-xl p-4 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase text-emerald-300">7-Day Full Cycle</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">Macro Lift</span>
            </div>
            <div class="mt-2 flex items-baseline justify-between">
              <div>
                <span class="text-2xl font-black text-white" id="tel-cr-7d">16.2%</span>
                <span class="text-xs text-gray-400 ml-1">CR (874 Bills)</span>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-emerald-400 block" id="tel-lift-7d">+₹92,500 Lift</span>
                <span class="text-[10px] text-gray-500" id="tel-profit-7d">Profit: ₹26,400</span>
              </div>
            </div>
            <div class="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 82%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Agent 4: Multi-Armed Bandit Thompson Sampling Matrix (8 Arms) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <i data-lucide="cpu" class="w-3.5 h-3.5 text-pink-400"></i>
            Agent 4: Multi-Armed Bandit Matrix (Thompson Sampling Posteriors Beta(α, β))
          </span>
          <button onclick="stepBanditOptimization()" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-bold text-pink-300 border border-pink-500/30 transition flex items-center gap-1">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i>
            <span>Sample Bandit Round</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs" id="bandit-arms-grid">
          <!-- Populated dynamically via loadBanditState() -->
          <div class="p-4 bg-gray-950/60 rounded-xl text-center text-gray-500">Loading Thompson Sampling arms...</div>
        </div>
      </div>

      <!-- Agent 3: Omni-Channel Dispatch Execution Console -->
      <div class="bg-gray-950/80 p-4 rounded-xl border border-gray-800 space-y-4">
        <div class="flex items-center justify-between border-b border-gray-800 pb-3">
          <span class="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <i data-lucide="radio" class="w-4 h-4 text-emerald-400"></i>
            Agent 3: Omni-Channel Active Dispatches (3 Concurrent Pipelines)
          </span>
          <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
            All 3 Channels Synced
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <!-- Channel 1: WhatsApp Cloud API -->
          <div class="bg-gray-900/90 p-3.5 rounded-xl border border-gray-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400 flex items-center gap-1.5">
                <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp Cloud API
              </span>
              <span class="text-[10px] font-mono text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">v19.0 Graph</span>
            </div>
            <p class="text-[11px] text-gray-400">Batch template delivery with exponential backoff &amp; DLT tracking.</p>
            <div class="text-[11px] font-mono text-gray-300 pt-1 border-t border-gray-800 flex justify-between">
              <span>Status: <b class="text-emerald-400">Active</b></span>
              <span>Retries: <b>3 Max / Jitter</b></span>
            </div>
          </div>

          <!-- Channel 2: Google Merchant XML Feed -->
          <div class="bg-gray-900/90 p-3.5 rounded-xl border border-gray-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-400 flex items-center gap-1.5">
                <i class="fa-brands fa-google text-sm"></i> Google Merchant Feed
              </span>
              <span class="text-[10px] font-mono text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">7,179 SKUs</span>
            </div>
            <p class="text-[11px] text-gray-400">Auto-injects active promo sale price &amp; campaign tags in RSS 2.0 XML.</p>
            <div class="text-[11px] font-mono text-gray-300 pt-1 border-t border-gray-800 flex justify-between">
              <span>Sync: <b class="text-emerald-400">100% Up to Date</b></span>
              <a href="/google-merchant-feed.xml" target="_blank" class="text-indigo-400 hover:underline">View XML ↗</a>
            </div>
          </div>

          <!-- Channel 3: Local MQTT Counter Signage -->
          <div class="bg-gray-900/90 p-3.5 rounded-xl border border-gray-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sky-400 flex items-center gap-1.5">
                <i class="fa-solid fa-tv text-sm"></i> In-Store Counter Displays
              </span>
              <span class="text-[10px] font-mono text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">MQTT / SSE</span>
            </div>
            <p class="text-[11px] text-gray-400">Publishes promo banner to <code>store/display/promo</code> across POS screens.</p>
            <div class="text-[11px] font-mono text-gray-300 pt-1 border-t border-gray-800 flex justify-between">
              <span>Topic: <b>store/display/promo</b></span>
              <span class="text-sky-300 font-bold">POS 1 &amp; 2 Active</span>
            </div>
          </div>
        </div>

        <!-- Latest Execution Log Output Box -->
        <div id="orchestration-log-box" class="p-3 bg-black/60 rounded-xl border border-gray-800 font-mono text-[11px] text-gray-300 space-y-1">
          <div class="text-gray-500 font-bold flex items-center justify-between">
            <span>[ORCHESTRATOR TELEMETRY STREAM]</span>
            <span class="text-emerald-400">● Real-time Loop Ready</span>
          </div>
          <div id="orchestration-log-content" class="text-gray-400">
            System ready. Agent 4 stands by to sample optimal discount depth and delivery hour. Click 'Execute RL Closed Loop' to trigger multi-agent pipeline.
          </div>
        </div>
      </div>

    </div>
"""

with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<!-- LOCAL FESTIVAL DEMAND FORECASTER & EVENT PULSE -->'
if target in content and 'id="agent3-4-orchestrator-section"' not in content:
    content = content.replace(target, agent3_4_html + '\n\n    ' + target)
    print("Injected Agent 3 & 4 HTML into ai-analytics.html")
else:
    print("Target not found or already injected.")

# JavaScript controller for Agent 3 & 4
agent3_4_js = """
    /* ══════════════════════════════════════════════════════════════════
       AGENT 3 & AGENT 4: ORCHESTRATION & RL BANDIT CONTROLLER
       ══════════════════════════════════════════════════════════════════ */
    let rlBanditData = null;

    async function loadBanditState() {
      try {
        const res = await fetch('/api/rl/bandit-status').then(r => r.json()).catch(() => null);
        if (!res || !res.success) return;
        rlBanditData = res;

        // Render Telemetry
        const tw = res.telemetry_windows || {};
        if (tw.window_24h) {
          if (document.getElementById('tel-cr-24h')) document.getElementById('tel-cr-24h').innerText = tw.window_24h.conversion_rate_pct + '%';
          if (document.getElementById('tel-lift-24h')) document.getElementById('tel-lift-24h').innerText = '+₹' + tw.window_24h.revenue_lift_inr.toLocaleString('en-IN') + ' Lift';
          if (document.getElementById('tel-profit-24h')) document.getElementById('tel-profit-24h').innerText = 'Profit: ₹' + tw.window_24h.gross_profit_contribution_inr.toLocaleString('en-IN');
        }
        if (tw.window_48h) {
          if (document.getElementById('tel-cr-48h')) document.getElementById('tel-cr-48h').innerText = tw.window_48h.conversion_rate_pct + '%';
          if (document.getElementById('tel-lift-48h')) document.getElementById('tel-lift-48h').innerText = '+₹' + tw.window_48h.revenue_lift_inr.toLocaleString('en-IN') + ' Lift';
          if (document.getElementById('tel-profit-48h')) document.getElementById('tel-profit-48h').innerText = 'Profit: ₹' + tw.window_48h.gross_profit_contribution_inr.toLocaleString('en-IN');
        }
        if (tw.window_7d) {
          if (document.getElementById('tel-cr-7d')) document.getElementById('tel-cr-7d').innerText = tw.window_7d.conversion_rate_pct + '%';
          if (document.getElementById('tel-lift-7d')) document.getElementById('tel-lift-7d').innerText = '+₹' + tw.window_7d.revenue_lift_inr.toLocaleString('en-IN') + ' Lift';
          if (document.getElementById('tel-profit-7d')) document.getElementById('tel-profit-7d').innerText = 'Profit: ₹' + tw.window_7d.gross_profit_contribution_inr.toLocaleString('en-IN');
        }

        renderBanditArmsGrid(res.bandit_arms || [], res.current_best_arm);
      } catch (err) {
        console.warn('RL Bandit loader notice:', err);
      }
    }

    function renderBanditArmsGrid(arms, bestArm) {
      const grid = document.getElementById('bandit-arms-grid');
      if (!grid) return;

      const bestId = bestArm?.arm_id || 'ARM_D3_T1';

      grid.innerHTML = arms.map(a => {
        const isBest = a.arm_id === bestId;
        return `
          <div class="p-3 rounded-xl border ${isBest ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/20' : 'bg-gray-950/60 border-gray-800'} space-y-1.5 transition">
            <div class="flex items-center justify-between">
              <span class="font-black ${isBest ? 'text-indigo-300' : 'text-gray-300'} text-[11px]">${a.arm_id}</span>
              ${isBest ? '<span class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-500 text-white animate-pulse">BEST ARM</span>' : `<span class="text-[10px] text-gray-500">${a.win_probability_pct}% Win</span>`}
            </div>
            <div class="text-[10px] text-gray-400 font-sans truncate">${a.target_cohort}</div>
            <div class="flex items-baseline justify-between pt-1 border-t border-gray-800/80">
              <span class="text-xs font-black text-white">${a.discount_delta_pct >= 0 ? '+' : ''}${a.discount_delta_pct}% @ ${a.delivery_hour}</span>
              <span class="text-[10px] font-bold text-emerald-400">${a.conversion_rate_pct}% CR</span>
            </div>
            <div class="flex items-center justify-between text-[9px] text-gray-500">
              <span>Beta(${a.alpha}, ${a.beta})</span>
              <span class="text-amber-400 font-bold">Profit: ₹${(a.profit_contribution_inr/1000).toFixed(1)}k</span>
            </div>
          </div>
        `;
      }).join('');
    }

    async function stepBanditOptimization() {
      try {
        const res = await fetch('/api/rl/optimize-step').then(r => r.json());
        if (res && res.success) {
          const arm = res.selected_arm;
          showToast(`🎯 Thompson Sampling Step: Selected Arm ${arm.arm_id} (${arm.discount_delta_pct >= 0 ? '+' : ''}${arm.discount_delta_pct}% @ ${arm.delivery_hour})!`);
          loadBanditState();
        }
      } catch (err) {
        showToast('Error stepping bandit optimization');
      }
    }

    async function triggerAutonomousOrchestrationLoop() {
      const btn = document.getElementById('btn-run-loop');
      const logBox = document.getElementById('orchestration-log-content');
      if (btn) {
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Executing Loop...';
        btn.disabled = true;
      }

      if (logBox) {
        logBox.innerHTML = '<span class="text-indigo-400">⚡ [LOOP INITIALIZED]</span> Agent 4 sampling Thompson Sampling Beta posteriors...';
      }

      try {
        const payload = {
          productName: document.getElementById('c-product-name')?.value || 'முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ பை)',
          mrp: Number(document.getElementById('c-mrp')?.value || 1450),
          discountPct: 10,
          marginPct: Number(document.getElementById('c-margin')?.value || 14.5),
          stockUnits: Number(document.getElementById('c-stock')?.value || 85),
          festivalContext: document.getElementById('c-festival')?.value || 'கார்த்திகை தீபம் 2026 சிறப்பு ஆஃபர்'
        };

        const res = await fetch('/api/rl/orchestrate-loop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());

        if (res && res.success) {
          const b = res.bandit_optimization;
          const ch = res.channel_dispatches;
          if (logBox) {
            logBox.innerHTML = `
              <div class="text-emerald-400 font-bold">✓ [ORCHESTRATION LOOP COMPLETE]</div>
              <div>• <b>Agent 4:</b> Selected Arm <b>${b.selected_arm_id}</b> (${b.applied_discount_delta} discount adjustment -> <b>${b.effective_discount_pct}% OFF</b>, Delivery at <b>${b.scheduled_delivery_hour}</b>)</div>
              <div>• <b>Agent 2:</b> Synthesized 3 vernacular formats (SMS ${res.campaign_copy.sms_tamil.length} chars, WhatsApp, Instagram)</div>
              <div>• <b>Agent 3 Channel 1:</b> Meta WhatsApp Cloud batch dispatches (${ch.whatsapp_cloud.total_recipients} recipients, status: ${ch.whatsapp_cloud.results[0]?.status})</div>
              <div>• <b>Agent 3 Channel 2:</b> Google Merchant XML Feed updated with <b>${ch.google_merchant_feed.total_skus_rendered} SKUs</b></div>
              <div>• <b>Agent 3 Channel 3:</b> MQTT Counter Signage broadcasted to <code>store/display/promo</code> (POS 1 &amp; POS 2)</div>
            `;
          }
          showToast(`🚀 Multi-Agent Loop Executed! Dispatched via WhatsApp, Google Merchant & MQTT!`);
          loadBanditState();
        } else {
          if (logBox) logBox.innerHTML = '<span class="text-red-400">Error executing loop: ' + (res?.error || 'Unknown error') + '</span>';
        }
      } catch (err) {
        if (logBox) logBox.innerHTML = '<span class="text-red-400">Network error: ' + err.message + '</span>';
      } finally {
        if (btn) {
          btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-white"></i> Execute RL Closed Loop';
          btn.disabled = false;
        }
        if (window.lucide) lucide.createIcons();
      }
    }
"""

# Append controller to main <script> in ai-analytics.html
target_script_end = "win.document.close(); win.focus(); setTimeout(() => win.print(), 350);\n    }\n"
if "function loadBanditState" not in content:
    content = content.replace(target_script_end, target_script_end + agent3_4_js + "\n")
    print("Injected Agent 3 & 4 JS Controller into ai-analytics.html")
else:
    print("Agent 3 & 4 JS Controller already present")

# Call loadBanditState() on DOMContentLoaded
dom_target = "if (typeof generateAgent2Copy === 'function') generateAgent2Copy();"
dom_replacement = "if (typeof generateAgent2Copy === 'function') generateAgent2Copy();\n      if (typeof loadBanditState === 'function') loadBanditState();"
if "loadBanditState();" not in content and dom_target in content:
    content = content.replace(dom_target, dom_replacement)
    print("Injected loadBanditState() into DOMContentLoaded")

with open('ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open('public/ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved ai-analytics.html and public/ai-analytics.html")
