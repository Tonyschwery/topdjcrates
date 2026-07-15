const fs = require('fs');

const dataPath = 'src/data/musicPacks.js';
let content = fs.readFileSync(dataPath, 'utf8');

// The duplicate IDs that need to be replaced (the SECOND occurrence of them)
const duplicatesToFix = [
  { oldId: 'id: 24,', newId: 'id: 1008,', titleSearch: 'Top Electro house' },
  { oldId: 'id: 26,', newId: 'id: 1009,', titleSearch: 'Top Arabic/Oriental Edits' }
];

duplicatesToFix.forEach(fix => {
  // Find the exact block by title
  const titleIndex = content.indexOf(fix.titleSearch);
  if (titleIndex !== -1) {
    // Look backward for the id property within a reasonable distance (e.g. 100 chars)
    const substring = content.substring(titleIndex - 100, titleIndex);
    const idIndex = substring.lastIndexOf(fix.oldId);
    
    if (idIndex !== -1) {
      const absoluteIdIndex = titleIndex - 100 + idIndex;
      content = content.substring(0, absoluteIdIndex) + fix.newId + content.substring(absoluteIdIndex + fix.oldId.length);
      console.log(`Replaced ${fix.oldId} with ${fix.newId} for ${fix.titleSearch}`);
    }
  }
});

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Finished updating IDs.');
