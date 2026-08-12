const fs = require('fs');
const file = 'src/data/musicPacks.js';
let content = fs.readFileSync(file, 'utf8');

const targetIdx = content.indexOf('TOP SOCA HITS');
if (targetIdx !== -1) {
  // Find the gumroadLink in the next 1000 characters
  const endIdx = targetIdx + 1000;
  const chunk = content.substring(targetIdx, endIdx);
  const updatedChunk = chunk.replace(
    'gumroadLink: "",',
    'gumroadLink: "https://topdjcrates.gumroad.com/l/iexbe",'
  );
  
  content = content.substring(0, targetIdx) + updatedChunk + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Gumroad link added successfully to SOCA crate.');
} else {
  console.log('SOCA crate not found.');
}
