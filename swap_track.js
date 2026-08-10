const fs = require('fs');

let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

content = content.replace(
  '"https://audio-hosting.netlify.app/rakkas - jananto vs pump it up - zeina (rakkas mashup).mp3"',
  '"https://audio-hosting.netlify.app/rakkas - chou el matloub - haifa (rakkas edit).mp3"'
);

content = content.replace(
  '"jananto vs pump it up - zeina (rakkas mashup)"',
  '"chou el matloub - haifa (rakkas edit)"'
);

fs.writeFileSync('src/data/musicPacks.js', content);
console.log('Swapped track 4 successfully.');
