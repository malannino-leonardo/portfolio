"use client";

import Particles from "@/components/Particles";
import EasterEggs from "@/components/easter-eggs";
import ElasticCursor from "@/components/ui/ElasticCursor";
import { usePerformance } from "@/hooks/use-performance";
import { useDarkPage } from "@/components/dark-page-marker";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AppOverlays() {
  const { isLowPowerMode } = usePerformance();
  const { resolvedTheme } = useTheme();
  const darkPage = useDarkPage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // The starfield is an opaque dark canvas: in light mode it is only shown on
  // pages that are dark by design (404, /about, ...).
  const showStars = !mounted || resolvedTheme !== "light" || darkPage;

  return (
    <>
      {showStars && (
        <Particles
          className="fixed inset-0 -z-10 animate-fade-in"
          quantity={isLowPowerMode ? 40 : 100}
        />
      )}
      <EasterEggs />
      {!isLowPowerMode && <ElasticCursor />}
    </>
  );
}
