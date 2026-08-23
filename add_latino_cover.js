const fs = require('fs');
const file = 'src/data/musicPacks.js';
let content = fs.readFileSync(file, 'utf8');

const targetIdx = content.indexOf('TOP LATINO HOUSE 2026');
if (targetIdx !== -1) {
  // Find the cover link in the next 1000 characters
  const endIdx = targetIdx + 1000;
  const chunk = content.substring(targetIdx, endIdx);
  const updatedChunk = chunk.replace(
    'cover: "",',
    'cover: "https://i.imgur.com/1aNBwbi.jpeg",'
  );
  
  content = content.substring(0, targetIdx) + updatedChunk + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Cover link added successfully to LATINO HOUSE crate.');
} else {
  console.log('LATINO HOUSE crate not found.');
}
