"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Copy,
  Check,
  Printer,
  MapPin,
  Car,
  Sparkles,
  Code2,
  Award,
  Briefcase,
  Layers,
} from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ResumeData } from "@/data/resume";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResumeHeroProps {
  personal: ResumeData["personal"];
}

export const ResumeHero: React.FC<ResumeHeroProps> = ({ personal }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      toast({
        title: "Email Copied!",
        description: `${personal.email} copied to your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please manually copy: " + personal.email,
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statIcons = [
    <Briefcase key="exp" className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
    <Code2 key="tech" className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
    <Award key="cert" className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
    <Layers key="proj" className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
  ];

  return (
    <section className="relative w-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden transition-all duration-300">
      {/* Background ambient glow effect */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner: Status & Quick Action Toolbar */}
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-2 px-3 py-1 text-xs font-medium border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {personal.status}
          </Badge>

          <Badge variant="secondary" className="gap-1.5 text-xs text-muted-foreground">
            <Car className="w-3.5 h-3.5" />
            {personal.drivingLicense}
          </Badge>
        </div>

        {/* Print & Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end print:hidden">
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2 text-xs h-9 bg-background/80 hover:bg-secondary border-border/70 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden xs:inline">Print / Save PDF</span>
                <span className="xs:hidden">PDF</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Print or export clean PDF document</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={handleCopyEmail}
                className="gap-2 text-xs h-9 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Email"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Quick copy {personal.email}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main Profile & Identity Info */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center pt-8">
        {/* Avatar with dynamic ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto lg:mx-0 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 border-border/80 p-1.5 shadow-2xl bg-gradient-to-b from-border/50 to-transparent group"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted">
            <Image
              src={personal.avatar}
              alt={personal.name}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-background border border-border shadow-md">
            <Sparkles className="w-4 h-4 text-brand" />
          </div>
        </motion.div>

        {/* Bio, Headline & Social links */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
                {personal.name}
              </h1>
            </div>

            <p className="text-lg sm:text-xl font-medium text-primary flex items-center justify-center lg:justify-start gap-2">
              <span>{personal.title}</span>
              <span className="text-muted-foreground/50 hidden sm:inline">•</span>
              <span className="text-sm font-normal text-muted-foreground hidden sm:flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {personal.location}
              </span>
            </p>
            <p className="text-xs text-muted-foreground sm:hidden flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {personal.location}
            </p>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
            {personal.bio}
          </p>

          {/* Social & Contact Strip */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-secondary-foreground border border-border/50 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>{personal.email}</span>
            </a>

            <Link
              href={personal.social.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-secondary-foreground border border-border/50 transition-colors"
            >
              <SiGithub className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </Link>

            <Link
              href={personal.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-secondary-foreground border border-border/50 transition-colors"
            >
              <SiLinkedin className="w-3.5 h-3.5 text-blue-500" />
              <span>LinkedIn</span>
            </Link>

            <Link
              href={personal.social.twitter}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-secondary-foreground border border-border/50 transition-colors"
            >
              <SiX className="w-3.5 h-3.5" />
              <span>Twitter / X</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-border/40">
        {personal.stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="group relative p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </span>
              <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                {statIcons[idx % statIcons.length]}
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground/90">
              {stat.label}
            </p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeHero;
