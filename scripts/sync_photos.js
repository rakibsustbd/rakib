const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PUB_DIR = path.join(__dirname, '../public/photography');
if (!fs.existsSync(PUB_DIR)) fs.mkdirSync(PUB_DIR, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function downloadImage(url, flickr_id) {
  const filename = `${flickr_id}.jpg`;
  const dest = path.join(PUB_DIR, filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return filename;

  try {
    const res = await axios({ url, method: 'GET', responseType: 'stream', timeout: 30000 });
    await new Promise((resolve, reject) => {
      const w = fs.createWriteStream(dest);
      res.data.pipe(w);
      w.on('finish', resolve);
      w.on('error', reject);
    });
    return filename;
  } catch (e) {
    if (e.response && e.response.status === 429) {
      return '429';
    }
    return null;
  }
}

async function main() {
  const photosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'flickr_photos_full.json'), 'utf8'));
  const datesMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'flickr_dates_map.json'), 'utf8'));
  
  console.log(`Final Sync for ${photosData.length} photos...`);

  let synced = 0, downloaded = 0;
  for (let i = 0; i < photosData.length; i++) {
    const p = photosData[i];
    
    // Date Logic
    let publishDate = new Date().toISOString();
    if (datesMap[p.flickr_id]) {
      publishDate = new Date(parseInt(datesMap[p.flickr_id]) * 1000).toISOString();
    }

    const filename = await downloadImage(p.image_url, p.flickr_id);
    const localPath = (filename && filename !== '429') ? `/photography/${filename}` : null;

    const { error } = await supabase.from('photos').upsert({
      flickr_id: p.flickr_id,
      title: p.title || 'Untitled',
      image_url: p.image_url,
      flickr_url: p.flickr_url,
      width: parseInt(p.width) || 1024,
      height: parseInt(p.height) || 768,
      local_path: localPath,
      publish_date: publishDate,
      description: p.description || ''
    }, { onConflict: 'flickr_id' });

    if (!error) {
      synced++;
      if (localPath) downloaded++;
    }

    process.stdout.write(`\rProgress: ${i+1}/${photosData.length} | Synced: ${synced} | Files: ${downloaded}`);
    
    if (filename === '429') await sleep(5000);
    else await sleep(1000);
  }

  console.log(`\n\n✅ SYNC COMPLETE`);
  console.log(`- Database records: ${synced}`);
  console.log(`- Local images: ${downloaded}`);
}

main().catch(console.error);
