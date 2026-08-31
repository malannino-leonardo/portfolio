const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// 1. Read me.jpg (which is PNG format)
const pngBuffer = fs.readFileSync(path.join(__dirname, "..", "public", "assets", "me.jpg"));

// 2. Parse PNG chunks
let pos = 8;
const idatChunks = [];
let width = 0;
let height = 0;

while (pos < pngBuffer.length) {
  const len = pngBuffer.readUInt32BE(pos);
  const type = pngBuffer.slice(pos + 4, pos + 8).toString("ascii");
  if (type === "IHDR") {
    width = pngBuffer.readUInt32BE(pos + 8);
    height = pngBuffer.readUInt32BE(pos + 12);
  } else if (type === "IDAT") {
    idatChunks.push(pngBuffer.slice(pos + 8, pos + 8 + len));
  }
  pos += 12 + len;
}

const allIdat = Buffer.concat(idatChunks);
const decompressed = zlib.inflateSync(allIdat);

console.log("PNG Parsed. Width:", width, "Height:", height, "Decompressed size:", decompressed.length);

// Unfilter PNG (sub, up, average, paeth or none)
// Standard RGB 8-bit row is 1 filter byte + width * 3 bytes
const rowBytes = 1 + width * 3;
const rawRgb = Buffer.alloc(width * height * 3);

for (let y = 0; y < height; y++) {
  const rowStart = y * rowBytes;
  const filter = decompressed[rowStart];
  for (let x = 0; x < width; x++) {
    const srcIdx = rowStart + 1 + x * 3;
    const destIdx = (y * width + x) * 3;

    // Simple unfiltering (standard RGB)
    let r = decompressed[srcIdx];
    let g = decompressed[srcIdx + 1];
    let b = decompressed[srcIdx + 2];

    if (filter === 1) { // Sub
      if (x > 0) {
        r = (r + rawRgb[destIdx - 3]) & 0xff;
        g = (g + rawRgb[destIdx - 2]) & 0xff;
        b = (b + rawRgb[destIdx - 1]) & 0xff;
      }
    } else if (filter === 2) { // Up
      if (y > 0) {
        const upIdx = ((y - 1) * width + x) * 3;
        r = (r + rawRgb[upIdx]) & 0xff;
        g = (g + rawRgb[upIdx + 1]) & 0xff;
        b = (b + rawRgb[upIdx + 2]) & 0xff;
      }
    } else if (filter === 3) { // Average
      const leftR = x > 0 ? rawRgb[destIdx - 3] : 0;
      const leftG = x > 0 ? rawRgb[destIdx - 2] : 0;
      const leftB = x > 0 ? rawRgb[destIdx - 1] : 0;
      const upIdx = ((y - 1) * width + x) * 3;
      const upR = y > 0 ? rawRgb[upIdx] : 0;
      const upG = y > 0 ? rawRgb[upIdx + 1] : 0;
      const upB = y > 0 ? rawRgb[upIdx + 2] : 0;
      r = (r + Math.floor((leftR + upR) / 2)) & 0xff;
      g = (g + Math.floor((leftG + upG) / 2)) & 0xff;
      b = (b + Math.floor((leftB + upB) / 2)) & 0xff;
    } else if (filter === 4) { // Paeth
      const leftR = x > 0 ? rawRgb[destIdx - 3] : 0;
      const leftG = x > 0 ? rawRgb[destIdx - 2] : 0;
      const leftB = x > 0 ? rawRgb[destIdx - 1] : 0;
      const upIdx = ((y - 1) * width + x) * 3;
      const upR = y > 0 ? rawRgb[upIdx] : 0;
      const upG = y > 0 ? rawRgb[upIdx + 1] : 0;
      const upB = y > 0 ? rawRgb[upIdx + 2] : 0;
      const diagIdx = ((y - 1) * width + (x - 1)) * 3;
      const diagR = (y > 0 && x > 0) ? rawRgb[diagIdx] : 0;
      const diagG = (y > 0 && x > 0) ? rawRgb[diagIdx + 1] : 0;
      const diagB = (y > 0 && x > 0) ? rawRgb[diagIdx + 2] : 0;

      function paeth(a, b, c) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        if (pa <= pb && pa <= pc) return a;
        if (pb <= pc) return b;
        return c;
      }

      r = (r + paeth(leftR, upR, diagR)) & 0xff;
      g = (g + paeth(leftG, upG, diagG)) & 0xff;
      b = (b + paeth(leftB, upB, diagB)) & 0xff;
    }

    rawRgb[destIdx] = r;
    rawRgb[destIdx + 1] = g;
    rawRgb[destIdx + 2] = b;
  }
}

// Downsample to target size (240x240) for high-DPI crisp rendering
const targetSize = 240;
const downsampled = Buffer.alloc(targetSize * targetSize * 3);

for (let dy = 0; dy < targetSize; dy++) {
  const sy = Math.floor((dy / targetSize) * height);
  for (let dx = 0; dx < targetSize; dx++) {
    const sx = Math.floor((dx / targetSize) * width);
    const srcIdx = (sy * width + sx) * 3;
    const destIdx = (dy * targetSize + dx) * 3;
    downsampled[destIdx] = rawRgb[srcIdx];
    downsampled[destIdx + 1] = rawRgb[srcIdx + 1];
    downsampled[destIdx + 2] = rawRgb[srcIdx + 2];
  }
}

const compressed = zlib.deflateSync(downsampled);
console.log("Downsampled 160x160 raw size:", downsampled.length, "Deflated size:", compressed.length);

// Save compressed base64 string for zero-dependency instant embedding
const base64Avatar = compressed.toString("base64");
fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "avatar-bytes.ts"),
  `export const AVATAR_IMAGE = {\n  width: ${targetSize},\n  height: ${targetSize},\n  deflatedBase64: "${base64Avatar}",\n};\n`
);
console.log("Saved to src/data/avatar-bytes.ts successfully!");
