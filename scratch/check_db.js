const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eqrqufobzwblesdrhtgi.supabase.co';
const supabaseKey = 'sb_publishable_938DcrTJsIvVxLWRvkcCxw_XbX0b0dg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: exp } = await supabase.from('experiences').select('*').order('order_index', { ascending: true });
  const { data: skills } = await supabase.from('skills').select('*');
  const { data: edu } = await supabase.from('education').select('*');

  console.log('--- EXPERIENCES ---');
  console.log(JSON.stringify(exp, null, 2));
  console.log('--- SKILLS ---');
  console.log(JSON.stringify(skills, null, 2));
  console.log('--- EDUCATION ---');
  console.log(JSON.stringify(edu, null, 2));
}

checkData();
