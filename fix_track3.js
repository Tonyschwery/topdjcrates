const fs = require('fs');

let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

// Replace track 3 URL
content = content.replace(
  'https://audio-hosting.netlify.app/rakkas - cute get busy - nawal el zoghbi (rakkas mashup).mp3',
  'https://audio-hosting.netlify.app/rakks - cute get busy - nawal el zoghbi (rakkas mashup).mp3'
);

fs.writeFileSync('src/data/musicPacks.js', content);
console.log('Fixed Track 3!');
