const fs = require('fs');

const obj = {
  id: 1011,
  year: 2026,
  title: "TOP RAKKAS MUSIC EDITS & REMIXES",
  artist: "Various Artists",
  description: "Get 50 exclusive remixes and edits featuring the biggest, most well-known Arabic artists. Engineered strictly for DJs, these high-energy Rakkas anthems are guaranteed to make the room move. 100% gig-ready in WAV & MP3.",
  cover: "https://i.imgur.com/CW75XoS.jpeg",
  gumroadLink: "", // TODO: User needs to provide this
  tracklistUrl: "/tracklists/RAKKAS1.html",
  originalPrice: 175,
  geoMetadata: {
    genre: "Arabic/Oriental",
    trackCount: "50",
    fileFormats: ["WAV", "MP3"],
    targetAudience: ["Professional DJs", "Club DJs"],
    useCases: ["Club Sets", "DJ Mixes", "Peak Time"],
    moods: ["Energetic", "Danceable", "Driving"]
  },
  discountedPrice: 100,
  tracks: [
    {
      id: "2026_rak1",
      title: "bass essma3 meni vs la colegiala (rakkas mashup)",
      audioPreview: "https://audio-hosting.netlify.app/rakkas - bass essma3 meni vs la colegiala (rakkas mashup).mp3"
    },
    {
      id: "2026_rak2",
      title: "gel gel gel scooby doo pa pa - dynstinct,lvbel c5 and pitbull (rakkas mashup)",
      audioPreview: "https://audio-hosting.netlify.app/rakkas - gel gel gel scooby doo pa pa - dynstinct,lvbel c5 and pitbull (rakkas mashup).mp3"
    },
    {
      id: "2026_rak3",
      title: "cute get busy - nawal el zoghbi (rakkas mashup)",
      audioPreview: "https://audio-hosting.netlify.app/rakkas - cute get busy - nawal el zoghbi (rakkas mashup).mp3"
    },
    {
      id: "2026_rak4",
      title: "jananto vs pump it up - zeina (rakkas mashup)",
      audioPreview: "https://audio-hosting.netlify.app/rakkas - jananto vs pump it up - zeina (rakkas mashup).mp3"
    },
    {
      id: "2026_rak5",
      title: "chou hal iyam - ziad rahbani (rakkas disco mix)",
      audioPreview: "https://audio-hosting.netlify.app/rakkas - chou hal iyam - ziad rahbani (rakkas disco mix).mp3"
    }
  ]
};

// We will use the same script sort_packs to append this object and write it out.
// But it's easier to just read musicPacks.js, find the end, and append.
let content = fs.readFileSync('src/data/musicPacks.js', 'utf8');

// Find the last `];`
const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex !== -1) {
  const newObjStr = ',\n  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + '\n];';
  content = content.slice(0, lastBracketIndex) + newObjStr + content.slice(lastBracketIndex + 2);
  fs.writeFileSync('src/data/musicPacks.js', content);
  console.log("Successfully appended new crate");
} else {
  console.log("Could not find ending bracket ]");
}
