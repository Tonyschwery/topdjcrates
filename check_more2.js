const https = require('https');

const base = "https://audio-hosting.netlify.app/";
const variations = [
  "rakkas - jananto vs pump it up - zeina (rakkas mashup) .mp3",
  "rakks - jananto vs pump it up - zeina (rakkas mashup) .mp3",
  "rakkas - jananto vs pump it up - zeina (rakks mashup).mp3",
  "rakks - jananto vs pump it up - zeina (rakks mashup).mp3",
  "rakkas - janat vs pump it up - zeina(rakkas mashup).mp3",
  "rakkas - jananto vs pump it up - zaina (rakkas mashup).mp3",
  "rakkas - jananto vs pump it up - zeina (rakkas mashup).mp3",
  "rakks - janat vs pump it up - zeina (rakkas mashup).mp3",
  "rakkas - jananto vs pump it up - zeina (rakkas mashup)  .mp3",
  "rakkas - jananto vs pump it up - zeina(rakkas mashup) .mp3",
  "4-/rakkas - jananto vs pump it up - zeina (rakkas mashup).mp3",
  "4-rakkas - jananto vs pump it up - zeina (rakkas mashup).mp3",
  "rakkas - jananto vs pump it up - zeina.mp3",
  "rakkas - jananto vs pump it up - zeina (rakkas mashup)",
  "rakkas - janat vs pump it up - zeina(rakkas mashup).mp3"
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
