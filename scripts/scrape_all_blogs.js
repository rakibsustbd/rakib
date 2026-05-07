const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IMAGE_DIR = path.join(__dirname, '..', 'public', 'blog_images');
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'blog images');

if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

function generateSlug(title) {
  return title.replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function downloadImage(url, filepath) {
  try {
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('finish', () => resolve(true))
        .on('error', e => reject(e));
    });
  } catch (e) {
    return false;
  }
}

async function scrapeAll() {
  console.log("Starting precision scraper for 59 posts...");
  
  // 1. Fetch initial page
  const { data: initialHtml } = await axios.get('https://www.somewhereinblog.net/blog/DeathLucifer');
  const $ = cheerio.load(initialHtml);
  
  const matchOwner = initialHtml.match(/blog_owner_id\s*=\s*([^;]+)/);
  const matchBlog = initialHtml.match(/blog_id\s*=\s*([^;]+)/);
  const ownerId = matchOwner ? matchOwner[1] : '23704';
  const blogId = matchBlog ? matchBlog[1] : '23703';
  
  let allPosts = [];
  
  // Parse first 15 posts from HTML
  $('h2.post-title').each((i, el) => {
    const aTag = $(el).find('a');
    allPosts.push({
      id: $(el).attr('data-id'),
      title: aTag.text().trim(),
      href: aTag.attr('href'),
      date: null // We'll get this during the detail scrape for the first 15
    });
  });
  
  // 2. Fetch remaining posts via AJAX API
  let lastPostId = allPosts[allPosts.length - 1].id;
  
  while(true) {
    console.log(`Fetching next batch after ID: ${lastPostId}...`);
    try {
      const { data: jsonPosts } = await axios.get(`https://www.somewhereinblog.net/blogger-posts/${ownerId}/${blogId}/${lastPostId}`);
      if (!jsonPosts || jsonPosts.length === 0) break;
      
      for (const jp of jsonPosts) {
        allPosts.push({
          id: jp.postId,
          title: jp.postTitle,
          href: `https://www.somewhereinblog.net${jp.postLink}`,
          date: jp.postDate
        });
      }
      lastPostId = jsonPosts[jsonPosts.length - 1].postId;
    } catch(e) {
      console.log("Pagination ended or failed.");
      break;
    }
  }
  
  // Deduplicate just in case
  const uniquePosts = [];
  const seenIds = new Set();
  for (const p of allPosts) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      uniquePosts.push(p);
    }
  }
  
  console.log(`Successfully discovered exactly ${uniquePosts.length} posts! Starting extraction...`);
  
  // 3. Scrape each post
  for (let i = 0; i < uniquePosts.length; i++) {
    const post = uniquePosts[i];
    const slug = generateSlug(post.title);
    
    console.log(`[${i+1}/${uniquePosts.length}] Scraping: ${post.title}`);
    try {
      const { data } = await axios.get(post.href);
      const $page = cheerio.load(data);
      const contentEl = $page('.blog-content');
      
      contentEl.find('.social-share, .fb-like, script, iframe').remove();
      
      // Determine date
      let publish_date = post.date;
      if (!publish_date) {
        // Fallback to scraping date from the detail page using the author block we discovered
        const authorText = $page('.author').first().text();
        // Look for the date portion
        const dateMatch = authorText.match(/([০-৯]{1,2}\s*ই?\s*(?:জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)[^০-৯]*[০-৯]{4}(?:\s*(?:সকাল|দুপুর|বিকাল|সন্ধ্যা|রাত|ভোর)?\s*[০-৯]{1,2}:[০-৯]{2})?)/);
        if (dateMatch) {
          publish_date = dateMatch[1].trim();
        } else {
          publish_date = "অজানা তারিখ";
        }
      }
      
      let excerpt = "এইখানে ব্লগের সারাংশ থাকবে।";
      const fullText = contentEl.text().trim();
      if (fullText) {
        excerpt = fullText.substring(0, 150) + "...";
      }

      let firstImageUrl = null;
      const imgs = contentEl.find('img');
      for (let imgIndex = 0; imgIndex < imgs.length; imgIndex++) {
        const img = $page(imgs[imgIndex]);
        let src = img.attr('src');
        if (src && !src.includes('emot-slices') && !src.includes('clear.gif') && !src.includes('bhalo-20.png')) { 
          const ext = path.extname(src).split('?')[0] || '.jpg';
          const filename = `${slug}-img${imgIndex}${ext}`;
          const publicPath = path.join(IMAGE_DIR, filename);
          const assetsPath = path.join(ASSETS_DIR, filename);
          
          await downloadImage(src, publicPath);
          fs.copyFileSync(publicPath, assetsPath);
          
          img.attr('src', `/blog_images/${filename}`);
          
          if (!firstImageUrl) firstImageUrl = `/blog_images/${filename}`;
        } else {
           img.remove();
        }
      }
      
      const contentHtml = contentEl.html();

      const { error } = await supabase
        .from('posts')
        .upsert([
          { 
            title: post.title,
            slug: slug,
            category: "গল্প ও ভাবনা",
            publish_date: publish_date,
            image_url: firstImageUrl,
            excerpt: excerpt,
            content: contentHtml
          }
        ], { onConflict: 'slug' });

      if (error) {
        console.error(`Failed to insert ${post.title}: `, error.message);
      } else {
        console.log(`✅ Saved: ${post.title} | Date: ${publish_date}`);
      }
    } catch(e) {
      console.log(`Failed to process ${post.href}: ${e.message}`);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("Finished scraping exactly " + uniquePosts.length + " posts!");
}

scrapeAll();
