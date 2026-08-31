"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Languages,
  Network,
  Computer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/data/resume";

interface ResumeCredentialsProps {
  education: ResumeData["education"];
  certifications: ResumeData["certifications"];
}

export const ResumeCredentials: React.FC<ResumeCredentialsProps> = ({
  education,
  certifications,
}) => {
  const getCertIcon = (type: string) => {
    switch (type) {
      case "cisco":
        return <Network className="w-5 h-5 text-sky-400" />;
      case "cambridge":
        return <Languages className="w-5 h-5 text-rose-400" />;
      case "icdl":
        return <Computer className="w-5 h-5 text-emerald-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* Education Column */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Education
            </h2>
            <p className="text-xs text-muted-foreground">
              Academic background and technical qualifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/40 transition-all duration-300 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-border/40">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {edu.degree}
                  </h3>
                  <p className="text-sm font-semibold text-primary">
                    {edu.field}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {edu.institution}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <Badge
                    variant="outline"
                    className="w-fit text-xs font-mono bg-background/80"
                  >
                    <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                    {edu.period}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                {edu.description}
              </p>

              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Learnings & Coursework
                </h4>
                <ul className="space-y-1.5">
                  {edu.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certifications Column */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Certifications
            </h2>
            <p className="text-xs text-muted-foreground">
              Industry-standard certified credentials & proficiencies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-5 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/40 transition-all duration-300 shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-background border border-border/60 shadow-xs group-hover:scale-105 transition-transform">
                    {getCertIcon(cert.iconType)}
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 tracking-wide bg-secondary/80 text-muted-foreground font-normal"
                  >
                    {cert.level}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                  {cert.issuer}
                </p>

                <p className="text-xs text-muted-foreground/90 mt-2 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/40">
                <div className="flex flex-wrap gap-1">
                  {cert.skillsValidated.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/60 text-muted-foreground border border-border/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResumeCredentials;
