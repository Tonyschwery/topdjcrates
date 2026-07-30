const fs = require('fs');
const file = 'src/data/musicPacks.js';
let content = fs.readFileSync(file, 'utf8');

if (content.includes('TOP AFRO HOUSE VOL 7')) {
  console.log('Found TOP AFRO HOUSE VOL 7');
  
  // Find the block
  const idx = content.indexOf('TOP AFRO HOUSE VOL 7');
  const endIdx = content.indexOf('},', idx);
  
  // Replace the specific gumroadLink nearby
  // Wait, let's just use regex to find the gumroadLink that comes after TOP AFRO HOUSE VOL 7
  // before the next id:
  let block = content.substring(idx - 100, idx + 1000);
  console.log("BLOCK START:\n" + block.substring(0, 500) + "\nBLOCK END");

  // We want to replace the gumroadLink in this specific object
  content = content.replace(
    /title:\s*['"]TOP AFRO HOUSE VOL 7['"][\s\S]*?gumroadLink:\s*['"]([^'"]+)['"]/,
    (match, p1) => {
      console.log('Replacing gumroadLink: ' + p1);
      return match.replace(p1, 'https://topdjcrates.gumroad.com/l/zjmzhs');
    }
  );
  
  fs.writeFileSync(file, content);
  console.log('File updated.');
} else {
  console.log('TOP AFRO HOUSE VOL 7 not found in file!');
}
