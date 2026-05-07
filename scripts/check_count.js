/**
 * Check photo count in DB
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { count } = await supabase.from('photos').select('*', { count: 'exact', head: true });
  console.log('Photos in DB:', count);

  const { data } = await supabase.from('photos').select('flickr_id').order('publish_date', { ascending: false });
  console.log('Sample IDs:', data?.slice(0, 5).map(p => p.flickr_id));
}

main();
