const fs = require('fs');
let c = fs.readFileSync('src/data/musicPacks.js', 'utf8');

c = c.replace(/primaryGenre:\s*['"][^'"]+['"],\s*/g, '');
c = c.replace(/subGenre:/g, 'genre:');

fs.writeFileSync('src/data/musicPacks.js', c);
console.log('Done');
