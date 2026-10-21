import { createRequire } from "node:module";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const heroSource = "public/brand/mars-horizon.png";
const heroOutput = "public/brand/mars-horizon.webp";
await sharp(heroSource).webp({ lossless: true, effort: 6 }).toFile(heroOutput);
const digest = buffer => createHash("sha256").update(buffer).digest("hex");
const originalPixels = await sharp(heroSource).ensureAlpha().raw().toBuffer();
const optimizedPixels = await sharp(heroOutput).ensureAlpha().raw().toBuffer();
if (digest(originalPixels) !== digest(optimizedPixels)) throw new Error("Lossless hero verification failed.");
for (const width of [192, 384, 768, 1024]) {
  await sharp("public/brand/no-small-thing.jpeg").resize({ width, withoutEnlargement: true }).webp({ quality: 90, effort: 6 }).toFile(`public/brand/logo-${width}.webp`);
}
for (const width of [384, 768]) await sharp("public/brand/monogram.png").resize({ width }).webp({ quality: 92, effort: 6 }).toFile(`public/brand/monogram-${width}.webp`);
for (const width of [440, 880]) await sharp("public/brand/wordmark-white.png").resize({ width }).webp({ lossless: true, effort: 6 }).toFile(`public/brand/wordmark-${width}.webp`);
await sharp("public/brand/monogram.png").resize(128, 128).png().toFile("public/brand/monogram-icon.png");
await sharp(heroSource).resize(1200, 630, { fit: "contain", background: "#080809" }).jpeg({ quality: 92 }).toFile("public/brand/social-share.jpg");
for (const project of ["orbit", "form-and-field"]) {
  await sharp(`public/work/${project}.svg`).resize(1200, 630, { fit: "contain", background: "#080809" }).jpeg({ quality: 92 }).toFile(`public/work/${project}-social.jpg`);
}
const original = (await stat(heroSource)).size;
const optimized = (await stat(heroOutput)).size;
console.log(JSON.stringify({ heroOriginalBytes: original, heroOptimizedBytes: optimized, savingPercent: Math.round((1 - optimized / original) * 100), identicalDecodedPixels: true, originalLogoPreserved: (await readFile("public/brand/no-small-thing.jpeg")).length > 0 }));
