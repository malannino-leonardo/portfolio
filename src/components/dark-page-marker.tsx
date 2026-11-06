"use client";

import { useEffect, useState } from "react";

const EVENT = "darkpagechange";

/**
 * Marks pages whose own background is always dark (the 404 scene, /about, ...).
 * The global header/footer then use their dark-theme colours so they stay readable
 * when the site is in light mode (see globals.css), and the starfield backdrop
 * stays visible (see useDarkPage / AppOverlays).
 */
export default function DarkPageMarker() {
  useEffect(() => {
    document.body.dataset.darkPage = "true";
    window.dispatchEvent(new Event(EVENT));
    return () => {
      delete document.body.dataset.darkPage;
      window.dispatchEvent(new Event(EVENT));
    };
  }, []);
  return null;
}

/** True while a <DarkPageMarker /> is mounted. */
export function useDarkPage() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => setDark(document.body.dataset.darkPage === "true");
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);
  return dark;
}
