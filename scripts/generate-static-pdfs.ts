import fs from "fs";
import path from "path";
import { generateResumePDF } from "../src/lib/pdf-generator";

const targetDir = path.join(__dirname, "..", "public", "assets", "resume");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Generating static resume PDFs...");

// Generate English resume
const enPdfBuffer = generateResumePDF("en");
const enPath = path.join(targetDir, "Resume_Leonardo_Malannino.pdf");
fs.writeFileSync(enPath, enPdfBuffer);
console.log(`Generated: ${enPath} (${enPdfBuffer.length} bytes)`);

// Generate Italian resume (Curriculum Vitae)
const itPdfBuffer = generateResumePDF("it");
const itPath = path.join(targetDir, "Curriculum_Vitae_Leonardo_Malannino.pdf");
fs.writeFileSync(itPath, itPdfBuffer);
console.log(`Generated: ${itPath} (${itPdfBuffer.length} bytes)`);

console.log("All resume PDFs regenerated successfully!");
