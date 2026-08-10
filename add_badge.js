const fs = require('fs');
const file = 'src/data/musicPacks.js';
let content = fs.readFileSync(file, 'utf8');

const targetIdx = content.indexOf('TOP RAKKAS MUSIC EDITS & REMIXES');
if (targetIdx !== -1) {
  // Find the cover field to inject badge below it
  const chunkStart = content.indexOf('cover:', targetIdx);
  const chunkEnd = content.indexOf(',', chunkStart) + 1;
  
  const injectStr = '\n    badge: "EXCLUSIVE",';
  
  content = content.substring(0, chunkEnd) + injectStr + content.substring(chunkEnd);
  
  fs.writeFileSync(file, content);
  console.log('Badge added successfully to Rakkas crate.');
} else {
  console.log('Rakkas crate not found.');
}
