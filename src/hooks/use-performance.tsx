"use client";

import { useState, useEffect } from "react";

export function usePerformance() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      if (typeof window === "undefined") return;

      const nav = window.navigator as any;

      // 1. Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 2. Check for low memory (devices with < 4GB RAM)
      const isLowMemory = nav.deviceMemory && nav.deviceMemory < 4;

      // 3. Check for low CPU cores (devices with < 4 cores)
      const isLowCpu = nav.hardwareConcurrency && nav.hardwareConcurrency < 4;

      // 4. Check for mobile devices (often lower performance than desktops)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        nav.userAgent
      );

      setIsLowPowerMode(prefersReducedMotion || isLowMemory || isLowCpu || isMobile);
    };

    checkPerformance();
  }, []);

  return { isLowPowerMode };
}
