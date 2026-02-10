"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "@/lib/lenis";
import { usePerformance } from "@/hooks/use-performance";

interface LenisProps {
  children: React.ReactNode;
  isInsideModal?: boolean;
}

function SmoothScroll({ children, isInsideModal = false }: LenisProps) {
  const { isLowPowerMode } = usePerformance();
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => {
      lenis?.stop();
      lenis?.start();
    });
  }, []);

  return (
    <ReactLenis
      root={!isInsideModal}
      options={{
        duration: isLowPowerMode ? 1 : 2,
        lerp: isLowPowerMode ? 0.1 : 0.05,
        smoothWheel: !isLowPowerMode, // Disable smooth wheel on low power for snappier feel
        prevent: (node) => {
          if (isInsideModal) return true;
          return !!node.closest('.modall');
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
