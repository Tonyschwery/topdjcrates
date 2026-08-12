const fs = require('fs');

const obj = {
  id: 1012,
  year: 2026,
  title: "TOP SOCA HITS",
  artist: "Various Artists",
  description: "Get 103 handpicked Soca hits, all featuring DJ-friendly Intro Clean edits. Perfect for seamless mixing and completely safe for any crowd. The ultimate high-energy Caribbean toolkit, 100% gig-ready in WAV & MP3.",
  cover: "https://i.imgur.com/xTd2kvf.jpeg",
  gumroadLink: "", // User will provide later
  tracklistUrl: "/tracklists/SOCA.html",
  originalPrice: 35,
  geoMetadata: {
    genre: "Soca/Caribbean",
    trackCount: "103",
    fileFormats: ["WAV", "MP3"],
    targetAudience: ["Professional DJs", "Club DJs"],
    useCases: ["Club Sets", "DJ Mixes", "Peak Time", "Warm-up"],
    moods: ["Energetic", "Danceable", "Caribbean"]
  },
  discountedPrice: 25,
  tracks: [
    {
      id: "2026_soca1",
      title: "Check the Vibe (Short Mix Preview)",
      audioPreview: "https://audio-hosting.netlify.app/soca- short preview.mp3"
    }
  ]
};

let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex !== -1) {
  const newObjStr = ',\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + '\n];';
  content = content.slice(0, lastBracketIndex) + newObjStr + content.slice(lastBracketIndex + 2);
  fs.writeFileSync('src/data/musicPacks.js', content);
  console.log("Successfully appended SOCA crate");
} else {
  console.log("Could not find ending bracket ]");
}
