const fs = require("fs");
const path = require("path");

function getJpegDimensions(buffer) {
  let i = 0;
  if (buffer[i] !== 0xff || buffer[i + 1] !== 0xd8) {
    throw new Error("Not a valid JPEG");
  }
  i += 2;

  while (i < buffer.length) {
    if (buffer[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buffer[i + 1];
    i += 2;

    // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = (buffer[i + 3] << 8) | buffer[i + 4];
      const width = (buffer[i + 5] << 8) | buffer[i + 6];
      const components = buffer[i + 7];
      return { width, height, components };
    } else if (marker === 0xd9 || marker === 0xda) {
      break;
    } else {
      const length = (buffer[i] << 8) | buffer[i + 1];
      i += length;
    }
  }
  throw new Error("Could not find SOF marker in JPEG");
}

const imgPath = path.join(__dirname, "..", "public", "assets", "me.jpg");
const imgBuffer = fs.readFileSync(imgPath);
const dims = getJpegDimensions(imgBuffer);
console.log("JPEG Dimensions:", dims, "Size in bytes:", imgBuffer.length);
