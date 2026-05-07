const axios = require('axios');
const fs = require('fs');

async function test() {
  try {
    const { data } = await axios.get('https://www.flickr.com/photos/rakiiiiiiib/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    // Look for model data
    const match = data.match(/modelExport:\s*({.*}),\s*auth/);
    if (match) {
      console.log("Found JSON model data!");
      fs.writeFileSync('scripts/flickr_test.json', match[1]);
    } else {
      console.log("JSON model data not found.");
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}

test();
