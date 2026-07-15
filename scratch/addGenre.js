const fs = require('fs');
let c = fs.readFileSync('src/data/musicPacks.js', 'utf8');

// The regex will look for geoMetadata { ... subGenre: 'xyz' } and duplicate that 'xyz' as a genre: 'xyz' field directly inside the crate.
const regex = /(id:\s*['"]?[a-zA-Z0-9_]+['"]?,\n\s*)([\s\S]*?geoMetadata:\s*{\s*[\s\S]*?subGenre:\s*'([^']+)'[\s\S]*?},)/g;

c = c.replace(regex, (match, prefix, rest, subGenre) => {
  return prefix + "genre: '" + subGenre + "',\n    " + rest;
});

fs.writeFileSync('src/data/musicPacks.js', c);
console.log('Done');
