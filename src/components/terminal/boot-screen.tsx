"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Linux-style startup sequence shown before the terminal UI:
 * blinking tty cursor → kernel log → systemd units → tty login → `startx`.
 * Any key / tap skips it. Calls `onDone` once (finished or skipped).
 */

const OK = () => (
  <span>
    [<span className="t-green">{"  OK  "}</span>]
  </span>
);

const KERNEL: string[] = [
  "Linux version 6.8.0-matrix (leonardo@portfolio) (gcc version 13.2.0, GNU ld 2.42) #1 SMP PREEMPT_DYNAMIC",
  "Command line: BOOT_IMAGE=/boot/vmlinuz-6.8.0-matrix root=/dev/portfolio ro quiet",
  "BIOS-provided physical RAM map:",
  "BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
  "DMI: Leonardo Malannino Portfolio/Ronchi dei Legionari, BIOS 2026.11",
  "tsc: Detected 3600.000 MHz processor",
  "Memory: 16302412K/16777216K available (curiosity: unlimited)",
  "smpboot: CPU0: Hyrise Studio Core(TM) @ 3.60GHz (family: 0x6, model: 0xb7)",
  "smp: Brought up 1 node, 8 CPUs",
  "devtmpfs: initialized",
  "NET: Registered PF_INET protocol family",
  "PCI: Using configuration type 1 for base access",
  "usbcore: registered new interface driver usbhid",
  "input: AT Translated Set 2 keyboard as /devices/platform/i8042/serio0/input/input0",
  "EXT4-fs (sda1): mounted filesystem with ordered data mode. Quota mode: none.",
  "random: crng init done",
  "systemd[1]: systemd 255 running in system mode (+PAM +AUDIT +SELINUX +GNUTLS)",
  "systemd[1]: Detected architecture x86-64.",
  "systemd[1]: Hostname set to <portfolio>.",
];

const UNITS: [string, boolean][] = [
  // [unit description, show a "Starting ..." line first]
  ["Journal Service", false],
  ["Create Static Device Nodes in /dev", false],
  ["Load Kernel Modules", false],
  ["Mounted /home/leonardo", true],
  ["Network Manager", true],
  ["Reached target Network", false],
  ["Projects Indexer", true],
  ["GitHub Contributions Sync", true],
  ["Coffee Daemon", false],
  ["Permit User Sessions", false],
  ["Getty on tty1", false],
  ["Reached target Multi-User System", false],
];

type Step =
  | { t: "line"; node: React.ReactNode; wait: number }
  | { t: "clear"; wait: number }
  | { t: "type"; prefix: React.ReactNode; text: string; wait: number; char: number; keep?: boolean };

function stamp(sec: number) {
  return `[${sec.toFixed(6).padStart(12, " ")}]`;
}

function buildScript(): Step[] {
  const s: Step[] = [];
  let sec = 0;
  KERNEL.forEach((msg, i) => {
    sec = i < 3 ? 0 : sec + 0.02 + Math.random() * 0.12;
    s.push({
      t: "line",
      node: (
        <span>
          <span className="t-dim">{stamp(sec)}</span> {msg}
        </span>
      ),
      wait: i === 0 ? 0 : 25 + Math.random() * 55,
    });
  });
  s.push({ t: "line", node: " ", wait: 220 });
  s.push({
    t: "line",
    node: (
      <span>
        Welcome to <span className="t-cyan">Portfolio OS 26.11</span>!
      </span>
    ),
    wait: 120,
  });
  s.push({ t: "line", node: " ", wait: 60 });
  UNITS.forEach(([name, starting]) => {
    const reached = name.startsWith("Reached") || name.startsWith("Mounted");
    if (starting && !reached) {
      s.push({
        t: "line",
        node: <span>{"         "}Starting <span className="t-white">{name}</span>...</span>,
        wait: 40 + Math.random() * 60,
      });
    }
    s.push({
      t: "line",
      node: (
        <span>
          <OK /> {reached ? "" : "Started "}
          <span className="t-white">{name}</span>.
        </span>
      ),
      wait: 60 + Math.random() * 110,
    });
  });
  s.push({ t: "clear", wait: 450 });
  s.push({ t: "line", node: "Portfolio OS 26.11 portfolio tty1", wait: 80 });
  s.push({ t: "line", node: " ", wait: 0 });
  s.push({ t: "type", prefix: "portfolio login: ", text: "leonardo", wait: 450, char: 85 });
  s.push({ t: "type", prefix: "Password: ", text: "", wait: 260, char: 0 });
  s.push({
    t: "line",
    node: (
      <span className="t-dim">
        Last login: {new Date(Date.now() - 864e5).toString().slice(0, 24)} on tty1
      </span>
    ),
    wait: 520,
  });
  s.push({
    t: "type",
    prefix: <span className="t-green">leonardo@portfolio:~$ </span>,
    text: "startx",
    wait: 260,
    char: 95,
    keep: true,
  });
  return s;
}

export default function BootScreen({ fast = false, onDone }: { fast?: boolean; onDone: () => void }) {
  const [lines, setLines] = useState<{ id: number; node: React.ReactNode }[]>([]);
  const [current, setCurrent] = useState<React.ReactNode>(null);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const finished = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // console behaviour: once the log overflows, keep the newest line in view
  useEffect(() => {
    const el = rootRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, current]);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const k = fast ? 0.35 : 1;
    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        timers.push(window.setTimeout(r, ms * k));
      });
    let id = 0;
    const add = (node: React.ReactNode) => setLines((l) => [...l, { id: ++id, node }]);

    const finish = (skip: boolean) => {
      if (finished.current) return;
      finished.current = true;
      cancelled = true;
      if (skip) {
        doneRef.current();
        return;
      }
      setLeaving(true); // CRT power-off, then hand over to the UI
      timers.push(window.setTimeout(() => doneRef.current(), 380));
    };

    (async () => {
      // bare tty: just the blinking underscore in the top-left corner
      await sleep(1250);
      for (const step of buildScript()) {
        if (cancelled) return;
        await sleep(step.wait);
        if (cancelled) return;
        if (step.t === "line") add(step.node);
        else if (step.t === "clear") setLines([]);
        else {
          let typed = "";
          setCurrent(<span>{step.prefix}</span>);
          for (const ch of step.text) {
            await sleep(step.char * (0.6 + Math.random() * 0.8));
            if (cancelled) return;
            typed += ch;
            const t = typed;
            setCurrent(
              <span>
                {step.prefix}
                {t}
              </span>
            );
          }
          await sleep(160);
          if (cancelled) return;
          setCurrent(null);
          add(
            <span>
              {step.prefix}
              {typed}
            </span>
          );
        }
      }
      await sleep(420);
      if (!cancelled) finish(false);
    })();

    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey || e.altKey)) return; // keep browser shortcuts
      finish(true);
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [fast]);

  return (
    <div
      ref={rootRef}
      className={"term-boot" + (leaving ? " is-leaving" : "")}
      data-ascii="skip"
      aria-hidden="true"
    >
      <div className="term-boot-log">
        {lines.map((l) => (
          <div key={l.id} className="term-boot-line">
            {l.node}
          </div>
        ))}
        <div className="term-boot-line">
          {current}
          <span className="term-boot-cursor">_</span>
        </div>
      </div>
      <div className="term-boot-hint">press any key or tap to skip</div>
    </div>
  );
}
