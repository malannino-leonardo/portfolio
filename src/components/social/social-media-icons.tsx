"use client";

import { useInView } from "framer-motion";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { SiGithub, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { config } from "@/data/config";
import Link from "next/link";

const BUTTONS = [
  {
    name: "Github",
    href: config.social.github,
    icon: <SiGithub size={"24"} color={"currentColor"} aria-hidden="true" />,
  },
  {
    name: "LinkedIn",
    href: config.social.linkedin,
    icon: <SiLinkedin size={"24"} color={"currentColor"} aria-hidden="true" />,
  },
  {
    name: "Twitter",
    href: config.social.twitter,
    icon: <SiX size={"24"} color={"currentColor"} aria-hidden="true" />,
  },
  {
    name: "Instagram",
    href: config.social.instagram,
    icon: <SiInstagram size={"24"} color={"currentColor"} aria-hidden="true" />,
  },
];

const SocialMediaButtons = () => {
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { once: true });
  return (
    <div ref={ref} className="z-10" role="group" aria-label="Social media links">
      {show &&
        BUTTONS.map((button) => (
          <Link href={button.href} key={button.name} target="_blank" rel="noopener noreferrer" aria-label={`${button.name} (opens in a new tab)`}>
            <Button variant={"ghost"} className="text-foreground">{button.icon}</Button>
          </Link>
        ))}
    </div>
  );
};

export default SocialMediaButtons;
