const axios = require('axios');

async function test() {
  const url = 'https://www.somewhereinblog.net/blogger-posts/23704/23703/29135329';
  const { data } = await axios.get(url);
  console.log(typeof data === 'object' ? JSON.stringify(data).substring(0, 500) : data.substring(0, 500));
}
test();
