const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const postData = {
  title: "গভীরতা, কখনও কখনও হারিয়ে যায়, অন্য কোনো গভীরতায় (ছবি ব্লগ)",
  publish_date: "০৪ ঠা ফেব্রুয়ারি, ২০১১ রাত ৩:০০",
  category: "ছবি ব্লগ",
  content: `
<p>
    ছাদের উপর থেকে শহরটাকে অনেক বেশি অদ্ভুত মনে হয়। শহরের ভেতরে অন্য এক শহর। বিড়ালের মতন নিঃশব্দ পা ফেলে ছাদের উপরে আসার উপলক্ষ্য কিন্তু এই শহরটাকে দেখা নয়। বরং পায়ের বুড়ো আঙুলের উপর ভর করে দাঁড়িয়ে আরেকটু ওপারে দেখার প্রয়াস। ওপারের সবুজটা আনন্দের উপলক্ষ্য নয়। প্রকৃতির তুলির আচড়ে মোহনীয় মুগ্ধতা আছে বটে। তবে বোধকরি স্বস্তির অনেক কমতি রয়েছে। প্রতিটি মাটির কণা জুড়ে শূণ্যতা। প্রতিটি পানির বিন্দুর মাঝেই যেন হাহাকার। প্রাণহীন প্রানবন্ত কোনো যৌবনবতীর বেঁচে থাকার প্রানান্তকর প্রচেষ্টা। জীবনযাত্রা থেমে থাকে না। তাই তাকে আজ বহুরূপী মনে হয়। ক্ষণে ক্ষণে রঙ বদলানো আকাশের মতন।  
</p>
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_0" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_1" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_2" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_3" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_4" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_5" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_6" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_7" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_8" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_9" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_10" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_11" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_12" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<img class="post_image" src="IMAGE_PLACEHOLDER_13" style="border: 1px solid #ccc; display: block; margin: 20px auto; max-width: 100%;">
<br>
<p>
    মানিকগঞ্জের ত্বরা ব্রীজ থেকে তোলা কালিগঙ্গা নদীর ছবি। প্রতি শীতেই প্রকৃতির অদ্ভুত এই রূপ দেখতে পাওয়া যায়। এই নদীকে ঘিরে বেড়ে উঠা জীবন যাত্রাও একেবারেই বদলে যায় প্রকৃতির সাথে সাথে। খাপ খাইয়ে নেয়াতে মানুষ বোধকরি সবচেয়ে স্মার্ট প্রাণী। তাই আমিও কষ্টে সৃষ্টে দিন কাটানো মানুষ গুলোকে ভুলে ছবি তোলা নিয়েই ব্যস্ত ছিলাম। ছবি তোলা শেষ করে ব্রীজের ওপারের খুপড়ি দোকানে এক গ্লাস গরুর দুধের সর খেয়ে, ঘরে ফিরে ক্লান্ত পরিশ্রান্ত হয়ে, আয়নার সামনে দাঁড়িয়ে নিজেকে দেখে চমকে উঠি। নগ্ন আমি দেখতে ভয়াবহ অসামঞ্জস্য। ঠিক যেন কালিগঙ্গার প্রতিচ্ছবি।
</p>
  `,
  imageUrls: [
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296766741_1-4.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296396979_1-1.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296397029_2-2.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296397265_3-4.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296398672_4-6.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296398734_5-8.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296398796_6-9.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296398882_7-10.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296398935_8-12.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296398985_9-11.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296399049_10-18.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296399103_11-19.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296409512_12-20__2_.JPG",
    "https://s3.amazonaws.com/somewherein/assets/images/DeathLucifer_1296409610_13-29_small.JPG"
  ]
};

function generateSlug(title) {
  return title.replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function downloadImage(url, filename) {
  const IMAGE_DIR = path.join(__dirname, '..', 'public', 'blog_images');
  const filepath = path.join(IMAGE_DIR, filename);
  
  try {
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('finish', () => resolve(`/blog_images/${filename}`))
        .on('error', e => reject(e));
    });
  } catch (e) {
    console.error(`Failed to download image ${url}:`, e.message);
    return null;
  }
}

async function restorePost() {
  console.log("Restoring deleted post...");
  
  const slug = generateSlug(postData.title);
  let finalContent = postData.content;
  let firstLocalImage = null;

  for (let i = 0; i < postData.imageUrls.length; i++) {
    const url = postData.imageUrls[i];
    const ext = path.extname(url).split('?')[0] || '.JPG';
    const filename = `${slug}-img${i}${ext}`;
    
    console.log(`Downloading image ${i+1}/${postData.imageUrls.length}...`);
    const localPath = await downloadImage(url, filename);
    
    if (localPath) {
      finalContent = finalContent.replace(`IMAGE_PLACEHOLDER_${i}`, localPath);
      if (!firstLocalImage) firstLocalImage = localPath;
    }
  }

  const excerpt = "ছাদের উপর থেকে শহরটাকে অনেক বেশি অদ্ভুত মনে হয়। শহরের ভেতরে অন্য এক শহর। বিড়ালের মতন নিঃশব্দ পা ফেলে ছাদের উপরে আসার উপলক্ষ্য কিন্তু এই শহরটাকে দেখা নয়...";

  const { error } = await supabase
    .from('posts')
    .upsert([
      {
        title: postData.title,
        slug: slug,
        category: postData.category,
        publish_date: postData.publish_date,
        image_url: firstLocalImage || '/default_blog_cover.png',
        excerpt: excerpt,
        content: finalContent
      }
    ], { onConflict: 'slug' });

  if (error) {
    console.error("Failed to restore post:", error.message);
  } else {
    console.log("Successfully restored post:", postData.title);
  }
}

restorePost();
