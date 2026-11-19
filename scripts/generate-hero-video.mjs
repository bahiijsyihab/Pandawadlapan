import fs from "node:fs";
import path from "node:path";

// Load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY belum diisi di .env.local");
  process.exit(1);
}

const prompt =
  "Cinematic minimalist luxury 3D reveal of an inverted geometric triangular ribbon emblem in brushed anodized silver and 24k gold (#F7D046), suspended inside a deep obsidian royal violet architectural studio (#160A2C) with fine orbiting gold light particles, slow smooth orbital camera movement, high contrast Apple keynote lighting, no text, seamless loop";

console.log("Menghubungi Gemini API (gemini-omni-1.2-flash)...");

const createRes = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/interactions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: "gemini-omni-1.2-flash",
      input: [{ type: "text", text: prompt }],
      response_format: {
        type: "video",
        delivery: "uri",
        aspect_ratio: "16:9",
        resolution: "720p",
        duration: "6s",
      },
    }),
  }
);

const createJson = await createRes.json().catch(() => ({}));
if (!createRes.ok) {
  console.error(`HTTP ${createRes.status} dari Gemini API:`);
  console.error(JSON.stringify(createJson, null, 2));
  process.exit(1);
}

const interactionId = createJson.id;
console.log(`Interaction dimulai: ${interactionId} (status: ${createJson.status})`);

let result = createJson;
for (let attempt = 0; attempt < 90; attempt++) {
  if (result.status === "completed" || result.status === "failed") break;
  await new Promise((r) => setTimeout(r, 5000));
  const pollRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/interactions/${interactionId}`,
    { headers: { "x-goog-api-key": apiKey } }
  );
  result = await pollRes.json();
  console.log(`Polling #${attempt + 1}: ${result.status}`);
}

if (result.status !== "completed") {
  console.error("Generasi video tidak selesai:", JSON.stringify(result, null, 2));
  process.exit(1);
}

// Find video output URI or inline data
const outputs = result.outputs || result.steps?.flatMap((s) => s.content || []) || [];
const videoPart = outputs.find((o) => o.type === "video" || o.mime_type?.startsWith("video/"));
if (!videoPart) {
  console.error("Tidak ditemukan output video di respons:", JSON.stringify(result, null, 2));
  process.exit(1);
}

const outFile = path.join(process.cwd(), "public", "assets", "hero-pandawa.mp4");
if (videoPart.data) {
  fs.writeFileSync(outFile, Buffer.from(videoPart.data, "base64"));
} else if (videoPart.uri) {
  const dl = await fetch(videoPart.uri, { headers: { "x-goog-api-key": apiKey } });
  const buf = Buffer.from(await dl.arrayBuffer());
  fs.writeFileSync(outFile, buf);
}
console.log(`Sukses! Video tersimpan di: ${outFile}`);
