const fs = require("fs");
const path = require("path");

// Ensure public/assets/resume exists
const targetDir = path.join(__dirname, "..", "public", "assets", "resume");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Assets resume directory ready:", targetDir);
