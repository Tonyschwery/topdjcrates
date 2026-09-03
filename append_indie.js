const fs = require('fs');

const obj = {
  id: 1014,
  year: 2026,
  title: "TOP INDIE DANCE 2026 VOL 2",
  artist: "Various Artists",
  description: "THE HOTTEST NEW SOUND: INDIE DANCE 2026 VOL 2 | Get 81 newly handpicked tracks defining the hottest Indie Dance and Dark Disco trends. Gritty synths meet heavy club grooves, curated perfectly for an unforgettable set. 100% gig-ready in WAV & MP3.",
  cover: "https://i.imgur.com/H4tU6YU.jpeg",
  gumroadLink: "https://topdjcrates.gumroad.com/l/nngsl",
  tracklistUrl: "/tracklists/TOPINDIEDANCE262.html",
  originalPrice: 35,
  geoMetadata: {
    genre: "Indie Dance / Dark Disco",
    trackCount: "81",
    fileFormats: ["WAV", "MP3"],
    targetAudience: ["Professional DJs", "Club DJs"],
    useCases: ["Club Sets", "DJ Mixes", "Peak Time"],
    moods: ["Gritty", "Dark", "Groove", "Energetic"]
  },
  discountedPrice: 25,
  tracks: [
    {
      id: "2026_ind1",
      title: "can't decide (airbender & roi power edit) - locky, max dean, luke dean",
      audioPreview: "https://audio-hosting.netlify.app/indiedance2 - can't decide (airbender & roi power edit) - locky, max dean, luke dean.mp3"
    },
    {
      id: "2026_ind2",
      title: "dance avec moi - original mix - stefano mapo",
      audioPreview: "https://audio-hosting.netlify.app/indiedance2 - dance avec moi - original mix - stefano mapo.mp3"
    },
    {
      id: "2026_ind3",
      title: "ring the bell - tom & collins",
      audioPreview: "https://audio-hosting.netlify.app/indiedance2 - ring the bell - tom & collins.mp3"
    },
    {
      id: "2026_ind4",
      title: "rockafeller skank (roi power edit)",
      audioPreview: "https://audio-hosting.netlify.app/indiedance2 - rockafeller skank (roi power edit).mp3"
    },
    {
      id: "2026_ind5",
      title: "teke - extended mix - bauha, lara (mx)",
      audioPreview: "https://audio-hosting.netlify.app/indiedance2 - teke - extended mix - bauha, lara (mx).mp3"
    }
  ]
};

let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex !== -1) {
  const newObjStr = ',\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + '\n];';
  content = content.slice(0, lastBracketIndex) + newObjStr + content.slice(lastBracketIndex + 2);
  fs.writeFileSync('src/data/musicPacks.js', content);
  console.log("Successfully appended INDIE DANCE crate");
} else {
  console.log("Could not find ending bracket ]");
}
