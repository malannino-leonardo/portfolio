const { spawnSync } = require("child_process");
const path = require("path");

const scriptPath = path.join(__dirname, "generate-static-pdfs.ts");
const result = spawnSync("npx", ["-y", "tsx", scriptPath], {
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}
