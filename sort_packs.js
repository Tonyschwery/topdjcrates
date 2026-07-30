const fs = require('fs');

const content = fs.readFileSync('src/data/musicPacks.js', 'utf-8');

// Find the start of the array
const startIdx = content.indexOf('export const musicPacks = [');
if (startIdx === -1) throw new Error('Could not find start of array');

const beforeArray = content.substring(0, startIdx + 'export const musicPacks = ['.length + 1);
const afterArrayStr = content.substring(startIdx + 'export const musicPacks = ['.length + 1);

// We need to parse objects. We will count brackets to correctly extract each object string.
const objects = [];
let braceCount = 0;
let currentObjStr = '';
let inString = false;
let stringChar = '';

for (let i = 0; i < afterArrayStr.length; i++) {
  const char = afterArrayStr[i];
  
  // Handle string literals
  if ((char === "'" || char === '"' || char === '`') && afterArrayStr[i-1] !== '\\') {
    if (!inString) {
      inString = true;
      stringChar = char;
    } else if (stringChar === char) {
      inString = false;
    }
  }

  if (!inString) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
  }

  if (braceCount > 0 || char === '}') {
    currentObjStr += char;
  }
  
  if (braceCount === 0 && !inString && char === '}') {
    objects.push(currentObjStr);
    currentObjStr = '';
    // Skip trailing commas and whitespace
    while (i + 1 < afterArrayStr.length && (afterArrayStr[i+1] === ',' || afterArrayStr[i+1] === ' ' || afterArrayStr[i+1] === '\n' || afterArrayStr[i+1] === '\r')) {
      i++;
    }
    
    // Check if we hit the end of the array
    if (afterArrayStr[i+1] === ']') {
      break;
    }
  }
}

// Now parse each object string to get its title and year for sorting
const parsedObjects = objects.map(objStr => {
  // Rough regex to find year
  const yearMatch = objStr.match(/year:\s*(\d+)/);
  const year = yearMatch ? parseInt(yearMatch[1]) : 0;
  
  // Rough regex to find title
  const titleMatch = objStr.match(/title:\s*['"`](.*?)['"`]/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Clean title for sorting (e.g., remove VOL X, PACK X, and numbers)
  let sortTitle = title.toUpperCase()
    .replace(/VOL\.?\s*\d+/g, '')
    .replace(/PACK\s*\d+/g, '')
    .replace(/PART\s*\d+/g, '')
    .replace(/202\d/g, '')
    .trim();
    
  return { str: objStr, year, sortTitle, title };
});

const mainPacks = parsedObjects.filter(p => p.year !== 2026);
const packs2026 = parsedObjects.filter(p => p.year === 2026);

// Sort function
const sortByTitle = (a, b) => a.sortTitle.localeCompare(b.sortTitle);

mainPacks.sort(sortByTitle);
packs2026.sort(sortByTitle);

// Combine and format
const sortedPacks = [...mainPacks, ...packs2026];
const newArrayContent = '\n  ' + sortedPacks.map(p => p.str).join(',\n  ') + '\n];\n';

fs.writeFileSync('src/data/musicPacks.js', beforeArray + newArrayContent);
console.log('Successfully sorted ' + sortedPacks.length + ' packs.');
