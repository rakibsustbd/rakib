const fs = require('fs');
const html = fs.readFileSync('scripts/flickr_page1.html', 'utf8');

// Page 1 has exactly 25 photos displayed — their IDs appear in the view-signature attrs
const sigMatches = [...html.matchAll(/__id_(\d+)__/g)];
const ids = [...new Set(sigMatches.map(m => m[1]))];
console.log('Photo IDs from view-signatures:', ids.length);
console.log(ids.join('\n'));
