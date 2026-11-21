const fs = require('fs');
const path = require('path');

const newSelect = `<select id="gemini-model-select" class="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-xs">
            <option value="gemini-2.5-flash" selected>Google Gemini 2.5 Flash (Recommended &bull; Latest Flagship Flash)</option>
            <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Next-Gen High Speed &bull; Fast &amp; Reliable)</option>
            <option value="gemini-2.0-flash-lite">Google Gemini 2.0 Flash-Lite (Ultra-Low Latency &bull; Instant Voice)</option>
            <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Standard Legacy Flash)</option>
            <option value="gemini-1.5-flash-8b">Google Gemini 1.5 Flash 8B (High Throughput)</option>
            <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep Strategic Reasoning)</option>
            <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Legacy Pro Reasoning)</option>
          </select>`;

['ai-analytics.html', path.join('public', 'ai-analytics.html')].forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  let s = fs.readFileSync(fullPath, 'utf8');
  const regex = /<select id="gemini-model-select"[\s\S]*?<\/select>/;
  if (!regex.test(s)) {
    console.error('Target select not found in', relPath);
    return;
  }
  s = s.replace(regex, newSelect);
  fs.writeFileSync(fullPath, s, 'utf8');
  console.log('Successfully updated gemini-model-select in', relPath);
});
