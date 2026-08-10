const https = require('https');

const base = "https://audio-hosting.netlify.app/";
const variations = [
  "Rakkas - Jananto vs Pump It Up - Zeina (Rakkas Mashup).mp3",
  "Rakkas - jananto vs pump it up - zeina (rakkas mashup).mp3",
  "RAKKAS - JANANTO VS PUMP IT UP - ZEINA (RAKKAS MASHUP).mp3",
  "rakkas - Jananto vs Pump it up - Zeina (rakkas mashup).mp3",
  "rakkas - Jananto vs Pump It Up - Zeina (rakkas mashup).mp3",
  "rakkas - Jananto Vs Pump It Up - Zeina (rakkas mashup).mp3",
  "Rakkas - jananto vs pump it up - zeina (Rakkas mashup).mp3"
];

let found = false;

variations.forEach(v => {
  const encoded = encodeURI(base + v);
  https.request(encoded, { method: 'HEAD' }, (res) => {
    if (res.statusCode === 200) {
      console.log(`[200] FOUND: ${v}`);
      found = true;
    }
  }).on('error', (err) => {}).end();
});

setTimeout(() => {
  if (!found) console.log("None of the variations found a 200.");
}, 3000);
