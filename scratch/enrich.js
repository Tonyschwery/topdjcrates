const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/musicPacks.js');
let content = fs.readFileSync(filePath, 'utf8');

function generateGeoMetadata(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  let primaryGenre = 'Electronic';
  let subGenre = 'Dance';
  let useCases = ['Club Sets', 'DJ Mixes'];
  let moods = ['Energetic', 'Danceable'];
  let targetAudience = ['Professional DJs', 'Club DJs'];
  
  if (text.includes('afro')) {
    primaryGenre = 'House';
    subGenre = 'Afro-House';
    useCases.push('Warm-up', 'Peak Time');
    moods.push('Tribal', 'Groove');
  } else if (text.includes('tech')) {
    primaryGenre = 'House';
    subGenre = 'Tech House';
    useCases.push('Peak Time', 'Late Night');
    moods.push('Driving', 'Deep');
  } else if (text.includes('reggaeton')) {
    primaryGenre = 'Latin';
    subGenre = 'Reggaeton';
    useCases.push('Mainstream', 'Party');
    moods.push('Upbeat', 'Party');
  } else if (text.includes('arabic') || text.includes('oriental')) {
    primaryGenre = 'World';
    subGenre = 'Arabic/Oriental';
    useCases.push('Specialty Events', 'Weddings');
    moods.push('Cultural', 'Festive');
  } else if (text.includes('funky') || text.includes('disco')) {
    primaryGenre = 'House';
    subGenre = text.includes('disco') ? 'Disco House' : 'Funky House';
    useCases.push('Warm-up', 'Lounge', 'Party');
    moods.push('Groovy', 'Uplifting');
  } else if (text.includes('amapiano')) {
    primaryGenre = 'Electronic';
    subGenre = 'Amapiano';
    useCases.push('Lounge', 'Warm-up');
    moods.push('Deep', 'Soulful');
  } else if (text.includes('r&b') || text.includes('hip hop') || text.includes('shatta')) {
    primaryGenre = 'Urban';
    subGenre = 'R&B / Hip Hop';
    useCases.push('Party', 'Urban Sets');
    moods.push('Upbeat', 'Bouncy');
  } else if (text.includes('indie dance')) {
    primaryGenre = 'Electronic';
    subGenre = 'Indie Dance';
    useCases.push('Club Sets', 'Late Night');
    moods.push('Retro', 'Driving');
  } else if (text.includes('latin')) {
    primaryGenre = 'Latin';
    subGenre = 'Latin House';
    useCases.push('Peak Time', 'Party');
    moods.push('Energetic', 'Festive');
  } else if (text.includes('wedding')) {
    primaryGenre = 'Open Format';
    subGenre = 'Wedding Anthems';
    useCases = ['Weddings', 'Corporate Events', 'Mobile DJ'];
    moods = ['Celebratory', 'Romantic', 'Party'];
    targetAudience = ['Wedding DJs', 'Mobile DJs'];
  } else if (text.includes('bollywood')) {
    primaryGenre = 'World';
    subGenre = 'Bollywood';
    useCases.push('Weddings', 'Desi Events');
    moods.push('Festive', 'High Energy');
  } else if (text.includes('organic') || text.includes('downtempo')) {
    primaryGenre = 'House';
    subGenre = 'Organic / Downtempo';
    useCases = ['Sunset', 'Lounge', 'Beach Club'];
    moods = ['Earthy', 'Chill', 'Deep'];
    targetAudience.push('Lounge DJs');
  }

  // Extract track count from description like "150+" or "120 tracks"
  let trackCount = 'Multiple';
  const countMatch = description.match(/(\d+)\+/);
  if (countMatch) {
    trackCount = countMatch[1] + '+';
  } else {
    const countMatch2 = description.match(/(\d+)\s+hand-selected/);
    if (countMatch2) {
      trackCount = countMatch2[1];
    }
  }

  // Return formatted JSON-like string
  return `  geoMetadata: {
      primaryGenre: '${primaryGenre}',
      subGenre: '${subGenre}',
      trackCount: '${trackCount}',
      fileFormats: ['WAV', 'MP3'],
      targetAudience: ${JSON.stringify(targetAudience)},
      useCases: ${JSON.stringify(useCases)},
      moods: ${JSON.stringify(moods)}
    },`;
}

// Regex to find each crate block
// We look for title and description to generate metadata, and then insert it before originalPrice, tracks, or buttonText
const blockRegex = /({[^}]*?title:\s*(['"])(.*?)\2[^}]*?description:\s*(['"])(.*?)\4[^}]*?)(discountedPrice:|buttonText:|tracks:)/g;

const newContent = content.replace(blockRegex, (match, prefix, q1, title, q2, description, suffix) => {
  if (prefix.includes('geoMetadata')) return match; // Skip if already enriched
  
  const geoMetaStr = generateGeoMetadata(title, description);
  return prefix + geoMetaStr + '\n    ' + suffix;
});

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully enriched musicPacks.js');
