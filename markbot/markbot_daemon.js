/**
 * MarkBot Autonomous Daemon
 * Sustains continuous 5-hour autonomous supervision, market analytics synthesis,
 * self-healing, and iterative software/marketing improvements.
 */

const fs = require('fs');
const path = require('path');
const MarkbotSupervisor = require('./markbot_supervisor');
const MarkbotIntelligence = require('./markbot_intelligence');

const ROOT_DIR = path.resolve(__dirname, '..');
const STATE_FILE = path.join(__dirname, 'markbot_state.json');
const LOG_FILE = path.join(__dirname, 'markbot_audit_log.json');

const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
const CYCLE_INTERVAL_MS = 10 * 60 * 1000; // Run full cycle every 10 minutes

class MarkbotDaemon {
  constructor() {
    this.supervisor = new MarkbotSupervisor();
    this.intelligence = new MarkbotIntelligence();
    this.loadState();
  }

  loadState() {
    if (fs.existsSync(STATE_FILE)) {
      try {
        this.state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      } catch {
        this.initState();
      }
    } else {
      this.initState();
    }
  }

  initState() {
    const now = Date.now();
    this.state = {
      daemonName: 'MarkBot Super-Intelligence',
      version: '1.0.0',
      status: 'RUNNING',
      startedAt: new Date(now).toISOString(),
      startTimestamp: now,
      targetEndTimestamp: now + FIVE_HOURS_MS,
      targetDurationHours: 5,
      totalCyclesCompleted: 0,
      lastCycleAt: null,
      supervisorStatus: null,
      marketIntelligenceSummary: null,
      auditHistory: []
    };
    this.saveState();
  }

  saveState() {
    try {
      fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2), 'utf8');
    } catch (e) {
      console.error('[MarkBot] Failed to write state:', e.message);
    }
  }

  logEvent(action, details) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      details
    };
    this.state.auditHistory.unshift(entry);
    if (this.state.auditHistory.length > 50) {
      this.state.auditHistory.pop();
    }
    this.saveState();

    try {
      let logs = [];
      if (fs.existsSync(LOG_FILE)) {
        logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8') || '[]');
      }
      logs.unshift(entry);
      fs.writeFileSync(LOG_FILE, JSON.stringify(logs.slice(0, 100), null, 2), 'utf8');
    } catch {}

    console.log(`[MarkBot][${entry.timestamp}] ${action}: ${JSON.stringify(details)}`);
  }

  // Execute a complete autonomous supervision & improvement cycle
  async executeCycle() {
    const now = Date.now();
    const remainingMs = Math.max(0, this.state.targetEndTimestamp - now);
    const remainingMin = Math.round(remainingMs / 60000);

    console.log(`\n=== [MarkBot] EXECUTING CYCLE #${this.state.totalCyclesCompleted + 1} (${remainingMin} mins remaining in 5-hour window) ===`);

    // 1. Run full project supervision & self-healing
    const supervisorReport = this.supervisor.runFullDiagnostic();
    this.state.supervisorStatus = supervisorReport;
    this.logEvent('SUPERVISOR_AUDIT', {
      healthy: supervisorReport.healthy,
      issuesFound: supervisorReport.issuesFound,
      autoRepairsDone: supervisorReport.autoRepairsDone
    });

    // 2. Refresh market analytics and seasonal predictions
    const marketReport = this.intelligence.generateFullMarketReport();
    this.state.marketIntelligenceSummary = {
      activeSeasonalCampaigns: marketReport.seasonalInsights.map(s => s.name),
      curatedBundlesCount: marketReport.curatedBundles.length,
      averageFamilyYearlySavings: marketReport.benchmarkSavings.estimatedYearlySavings
    };
    this.logEvent('MARKET_INTELLIGENCE_REFRESH', {
      bundles: marketReport.curatedBundles.length,
      activeSeason: marketReport.seasonalInsights.find(s => s.status === 'ACTIVE_NOW')?.name
    });

    // 3. Update marketing assets & file sync
    try {
      const srcMarketing = path.join(ROOT_DIR, 'marketing.html');
      const pubMarketing = path.join(ROOT_DIR, 'public', 'marketing.html');
      const preMarketing = path.join(ROOT_DIR, 'pre_model', 'marketing.html');
      if (fs.existsSync(srcMarketing)) {
        fs.copyFileSync(srcMarketing, pubMarketing);
        fs.copyFileSync(srcMarketing, preMarketing);
        this.logEvent('MARKETING_SYNC', { status: 'Synchronized across root, public, and pre_model' });
      }
    } catch (e) {
      this.logEvent('MARKETING_SYNC_ERROR', { error: e.message });
    }

    // 4. Update cycle metrics
    this.state.totalCyclesCompleted++;
    this.state.lastCycleAt = new Date().toISOString();
    this.saveState();

    return {
      cycle: this.state.totalCyclesCompleted,
      healthy: supervisorReport.healthy,
      remainingMinutes: remainingMin
    };
  }

  // Start continuous 5-hour daemon loop
  async start() {
    console.log('[MarkBot] Starting 5-hour autonomous mission...');
    await this.executeCycle();

    this.timer = setInterval(async () => {
      const now = Date.now();
      if (now >= this.state.targetEndTimestamp) {
        console.log('[MarkBot] 5-hour endurance window completed successfully.');
        this.state.status = 'COMPLETED_5_HOURS';
        this.saveState();
        clearInterval(this.timer);
        return;
      }

      await this.executeCycle();
    }, CYCLE_INTERVAL_MS);
  }
}

if (require.main === module) {
  const daemon = new MarkbotDaemon();
  daemon.start();
}

module.exports = MarkbotDaemon;
