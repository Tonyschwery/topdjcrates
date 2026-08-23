const fs = require('fs');

const obj = {
  id: 1013,
  year: 2026,
  title: "TOP LATINO HOUSE 2026",
  artist: "Various Artists",
  description: "Get 96 handpicked tracks defining the absolute best in Latino House for the 2026 season. Vibrant brass, heavy percussion, and driving club basslines. A premium, zero-filler collection perfectly DJ-ready in WAV & MP3.",
  cover: "", // User provided a blob URL which won't work, leaving blank for now
  gumroadLink: "https://topdjcrates.gumroad.com/l/erwds",
  tracklistUrl: "/tracklists/TOPLATIN262.html",
  originalPrice: 35,
  geoMetadata: {
    genre: "Latino House",
    trackCount: "96",
    fileFormats: ["WAV", "MP3"],
    targetAudience: ["Professional DJs", "Club DJs"],
    useCases: ["Club Sets", "DJ Mixes", "Peak Time"],
    moods: ["Energetic", "Danceable", "Latin", "Vibrant"]
  },
  discountedPrice: 25,
  tracks: [
    {
      id: "2026_lat1",
      title: "movin' to the sun (mike violinist x matt&madmax remix) - ultra naté, hugel, imael angel",
      audioPreview: "https://audio-hosting.netlify.app/latinhouse26 - movin' to the sun (mike violinist x matt&madmax remix) - ultra naté, hugel, imael angel.mp3"
    },
    {
      id: "2026_lat2",
      title: "sinnerman - aaron sevilla, dj care, mikrobeats",
      audioPreview: "https://audio-hosting.netlify.app/latinhouse26 - sinnerman - aaron sevilla, dj care, mikrobeats.mp3"
    },
    {
      id: "2026_lat3",
      title: "sombrita - zaava",
      audioPreview: "https://audio-hosting.netlify.app/latinhouse26 - sombrita - zaava.mp3"
    },
    {
      id: "2026_lat4",
      title: "the power (mk ita 'cut' remix) - snap",
      audioPreview: "https://audio-hosting.netlify.app/latinhouse26 - the power (mk ita 'cut' remix) - snap.mp3"
    },
    {
      id: "2026_lat5",
      title: "adagio for strings (nolek edit) - tiësto",
      audioPreview: "https://audio-hosting.netlify.app/latinhouse26 - adagio for strings (nolek edit) - tiësto.mp3"
    }
  ]
};

let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex !== -1) {
  const newObjStr = ',\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + '\n];';
  content = content.slice(0, lastBracketIndex) + newObjStr + content.slice(lastBracketIndex + 2);
  fs.writeFileSync('src/data/musicPacks.js', content);
  console.log("Successfully appended LATINO HOUSE crate");
} else {
  console.log("Could not find ending bracket ]");
}
