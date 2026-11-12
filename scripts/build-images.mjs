// Turns the huge studio photos into small, modern, responsive images.
// Run: npm run images   (originals stay untouched in the project root)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/assets/img";
const SRC = "photos";
await mkdir(OUT, { recursive: true });

// name -> source + crop (fractions of the original) + widths
const jobs = [
  { src: "Lekan-a4.jpg", name: "lekan-suit", crop: { l: 0.06, t: 0.03, w: 0.88, h: 0.86 }, widths: [400, 640, 920] },
  { src: "Lekan-4.jpg", name: "lekan-smile", crop: { l: 0.04, t: 0.04, w: 0.92, h: 0.92 }, widths: [400, 640, 880] },
  { src: "Lekan-2.jpg", name: "lekan-full", crop: { l: 0.16, t: 0.06, w: 0.68, h: 0.9 }, widths: [400, 640, 800] },
];

for (const j of jobs) {
  const file = `${SRC}/${j.src}`;
  const img = sharp(file).rotate();
  const { width, height } = await img.metadata();
  const region = {
    left: Math.round(width * j.crop.l),
    top: Math.round(height * j.crop.t),
    width: Math.round(width * j.crop.w),
    height: Math.round(height * j.crop.h),
  };
  for (const w of j.widths) {
    const base = sharp(file).rotate().extract(region).resize({ width: w });
    await base.clone().avif({ quality: 40, effort: 8, chromaSubsampling: "4:2:0" }).toFile(`${OUT}/${j.name}-${w}.avif`);
    await base.clone().webp({ quality: 62, effort: 6, smartSubsample: true }).toFile(`${OUT}/${j.name}-${w}.webp`);
    // JPEG is only the <img> fallback for very old browsers, so one size is enough
    if (w === 640) await base.clone().jpeg({ quality: 68, mozjpeg: true, progressive: true }).toFile(`${OUT}/${j.name}-${w}.jpg`);
  }
  // tiny blurred placeholder colour, printed so it can be pasted into CSS
  const { dominant } = await sharp(file).stats();
  console.log(j.name, region, "dominant:", dominant);
}

// Social share card (1200x630): portrait on the right of a forest-green card
const portrait = await sharp(`${SRC}/Lekan-a4.jpg`).rotate()
  .extract({ left: 600, top: 200, width: 4200, height: 4400 })
  .resize({ height: 630, width: 600, fit: "cover", position: "top" }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#1f3a2b"/>
  <text x="70" y="250" font-family="Georgia, serif" font-size="68" fill="#f4f1e8">Olalekan Amoo</text>
  <text x="70" y="330" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#c9d8bd">Backend &amp; Cloud Engineer</text>
  <text x="70" y="380" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#c9d8bd">Java · Spring Boot · AWS · Azure</text>
  <rect x="70" y="440" width="300" height="64" rx="32" fill="#c8643b"/>
  <text x="220" y="481" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#fff">Let's build →</text>
</svg>`;
await sharp(Buffer.from(svg)).composite([{ input: portrait, left: 600, top: 0 }])
  .jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/og-card.jpg`);
console.log("done");
