require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const postsToMigrate = [
  {
    title: "টাইগারদের জন্য একটি অক্রিকেটিয় টোটকা প্রয়াস",
    category: "ভাবনা",
    publish_date: "মে ০৬, ২০২৪",
    image_url: "/blog_post_1.jpg",
    excerpt: "মানুষের জীবনটা একটা বইয়ের মতো। প্রতিটা দিন একেকটা পাতা। কোনো পাতা হাসির, কোনো পাতা কান্নার...",
    content: "এখানে বিস্তারিত পোস্ট থাকবে...",
  },
  {
    title: "শ্রেষ্টতম সময়ের শুরু",
    category: "গল্প",
    publish_date: "মে ০৪, ২০২৪",
    image_url: "/blog_post_2.jpg",
    excerpt: "বর্তমান বিশ্বে প্রযুক্তি ছাড়া ব্যবসার কথা চিন্তা করা অসম্ভব। কিন্তু শুধু প্রযুক্তিই কি যথেষ্ট?...",
    content: "এখানে বিস্তারিত পোস্ট থাকবে...",
  },
  {
    title: "শহরের কোনো এক উষ্ণতম দিনে....",
    category: "ভাবনা",
    publish_date: "এপ্রিল ২৮, ২০২৪",
    image_url: "/blog_post_3.jpg",
    excerpt: "ঠিক উষ্ণতম বলা যাবে না হয়তো। তবে প্রচন্ড দাবদাহকে উপেক্ষাও করা যাচ্ছে না। স্মৃতিকথন লেখার জন্য একেবারেই উপযুক্ত আবহাওয়া নয়। এডিসন ভাইয়ের আবিষ্কারের সরকারী ডিজিটাইজড ব্যবস্থাপনায় আশা যাওয়ায় লেখালেখি দূরে থাক, একটু প্রশান্তিতে ঘুমিয়ে থাকাটাই দায়।",
    content: "ঠিক উষ্ণতম বলা যাবে না হয়তো। তবে প্রচন্ড দাবদাহকে উপেক্ষাও করা যাচ্ছে না। স্মৃতিকথন লেখার জন্য একেবারেই উপযুক্ত আবহাওয়া নয়। এডিসন ভাইয়ের আবিষ্কারের সরকারী ডিজিটাইজড ব্যবস্থাপনায় আশা যাওয়ায় লেখালেখি দূরে থাক, একটু প্রশান্তিতে ঘুমিয়ে থাকাটাই দায়।\n\nকি অদ্ভুত, সময় গড়ে দেয় ব্যবধান। একটা সময় এই রকম আবহাওয়ায় খেলার মাঠে কত সময় কাটিয়েছি। আর আজ চার দেয়ালের মাঝে ফ্যানের নিচে বসেও অস্থির লাগছে। বয়স নাকি পরিস্থিতি, কোনটা এর জন্য দায়ী তা বলা মুশকিল।\n\nএই গরমের মাঝেই মনে পড়ে গেল কিছু পুরোনো স্মৃতি। বন্ধুরা মিলে পুকুরে ঝাঁপিয়ে পড়ার সেই দুপুরগুলো। এখন আর সেই দিন নেই, সেই বন্ধুরাও নেই কাছাকাছি। সবাই যার যার জীবনে ব্যস্ত।\n\nতবে এই উষ্ণতম দিনেও একটা শান্তি আছে। যখন হঠাৎ করে এক পশলা বৃষ্টি এসে সব কিছু ঠান্ডা করে দেয়। মাটির সোঁদা গন্ধ আর বৃষ্টির শব্দ সব ক্লান্তি ধুয়ে মুছে নিয়ে যায়। হয়তো আজ বিকেলেও এমন একটা বৃষ্টির অপেক্ষায় আছি।",
  },
  {
    title: "অনুভবে অন্তরীক্ষ",
    category: "গল্প",
    publish_date: "এপ্রিল ২৫, ২০২৪",
    image_url: "/blog_post_4.jpg",
    excerpt: "নেতৃত্ব মানে আদেশ দেওয়া নয়, নেতৃত্ব মানে পথ দেখানো। ১৮ বছরের অভিজ্ঞতা থেকে যা শিখলাম...",
    content: "এখানে বিস্তারিত পোস্ট থাকবে...",
  },
  {
    title: "বৃষ্টিস্নাত দুপুর অথবা জোছনার সমুদ্র বিলাশ কিংবা শুধুই অনুভূতিনামা",
    category: "দেশ",
    publish_date: "এপ্রিল ২০, ২০২৪",
    image_url: "/blog_post_5.jpg",
    excerpt: "শহরের যান্ত্রিকতা ছেড়ে যখনই গ্রামে যাই, এক অদ্ভুত প্রশান্তি অনুভব করি...",
    content: "এখানে বিস্তারিত পোস্ট থাকবে...",
  },
  { title: "ত্রিশের আনাগোনা (যাপিত জীবন)", category: "ভাবনা", publish_date: "এপ্রিল ১৫, ২০২৪", excerpt: "", content: "" },
  { title: "যাপিত জীবন (৩)", category: "ভাবনা", publish_date: "এপ্রিল ১০, ২০২৪", excerpt: "", content: "" },
  { title: "যাপিত জীবন অথবা নিছক ছবি ব্লগ", category: "ছবি ব্লগ", publish_date: "এপ্রিল ০৫, ২০২৪", excerpt: "", content: "" },
  { title: "গভীরতা, কখনও কখনও হারিয়ে যায়, অন্য কোনো গভীরতায়", category: "ভাবনা", publish_date: "মার্চ ২৮, ২০২৪", excerpt: "", content: "" },
  { title: "শিল্পান্তর (গল্প)", category: "গল্প", publish_date: "মার্চ ২৫, ২০২৪", excerpt: "", content: "" },
  { title: "শূণ্য পূর্ণ অনুভূতি", category: "ভাবনা", publish_date: "মার্চ ২০, ২০২৪", excerpt: "", content: "" }
];

function generateSlug(title) {
  // Simple slugifier for Bengali/English
  return title.replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function runMigration() {
  console.log("Starting database migration...");
  
  for (const post of postsToMigrate) {
    const slug = generateSlug(post.title);
    
    const { data, error } = await supabase
      .from('posts')
      .upsert([
        { 
          title: post.title,
          slug: slug,
          category: post.category,
          publish_date: post.publish_date,
          image_url: post.image_url || null,
          excerpt: post.excerpt || null,
          content: post.content || null
        }
      ], { onConflict: 'slug' });

    if (error) {
      console.error(`Failed to insert ${post.title}: `, error.message);
    } else {
      console.log(`Successfully migrated: ${post.title}`);
    }
  }
  
  console.log("Migration complete!");
}

runMigration();
