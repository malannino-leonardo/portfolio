"use client";

import { useEffect } from "react";
import { AsciiReveal } from "@/lib/ascii-reveal";
import { usePreloader } from "@/components/preloader";
import { usePerformance } from "@/hooks/use-performance";

/**
 * Applies the ASCII decode effect to every text node in the document
 * (all routes). Starts once the preloader has finished so the effect is seen.
 */
export default function AsciiRevealProvider() {
  const { isLoading } = usePreloader();
  const { isLowPowerMode } = usePerformance();

  useEffect(() => {
    if (isLoading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const engine = new AsciiReveal({
      speed: isLowPowerMode ? 0.7 : 1,
      tick: isLowPowerMode ? 80 : 55,
      maxActive: isLowPowerMode ? 40 : 90,
    });
    engine.start(document.body);
    return () => engine.stop();
  }, [isLoading, isLowPowerMode]);

  return null;
}
