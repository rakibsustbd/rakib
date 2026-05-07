const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.flickr.com/',
};

async function main() {
  const { data: html } = await axios.get('https://www.flickr.com/photos/rakiiiiiiib/page1', { headers: HEADERS });
  
  // Save the full HTML for inspection
  fs.writeFileSync('scripts/flickr_page1.html', html);
  console.log('Saved HTML to scripts/flickr_page1.html');
  console.log('HTML length:', html.length);
  
  // Try various patterns
  const patterns = [
    /modelExport\s*:\s*(\{)/,
    /modelExport:/,
    /"photo-models"/,
    /photostream-models/,
    /YUI_config/,
    /appContext/,
    /window\.appContext/,
    /root\s*=\s*\{/,
  ];
  
  for (const p of patterns) {
    const m = html.match(p);
    console.log(`Pattern ${p}: ${m ? 'FOUND at ' + m.index : 'NOT FOUND'}`);
  }
  
  // Find all JSON-like structures
  const photoIdMatches = html.match(/"id"\s*:\s*"(\d{10,})"/g);
  if (photoIdMatches) {
    const ids = [...new Set(photoIdMatches.map(m => m.match(/(\d{10,})/)[1]))];
    console.log('\nPhoto IDs found directly in HTML:', ids.length);
    console.log('First 5:', ids.slice(0, 5));
  }
}

main().catch(console.error);
