const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const targetTitles = [
  'শহরের কোনো এক উষ্ণতম দিনে',
  'পংত্তিমালা',
  'এলোমেলো কথামালাঃ ১',
  'নাছোড়বান্দা'
];

async function updateCovers() {
  console.log("Updating blog covers to the new default image...");
  
  for (const title of targetTitles) {
    // We use ilike with % to handle potential variations like trailing dots or punctuation
    const { data, error } = await supabase
      .from('posts')
      .update({ image_url: '/default_blog_cover.png' })
      .ilike('title', `%${title}%`);

    if (error) {
      console.error(`Failed to update post matching "${title}":`, error.message);
    } else {
      console.log(`Successfully updated cover for posts matching: "${title}"`);
    }
  }
  
  console.log("Update process complete!");
}

updateCovers();
