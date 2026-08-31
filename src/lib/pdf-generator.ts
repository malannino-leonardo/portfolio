import { resumeDataByLocale, ResumeLocale } from "@/data/resume";
import { AVATAR_IMAGE } from "@/data/avatar-bytes";

export function generateResumePDF(locale: ResumeLocale = "en"): Uint8Array {
  const data = resumeDataByLocale[locale];
  const { personal, labels, experiences, skills, education, certifications } = data;

  // A4 dimensions in points (72 points = 1 inch)
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 42;
  const marginTop = 42;
  const marginBottom = 42;
  const contentWidth = pageWidth - marginX * 2;

  // Helper to escape PDF strings
  const escapePdf = (str: string) => {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/[^\x20-\x7E]/g, (ch) => {
        const code = ch.charCodeAt(0);
        if (code === 8211 || code === 8212) return "-"; // en-dash / em-dash
        if (code === 8216 || code === 8217) return "'"; // single quotes
        if (code === 8220 || code === 8221) return '"'; // double quotes
        if (code === 8226) return "-"; // bullet
        if (code === 224) return "\\340"; // à
        if (code === 232) return "\\350"; // è
        if (code === 233) return "\\351"; // é
        if (code === 236) return "\\354"; // ì
        if (code === 242) return "\\362"; // ò
        if (code === 249) return "\\371"; // ù
        if (code === 176) return "\\260"; // °
        return "?";
      });
  };

  const charWidth = (size: number, isBold: boolean = false) => {
    return size * (isBold ? 0.58 : 0.52);
  };

  // Word wrapping helper
  const wrapText = (text: string, maxWidth: number, fontSize: number, isBold: boolean = false): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = testLine.length * charWidth(fontSize, isBold);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.length ? lines : [""];
  };

  interface DrawCommand {
    type: "text" | "line" | "rect" | "image";
    x?: number;
    y?: number;
    text?: string;
    font?: string;
    size?: number;
    color?: [number, number, number];
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    w?: number;
    h?: number;
    fillColor?: [number, number, number];
    imgId?: string;
  }

  const pages: DrawCommand[][] = [[]];
  let currentPageIndex = 0;
  let currentY = pageHeight - marginTop;

  const getPage = () => pages[currentPageIndex];

  const forcePageBreak = () => {
    currentPageIndex++;
    pages[currentPageIndex] = [];
    currentY = pageHeight - marginTop;
  };

  const checkPageBreak = (neededHeight: number) => {
    if (currentY - neededHeight < marginBottom) {
      forcePageBreak();
    }
  };

  const addText = (
    text: string,
    font: "F1" | "F2" | "F3",
    size: number,
    color: [number, number, number] = [0.1, 0.1, 0.1],
    indent: number = 0,
    alignRight: boolean = false,
    customY?: number
  ) => {
    const y = customY !== undefined ? customY : currentY;
    const isBold = font === "F2";
    const width = text.length * charWidth(size, isBold);
    const x = alignRight ? pageWidth - marginX - width : marginX + indent;

    getPage().push({
      type: "text",
      x,
      y,
      text: escapePdf(text),
      font,
      size,
      color,
    });
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, color: [number, number, number] = [0.78, 0.74, 0.66]) => {
    getPage().push({
      type: "line",
      x1,
      y1,
      x2,
      y2,
      color,
    });
  };

  const addSectionHeader = (title: string) => {
    currentY -= 14;

    // Amber accent bar
    getPage().push({
      type: "rect",
      x: marginX,
      y: currentY - 1,
      w: 4,
      h: 12,
      fillColor: [0.7, 0.35, 0.05],
    });

    addText(title.toUpperCase(), "F2", 11, [0.1, 0.1, 0.1], 10);
    currentY -= 3.5;
    addLine(marginX, currentY, pageWidth - marginX, currentY, [0.82, 0.78, 0.7]);
    currentY -= 11;
  };

  // ==========================================
  // PAGE 1: HEADER, SUMMARY, SKILLS, JOBS 1 & 2
  // ==========================================

  // Profile Photo on the Left (68x68 points)
  const photoSize = 68;
  const photoX = marginX;
  // Align photo top edge with top of candidate name capital letters (currentY + 16)
  const photoY = currentY + 16 - photoSize;
  const textIndent = photoSize + 16;

  // Draw Avatar Photo
  getPage().push({
    type: "image",
    imgId: "Im1",
    x: photoX,
    y: photoY,
    w: photoSize,
    h: photoSize,
  });

  // Photo subtle border
  getPage().push({
    type: "rect",
    x: photoX,
    y: photoY,
    w: photoSize,
    h: photoSize,
    color: [0.8, 0.75, 0.65],
  });

  // Candidate Name
  addText(personal.name, "F2", 21, [0.1, 0.1, 0.1], textIndent);
  currentY -= 16;

  // Role Title
  addText(personal.title, "F2", 11.5, [0.7, 0.35, 0.05], textIndent);
  currentY -= 14;

  // Contact line 1: Email
  addText(personal.email, "F1", 9, [0.35, 0.35, 0.35], textIndent);
  currentY -= 12;

  // Contact line 2: Location & Driving License
  const contactLine2 = `${personal.location}   •   ${personal.drivingLicenseLabel}: ${personal.drivingLicense}`;
  addText(contactLine2, "F1", 9, [0.35, 0.35, 0.35], textIndent);

  // Set currentY safely below the photo block
  currentY = Math.min(currentY - 14, photoY - 14);

  // ------------------------------------------
  // PROFESSIONAL SUMMARY
  // ------------------------------------------
  addSectionHeader(personal.summaryTitle);

  const bioLines = wrapText(personal.bio, contentWidth, 9, false);
  for (const line of bioLines) {
    addText(line, "F1", 9, [0.15, 0.15, 0.15]);
    currentY -= 13;
  }
  currentY -= 2;

  // ------------------------------------------
  // SKILLS
  // ------------------------------------------
  addSectionHeader(labels.skillsTitle);

  // Communication Skills
  addText(`${labels.communicationSkillsLabel}:`, "F2", 9, [0.1, 0.1, 0.1]);
  const commLines = wrapText(labels.communicationSkillsDesc, contentWidth - 145, 9, false);
  let isFirstComm = true;
  for (const line of commLines) {
    addText(line, "F1", 9, [0.22, 0.22, 0.22], 145, false, isFirstComm ? currentY : undefined);
    currentY -= 12.5;
    isFirstComm = false;
  }
  currentY -= 2;

  // Technical Domain Skills
  for (const group of skills) {
    addText(`${group.categoryLabel}:`, "F2", 9, [0.1, 0.1, 0.1]);
    const itemsList = group.items.map((i) => i.label).join("  •  ");
    const skillLines = wrapText(itemsList, contentWidth - 145, 9, false);

    let isFirst = true;
    for (const line of skillLines) {
      addText(line, "F1", 9, [0.22, 0.22, 0.22], 145, false, isFirst ? currentY : undefined);
      currentY -= 12.5;
      isFirst = false;
    }
    currentY -= 2;
  }
  currentY -= 6;

  // ------------------------------------------
  // EXPERIENCE (Page 1 entries)
  // ------------------------------------------
  addSectionHeader(labels.experienceTitle);

  // Job 1: Hyrise Studios
  const exp1 = experiences[0];
  if (exp1) {
    addText(exp1.title, "F2", 10.5, [0.1, 0.1, 0.1]);
    addText(exp1.period, "F2", 9, [0.18, 0.18, 0.18], 0, true, currentY);
    currentY -= 13;

    addText(`${exp1.company} (${exp1.companyType})`, "F2", 9.5, [0.7, 0.35, 0.05]);
    addText(exp1.location, "F1", 8.5, [0.4, 0.4, 0.4], 0, true, currentY);
    currentY -= 13;

    const summaryLines = wrapText(exp1.summary, contentWidth, 9, false);
    for (const line of summaryLines) {
      addText(line, "F1", 9, [0.22, 0.22, 0.22]);
      currentY -= 12.5;
    }
    currentY -= 2;

    for (const ach of exp1.achievements) {
      const achLines = wrapText(ach, contentWidth - 14, 9, false);
      let isFirstBullet = true;
      for (const line of achLines) {
        if (isFirstBullet) {
          addText("-", "F2", 9, [0.7, 0.35, 0.05], 4);
        }
        addText(line, "F1", 9, [0.15, 0.15, 0.15], 14);
        currentY -= 12.5;
        isFirstBullet = false;
      }
    }
    currentY -= 12;
  }

  // Job 2: u-blox
  const exp2 = experiences[1];
  if (exp2) {
    addText(exp2.title, "F2", 10.5, [0.1, 0.1, 0.1]);
    addText(exp2.period, "F2", 9, [0.18, 0.18, 0.18], 0, true, currentY);
    currentY -= 13;

    addText(`${exp2.company} (${exp2.companyType})`, "F2", 9.5, [0.7, 0.35, 0.05]);
    addText(exp2.location, "F1", 8.5, [0.4, 0.4, 0.4], 0, true, currentY);
    currentY -= 13;

    const summaryLines = wrapText(exp2.summary, contentWidth, 9, false);
    for (const line of summaryLines) {
      addText(line, "F1", 9, [0.22, 0.22, 0.22]);
      currentY -= 12.5;
    }
    currentY -= 2;

    for (const ach of exp2.achievements) {
      const achLines = wrapText(ach, contentWidth - 14, 9, false);
      let isFirstBullet = true;
      for (const line of achLines) {
        if (isFirstBullet) {
          addText("-", "F2", 9, [0.7, 0.35, 0.05], 4);
        }
        addText(line, "F1", 9, [0.15, 0.15, 0.15], 14);
        currentY -= 12.5;
        isFirstBullet = false;
      }
    }
  }

  // ==========================================
  // PAGE 2: JOB 3, EDUCATION, CERTIFICATIONS, GDPR
  // ==========================================
  forcePageBreak();

  // Top header marker on Page 2 for continuity
  addText(`${personal.name}   •   ${personal.title}`, "F2", 9, [0.5, 0.5, 0.5]);
  addText(locale === "it" ? "Pagina 2 di 2" : "Page 2 of 2", "F1", 8.5, [0.5, 0.5, 0.5], 0, true, currentY);
  currentY -= 8;
  addLine(marginX, currentY, pageWidth - marginX, currentY, [0.82, 0.78, 0.7]);
  currentY -= 12;

  // Job 3: Student Developer
  const exp3 = experiences[2];
  if (exp3) {
    addText(exp3.title, "F2", 10.5, [0.1, 0.1, 0.1]);
    addText(exp3.period, "F2", 9, [0.18, 0.18, 0.18], 0, true, currentY);
    currentY -= 13;

    addText(`${exp3.company} (${exp3.companyType})`, "F2", 9.5, [0.7, 0.35, 0.05]);
    addText(exp3.location, "F1", 8.5, [0.4, 0.4, 0.4], 0, true, currentY);
    currentY -= 13;

    const summaryLines = wrapText(exp3.summary, contentWidth, 9, false);
    for (const line of summaryLines) {
      addText(line, "F1", 9, [0.22, 0.22, 0.22]);
      currentY -= 12.5;
    }
    currentY -= 2;

    for (const ach of exp3.achievements) {
      const achLines = wrapText(ach, contentWidth - 14, 9, false);
      let isFirstBullet = true;
      for (const line of achLines) {
        if (isFirstBullet) {
          addText("-", "F2", 9, [0.7, 0.35, 0.05], 4);
        }
        addText(line, "F1", 9, [0.15, 0.15, 0.15], 14);
        currentY -= 12.5;
        isFirstBullet = false;
      }
    }
    currentY -= 12;
  }

  // ------------------------------------------
  // EDUCATION
  // ------------------------------------------
  addSectionHeader(labels.educationTitle);

  for (const edu of education) {
    addText(`${edu.degree} – ${edu.field}`, "F2", 10.5, [0.1, 0.1, 0.1]);
    addText(edu.period, "F2", 9, [0.18, 0.18, 0.18], 0, true, currentY);
    currentY -= 13;

    addText(edu.institution, "F2", 9.5, [0.7, 0.35, 0.05]);
    addText(edu.location, "F1", 8.5, [0.4, 0.4, 0.4], 0, true, currentY);
    currentY -= 13;

    const eduDescLines = wrapText(edu.description, contentWidth, 9, false);
    for (const line of eduDescLines) {
      addText(line, "F1", 9, [0.22, 0.22, 0.22]);
      currentY -= 12.5;
    }
    currentY -= 2;

    for (const hl of edu.highlights) {
      const hlLines = wrapText(hl, contentWidth - 14, 9, false);
      let isFirstHl = true;
      for (const line of hlLines) {
        if (isFirstHl) {
          addText("-", "F2", 9, [0.7, 0.35, 0.05], 4);
        }
        addText(line, "F1", 9, [0.15, 0.15, 0.15], 14);
        currentY -= 12.5;
        isFirstHl = false;
      }
    }
    currentY -= 10;
  }

  // ------------------------------------------
  // CERTIFICATIONS
  // ------------------------------------------
  addSectionHeader(labels.certificationsTitle);

  for (const cert of certifications) {
    addText(cert.title, "F2", 9.5, [0.1, 0.1, 0.1]);
    if (cert.level) {
      addText(`(${cert.level})`, "F3", 8.5, [0.4, 0.4, 0.4], 0, true, currentY);
    }
    currentY -= 12;

    const certDescLines = wrapText(cert.description, contentWidth - 12, 8.5, false);
    for (const line of certDescLines) {
      addText(line, "F3", 8.5, [0.3, 0.3, 0.3], 12);
      currentY -= 12;
    }
    currentY -= 6;
  }

  // ------------------------------------------
  // GDPR / PRIVACY FOOTER
  // ------------------------------------------
  currentY -= 14;
  addLine(marginX, currentY, pageWidth - marginX, currentY, [0.88, 0.85, 0.8]);
  currentY -= 11;

  const privacyLines = wrapText(labels.privacyClause, contentWidth, 7.5, false);
  for (const line of privacyLines) {
    addText(line, "F1", 7.5, [0.45, 0.45, 0.45]);
    currentY -= 10;
  }

  // ==========================================
  // PDF OBJECT GENERATION & ENCODING
  // ==========================================
  const objects: string[] = [];

  // 1. Catalog
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

  const numPages = pages.length;
  const pageObjIds: number[] = [];
  let nextObjId = 3;

  for (let i = 0; i < numPages; i++) {
    pageObjIds.push(nextObjId);
    nextObjId += 2;
  }

  const fontF1Id = nextObjId++;
  const fontF2Id = nextObjId++;
  const fontF3Id = nextObjId++;
  const imageXObjId = nextObjId++;

  const kidsStr = pageObjIds.map((id) => `${id} 0 R`).join(" ");
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [ ${kidsStr} ] /Count ${numPages} >>\nendobj\n`);

  // Decode deflated avatar bytes from base64
  const avatarBytes = Buffer.from(AVATAR_IMAGE.deflatedBase64, "base64");

  pages.forEach((pageCommands, idx) => {
    const pageId = pageObjIds[idx];
    const contentId = pageId + 1;

    let stream = "";

    // Clean warm ivory background
    stream += `q\n`;
    stream += `0.985 0.975 0.945 rg\n`;
    stream += `0 0 ${pageWidth} ${pageHeight} re\n`;
    stream += `f\n`;
    stream += `Q\n`;

    for (const cmd of pageCommands) {
      if (cmd.type === "image") {
        stream += `q\n`;
        stream += `${cmd.w?.toFixed(2)} 0 0 ${cmd.h?.toFixed(2)} ${cmd.x?.toFixed(2)} ${cmd.y?.toFixed(2)} cm\n`;
        stream += `/${cmd.imgId} Do\n`;
        stream += `Q\n`;
      } else if (cmd.type === "line") {
        const [r, g, b] = cmd.color || [0, 0, 0];
        stream += `q\n`;
        stream += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG\n`;
        stream += `0.75 w\n`;
        stream += `${cmd.x1?.toFixed(2)} ${cmd.y1?.toFixed(2)} m\n`;
        stream += `${cmd.x2?.toFixed(2)} ${cmd.y2?.toFixed(2)} l\n`;
        stream += `S\n`;
        stream += `Q\n`;
      } else if (cmd.type === "rect") {
        if (cmd.fillColor) {
          const [r, g, b] = cmd.fillColor;
          stream += `q\n`;
          stream += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg\n`;
          stream += `${cmd.x?.toFixed(2)} ${cmd.y?.toFixed(2)} ${cmd.w?.toFixed(2)} ${cmd.h?.toFixed(2)} re\n`;
          stream += `f\n`;
          stream += `Q\n`;
        } else if (cmd.color) {
          const [r, g, b] = cmd.color;
          stream += `q\n`;
          stream += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG\n`;
          stream += `0.75 w\n`;
          stream += `${cmd.x?.toFixed(2)} ${cmd.y?.toFixed(2)} ${cmd.w?.toFixed(2)} ${cmd.h?.toFixed(2)} re\n`;
          stream += `S\n`;
          stream += `Q\n`;
        }
      } else if (cmd.type === "text") {
        const [r, g, b] = cmd.color || [0, 0, 0];
        stream += `BT\n`;
        stream += `/${cmd.font} ${cmd.size} Tf\n`;
        stream += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg\n`;
        stream += `${cmd.x?.toFixed(2)} ${cmd.y?.toFixed(2)} Td\n`;
        stream += `(${cmd.text}) Tj\n`;
        stream += `ET\n`;
      }
    }

    const streamLength = Buffer.byteLength(stream, "latin1");

    objects.push(
      `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 ${pageWidth} ${pageHeight} ] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontF1Id} 0 R /F2 ${fontF2Id} 0 R /F3 ${fontF3Id} 0 R >> /XObject << /Im1 ${imageXObjId} 0 R >> >> >>\nendobj\n`
    );

    objects.push(
      `${contentId} 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj\n`
    );
  });

  // Fonts Objects
  objects.push(`${fontF1Id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n`);
  objects.push(`${fontF2Id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n`);
  objects.push(`${fontF3Id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>\nendobj\n`);

  // Avatar Image XObject
  objects.push(
    `${imageXObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${AVATAR_IMAGE.width} /Height ${AVATAR_IMAGE.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${avatarBytes.length} >>\nstream\n` +
      avatarBytes.toString("binary") +
      `\nendstream\nendobj\n`
  );

  let pdfOutput = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdfOutput, "latin1"));
    pdfOutput += obj;
  }

  const xrefOffset = Buffer.byteLength(pdfOutput, "latin1");
  pdfOutput += `xref\n0 ${objects.length + 1}\n`;
  pdfOutput += `0000000000 65535 f \n`;

  for (const offset of offsets) {
    const padded = String(offset).padStart(10, "0");
    pdfOutput += `${padded} 00000 n \n`;
  }

  pdfOutput += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdfOutput += `startxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdfOutput, "latin1");
}
