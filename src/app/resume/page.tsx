import { Metadata } from "next";
import ResumeView from "@/components/resume/resume-view";
import { config } from "@/data/config";

export const metadata: Metadata = {
  title: `Resume | ${config.author} - Full-Stack Developer`,
  description:
    "Interactive resume and CV of Leonardo Malannino. Explore professional experience, technical skills in React, Next.js, TypeScript, Node.js, and verified Cisco certifications.",
  keywords: [
    ...config.keywords,
    "Resume",
    "CV",
    "Curriculum Vitae",
    "Experience",
    "Skills",
    "Certifications",
    "Full-Stack Developer",
  ],
  openGraph: {
    title: `Resume | ${config.author}`,
    description:
      "Interactive resume and technical skills matrix of Leonardo Malannino.",
    url: `${config.site}/resume`,
    type: "profile",
  },
};

export default function ResumePage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <ResumeView />
    </main>
  );
}
