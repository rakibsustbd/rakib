const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { count: photoCount } = await supabase.from('photos').select('*', { count: 'exact', head: true });
  const { count: blogCount } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
  const { count: expCount } = await supabase.from('experiences').select('*', { count: 'exact', head: true });
  const { count: skillCount } = await supabase.from('skills').select('*', { count: 'exact', head: true });

  console.log(`Photos: ${photoCount}`);
  console.log(`Blogs: ${blogCount}`);
  console.log(`Experiences: ${expCount}`);
  console.log(`Skills: ${skillCount}`);
}

check();
