/**
 * Flickr Final Scraper — extracts modelExport from Y.ClientApp.init() call
 * Flickr confirms: 182 photos = 8 pages of 25 (last page has 7)
 * perPage setting is 50 in params, but 25 display per page
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PUB_DIR = path.join(__dirname, '../public/photography');
if (!fs.existsSync(PUB_DIR)) fs.mkdirSync(PUB_DIR, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.flickr.com/',
};

/**
 * Find the modelExport JSON inside the page HTML.
 * It's inside Y.ClientApp.init({ ..., modelExport: {...} })
 */
function extractModelExport(html) {
  // The modelExport is embedded as: modelExport: { "legend": [...], "main": {...} }
  // Find the key
  const idx = html.indexOf('"modelExport"');
  if (idx === -1) {
    // Try alternate key: modelExport:
    const idx2 = html.indexOf('modelExport:');
    if (idx2 === -1) return null;
    // extract starting from the { after modelExport:
    const start = html.indexOf('{', idx2 + 12);
    if (start === -1) return null;
    return extractJSON(html, start);
  }
  const colon = html.indexOf(':', idx + 13);
  const start = html.indexOf('{', colon);
  return extractJSON(html, start);
}

function extractJSON(html, start) {
  let depth = 0;
  let i = start;
  for (; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) return html.substring(start, i + 1);
    }
  }
  return null;
}

function extractPhotosFromMain(main) {
  const results = [];
  const photostreamModels = main['photostream-models'] || [];
  
  for (const psm of photostreamModels) {
    if (!psm || !psm.data) continue;
    const ppl = psm.data.photoPageList;
    if (!ppl || !ppl.data || !ppl.data._data) continue;

    for (const item of ppl.data._data) {
      if (!item || !item.data) continue;
      const p = item.data;
      if (!p.id) continue;

      // Title
      const title = (p.title && typeof p.title === 'object') ? p.title._content : (p.title || 'Untitled');
      const desc = (p.description && typeof p.description === 'object') ? p.description._content : (p.description || '');

      // Date
      let publishDate = new Date().toISOString();
      const statsData = p.stats && p.stats.data ? p.stats.data : null;
      if (statsData && statsData.datePosted) {
        publishDate = new Date(parseInt(statsData.datePosted) * 1000).toISOString();
      }

      // Sizes
      const sizes = p.sizes && p.sizes.data ? p.sizes.data : null;
      if (!sizes) continue;

      let imageUrl = null;
      let width = p.oWidth || 1024;
      let height = p.oHeight || 768;

      for (const key of ['o', 'k', 'h', 'b', 'l', 'c', 'z', 'm']) {
        const s = sizes[key];
        if (!s) continue;
        const sd = s.data || s;
        const u = sd.url || sd.displayUrl;
        if (u) {
          imageUrl = u.startsWith('//') ? 'https:' + u : u;
          if (!p.oWidth) { width = sd.width || width; height = sd.height || height; }
          break;
        }
      }

      if (!imageUrl) continue;

      results.push({
        flickr_id: String(p.id),
        title,
        description: desc,
        publish_date: publishDate,
        image_url: imageUrl,
        flickr_url: `https://www.flickr.com/photos/rakiiiiiiib/${p.id}`,
        width: parseInt(width, 10) || 1024,
        height: parseInt(height, 10) || 768,
      });
    }
  }
  return results;
}

async function scrapePage(pageNum) {
  // Page 1 uses no suffix, page 2+ uses page2, page3 etc
  const url = pageNum === 1
    ? 'https://www.flickr.com/photos/rakiiiiiiib/'
    : `https://www.flickr.com/photos/rakiiiiiiib/page${pageNum}`;

  console.log(`\n▶ Fetching page ${pageNum}: ${url}`);

  let html;
  try {
    const res = await axios.get(url, { headers: HEADERS, timeout: 25000 });
    html = res.data;
  } catch (e) {
    console.error(`  Error: ${e.message}`);
    return [];
  }

  // Count total photos from header (for verification)
  const totalMatch = html.match(/<p class="metadata-item photo-count">(\d+) Photos<\/p>/);
  if (totalMatch && pageNum === 1) {
    console.log(`  Total on Flickr: ${totalMatch[1]} photos`);
  }

  const jsonStr = extractModelExport(html);
  if (!jsonStr) {
    console.log(`  No modelExport found on page ${pageNum}`);
    return [];
  }

  let model;
  try {
    model = JSON.parse(jsonStr);
  } catch (e) {
    console.error(`  JSON parse error: ${e.message}`);
    return [];
  }

  const main = model.main || {};
  const photos = extractPhotosFromMain(main);
  console.log(`  Extracted ${photos.length} photos from page ${pageNum}`);
  return photos;
}

async function downloadImage(url, flickr_id) {
  const filename = `${flickr_id}.jpg`;
  const dest = path.join(PUB_DIR, filename);
  if (fs.existsSync(dest)) return filename;

  try {
    const res = await axios({ url, method: 'GET', responseType: 'stream', headers: HEADERS, timeout: 30000 });
    await new Promise((resolve, reject) => {
      const w = fs.createWriteStream(dest);
      res.data.pipe(w);
      w.on('finish', resolve);
      w.on('error', reject);
    });
    return filename;
  } catch (e) {
    console.error(`    ✗ Download failed for ${flickr_id}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('=== Flickr Final Scraper ===\n');

  const allPhotos = new Map();

  // 182 photos / 25 per page = 8 pages (last page ~7 photos)
  for (let page = 1; page <= 10; page++) {
    const photos = await scrapePage(page);

    if (photos.length === 0) {
      console.log(`\n  ↳ No photos on page ${page}. Done collecting.`);
      break;
    }

    for (const p of photos) allPhotos.set(p.flickr_id, p);
    console.log(`  Total unique so far: ${allPhotos.size}`);
    await sleep(1200);
  }

  const photos = [...allPhotos.values()];
  console.log(`\n=== Total unique photos collected: ${photos.length} ===\n`);

  let synced = 0, failed = 0;

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const shortTitle = photo.title.substring(0, 35);
    process.stdout.write(`[${i + 1}/${photos.length}] "${shortTitle}"... `);

    const filename = await downloadImage(photo.image_url, photo.flickr_id);
    const localPath = filename ? `/photography/${filename}` : null;

    const { error } = await supabase.from('photos').upsert(
      { ...photo, local_path: localPath },
      { onConflict: 'flickr_id' }
    );

    if (error) {
      console.log(`✗ DB: ${error.message}`);
      failed++;
    } else {
      console.log(`✓ ${localPath ? 'local' : 'remote'}`);
      synced++;
    }

    if (filename) await sleep(600);
  }

  const localCount = fs.readdirSync(PUB_DIR).length;
  console.log(`\n✅ Done! Synced: ${synced}, Failed: ${failed}`);
  console.log(`   Local images: ${localCount} files`);
}

main().catch(console.error);
