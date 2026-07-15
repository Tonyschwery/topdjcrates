const fs = require('fs');
let c = fs.readFileSync('src/data/musicPacks.js', 'utf8');

c = c.replace(/primaryGenre:\s*'[^']+',\n\s*subGenre:\s*'([^']+)',/g, "genre: '$1',");

fs.writeFileSync('src/data/musicPacks.js', c);
console.log('Done');
