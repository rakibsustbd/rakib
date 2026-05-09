const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixDates() {
  console.log("Fetching posts with unknown dates...");
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content, publish_date')
    .or('publish_date.eq.অজানা তারিখ,publish_date.eq.Unknown');

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  console.log(`Found ${posts.length} posts to check.`);

  let updatedCount = 0;
  for (const post of posts) {
    // Regex to find "সর্বশেষ এডিট : <DATE>"
    // We look for the pattern before </div> or end of string
    const match = post.content.match(/(?:সর্বশেষ এডিট\s*:\s*)([^<]+)/i);

    if (match && match[1]) {
      let extractedDate = match[1].trim();
      
      // Remove any trailing "</div>" or extra spaces if captured
      extractedDate = extractedDate.replace(/<\/div>/g, '').trim();

      if (extractedDate) {
        console.log(`Updating "${post.title}": Unknown -> ${extractedDate}`);
        
        const { error: updateError } = await supabase
          .from('posts')
          .update({ publish_date: extractedDate })
          .eq('id', post.id);

        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    } else {
      console.log(`Skipping "${post.title}": No date pattern found in content.`);
    }
  }

  console.log(`Done! Updated ${updatedCount} posts.`);
}

fixDates();
