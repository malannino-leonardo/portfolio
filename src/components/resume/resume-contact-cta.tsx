"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Printer,
} from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/data/config";

export const ResumeContactCta: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.email);
      setCopied(true);
      toast({
        title: "Email Copied!",
        description: `${config.email} copied to your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please manually copy: " + config.email,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="relative w-full rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-background p-8 sm:p-10 shadow-xl overflow-hidden print:hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Let&apos;s Build Something Extraordinary</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Interested in working together?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Whether you have an upcoming project, a freelance opportunity, or just want to connect, feel free to reach out.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/#contact" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 text-sm shadow-md">
              <MessageSquare className="w-4 h-4" />
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleCopyEmail}
            className="w-full sm:w-auto gap-2 text-sm bg-background/80 hover:bg-secondary border-border/80 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Email Copied!" : "Copy Email"}</span>
          </Button>

          <a
            href={`mailto:${config.email}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border/80 bg-background/80 hover:bg-secondary text-foreground transition-colors shadow-xs"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span>Send Email</span>
          </a>
        </div>
      </div>

      {/* Social Bar */}
      <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4 mt-8 pt-6 border-t border-border/40 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Leonardo Malannino. All rights reserved.</p>

        <div className="flex items-center gap-3">
          <Link
            href={config.social.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary"
            aria-label="GitHub"
          >
            <SiGithub className="w-4 h-4" />
          </Link>
          <Link
            href={config.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary"
            aria-label="LinkedIn"
          >
            <SiLinkedin className="w-4 h-4 text-blue-500" />
          </Link>
          <Link
            href={config.social.twitter}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary"
            aria-label="Twitter / X"
          >
            <SiX className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResumeContactCta;
