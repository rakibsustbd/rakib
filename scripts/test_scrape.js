const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  const url = 'https://www.somewhereinblog.net/blog/DeathLucifer/29948345';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  const title = $('h2.post-title').text().trim() || $('h2').first().text().trim();
  const date = $('.post-date').text().trim() || $('.date').text().trim() || $('span').filter((i, el) => $(el).text().includes('২০২৪')).text().trim();
  const bodyHTML = $('.post-content').html() || $('.post-body').html() || $('.post').html() || $('.blog-content').html();
  
  console.log("Title:", title);
  console.log("Date:", date);
  console.log("Body length:", bodyHTML ? bodyHTML.length : 0);
  console.log("Body Snippet:", bodyHTML ? bodyHTML.substring(0, 200) : "Not found");
  
  const images = [];
  $('.post-content img, .post-body img, .blog-content img').each((i, el) => {
    images.push($(el).attr('src'));
  });
  console.log("Images:", images);
}

testScrape();
