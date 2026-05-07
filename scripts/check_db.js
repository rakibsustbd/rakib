require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('posts').select('title, slug').eq('title', 'টাইগারদের জন্য একটি অক্রিকেটিয় টোটকা প্রয়াস').single();
  console.log("DB Title:", data.title);
  console.log("DB Slug:", data.slug);
}
run();
