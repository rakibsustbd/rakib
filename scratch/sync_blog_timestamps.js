const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const months = {
  'জানুয়ারি': '01', 'ফেব্রুয়ারি': '02', 'মার্চ': '03', 'এপ্রিল': '04',
  'মে': '05', 'জুন': '06', 'জুলাই': '07', 'আগস্ট': '08',
  'সেপ্টেম্বর': '09', 'অক্টোবর': '10', 'নভেম্বর': '11', 'ডিসেম্বর': '12'
};

const digits = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

function parseBengaliNumber(s) {
  return s.split('').map(c => digits[c] || c).join('');
}

async function syncTimestamps() {
  console.log("Fetching all posts...");
  const { data: posts, error } = await supabase.from('posts').select('id, title, publish_date');

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Processing ${posts.length} posts...`);

  for (const post of posts) {
    const raw = post.publish_date;
    if (!raw || raw === 'Unknown' || raw === 'অজানা তারিখ') continue;

    try {
      // Format: "২৬ শে মে, ২০১৩  রাত ১২:১৫" or "০৭ ই ফেব্রুয়ারি, ২০০৯  রাত ৮:৪৯"
      const parts = raw.split(/\s+/);
      
      let day = '';
      let month = '';
      let year = '';
      let time = '';

      // Find year (4 digits)
      const yearMatch = raw.match(/[০-৯]{4}/);
      if (!yearMatch) continue;
      year = parseBengaliNumber(yearMatch[0]);

      // Find month
      for (const m in months) {
        if (raw.includes(m)) {
          month = months[m];
          break;
        }
      }

      // Find day (starts with digits)
      const dayMatch = raw.match(/^[০-৯]{1,2}/);
      if (dayMatch) {
        day = parseBengaliNumber(dayMatch[0]).padStart(2, '0');
      } else {
        // Fallback for cases where it's not at the start
        const dayMatch2 = raw.match(/([০-৯]{1,2})\s+(শে|ই|রা|লা)/);
        if (dayMatch2) day = parseBengaliNumber(dayMatch2[1]).padStart(2, '0');
      }

      if (year && month && day) {
        const isoDate = `${year}-${month}-${day}T12:00:00Z`;
        console.log(`[${post.id}] ${post.title} -> ${isoDate}`);
        
        // We update created_at to the actual publish date for better sorting
        await supabase.from('posts').update({ created_at: isoDate }).eq('id', post.id);
      }
    } catch (e) {
      console.error(`Failed to parse: ${raw}`, e);
    }
  }

  console.log("Done!");
}

syncTimestamps();
