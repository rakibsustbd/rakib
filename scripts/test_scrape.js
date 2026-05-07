const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const { data } = await axios.get('https://www.somewhereinblog.net/blog/DeathLucifer/29948345');
  const $ = cheerio.load(data);
  console.log('.post-content length:', $('.post-content').html() ? $('.post-content').html().length : 0);
  console.log('.post-body length:', $('.post-body').html() ? $('.post-body').html().length : 0);
  console.log('.blog-content length:', $('.blog-content').html() ? $('.blog-content').html().length : 0);
  console.log('p length in blog-content:', $('.blog-content p').length);
}
test();
