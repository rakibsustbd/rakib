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
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Ensure the assets folder exists too as requested
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'blog images');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const postsToMigrate = [
  { title: "টাইগারদের জন্য একটি অক্রিকেটিয় টোটকা প্রয়াস", category: "ভাবনা", publish_date: "মে ০৬, ২০২৪", image_url: "/blog_post_1.jpg" },
  { title: "শ্রেষ্টতম সময়ের শুরু", category: "গল্প", publish_date: "মে ০৪, ২০২৪", image_url: "/blog_post_2.jpg" },
  { title: "শহরের কোনো এক উষ্ণতম দিনে....", category: "ভাবনা", publish_date: "এপ্রিল ২৮, ২০২৪", image_url: "/blog_post_3.jpg" },
  { title: "অনুভবে অন্তরীক্ষ", category: "গল্প", publish_date: "এপ্রিল ২৫, ২০২৪", image_url: "/blog_post_4.jpg" },
  { title: "বৃষ্টিস্নাত দুপুর অথবা জোছনার সমুদ্র বিলাশ কিংবা শুধুই অনুভূতিনামা", category: "দেশ", publish_date: "এপ্রিল ২০, ২০২৪", image_url: "/blog_post_5.jpg" },
  { title: "ত্রিশের আনাগোনা (যাপিত জীবন)", category: "ভাবনা", publish_date: "এপ্রিল ১৫, ২০২৪" },
  { title: "যাপিত জীবন (৩)", category: "ভাবনা", publish_date: "এপ্রিল ১০, ২০২৪" },
  { title: "যাপিত জীবন অথবা নিছক ছবি ব্লগ", category: "ছবি ব্লগ", publish_date: "এপ্রিল ০৫, ২০২৪" },
  { title: "গভীরতা, কখনও কখনও হারিয়ে যায়, অন্য কোনো গভীরতায় (ছবি ব্লগ)", category: "ভাবনা", publish_date: "মার্চ ২৮, ২০২৪" },
  { title: "শিল্পান্তর (গল্প)", category: "গল্প", publish_date: "মার্চ ২৫, ২০২৪" },
  { title: "শূণ্য পূর্ণ অনুভূতি", category: "ভাবনা", publish_date: "মার্চ ২০, ২০২৪" },
  { title: "ছবি ব্লগঃ পাহাড় ডাকে আজ আমায়", category: "ছবি ব্লগ", publish_date: "মার্চ ১৫, ২০২৪" },
  { title: "শুধু তোমার আমার হৃদয়ে, ভিজে মাটির সোদা গন্ধ", category: "ভাবনা", publish_date: "মার্চ ১০, ২০২৪" },
  { title: "ছবি ব্লগঃ পুরাতন প্রাণের টানে", category: "ছবি ব্লগ", publish_date: "মার্চ ০৫, ২০২৪" },
  { title: "আলোয়-অন্ধকারে (গল্প)", category: "গল্প", publish_date: "ফেব্রুয়ারি ২৮, ২০২৪" }
];

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
    console.error(`Failed to download image ${url}`);
    return false;
  }
}

async function fetchLinks() {
  const { data } = await axios.get('https://www.somewhereinblog.net/blog/DeathLucifer');
  const $ = cheerio.load(data);
  const links = {};
  
  $('h2 a').each((i, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr('href');
    if (title && href) {
      links[title] = href;
    }
  });
  
  return links;
}

async function scrapeAndMigrate() {
  console.log("Fetching index to map links...");
  const titleToLinkMap = await fetchLinks();
  
  for (let i = 0; i < postsToMigrate.length; i++) {
    const post = postsToMigrate[i];
    const slug = generateSlug(post.title);
    
    // Find matching link from index page. Some titles might have minor differences.
    // So we do a soft match
    let link = titleToLinkMap[post.title];
    if (!link) {
      const match = Object.keys(titleToLinkMap).find(k => k.includes(post.title) || post.title.includes(k));
      if (match) link = titleToLinkMap[match];
    }
    
    let contentHtml = "";
    let excerpt = "এইখানে ব্লগের সারাংশ থাকবে।";
    let firstImageUrl = post.image_url;

    if (link) {
      console.log(`Scraping post: ${post.title}`);
      const { data } = await axios.get(link);
      const $ = cheerio.load(data);
      const contentEl = $('.post-content');
      
      // Clean up some unwanted elements like social share buttons
      contentEl.find('.social-share, .fb-like, script, iframe').remove();
      
      // Extract text for excerpt
      const fullText = contentEl.text().trim();
      if (fullText) {
        excerpt = fullText.substring(0, 150) + "...";
      }

      // Download images
      const imgs = contentEl.find('img');
      for (let imgIndex = 0; imgIndex < imgs.length; imgIndex++) {
        const img = $(imgs[imgIndex]);
        let src = img.attr('src');
        if (src && !src.includes('emot-slices')) { // skip emojis
          const ext = path.extname(src).split('?')[0] || '.jpg';
          const filename = `${slug}-img${imgIndex}${ext}`;
          const publicPath = path.join(IMAGE_DIR, filename);
          const assetsPath = path.join(ASSETS_DIR, filename);
          
          await downloadImage(src, publicPath);
          fs.copyFileSync(publicPath, assetsPath); // Copy to assets as well per user request
          
          // Replace src with local path
          img.attr('src', `/blog_images/${filename}`);
          
          if (!firstImageUrl) {
            firstImageUrl = `/blog_images/${filename}`;
          }
        }
      }
      
      contentHtml = contentEl.html();
    } else {
      console.log(`Link not found for: ${post.title}`);
    }

    // Upsert into Supabase
    const { error } = await supabase
      .from('posts')
      .upsert([
        { 
          title: post.title,
          slug: slug,
          category: post.category,
          publish_date: post.publish_date,
          image_url: firstImageUrl || null,
          excerpt: excerpt,
          content: contentHtml || null
        }
      ], { onConflict: 'slug' });

    if (error) {
      console.error(`Failed to insert ${post.title}: `, error.message);
    } else {
      console.log(`Successfully migrated to DB: ${post.title}`);
    }
    
    // Add a small delay to avoid hammering the server
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("Full scraping and migration complete!");
}

scrapeAndMigrate();
