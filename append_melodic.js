const fs = require('fs');

const obj = {
  id: 1015,
  year: 2026,
  title: "TOP IMELODIC HOUSE 2026",
  artist: "Various Artists",
  description: "Get 103 handpicked tracks defining the absolute best in Melodic House for the 2026 season. Soaring synthesizers, emotional build-ups, and driving club basslines. A premium TopDJCrates collection that is 100% gig-ready in WAV & MP3.",
  cover: "https://i.imgur.com/LJR0yOh.jpeg",
  gumroadLink: "",
  tracklistUrl: "/tracklists/TOPIMELODICHOUSE2026.html",
  originalPrice: 35,
  geoMetadata: {
    genre: "Melodic House",
    trackCount: "103",
    fileFormats: ["WAV", "MP3"],
    targetAudience: ["Professional DJs", "Club DJs"],
    useCases: ["Club Sets", "DJ Mixes", "Peak Time", "Warm-up"],
    moods: ["Emotional", "Driving", "Soaring", "Deep"]
  },
  discountedPrice: 25,
  tracks: [
    {
      id: "2026_mel1",
      title: "afterglow - matrx",
      audioPreview: "https://audio-hosting.netlify.app/tmh26 - afterglow - matrx.mp3"
    },
    {
      id: "2026_mel2",
      title: "credence - sonickraft",
      audioPreview: "https://audio-hosting.netlify.app/tmh26 - credence - sonickraft.mp3"
    },
    {
      id: "2026_mel3",
      title: "katanga - yamil",
      audioPreview: "https://audio-hosting.netlify.app/tmh26 - katanga - yamil.mp3"
    },
    {
      id: "2026_mel4",
      title: "paloma - johnwaynes",
      audioPreview: "https://audio-hosting.netlify.app/tmh26 - paloma - johnwaynes.mp3"
    },
    {
      id: "2026_mel5",
      title: "take control - solara",
      audioPreview: "https://audio-hosting.netlify.app/tmh26 - take control - solara.mp3"
    }
  ]
};

let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex !== -1) {
  const newObjStr = ',\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + '\n];';
  content = content.slice(0, lastBracketIndex) + newObjStr + content.slice(lastBracketIndex + 2);
  fs.writeFileSync('src/data/musicPacks.js', content);
  console.log("Successfully appended IMELODIC HOUSE crate");
} else {
  console.log("Could not find ending bracket ]");
}
