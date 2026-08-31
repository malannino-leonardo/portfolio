"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Copy,
  Check,
  Download,
  MapPin,
  Car,
} from "lucide-react";
import { SiGithub, SiLinkedin, SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { resumeDataByLocale, ResumeLocale } from "@/data/resume";
import { generateResumePDF } from "@/lib/pdf-generator";

export const ResumeView: React.FC = () => {
  const { toast } = useToast();
  const [locale, setLocale] = useState<ResumeLocale>("en");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentData = resumeDataByLocale[locale];
  const { personal, labels, experiences, skills, education, certifications } = currentData;

  // Dynamically set document title based on language
  useEffect(() => {
    const originalTitle = document.title;
    if (locale === "it") {
      document.title = `Curriculum Vitae - ${personal.name}`;
    } else {
      document.title = `Resume - ${personal.name}`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [locale, personal.name]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      toast({
        title: labels.copiedEmail,
        description: `${personal.email} copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: "Copy failed",
        description: `Please copy: ${personal.email}`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    try {
      setIsDownloading(true);
      const pdfBytes = generateResumePDF(locale);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const filename =
        locale === "it"
          ? `Curriculum_Vitae_${personal.name.replace(/\s+/g, "_")}.pdf`
          : `Resume_${personal.name.replace(/\s+/g, "_")}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: locale === "it" ? "Download avviato!" : "Download started!",
        description: filename,
      });
    } catch (error) {
      console.error("PDF download failed, opening API route fallback:", error);
      window.open(`/api/resume-pdf?locale=${locale}`, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const toolsSkills = skills.find((s) => s.category === "tools")?.items || [];
  const frontendSkills = skills.find((s) => s.category === "frontend")?.items || [];
  const backendSkills = skills.find((s) => s.category === "backend")?.items || [];
  const animationsSkills = skills.find((s) => s.category === "animations")?.items || [];

  return (
    <div className="min-h-screen w-full pt-20 sm:pt-24 pb-16 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-5">
      
      {/* Top Action Bar with EN/IT Language Switcher & Download PDF */}
      <div className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-card/70 backdrop-blur-md border border-border/60 shadow-md print:hidden">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{labels.backToPortfolio}</span>
          </Button>
        </Link>

        {/* Action Controls: Language Toggle + Copy Email + Download PDF */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          
          {/* EN / IT Segmented Switch */}
          <div className="flex items-center p-0.5 rounded-lg bg-secondary/80 border border-border/70 shadow-xs">
            <button
              onClick={() => setLocale("en")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-can-hover ${
                locale === "en"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="English version"
            >
              EN
            </button>
            <button
              onClick={() => setLocale("it")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-can-hover ${
                locale === "it"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Versione Italiana"
            >
              IT
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyEmail}
            className="flex-1 sm:flex-none gap-2 text-xs h-9 bg-background/90 hover:bg-secondary border-border/80 shadow-xs"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? labels.copiedEmail : labels.copyEmail}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 sm:flex-none gap-2 text-xs h-9 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{labels.downloadPdf}</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REALISTIC YELLOW NOTEBOOK PAPER SHEET CONTAINER WITH PUNCHED HOLES        */}
      {/* ========================================================================= */}
      <div className="relative w-full rounded-2xl bg-[#faf5e6] text-[#22201c] border border-[#e5dcbf] shadow-[0_12px_45px_rgba(0,0,0,0.22)] overflow-hidden transition-all duration-300">
        
        {/* Left Punched Binder Holes Strip */}
        <div 
          aria-hidden="true" 
          className="absolute left-0 top-0 bottom-0 w-10 sm:w-14 flex flex-col justify-between items-center py-6 sm:py-8 pointer-events-none select-none z-10"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-background border border-[#d6cbab] shadow-[inset_0_2px_4px_rgba(0,0,0,0.45)] transition-colors"
            />
          ))}
        </div>

        {/* Vertical Margin Line (notebook guide separator) */}
        <div 
          aria-hidden="true" 
          className="absolute left-10 sm:left-14 top-0 bottom-0 w-px bg-[#dfd4b4] pointer-events-none" 
        />

        {/* Content Wrapper inside the paper sheet with generous left margin */}
        <div className="pl-16 sm:pl-22 md:pl-28 pr-6 sm:pr-10 md:pr-14 py-8 sm:py-12 md:py-14 space-y-8">
          
          {/* ----------------------------------------------------------------------- */}
          {/* HEADER: Candidate Profile & Full-Width Professional Summary             */}
          {/* ----------------------------------------------------------------------- */}
          <header className="space-y-5">
            
            {/* Top Identity Row: Avatar aligned on left with Name & Contact Info */}
            <div className="flex flex-row gap-5 sm:gap-7 items-stretch">
              
              {/* Profile Avatar on the Left */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-[#d6cbab] shadow-md bg-[#eee7cf] shrink-0">
                <Image
                  src={personal.avatar}
                  alt={personal.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Personal Details: top aligned with top of pfp and bottom contact row aligned with bottom of pfp */}
              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1916] font-display leading-tight">
                    {personal.name}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-[#b45309] dark:text-[#c2410c] mt-0.5">
                    {personal.title}
                  </p>
                </div>

                {/* Contact Meta Grid pinned to bottom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:text-sm text-[#4b463a]">
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-2 hover:text-[#1a1916] transition-colors text-left group w-fit"
                    title="Click to copy email"
                  >
                    <Mail className="w-4 h-4 text-[#b45309] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs font-semibold">{personal.email}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#b45309] shrink-0" />
                    <span className="font-medium">{personal.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#b45309] shrink-0" />
                    <span className="font-medium">{personal.drivingLicenseLabel}: {personal.drivingLicense}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-1 sm:pt-0">
                    <Link
                      href={personal.social.github}
                      target="_blank"
                      className="inline-flex items-center gap-1 hover:text-[#1a1916] transition-colors font-medium"
                    >
                      <SiGithub className="w-3.5 h-3.5" />
                      <span className="text-xs">GitHub</span>
                    </Link>

                    <Link
                      href={personal.social.linkedin}
                      target="_blank"
                      className="inline-flex items-center gap-1 hover:text-[#1a1916] transition-colors font-medium"
                    >
                      <SiLinkedin className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span className="text-xs">LinkedIn</span>
                    </Link>

                    <Link
                      href={personal.social.instagram}
                      target="_blank"
                      className="inline-flex items-center gap-1 hover:text-[#1a1916] transition-colors font-medium"
                    >
                      <SiInstagram className="w-3.5 h-3.5 text-[#e1306c]" />
                      <span className="text-xs">Instagram</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary (Justified on the Left across the full content width) */}
            <div className="pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#635d4f] mb-1 font-display">
                {personal.summaryTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#2c2923] leading-relaxed font-sans font-normal">
                {personal.bio}
              </p>
            </div>
          </header>

          {/* ----------------------------------------------------------------------- */}
          {/* SECTION: SKILLS                                                         */}
          {/* ----------------------------------------------------------------------- */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-[#dfd4b4]">
              <span className="w-2.5 h-6 rounded-sm bg-[#b45309]" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#1a1916] uppercase font-display">
                {labels.skillsTitle}
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm pt-2">
              {/* Communication skills */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-start">
                <span className="font-bold text-[#1a1916]">{labels.communicationSkillsLabel}</span>
                <p className="text-[#3d382e] leading-relaxed">
                  {labels.communicationSkillsDesc}
                </p>
              </div>

              {/* Tools & Deployment */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-start">
                <span className="font-bold text-[#1a1916]">{labels.toolsLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {toolsSkills.map((s) => (
                    <span
                      key={s.name}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#ede4cc] text-[#1a1916] border border-[#dcd0af]"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Frontend */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-start">
                <span className="font-bold text-[#1a1916]">{labels.frontendLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {frontendSkills.map((s) => (
                    <span
                      key={s.name}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#ede4cc] text-[#1a1916] border border-[#dcd0af]"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend & Databases */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-start">
                <span className="font-bold text-[#1a1916]">{labels.backendLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {backendSkills.map((s) => (
                    <span
                      key={s.name}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#ede4cc] text-[#1a1916] border border-[#dcd0af]"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Animations & 3D */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-start">
                <span className="font-bold text-[#1a1916]">{labels.animationsLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {animationsSkills.map((s) => (
                    <span
                      key={s.name}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#ede4cc] text-[#1a1916] border border-[#dcd0af]"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* SECTION: EXPERIENCE                                                     */}
          {/* ----------------------------------------------------------------------- */}
          <section className="py-2 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-[#dfd4b4]">
              <span className="w-2.5 h-6 rounded-sm bg-[#b45309]" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#1a1916] uppercase font-display">
                {labels.experienceTitle}
              </h2>
            </div>

            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-2.5">
                  {/* Line 1: Role Title & Date Range */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#1a1916] tracking-tight">
                      {exp.title}
                    </h3>

                    <div className="text-xs sm:text-sm font-mono font-bold text-[#1a1916] uppercase shrink-0">
                      {exp.period}
                    </div>
                  </div>

                  {/* Line 2: Company / Studio Name & Location */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm -mt-1 pb-1">
                    <div className="font-bold text-[#b45309] flex items-center gap-1.5">
                      <span>{exp.company}</span>
                      <span className="font-medium text-[#635d4f]">({exp.companyType})</span>
                    </div>

                    <div className="text-[#635d4f] font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Summary Narrative */}
                  <p className="text-xs sm:text-sm text-[#3d382e] leading-relaxed">
                    {exp.summary}
                  </p>

                  {/* Bullets */}
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs sm:text-sm text-[#22201c] leading-relaxed">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* SECTION: EDUCATION                                                      */}
          {/* ----------------------------------------------------------------------- */}
          <section className="py-2 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-[#dfd4b4]">
              <span className="w-2.5 h-6 rounded-sm bg-[#b45309]" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#1a1916] uppercase font-display">
                {labels.educationTitle}
              </h2>
            </div>

            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-2.5">
                  {/* Line 1: Degree / Qualification & Date Period */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#1a1916] tracking-tight">
                      {edu.degree} – {edu.field}
                    </h3>

                    <div className="text-xs sm:text-sm font-mono font-bold text-[#1a1916] uppercase shrink-0">
                      {edu.period}
                    </div>
                  </div>

                  {/* Line 2: Institution & Location */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm -mt-1 pb-1">
                    <div className="font-bold text-[#b45309]">
                      {edu.institution}
                    </div>

                    <div className="text-[#635d4f] font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#3d382e] leading-relaxed">
                    {edu.description}
                  </p>

                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs sm:text-sm text-[#22201c] leading-relaxed">
                    {edu.highlights.map((item, idx) => (
                      <li key={idx} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* SECTION: CERTIFICATIONS                                                 */}
          {/* ----------------------------------------------------------------------- */}
          <section className="py-2 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-[#dfd4b4]">
              <span className="w-2.5 h-6 rounded-sm bg-[#b45309]" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#1a1916] uppercase font-display">
                {labels.certificationsTitle}
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm pt-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-[#1a1916]">{cert.title}</span>
                    {cert.level && (
                      <span className="text-[11px] text-[#524c3e] font-mono font-medium">
                        ({cert.level})
                      </span>
                    )}
                  </div>
                  <p className="text-[#4b463a] italic leading-relaxed pl-2.5 border-l-2 border-[#b45309]/50">
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* GDPR / Privacy Clause                                                   */}
          {/* ----------------------------------------------------------------------- */}
          <footer className="pt-6 border-t border-[#dfd4b4] text-center text-[10px] text-[#635d4f] leading-relaxed">
            {labels.privacyClause}
          </footer>

        </div>
      </div>

      {/* Bottom Footer Navigation Link */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 print:hidden text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{labels.backToPortfolio}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/#contact" className="hover:text-foreground transition-colors">
            {labels.contactForm}
          </Link>
          <span>•</span>
          <a href={`mailto:${personal.email}`} className="hover:text-foreground transition-colors">
            {personal.email}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeView;
