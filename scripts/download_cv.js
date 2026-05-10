const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadCV() {
  const url = 'https://docs.google.com/document/d/1PT7aDiI2j5CoZCtj4xcUyEeGAM99VG9J/export?format=pdf';
  const outputPath = path.join(__dirname, '..', 'public', 'Ahmed_Rakib_Uddin_CV.pdf');
  
  console.log('Downloading CV from Google Docs...');
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('CV downloaded successfully to public/Ahmed_Rakib_Uddin_CV.pdf');
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading CV:', error.message);
  }
}

downloadCV();
