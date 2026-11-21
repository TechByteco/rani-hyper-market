const fs = require('fs');
const html = fs.readFileSync('ai-analytics.html', 'utf8');

const fnDef = html.indexOf('function handleFestivalDropdownChange');
console.log('function handleFestivalDropdownChange defined at:', fnDef);
if (fnDef !== -1) {
  console.log(html.substring(fnDef, fnDef + 800));
}
