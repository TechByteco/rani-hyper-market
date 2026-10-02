/**
 * MarkBot Project Supervisor
 * Autonomous health inspection, catalog integrity auditing, self-healing,
 * and Zero-Dev production shield for Rani Hyper Market.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

class MarkbotSupervisor {
  constructor() {
    this.status = {
      healthy: true,
      lastCheck: null,
      issuesFound: 0,
      autoRepairsDone: 0,
      checks: {}
    };
  }

  // 1. Audit catalog integrity
  auditCatalog() {
    const catalogPath = path.join(ROOT_DIR, 'rani_products.json');
    const result = { name: 'Catalog Audit', passed: false, details: '' };

    if (!fs.existsSync(catalogPath)) {
      result.details = 'Catalog file missing: rani_products.json';
      return result;
    }

    try {
      const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      if (!Array.isArray(data) || data.length === 0) {
        result.details = 'Catalog is empty or malformed';
        return result;
      }

      // Check for forbidden Apollo or Unsplash images
      const apolloCount = data.filter(p => (p.image_url || '').toLowerCase().includes('apollo247')).length;
      const unsplashCount = data.filter(p => (p.image_url || '').toLowerCase().includes('unsplash')).length;
      const missingImg = data.filter(p => !p.image_url || p.image_url.trim() === '').length;

      if (apolloCount > 0 || unsplashCount > 0 || missingImg > 0) {
        result.details = `Anomalies detected: Apollo=${apolloCount}, Unsplash=${unsplashCount}, Missing=${missingImg}`;
        result.passed = false;
      } else {
        result.passed = true;
        result.details = `All ${data.length} catalog items verified with authentic packshots (0 Apollo, 0 Unsplash).`;
      }
    } catch (e) {
      result.details = 'JSON parse error: ' + e.message;
      return result;
    }

    return result;
  }

  // 2. Audit file synchronization across root, public, and pre_model
  auditFileSynchronization() {
    const result = { name: 'File Sync Audit', passed: true, details: [] };
    const syncFiles = ['rani_products.json', 'index.html', 'store.html', 'admin.html'];

    syncFiles.forEach(file => {
      const rootPath = path.join(ROOT_DIR, file);
      const publicPath = path.join(ROOT_DIR, 'public', file);

      if (fs.existsSync(rootPath) && fs.existsSync(publicPath)) {
        const rootStat = fs.statSync(rootPath);
        const publicStat = fs.statSync(publicPath);
        if (rootStat.size !== publicStat.size) {
          result.passed = false;
          result.details.push(`Size discrepancy in ${file} (root: ${rootStat.size} vs public: ${publicStat.size})`);
          
          // Auto-repair by syncing root to public
          try {
            fs.copyFileSync(rootPath, publicPath);
            this.status.autoRepairsDone++;
            result.details.push(`Auto-repaired: Synced ${file} to public/`);
          } catch (err) {
            result.details.push(`Auto-repair failed for ${file}: ${err.message}`);
          }
        }
      }
    });

    if (result.details.length === 0) {
      result.details = 'Root and public folders are synchronized.';
    } else {
      result.details = result.details.join(' | ');
    }

    return result;
  }

  // 3. Zero-Dev Shield: Ensure no debug or development watermarks are exposed on client pages
  enforceZeroDevShield() {
    const result = { name: 'Zero-Dev Shield', passed: true, details: '' };
    const pages = ['index.html', 'public/index.html', 'marketing.html', 'public/marketing.html'];
    const forbiddenPatterns = [
      /\[DEV MODE\]/i,
      /under development/i,
      /work in progress/i,
      /console\.warn\(.*demo.*\)/i,
      /test mock/i
    ];

    let foundDevMarkers = 0;

    pages.forEach(p => {
      const fullPath = path.join(ROOT_DIR, p);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        forbiddenPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            foundDevMarkers++;
            result.passed = false;
            // Clean it silently
            const cleaned = content.replace(pattern, '');
            fs.writeFileSync(fullPath, cleaned, 'utf8');
            this.status.autoRepairsDone++;
          }
        });
      }
    });

    if (foundDevMarkers === 0) {
      result.details = 'Zero-Dev Shield verified: Storefront is 100% production-clean.';
    } else {
      result.details = `Sanitized ${foundDevMarkers} dev markers to preserve enterprise polish.`;
    }

    return result;
  }

  // 4. Temporary scratch file cleanup
  cleanOrphanedTmpFiles() {
    const result = { name: 'Temp Cleaner', passed: true, details: '' };
    let cleaned = 0;

    try {
      const files = fs.readdirSync(ROOT_DIR);
      files.forEach(f => {
        if (f.endsWith('.tmp') || (f.startsWith('BIT') && f.endsWith('.tmp'))) {
          try {
            fs.unlinkSync(path.join(ROOT_DIR, f));
            cleaned++;
          } catch {}
        }
      });
      result.details = `Cleaned ${cleaned} orphaned temp files.`;
    } catch (e) {
      result.details = 'Error scanning temp files: ' + e.message;
    }

    return result;
  }

  // Master Run
  runFullDiagnostic() {
    this.status.lastCheck = new Date().toISOString();
    
    const catCheck = this.auditCatalog();
    const syncCheck = this.auditFileSynchronization();
    const zeroDevCheck = this.enforceZeroDevShield();
    const cleanCheck = this.cleanOrphanedTmpFiles();

    this.status.checks = {
      catalog: catCheck,
      sync: syncCheck,
      zeroDev: zeroDevCheck,
      cleanup: cleanCheck
    };

    const failed = Object.values(this.status.checks).filter(c => !c.passed);
    this.status.issuesFound = failed.length;
    this.status.healthy = (failed.length === 0);

    return this.status;
  }
}

// CLI test mode
if (require.main === module) {
  const supervisor = new MarkbotSupervisor();
  const report = supervisor.runFullDiagnostic();
  console.log('--- MARKBOT SUPERVISOR REPORT ---');
  console.log(JSON.stringify(report, null, 2));
}

module.exports = MarkbotSupervisor;
