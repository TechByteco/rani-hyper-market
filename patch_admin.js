const fs = require('fs');
const filePath = 'G:/dell intel core i7 pc data/SKS Market/admin.html';
let content = fs.readFileSync(filePath, 'utf8');

const storeBtn = '<a href="store.html" target="_blank" class="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"><i class="fa-solid fa-arrow-up-right-from-square text-[11px]"></i> View Public Store</a>';

if (!content.includes('View Public Store')) {
  content = content.replace('<div class="flex items-center gap-4">', '<div class="flex items-center gap-4">' + storeBtn);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('admin.html updated with View Public Store link!');
}