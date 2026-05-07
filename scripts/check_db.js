const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTable() {
  const { data, error } = await supabase.from('photos').select('*').limit(1);
  if (error && error.code === '42P01') {
    console.log("Table 'photos' does not exist.");
  } else if (error) {
    console.log("Error checking table:", error.message);
  } else {
    console.log("Table 'photos' exists.");
  }
}

checkTable();
