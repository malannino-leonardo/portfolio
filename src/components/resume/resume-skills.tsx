"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Search,
  Sparkles,
  Bot,
  Users,
  ShieldCheck,
  Cpu,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ResumeData } from "@/data/resume";

interface ResumeSkillsProps {
  skillGroups: ResumeData["skills"];
}

type TabKey = "all" | "languages" | "frontend" | "backend" | "tools" | "competencies";

export const ResumeSkills: React.FC<ResumeSkillsProps> = ({ skillGroups }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allSkills = useMemo(() => {
    return skillGroups.flatMap((group) => group.items);
  }, [skillGroups]);

  const filteredSkills = useMemo(() => {
    let list = activeTab === "all"
      ? allSkills
      : skillGroups.find((g) => g.category === activeTab)?.items || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, allSkills, skillGroups, searchQuery]);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All Skills", count: allSkills.length },
    {
      key: "languages",
      label: "Languages",
      count: skillGroups.find((g) => g.category === "languages")?.items.length || 0,
    },
    {
      key: "frontend",
      label: "Frontend",
      count: skillGroups.find((g) => g.category === "frontend")?.items.length || 0,
    },
    {
      key: "backend",
      label: "Backend & DB",
      count: skillGroups.find((g) => g.category === "backend")?.items.length || 0,
    },
    {
      key: "tools",
      label: "Tools & Cloud",
      count: skillGroups.find((g) => g.category === "tools")?.items.length || 0,
    },
    {
      key: "competencies",
      label: "Competencies",
      count: skillGroups.find((g) => g.category === "competencies")?.items.length || 0,
    },
  ];

  const getCompetencyIcon = (name: string) => {
    switch (name) {
      case "agentic-ai":
        return <Bot className="w-5 h-5 text-purple-400" />;
      case "teamwork":
        return <Users className="w-5 h-5 text-emerald-400" />;
      case "networking":
        return <Cpu className="w-5 h-5 text-sky-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Technical Arsenal & Skills
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Grouped by domain specialization, categorized with proficiency levels
          </p>
        </div>

        {/* Real-time search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-background/80 border-border/70 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-secondary/40 border border-border/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-can-hover flex items-center gap-1.5 ${
                isActive
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border/70 p-8">
          <Layers className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No skills matched &ldquo;{searchQuery}&rdquo;</p>
          <p className="text-xs text-muted-foreground mt-1">Try searching for TypeScript, React, Node.js or AI</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                {/* Top: Icon + Title + Level */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center p-1.5 border border-border/60 bg-background shadow-xs group-hover:scale-105 transition-transform duration-300"
                        style={{ borderColor: `${skill.color}30` }}
                      >
                        {skill.iconUrl ? (
                          <Image
                            src={skill.iconUrl}
                            alt={skill.label}
                            width={22}
                            height={22}
                            className="object-contain"
                          />
                        ) : (
                          getCompetencyIcon(skill.name)
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {skill.label}
                          {skill.featured && (
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                          )}
                        </h3>
                        <span className="text-[11px] text-muted-foreground capitalize">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    {skill.level && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5 font-normal tracking-wide bg-secondary/80 text-muted-foreground"
                      >
                        {skill.level}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2 group-hover:line-clamp-none transition-all">
                    {skill.description}
                  </p>
                </div>

                {/* Subtle Accent Glow Indicator */}
                <div
                  className="w-full h-0.5 rounded-full mt-3 opacity-20 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: skill.color || "hsl(var(--primary))" }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default ResumeSkills;
