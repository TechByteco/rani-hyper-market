const fs = require('fs');
const path = require('path');

const filePath = 'C:\\SKS_Market_Projects\\SKS Market\\product-images.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Smart Search input and Google Image search helper button to Tab 3
const oldTabLink = `      <!-- TAB 3 CONTENT: ONLINE IMAGE URL LINK -->
      <div id="tab-content-link" class="space-y-3 hidden">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">
            Online Product Packshot Image URL
          </label>
          <div class="flex items-center gap-2">
            <input
              type="url"
              id="input-online-url"
              placeholder="https://example.com/product-packshot.jpg"
              class="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
            <button type="button" onclick="previewOnlineUrl()" class="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 transition">
              <i class="fa-solid fa-eye"></i> Preview
            </button>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">
            Paste any direct image link from IndiaMART, OpenFoodFacts, manufacturer site, or Google.
          </p>
        </div>
      </div>`;

const newTabLink = `      <!-- TAB 3 CONTENT: ONLINE IMAGE URL LINK & SEARCH HELPER -->
      <div id="tab-content-link" class="space-y-3 hidden">
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div class="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
            <i class="fa-solid fa-wand-magic-sparkles text-emerald-600"></i> Automatic Web Search Query
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input
              type="text"
              id="input-search-query"
              class="flex-1 px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-gray-800"
              placeholder="Search query (e.g. 40G Sensodyne Fresh Gel in jpg format)"
            >
            <button
              type="button"
              onclick="openGoogleImageSearch()"
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Search Web
            </button>
          </div>
          <p class="text-[10px] text-emerald-700 mt-1.5 font-medium">
            Click <b>Search Web</b> to find the first JPG packshot on Google Images, then right-click <i>"Copy Image Address"</i> and paste below.
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">
            Direct Product Packshot Image URL (.jpg / .png)
          </label>
          <div class="flex items-center gap-2">
            <input
              type="url"
              id="input-online-url"
              placeholder="https://example.com/product-packshot.jpg"
              class="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
            <button type="button" onclick="previewOnlineUrl()" class="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 transition">
              <i class="fa-solid fa-eye"></i> Preview
            </button>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">
            Paste any direct image link from Apollo Pharmacy, OpenFoodFacts, IndiaMART, or Google Images.
          </p>
        </div>
      </div>`;

if (content.includes(oldTabLink)) {
  content = content.replace(oldTabLink, newTabLink);
}

// 2. Add openGoogleImageSearch and populate query logic
const oldOpenStudio = "document.getElementById('image-studio-modal').classList.remove('hidden');";
const newOpenStudio = `document.getElementById('image-studio-modal').classList.remove('hidden');
      
      // Auto-populate online JPG search query
      const searchBox = document.getElementById('input-search-query');
      if (searchBox && p) {
        searchBox.value = p.title + ' in jpg format';
      }`;

if (!content.includes('Auto-populate online JPG search query')) {
  content = content.replace(oldOpenStudio, newOpenStudio);
}

const jsFunctions = `
    function openGoogleImageSearch() {
      const q = document.getElementById('input-search-query')?.value?.trim() || (activeProductForModal ? activeProductForModal.title + ' in jpg format' : '');
      if (!q) return;
      const url = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q);
      window.open(url, '_blank');
    }
`;

if (!content.includes('function openGoogleImageSearch')) {
  content = content.replace('function previewOnlineUrl() {', jsFunctions + '\n    function previewOnlineUrl() {');
}

fs.writeFileSync(filePath, content, 'utf8');

// Copy to public and pre_model if needed
const pubFile = 'C:\\SKS_Market_Projects\\SKS Market\\public\\product-images.html';
if (fs.existsSync(pubFile)) fs.writeFileSync(pubFile, content, 'utf8');

console.log('Successfully updated product-images.html with Internet Search Packshot automation!');
