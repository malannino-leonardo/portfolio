"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { usePreloader } from "@/components/preloader";
import { config } from "@/data/config";
import MatrixRain from "./matrix-rain";
import BootScreen from "./boot-screen";
import { Banner, COMMAND_NAMES, CommandContext, runCommand } from "./commands";
import { HOME, display, getNode, resolveSegments } from "./fs";
import "./terminal.css";

type Line = { id: number; node: React.ReactNode; cmd?: boolean };

const PATH_COMMANDS = new Set([
  "ls", "ll", "dir", "cd", "cat", "less", "more", "head", "tail", "tree", "find", "grep", "wc", "file", "open", "xdg-open",
]);
const OPEN_ALIASES = ["github", "linkedin", "x", "instagram", "email"];

const Prompt = ({ cwd }: { cwd: string }) => (
  <span className="term-prompt">
    <span className="term-prompt-long">leonardo@portfolio:</span>
    {display(cwd)}$
  </span>
);

export default function Terminal() {
  const router = useRouter();
  const { bypassLoading } = usePreloader();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [matrix, setMatrix] = useState(false);
  const [cwd, setCwdState] = useState(HOME);
  const cwdRef = useRef(HOME);
  const prevCwd = useRef(HOME);
  const idRef = useRef(0);
  const history = useRef<string[]>([]);
  const histPos = useRef(-1);
  const draft = useRef("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const booted = useRef(false);
  const matrixRef = useRef(false);
  // "boot" = Linux startup screen, "ready" = terminal UI powered on
  const [phase, setPhase] = useState<"boot" | "ready">("boot");
  const [fastBoot, setFastBoot] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInstant(true);
      setPhase("ready");
      return;
    }
    // second visit in the same tab session: same sequence, ~3x quicker
    try {
      if (sessionStorage.getItem("term-booted")) setFastBoot(true);
      sessionStorage.setItem("term-booted", "1");
    } catch {
      /* storage unavailable */
    }
  }, []);
  const theme: "light" | "dark" = mounted && resolvedTheme === "light" ? "light" : "dark";

  const push = useCallback((node: React.ReactNode, cmd = false) => {
    setLines((l) => [...l, { id: ++idRef.current, node, cmd }]);
  }, []);

  // lock page scroll behind the fullscreen terminal
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  // keep the newest output in view (also when async output such as heatmaps resizes)
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, cwd]);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const inner = el.firstElementChild;
    if (!inner) return;
    let stick = true;
    const onScroll = () => {
      stick = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      if (stick) el.scrollTop = el.scrollHeight;
    });
    ro.observe(inner);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const execRef = useRef<(raw: string) => void>(() => {});

  const ctx: CommandContext = useMemo(
    () => ({
      get cwd() {
        return cwdRef.current;
      },
      get prevCwd() {
        return prevCwd.current;
      },
      setCwd: (p: string) => {
        prevCwd.current = cwdRef.current;
        cwdRef.current = p;
        setCwdState(p);
      },
      run: (cmd: string) => execRef.current(cmd),
      clear: () => setLines([]),
      toggleMatrix: () => {
        matrixRef.current = !matrixRef.current;
        setMatrix(matrixRef.current);
        return matrixRef.current;
      },
      navigate: (href: string) => window.setTimeout(() => router.push(href), 450),
      get history() {
        return history.current;
      },
      theme,
      setTheme: (t: "light" | "dark") => setTheme(t),
    }),
    [router, theme, setTheme]
  );

  const exec = useCallback(
    (raw: string) => {
      const text = raw.trim();
      push(
        <span>
          <Prompt cwd={cwdRef.current} /> <span className="t-white">{raw}</span>
        </span>,
        true
      );
      if (!text) return;
      history.current.push(text);
      histPos.current = -1;
      const out = runCommand(text, ctx);
      if (out !== null && out !== undefined) push(out);
    },
    [push, ctx]
  );
  execRef.current = exec;

  // session start (once the Linux boot screen has handed over)
  useEffect(() => {
    if (phase !== "ready" || booted.current) return;
    booted.current = true;
    bypassLoading(); // the boot screen replaces the site preloader on this route
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps: React.ReactNode[] = [
      <span key="a" className="t-green">
        ► establishing secure connection to leonardo.malannino ...
      </span>,
      <span key="b" className="t-dim">
        handshake ok · mounting /home/leonardo (read-only)
      </span>,
      <Banner key="c" />,
    ];
    const timers: number[] = [];
    steps.forEach((n, i) => timers.push(window.setTimeout(() => push(n), reduce ? 0 : i * 260)));
    timers.push(window.setTimeout(() => exec("cat README.md"), reduce ? 0 : steps.length * 260 + 100));
    timers.push(window.setTimeout(() => exec("ls"), reduce ? 0 : steps.length * 260 + 300));
    if (window.matchMedia("(hover: hover)").matches) inputRef.current?.focus();
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const setValueAt = (v: string) => {
    setValue(v);
    setCaret(v.length);
  };

  /** Tab completion: commands for the first word, filesystem paths afterwards. */
  const complete = () => {
    const before = value.slice(0, caret);
    const parts = before.split(/\s+/);
    const last = parts[parts.length - 1];
    const head = before.slice(0, before.length - last.length);
    let candidates: string[] = [];
    if (parts.length === 1) {
      candidates = COMMAND_NAMES.filter((c) => c.startsWith(last.toLowerCase()));
    } else if (PATH_COMMANDS.has(parts[0])) {
      const slash = last.lastIndexOf("/");
      const dirPart = slash >= 0 ? last.slice(0, slash + 1) : "";
      const namePart = slash >= 0 ? last.slice(slash + 1) : last;
      const node = getNode(resolveSegments(cwdRef.current, dirPart || "."));
      if (node && node.type === "dir") {
        candidates = Object.keys(node.children)
          .filter((k) => k.startsWith(namePart))
          .map((k) => dirPart + k + (node.children[k].type === "dir" ? "/" : ""));
      }
      if (parts[0] === "open" || parts[0] === "xdg-open")
        candidates.push(...OPEN_ALIASES.filter((a) => a.startsWith(last) && !dirPart));
    }
    if (!candidates.length) return;
    if (candidates.length === 1) {
      const c = candidates[0];
      setValueAt(head + c + (c.endsWith("/") ? "" : " ") + value.slice(caret));
      return;
    }
    let pre = candidates[0];
    for (const m of candidates) while (!m.startsWith(pre)) pre = pre.slice(0, -1);
    setValueAt(head + pre + value.slice(caret));
    push(<span className="t-dim">{candidates.join("   ")}</span>);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = value;
      setValueAt("");
      exec(v);
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      if (histPos.current === -1) {
        draft.current = value;
        histPos.current = h.length - 1;
      } else histPos.current = Math.max(0, histPos.current - 1);
      setValueAt(h[histPos.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (histPos.current === -1) return;
      histPos.current++;
      const v = histPos.current >= h.length ? draft.current : h[histPos.current];
      if (histPos.current >= h.length) histPos.current = -1;
      setValueAt(v);
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      push(
        <span>
          <Prompt cwd={cwdRef.current} /> <span className="t-white">{value}</span>
          <span className="t-dim">^C</span>
        </span>,
        true
      );
      setValueAt("");
    }
  };

  const syncCaret = (el: HTMLInputElement) => setCaret(el.selectionStart ?? el.value.length);
  const before = value.slice(0, caret);
  const after = value.slice(caret);

  return (
    <div
      className="term-root"
      data-theme={theme}
      onClick={(e) => {
        if (window.getSelection?.()?.toString()) return; // let people copy output
        if ((e.target as HTMLElement).closest("a,button")) return;
        inputRef.current?.focus();
      }}
    >
      <MatrixRain active={matrix} light={theme === "light"} />
      {phase === "boot" && <BootScreen fast={fastBoot} onDone={() => setPhase("ready")} />}
      <div className={"term-wrap" + (phase === "boot" ? " is-booting" : instant ? "" : " is-powering-on")}>
        <div className="term-topbar">
          <Link href="/">← back to the 3D portfolio</Link>
          <span className="term-topright">
            <span>{config.author}</span>
            <button
              type="button"
              className="term-theme"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              title="Toggle light / dark"
            >
              {theme === "light" ? "☾ dark" : "☀ light"}
            </button>
          </span>
        </div>

        <div className="term-window" role="application" aria-label="Interactive terminal">
          <div className="term-titlebar">
            <span className="term-dot" style={{ background: "#ff5f56" }} />
            <span className="term-dot" style={{ background: "#ffbd2e" }} />
            <span className="term-dot" style={{ background: "#27c93f" }} />
            <span className="term-title">leonardo@portfolio: {display(cwd)}</span>
          </div>
          <div className="term-body" ref={bodyRef} aria-live="polite">
            <div>
              {lines.map((l) => (
                <div key={l.id} className={"term-line" + (l.cmd ? " cmd" : "")}>
                  {l.node}
                </div>
              ))}
            </div>
          </div>
          <div className="term-inputrow">
            <Prompt cwd={cwd} />
            <div className="term-inputwrap">
              <div className="term-mirror" data-ascii="skip" aria-hidden="true">
                {before}
                <span className="term-cursor" />
                {after}
              </div>
              <input
                ref={inputRef}
                className="term-input"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  syncCaret(e.target);
                }}
                onKeyDown={onKeyDown}
                onKeyUp={(e) => syncCaret(e.currentTarget)}
                onSelect={(e) => syncCaret(e.currentTarget)}
                onClick={(e) => syncCaret(e.currentTarget)}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                aria-label="terminal command input"
                data-ascii="skip"
              />
            </div>
          </div>
        </div>

        <div className="term-footer">
          <a href={config.social.github} target="_blank" rel="noopener noreferrer">
            github
          </a>
          ·
          <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer">
            linkedin
          </a>
          ·
          <a href={`mailto:${config.email}`}>email</a>
          ·
          <Link href="/resume">resume</Link>
        </div>
      </div>
    </div>
  );
}
