"use client";

import { useEffect, useRef, useState } from "react";

const ContributionGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadWidget, setShouldLoadWidget] = useState(false);

  useEffect(() => {
    if (!containerRef.current || shouldLoadWidget) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadWidget(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "400px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadWidget]);

  useEffect(() => {
    if (!shouldLoadWidget) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const existingLink = document.querySelector<HTMLLinkElement>(
      'link[data-gh-widget="stylesheet"]'
    );
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-gh-widget="script"]'
    );

    const notifyLayoutChange = () => {
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    };

    const link =
      existingLink ??
      Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href: "https://githubgraph.jigyansurout.com/assets/css/gh.css",
      });

    if (!existingLink) {
      link.setAttribute("data-gh-widget", "stylesheet");
      document.head.appendChild(link);
    }

    const script =
      existingScript ??
      Object.assign(document.createElement("script"), {
        src: "https://githubgraph.jigyansurout.com/assets/js/gh.js",
        async: true,
      });

    if (!existingScript) {
      script.setAttribute("data-gh-widget", "script");
      script.addEventListener("load", notifyLayoutChange, { once: true });
      document.body.appendChild(script);
    } else {
      notifyLayoutChange();
    }

    return () => {
      script.removeEventListener("load", notifyLayoutChange);
    };
  }, [shouldLoadWidget]);

  return (
    <div ref={containerRef} className="hidden md:block w-full overflow-x-auto">
      <style>{`
        #gh {
          --gh-bg-color: #070c18;
          --gh-text-default-color: #f1f5f9;
          --gh-cell-level0-color: #1e202e;
          --gh-border-card-color: #111a27;
          margin: 0 auto;
          width: max-content;
        }
      `}</style>
      <div className="min-w-max flex justify-center">
        <div id="gh" data-login="malannino-leonardo" data-show-thumbnail="true" />
      </div>
    </div>
  );
};

export default ContributionGraph;
