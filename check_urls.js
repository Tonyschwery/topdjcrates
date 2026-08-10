const https = require('https');

const urls = [
  "https://audio-hosting.netlify.app/rakkas - cute get busy - nawal el zoghbi (rakkas mashup).mp3",
  "https://audio-hosting.netlify.app/rakks - cute get busy - nawal el zoghbi (rakkas mashup).mp3",
  "https://audio-hosting.netlify.app/rakkas - jananto vs pump it up - zeina (rakkas mashup).mp3",
  "https://audio-hosting.netlify.app/rakks - jananto vs pump it up - zeina (rakkas mashup).mp3",
  "https://audio-hosting.netlify.app/rakkas - janat vs pump it up - zeina (rakkas mashup).mp3"
];

urls.forEach(urlStr => {
  const encoded = encodeURI(urlStr);
  https.request(encoded, { method: 'HEAD' }, (res) => {
    console.log(`[${res.statusCode}] ${urlStr}`);
  }).on('error', (err) => {
    console.log(`[ERROR] ${urlStr}: ${err.message}`);
  }).end();
});
