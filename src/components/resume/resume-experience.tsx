"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/data/resume";

interface ResumeExperienceProps {
  experiences: ResumeData["experiences"];
}

export const ResumeExperience: React.FC<ResumeExperienceProps> = ({
  experiences,
}) => {
  const [filterType, setFilterType] = useState<"All" | "Freelance" | "Internship" | "Academic">("All");

  const filteredExperiences = experiences.filter((exp) => {
    if (filterType === "All") return true;
    return exp.type === filterType;
  });

  return (
    <section className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Professional Experience
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Track record across client engineering, corporate IT, and collaborative software projects
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/50 border border-border/50">
          {(["All", "Freelance", "Internship", "Academic"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-can-hover ${
                filterType === type
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-border/60 space-y-8 mt-6">
        {filteredExperiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Timeline Node Dot */}
            <div
              className={`absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full border-2 bg-background transition-all duration-300 ${
                exp.current
                  ? "border-primary ring-4 ring-primary/20 scale-110"
                  : "border-muted-foreground/60 group-hover:border-primary group-hover:scale-110"
              }`}
            >
              {exp.current && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto my-0.5" />
              )}
            </div>

            {/* Experience Card */}
            <div className="p-6 rounded-2xl border border-border/50 bg-card/40 hover:bg-card/90 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg space-y-4">
              {/* Card Top: Title, Company, Period, Badges */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-border/40">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    {exp.badge && (
                      <Badge
                        variant={exp.current ? "default" : "secondary"}
                        className="text-[10px] px-2 py-0.5"
                      >
                        {exp.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/90 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      {exp.company}
                    </span>
                    <span className="text-muted-foreground/60">({exp.companyType})</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="w-fit text-xs gap-1.5 px-3 py-1 font-mono bg-background/80 border-border/70 text-foreground whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  {exp.period}
                </Badge>
              </div>

              {/* Summary / Role description */}
              <p className="text-sm text-foreground/90 leading-relaxed font-normal">
                {exp.summary}
              </p>

              {/* Key Bullet Points / Achievements */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Key Impact & Responsibilities
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {exp.achievements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Strip */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {exp.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-[11px] font-normal px-2.5 py-0.5 bg-secondary/60 hover:bg-secondary border border-border/40 text-foreground/80"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ResumeExperience;
