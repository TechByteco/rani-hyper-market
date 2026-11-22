/**
 * Standalone Batch CLI for Google Merchant Center Feed Generation
 * Rani Hyper Market, Bodinayakanur & Theni District
 */

const { googleMerchantSyncService } = require('./services/googleMerchantSyncService');

console.log('--- Starting Google Merchant Center Bilingual Feed Generation ---');
const t0 = Date.now();
const result = googleMerchantSyncService.generateXmlFeed();
const elapsed = Date.now() - t0;

console.log(`Successfully generated Google Merchant Feed in ${elapsed}ms:`);
console.log(`- Total SKUs: ${result.meta.totalProducts}`);
console.log(`- GTIN Coverage: ${result.meta.gtinCoverageCount} (${result.meta.gtinCoveragePercent})`);
console.log(`- File Size: ${result.meta.sizeFormatted} (${result.meta.byteSize} bytes)`);
console.log(`- Schedule: ${result.meta.schedule}`);
console.log(`- Output Files: google-merchant-feed.xml & public/google-merchant-feed.xml`);
