const https = require('https');

const base = "https://audio-hosting.netlify.app/";
const variations = [
  "tfd26 - akalelo - joi n'juno.mp3",
  "tfd26 - nibolowa - 1da banton.mp3",
  "tfd26 - stand up - da lukas, stella brown.mp3",
  "tfd26 -dance, dance, dance (yowsah,yowsah,yowsah) - chic - 118.mp3",
  "tfd26 -mr. cool - jo paciello, soultrain.mp3",
  "tfd26 - dance, dance, dance (yowsah,yowsah,yowsah) - chic - 118.mp3",
  "tfd26 - mr. cool - jo paciello, soultrain.mp3"
];

let pending = variations.length;
variations.forEach(v => {
  const encoded = encodeURI(base + v).replace(/'/g, "%27");
  https.request(encoded, { method: 'HEAD' }, (res) => {
    if (res.statusCode === 200) {
      console.log(`[200] FOUND: ${v}`);
    } else {
      console.log(`[${res.statusCode}] Not found: ${v}`);
    }
  }).on('error', (err) => {
    console.log(`Error on ${v}: ${err.message}`);
  }).end();
});
