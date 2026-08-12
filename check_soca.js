const https = require('https');

const base = "https://audio-hosting.netlify.app/";
const variations = [
  "soca- short preview.mp3",
  "soca - short preview.mp3",
  "soca-short preview.mp3",
  "soca - short preview .mp3"
];

variations.forEach(v => {
  const encoded = encodeURI(base + v);
  https.request(encoded, { method: 'HEAD' }, (res) => {
    if (res.statusCode === 200) {
      console.log(`[200] FOUND: ${v}`);
    } else {
      console.log(`[${res.statusCode}] Not found: ${v}`);
    }
  }).on('error', (err) => {}).end();
});
