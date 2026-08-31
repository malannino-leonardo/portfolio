import { NextRequest, NextResponse } from "next/server";
import { generateResumePDF } from "@/lib/pdf-generator";
import { ResumeLocale } from "@/data/resume";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get("locale") || "en") as ResumeLocale;

  try {
    const pdfBuffer = generateResumePDF(locale === "it" ? "it" : "en");
    const filename =
      locale === "it"
        ? "Curriculum_Vitae_Leonardo_Malannino.pdf"
        : "Resume_Leonardo_Malannino.pdf";

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
