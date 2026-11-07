"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Linux-style startup sequence shown before the terminal UI:
 * blinking tty cursor → kernel log → systemd units → tty login → `startx`.
 *
 * With `sound`, the screen waits for a key / tap ("power on") because browsers
 * only allow audio after a user gesture. The boot log is then driven by the
 * audio clock so the text stays locked to the recording:
 *   0.15s power switch click · 1.55s drive spins up (kernel log)
 *   4.85s drive at speed ("Welcome to") · 5.0-7.3s head seeks (systemd units)
 *   7.6s steady hum (tty login)
 * Without `sound` (repeat visit in the same session) it runs silently and faster.
 * Once powered on, any key / tap skips. Calls `onDone` once.
 */

const SOUND_SRC = "/sounds/boot.mp3";
const VOLUME = 0.7;
// timeline, in seconds of /sounds/boot.mp3
const T_SPIN = 1.55;
const T_KERNEL_END = 4.7;
const T_READY = 4.85;
const T_UNITS = 5.0;
const T_UNITS_END = 7.3;
const T_LOGIN = 7.6;

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
  "ata1.00: ATA-9: PORTFOLIO HDD 1TB, 7200 rpm, max UDMA/133",
  "EXT4-fs (sda1): mounted filesystem with ordered data mode. Quota mode: none.",
  "random: crng init done",
  "systemd[1]: systemd 255 running in system mode (+PAM +AUDIT +SELINUX +GNUTLS)",
  "systemd[1]: Hostname set to <portfolio>.",
];

const UNITS: [string, boolean][] = [
  // [unit description, show a "Starting ..." line first]
  ["Journal Service", false],
  ["Create Static Device Nodes in /dev", false],
  ["Load Kernel Modules", false],
  ["Mounted /home/leonardo", false],
  ["Network Manager", true],
  ["Reached target Network", false],
  ["Projects Indexer", true],
  ["GitHub Contributions Sync", true],
  ["Coffee Daemon", false],
  ["Permit User Sessions", false],
  ["Getty on tty1", false],
  ["Reached target Multi-User System", false],
];

/** `at`: absolute time on the boot clock (s). `wait`: delay after the previous step (ms). */
type Step = { at?: number; wait?: number } & (
  | { t: "line"; node: React.ReactNode }
  | { t: "clear" }
  | { t: "type"; prefix: React.ReactNode; text: string; char: number }
);

const stamp = (sec: number) => `[${sec.toFixed(6).padStart(12, " ")}]`;
const jitter = (amp: number) => (Math.random() - 0.5) * amp;

function buildScript(): Step[] {
  const s: Step[] = [];

  // kernel log while the drive spins up: an instant burst, then a steady trickle
  let sec = 0;
  KERNEL.forEach((msg, i) => {
    sec = i < 3 ? 0 : sec + 0.02 + Math.random() * 0.12;
    const at =
      i < 3 ? T_SPIN + i * 0.04 : T_SPIN + 0.12 + ((i - 3) / (KERNEL.length - 4)) * (T_KERNEL_END - T_SPIN - 0.12) + jitter(0.08);
    s.push({
      t: "line",
      at,
      node: (
        <span>
          <span className="t-dim">{stamp(sec)}</span> {msg}
        </span>
      ),
    });
  });

  // drive at speed
  s.push({ t: "line", at: T_READY, node: " " });
  s.push({
    t: "line",
    at: T_READY + 0.03,
    node: (
      <span>
        Welcome to <span className="t-cyan">Portfolio OS 26.11</span>!
      </span>
    ),
  });
  s.push({ t: "line", at: T_READY + 0.06, node: " " });

  // systemd units over the head-seek clicks
  const unitLines: React.ReactNode[] = [];
  UNITS.forEach(([name, starting]) => {
    const plain = name.startsWith("Reached") || name.startsWith("Mounted");
    if (starting)
      unitLines.push(
        <span>
          {"         "}Starting <span className="t-white">{name}</span>...
        </span>
      );
    unitLines.push(
      <span>
        <OK /> {plain ? "" : "Started "}
        <span className="t-white">{name}</span>.
      </span>
    );
  });
  unitLines.forEach((node, i) => {
    const at = T_UNITS + (i / (unitLines.length - 1)) * (T_UNITS_END - T_UNITS) + (i ? jitter(0.06) : 0);
    s.push({ t: "line", at, node });
  });

  // steady hum: tty login
  s.push({ t: "clear", at: T_LOGIN });
  s.push({ t: "line", wait: 80, node: "Portfolio OS 26.11 portfolio tty1" });
  s.push({ t: "line", node: " " });
  s.push({ t: "type", wait: 450, prefix: "portfolio login: ", text: "leonardo", char: 85 });
  s.push({ t: "type", wait: 260, prefix: "Password: ", text: "", char: 0 });
  s.push({
    t: "line",
    wait: 520,
    node: <span className="t-dim">Last login: {new Date(Date.now() - 864e5).toString().slice(0, 24)} on tty1</span>,
  });
  s.push({ t: "type", wait: 260, prefix: <span className="t-green">leonardo@portfolio:~$ </span>, text: "startx", char: 95 });
  return s;
}

/** Fades an element out and stops it; independent of React so it survives unmount. */
function fadeOut(audio: HTMLAudioElement, ms: number) {
  if (audio.paused) return;
  const from = audio.volume;
  const t0 = performance.now();
  const id = window.setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    audio.volume = from * (1 - k);
    if (k >= 1) {
      window.clearInterval(id);
      audio.pause();
    }
  }, 30);
}

export default function BootScreen({
  fast = false,
  sound = false,
  onDone,
}: {
  fast?: boolean;
  sound?: boolean;
  onDone: () => void;
}) {
  const [lines, setLines] = useState<{ id: number; node: React.ReactNode }[]>([]);
  const [current, setCurrent] = useState<React.ReactNode>(null);
  const [leaving, setLeaving] = useState(false);
  const [powered, setPowered] = useState(!sound);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const rootRef = useRef<HTMLDivElement>(null);

  // console behaviour: once the log overflows, keep the newest line in view
  useEffect(() => {
    const el = rootRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, current]);

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    let started = false;
    const timers: number[] = [];
    const k = fast ? 0.35 : 1; // wall seconds per boot-clock second (silent mode only)

    let audio: HTMLAudioElement | null = null;
    if (sound) {
      audio = new Audio(SOUND_SRC);
      audio.preload = "auto";
      audio.volume = VOLUME;
    }

    // boot clock: the audio position while it plays, wall time otherwise
    let perf0 = 0;
    const clock = () => {
      if (audio && !audio.paused && !audio.ended && audio.currentTime > 0) return audio.currentTime;
      return (performance.now() - perf0) / 1000 / k;
    };
    const until = (t: number) =>
      new Promise<void>((resolve) => {
        const tick = () => {
          if (cancelled || clock() >= t) resolve();
          else timers.push(window.setTimeout(tick, 16));
        };
        tick();
      });
    const sleep = (ms: number) => until(clock() + ms / 1000);

    let id = 0;
    const add = (node: React.ReactNode) => setLines((l) => [...l, { id: ++id, node }]);

    const finish = (skip: boolean) => {
      if (finished) return;
      finished = true;
      cancelled = true;
      if (audio) fadeOut(audio, skip ? 500 : 1800);
      if (skip) {
        doneRef.current();
        return;
      }
      setLeaving(true); // CRT power-off, then hand over to the UI
      timers.push(window.setTimeout(() => doneRef.current(), 380));
    };

    const run = async () => {
      for (const step of buildScript()) {
        if (step.at !== undefined) await until(step.at);
        if (step.wait) await sleep(step.wait);
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
    };

    const start = () => {
      if (started) return;
      started = true;
      perf0 = performance.now();
      setPowered(true);
      // must be called synchronously inside the gesture handler
      audio?.play().catch(() => {
        audio = null; // blocked or failed: keep booting silently on wall time
      });
      run();
    };

    const onInput = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab")) return;
      if (!started) start();
      else finish(true);
    };
    if (!sound) start();
    window.addEventListener("keydown", onInput);
    window.addEventListener("click", onInput);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onInput);
      window.removeEventListener("click", onInput);
      if (audio && !finished) fadeOut(audio, 200); // e.g. navigating away mid-boot
    };
  }, [fast, sound]);

  return (
    <div
      ref={rootRef}
      className={"term-boot" + (leaving ? " is-leaving" : "")}
      data-ascii="skip"
      aria-hidden={powered ? "true" : undefined}
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
      {powered ? (
        <div className="term-boot-hint">press any key or tap to skip</div>
      ) : (
        <button type="button" className="term-boot-power">
          <span className="term-boot-power-icon" aria-hidden="true">
            ⏻
          </span>
          press any key or tap to power on
        </button>
      )}
    </div>
  );
}
