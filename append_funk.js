const fs = require('fs');

const obj = {
  id: 1016,
  year: 2026,
  title: "TOP FUNK/DISCO 2026",
  artist: "Various Artists",
  description: "Get 143 handpicked tracks, featuring a premium blend of fresh funk/disco anthems and brand-new club remixes of the biggest 80s classics. Iconic nostalgic vocals paired with modern, driving house beats. The ultimate feel-good toolkit, 100% gig-ready in WAV & MP3.",
  cover: "https://i.imgur.com/SA0tnwa.jpeg",
  gumroadLink: "https://topdjcrates.gumroad.com/l/pgabzf",
  tracklistUrl: "/tracklists/TOPFUNKDISCO.html",
  originalPrice: 35,
  geoMetadata: {
    genre: "Funk / Disco House",
    trackCount: "143",
    fileFormats: ["WAV", "MP3"],
    targetAudience: ["Professional DJs", "Club DJs"],
    useCases: ["Club Sets", "DJ Mixes", "Feel-good"],
    moods: ["Nostalgic", "Upbeat", "Driving", "Feel-good"]
  },
  discountedPrice: 25,
  tracks: [
    {
      id: "2026_fun1",
      title: "akalelo - joi n'juno",
      audioPreview: "https://audio-hosting.netlify.app/tfd26 - akalelo - joi n'juno.mp3"
    },
    {
      id: "2026_fun2",
      title: "nibolowa - 1da banton",
      audioPreview: "https://audio-hosting.netlify.app/tfd26 - nibolowa - 1da banton.mp3"
    },
    {
      id: "2026_fun3",
      title: "stand up - da lukas, stella brown",
      audioPreview: "https://audio-hosting.netlify.app/tfd26 - stand up - da lukas, stella brown.mp3"
    },
    {
      id: "2026_fun4",
      title: "dance, dance, dance (yowsah,yowsah,yowsah) - chic - 118",
      audioPreview: "https://audio-hosting.netlify.app/tfd26 -dance, dance, dance (yowsah,yowsah,yowsah) - chic - 118.mp3"
    },
    {
      id: "2026_fun5",
      title: "mr. cool - jo paciello, soultrain",
      audioPreview: "https://audio-hosting.netlify.app/tfd26 -mr. cool - jo paciello, soultrain.mp3"
    }
  ]
};

let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex !== -1) {
  const newObjStr = ',\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + '\n];';
  content = content.slice(0, lastBracketIndex) + newObjStr + content.slice(lastBracketIndex + 2);
  fs.writeFileSync('src/data/musicPacks.js', content);
  console.log("Successfully appended FUNK/DISCO crate");
} else {
  console.log("Could not find ending bracket ]");
}
