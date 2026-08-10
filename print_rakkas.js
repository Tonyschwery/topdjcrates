const fs = require('fs');

const content = fs.readFileSync('src/data/musicPacks.js', 'utf8');
const idx = content.indexOf('TOP RAKKAS');
if (idx !== -1) {
  const endIdx = content.indexOf('},', idx);
  console.log(content.substring(idx - 100, idx + 2000));
} else {
  console.log('Not found');
}
