import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const members = JSON.parse(fs.readFileSync(path.join(root, "src/data/members.json"), "utf8"));
const albums = JSON.parse(fs.readFileSync(path.join(root, "src/data/albums.json"), "utf8"));
const videos = JSON.parse(fs.readFileSync(path.join(root, "src/data/videos.json"), "utf8"));
const works = JSON.parse(fs.readFileSync(path.join(root, "src/data/works.json"), "utf8"));

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initialsOf(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "P") + (parts[1]?.[0] ?? "8")).toUpperCase();
}

// 1. Member editorial portraits (41 uniform 3:4 portraits)
const classPalettes = {
  "XII IPA 1": ["#160A2C", "#4C1D95", "#C58BF2", "#F7D046"],
  "XII IPA 2": ["#140D33", "#3730A3", "#7B92F8", "#F7D046"],
  "XII IPS": ["#1C0B2E", "#6D28D9", "#D8B4FE", "#5CE1E6"],
  "XII Agama": ["#160A2C", "#3B0764", "#5CE1E6", "#F7D046"],
};

ensureDir(path.join(root, "public/assets/members"));
for (const m of members) {
  const [c1, c2, c3, accent] = classPalettes[m.class_group] || classPalettes["XII IPA 1"];
  const idxNum = parseInt(m.index, 10);
  const cx = 180 + ((idxNum * 29) % 120) - 60;
  const cy = 150 + ((idxNum * 17) % 80) - 40;
  const init = initialsOf(m.full_name);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="65%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="#160A2C"/>
    </linearGradient>
    <radialGradient id="glow" cx="${(cx / 400).toFixed(2)}" cy="${(cy / 500).toFixed(2)}" r="0.65">
      <stop offset="0%" stop-color="${c3}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2E1065"/>
      <stop offset="100%" stop-color="#120724"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FBE38A"/>
      <stop offset="50%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="#C99A1A"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg)"/>
  <rect width="400" height="500" fill="url(#glow)"/>
  <g opacity="0.16" stroke="${c3}" fill="none">
    <circle cx="200" cy="215" r="145" stroke-width="1" stroke-dasharray="4 6"/>
    <polygon points="200,360 95,155 305,155" stroke-width="1.2"/>
  </g>
  <g opacity="0.09" fill="#FFFFFF" font-family="system-ui,sans-serif" font-weight="800" font-size="140" text-anchor="middle">
    <text x="200" y="295">${escapeXml(init)}</text>
  </g>
  <!-- Editorial studio silhouette -->
  <g transform="translate(0,18)">
    <ellipse cx="200" cy="196" rx="56" ry="64" fill="#1E1038" stroke="url(#gold)" stroke-opacity="0.45" stroke-width="1.5"/>
    <path d="M84,482 C92,352 135,302 200,302 C265,302 308,352 316,482 Z" fill="url(#suit)" stroke="url(#gold)" stroke-opacity="0.4" stroke-width="1.5"/>
    <path d="M168,306 L200,356 L232,306" fill="none" stroke="url(#gold)" stroke-width="2" stroke-opacity="0.75"/>
    <polygon points="200,336 188,312 212,312" fill="url(#gold)" opacity="0.85"/>
  </g>
  <!-- Monogram badge -->
  <g transform="translate(200,214)">
    <text x="0" y="10" text-anchor="middle" fill="#F8F7F4" font-family="system-ui,sans-serif" font-weight="800" font-size="38" letter-spacing="2">${escapeXml(init)}</text>
  </g>
  <!-- Frame accents -->
  <rect x="16" y="16" width="368" height="468" rx="14" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1"/>
  <text x="32" y="46" fill="#F7D046" font-family="ui-monospace,monospace" font-size="13" font-weight="700" letter-spacing="2">PANDAWA // #${escapeXml(m.index)}</text>
  <text x="368" y="46" text-anchor="end" fill="#E2E8F0" fill-opacity="0.7" font-family="ui-monospace,monospace" font-size="11">${escapeXml(m.class_group)}</text>
</svg>`;
  fs.writeFileSync(path.join(root, "public", m.photo_url), svg, "utf8");
}

// 2. Album covers & gallery photos (16:10 editorial photography cards)
const albumThemes = {
  "album-mpls-2024": ["#1A0B3B", "#4C1D95", "#F7D046", "#5CE1E6"],
  "album-makrab-2026": ["#120724", "#3B0764", "#F7D046", "#F97316"],
  "album-classmeeting-2026": ["#160A2C", "#1D4ED8", "#5CE1E6", "#F7D046"],
  "album-yearbook-2026": ["#160A2C", "#5B21B6", "#C58BF2", "#F7D046"],
};

function makeSceneSvg(title, subtitle, tag, palette, seed) {
  const [c1, c2, c3, c4] = palette;
  const cx1 = 220 + (seed * 97) % 420;
  const cy1 = 120 + (seed * 53) % 240;
  const cx2 = 760 - (seed * 71) % 340;
  const cy2 = 360 - (seed * 43) % 180;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="960" height="600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="#120724"/>
    </linearGradient>
    <radialGradient id="r1" cx="${(cx1 / 960).toFixed(2)}" cy="${(cy1 / 600).toFixed(2)}" r="0.55">
      <stop offset="0%" stop-color="${c3}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="r2" cx="${(cx2 / 960).toFixed(2)}" cy="${(cy2 / 600).toFixed(2)}" r="0.5">
      <stop offset="0%" stop-color="${c4}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="960" height="600" fill="url(#g)"/>
  <rect width="960" height="600" fill="url(#r1)"/>
  <rect width="960" height="600" fill="url(#r2)"/>
  <!-- Architectural grid & prism motif -->
  <g stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1" fill="none">
    <line x1="0" y1="150" x2="960" y2="150"/>
    <line x1="0" y1="300" x2="960" y2="300"/>
    <line x1="0" y1="450" x2="960" y2="450"/>
    <line x1="240" y1="0" x2="240" y2="600"/>
    <line x1="480" y1="0" x2="480" y2="600"/>
    <line x1="720" y1="0" x2="720" y2="600"/>
  </g>
  <g transform="translate(${480 + ((seed % 3) - 1) * 90}, 275)" fill="none">
    <circle r="155" stroke="${c3}" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="6 8"/>
    <circle r="110" stroke="${c4}" stroke-opacity="0.4" stroke-width="1"/>
    <polygon points="0,120 -115,-85 115,-85" stroke="#F7D046" stroke-width="2.5" fill="${c2}" fill-opacity="0.35"/>
    <polygon points="0,78 -72,-54 72,-54" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.2"/>
    <circle cx="0" cy="-8" r="10" fill="#F7D046"/>
  </g>
  <g fill="#FFFFFF" opacity="0.65">
    <circle cx="${140 + (seed * 41) % 200}" cy="${110 + (seed * 23) % 120}" r="3"/>
    <circle cx="${680 + (seed * 37) % 200}" cy="${120 + (seed * 29) % 140}" r="2.5"/>
    <circle cx="${740 + (seed * 19) % 160}" cy="${410 + (seed * 31) % 120}" r="3.5" fill="#F7D046"/>
    <circle cx="${180 + (seed * 59) % 180}" cy="${430 + (seed * 17) % 100}" r="2.5" fill="#5CE1E6"/>
  </g>
  <rect x="36" y="36" width="888" height="528" rx="18" fill="none" stroke="#FFFFFF" stroke-opacity="0.14"/>
  <text x="64" y="84" fill="#F7D046" font-family="ui-monospace,monospace" font-size="14" font-weight="700" letter-spacing="3">${escapeXml(tag)}</text>
  <text x="64" y="492" fill="#FFFFFF" font-family="system-ui,sans-serif" font-weight="800" font-size="36">${escapeXml(title)}</text>
  <text x="64" y="528" fill="#E2E8F0" fill-opacity="0.82" font-family="system-ui,sans-serif" font-size="18">${escapeXml(subtitle)}</text>
</svg>`;
}

ensureDir(path.join(root, "public/assets/albums"));
let seed = 1;
for (const album of albums) {
  const pal = albumThemes[album.id] || albumThemes["album-makrab-2026"];
  fs.writeFileSync(
    path.join(root, "public", album.cover_url),
    makeSceneSvg(album.title, `${album.date} • ${album.photos.length} Dokumentasi`, "ALBUM ARSIP // PANDAWA 08", pal, seed++),
    "utf8"
  );
  album.photos.forEach((p, idx) => {
    fs.writeFileSync(
      path.join(root, "public", p.url),
      makeSceneSvg(`${album.title} — #0${idx + 1}`, p.caption.slice(0, 68), `DOKUMENTASI ${album.date.toUpperCase()}`, pal, seed++),
      "utf8"
    );
  });
}

// 3. Video thumbnails (16:9)
ensureDir(path.join(root, "public/assets/videos"));
const vidPalettes = [
  ["#160A2C", "#5B21B6", "#F7D046", "#C58BF2"],
  ["#120724", "#3730A3", "#5CE1E6", "#7B92F8"],
  ["#1B0B32", "#6D28D9", "#F7D046", "#5CE1E6"],
  ["#160A2C", "#4C1D95", "#C58BF2", "#F7D046"],
];
videos.forEach((v, i) => {
  fs.writeFileSync(
    path.join(root, "public", v.thumbnail_url),
    makeSceneSvg(v.title.slice(0, 38), `${v.category} • Durasi ${v.duration}`, `ARSIP VIDEO // ${v.category.toUpperCase()}`, vidPalettes[i % vidPalettes.length], 20 + i * 3),
    "utf8"
  );
});

// 4. Works preview images
ensureDir(path.join(root, "public/assets/works"));
const workPalettes = {
  "Karya Tulis": ["#160A2C", "#4C1D95", "#F7D046", "#C58BF2"],
  "Desain Visual": ["#180A33", "#5B21B6", "#5CE1E6", "#F7D046"],
  "Audio/Musik": ["#120724", "#3730A3", "#7B92F8", "#5CE1E6"],
  Proyek: ["#160A2C", "#3B0764", "#5CE1E6", "#F7D046"],
};
works.forEach((w, i) => {
  const pal = workPalettes[w.category] || workPalettes["Proyek"];
  fs.writeFileSync(
    path.join(root, "public", w.preview_url),
    makeSceneSvg(w.title.slice(0, 36), w.subtitle || w.category, `ETALASE KARYA // ${w.category.toUpperCase()}`, pal, 40 + i * 5),
    "utf8"
  );
});

// 5. Generate real playable harmonic WAV file for Audio/Musik works (18 seconds, warm ambient chord progression)
ensureDir(path.join(root, "public/assets/audio"));
function generateAmbientWav(filePath) {
  const sampleRate = 22050;
  const durationSec = 16;
  const numSamples = sampleRate * durationSec;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Warm chord progression: Dm9 -> Bbmaj7 -> Fmaj7 -> C6 (4s each)
  const chords = [
    [146.83, 220.0, 261.63, 329.63, 440.0],
    [116.54, 174.61, 220.0, 293.66, 349.23],
    [174.61, 220.0, 261.63, 329.63, 523.25],
    [130.81, 196.0, 261.63, 329.63, 440.0],
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const chordIdx = Math.min(3, Math.floor(t / 4));
    const localT = t % 4;
    const freqs = chords[chordIdx];

    // Smooth swell envelope per bar + overall fade
    const barEnv = Math.sin((localT / 4) * Math.PI) * 0.75 + 0.25;
    const fadeIn = Math.min(1, t / 0.8);
    const fadeOut = Math.min(1, (durationSec - t) / 1.2);
    const env = barEnv * fadeIn * fadeOut;

    let sample = 0;
    for (let f = 0; f < freqs.length; f++) {
      const freq = freqs[f];
      const vibrato = 1 + 0.002 * Math.sin(2 * Math.PI * 3.5 * t + f);
      sample += Math.sin(2 * Math.PI * freq * vibrato * t) * (1 / freqs.length);
    }
    // Gentle arpeggio bell ping every 0.5s
    const arpStep = Math.floor(t * 2) % freqs.length;
    const arpLocal = (t * 2) % 1;
    const arpEnv = Math.exp(-arpLocal * 5.5) * 0.28;
    sample += Math.sin(2 * Math.PI * freqs[arpStep] * 2 * t) * arpEnv;

    const val = Math.max(-1, Math.min(1, sample * env * 0.55));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }
  fs.writeFileSync(filePath, buffer);
}

generateAmbientWav(path.join(root, "public/assets/audio/harmoni-delapan.wav"));
console.log("Generated 41 member portraits, 20 album assets, 4 video thumbnails, 9 work previews, and 1 WAV audio track.");
