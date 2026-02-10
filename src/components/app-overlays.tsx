"use client";

import Particles from "@/components/Particles";
import EasterEggs from "@/components/easter-eggs";
import ElasticCursor from "@/components/ui/ElasticCursor";
import { usePerformance } from "@/hooks/use-performance";

export default function AppOverlays() {
  const { isLowPowerMode } = usePerformance();

  return (
    <>
      <Particles
        className="fixed inset-0 -z-10 animate-fade-in"
        quantity={isLowPowerMode ? 40 : 100}
      />
      <EasterEggs />
      {!isLowPowerMode && <ElasticCursor />}
    </>
  );
}
