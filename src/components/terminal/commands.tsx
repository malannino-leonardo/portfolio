"use client";

import React from "react";
import { resumeDataByLocale } from "@/data/resume";
import { config } from "@/data/config";
import { ContributionHeatmap, StreakStats } from "./contributions";
import { FsNode, HOME, display, lookup, sizeOf, walk } from "./fs";

const P = resumeDataByLocale.en.personal;

export interface CommandContext {
  cwd: string;
  prevCwd: string;
  setCwd: (p: string) => void;
  /** run a command line as if the user typed it (used by clickable ls entries) */
  run: (cmd: string) => void;
  clear: () => void;
  toggleMatrix: () => boolean;
  navigate: (href: string) => void;
  history: string[];
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export type Output = React.ReactNode;

/* ------------------------------ small pieces ----------------------------- */

const A = ({ href, children }: { href: string; children?: React.ReactNode }) => (
  <a
    href={href}
    target={href.startsWith("/") || href.startsWith("mailto:") ? undefined : "_blank"}
    rel="noopener noreferrer"
    className="t-link"
  >
    {children ?? href}
  </a>
);
const Dim = ({ children }: { children?: React.ReactNode }) => <span className="t-dim">{children}</span>;
const G = ({ children }: { children?: React.ReactNode }) => <span className="t-green">{children}</span>;
const Err = ({ children }: { children?: React.ReactNode }) => <div className="t-err">{children}</div>;

const URL_RE = /(https?:\/\/[^\s)]+|mailto:[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+|\/#contact)/g;

/** Text with clickable links (and optional highlighted matches). */
function Linkify({ text, hl }: { text: string; hl?: RegExp }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 1) {
          const href = p.includes("@") && !p.startsWith("mailto:") && !p.startsWith("http") ? `mailto:${p}` : p;
          return (
            <A key={i} href={href}>
              {p}
            </A>
          );
        }
        if (hl) {
          const segs = p.split(new RegExp(`(${hl.source})`, hl.flags.replace("g", "")));
          return segs.map((s, j) =>
            j % 2 === 1 ? (
              <mark key={`${i}-${j}`} className="t-mark">
                {s}
              </mark>
            ) : (
              <React.Fragment key={`${i}-${j}`}>{s}</React.Fragment>
            )
          );
        }
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

/** Markdown-ish file renderer: "# heading", "- bullet". */
function FileText({ text }: { text: string }) {
  return (
    <div>
      {text.split("\n").map((l, i) => {
        if (l.startsWith("# ")) {
          return (
            <div key={i} className="t-white">
              {l.slice(2)}
            </div>
          );
        }
        if (l.startsWith("- ")) {
          return (
            <div key={i} className="t-bullet">
              <G>›</G>
              <span>
                <Linkify text={l.slice(2)} />
              </span>
            </div>
          );
        }
        return (
          <div key={i} style={{ minHeight: l ? undefined : "0.8em" }}>
            <Linkify text={l} />
          </div>
        );
      })}
    </div>
  );
}

/** A clickable ls entry: folders `cd`, files `cat` (binary files `open`). */
function Entry({ name, node, full, ctx }: { name: string; node: FsNode; full: string; ctx: CommandContext }) {
  const isDir = node.type === "dir";
  const cmd = isDir
    ? `cd ${display(full)}`
    : node.type === "file" && node.binary
    ? `open ${display(full)}`
    : `cat ${display(full)}`;
  const cls = isDir ? "t-dir" : node.type === "file" && node.url && !name.endsWith(".md") ? "t-linkfile" : "t-file";
  return (
    <button type="button" className={"t-entry " + cls} onClick={() => ctx.run(cmd)} title={cmd}>
      {name}
      {isDir ? "/" : ""}
    </button>
  );
}

const MONTH = "Nov  6 09:41";

/* ------------------------------ command table ----------------------------- */

type Cmd = {
  desc: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[], ctx: CommandContext) => Output;
};

const split = (args: string[]) => {
  const flags = new Set<string>();
  const rest: string[] = [];
  const opts: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-n" || a === "-name" || a === "-type") {
      opts[a] = args[++i] ?? "";
    } else if (/^-\d+$/.test(a)) {
      opts["-n"] = a.slice(1);
    } else if (a.startsWith("-") && a.length > 1) {
      if (a.startsWith("--")) flags.add(a);
      else a.slice(1).split("").forEach((c) => flags.add("-" + c));
    } else rest.push(a);
  }
  return { flags, rest, opts };
};

const readonly = (name: string): Cmd => ({
  desc: "",
  hidden: true,
  run: (args) => (
    <Err>
      {name}: cannot modify {args[0] ?? "anything"}: Read-only file system (this is a portfolio, not prod)
    </Err>
  ),
});

function headTail(args: string[], ctx: CommandContext, mode: "head" | "tail"): Output {
  const { rest, opts } = split(args);
  const f = rest[0];
  if (!f) return <Err>{mode}: missing file operand</Err>;
  const { node } = lookup(ctx.cwd, f);
  if (!node) return <Err>{mode}: cannot open &apos;{f}&apos;: No such file or directory</Err>;
  if (node.type === "dir") return <Err>{mode}: error reading &apos;{f}&apos;: Is a directory</Err>;
  const n = Math.max(1, parseInt(opts["-n"] ?? "10", 10) || 10);
  const all = node.text.split("\n");
  return <FileText text={(mode === "head" ? all.slice(0, n) : all.slice(-n)).join("\n")} />;
}

export const COMMANDS: Record<string, Cmd> = {
  help: {
    desc: "list available commands",
    run: () => {
      const rows = Object.entries(COMMANDS).filter(([, c]) => !c.hidden);
      return (
        <div>
          <div className="t-white">Available commands</div>
          {rows.map(([name, c]) => (
            <div key={name} className="t-row">
              <span className="t-green t-key" style={{ minWidth: "16ch" }}>
                {name}
              </span>
              <span className="t-val">
                <Dim>{c.desc}</Dim>
              </span>
            </div>
          ))}
          <div className="mt-1">
            <Dim>
              Start with <G>ls</G>, then <G>cd projects</G> and <G>cat</G> a file. <G>Tab</G> completes, <G>↑ ↓</G>{" "}
              browse history, <G>man &lt;cmd&gt;</G> for usage.
            </Dim>
          </div>
        </div>
      );
    },
  },
  ls: {
    desc: "list directory contents",
    usage: "ls [-l] [-a] [path...]",
    run: (args, ctx) => {
      const { flags, rest } = split(args);
      const long = flags.has("-l");
      const all = flags.has("-a");
      const targets = rest.length ? rest : ["."];
      const blocks = targets.map((t, ti) => {
        const { path, node } = lookup(ctx.cwd, t);
        if (!node) return <Err key={ti}>ls: cannot access &apos;{t}&apos;: No such file or directory</Err>;
        const entries: { name: string; node: FsNode; full: string }[] = [];
        if (node.type === "file") entries.push({ name: t, node, full: path });
        else {
          if (all) {
            entries.push({ name: ".", node, full: path });
            entries.push({ name: "..", node, full: path.split("/").slice(0, -1).join("/") || "/" });
          }
          Object.keys(node.children)
            .sort((a, b) => a.localeCompare(b))
            .forEach((k) => entries.push({ name: k, node: node.children[k], full: `${path === "/" ? "" : path}/${k}` }));
        }
        const dot = (n: string) => n === "." || n === "..";
        const body = long ? (
          <div>
            <div>
              <Dim>total {entries.length * 4}</Dim>
            </div>
            {entries.map((e) => (
              <div key={e.name} className="t-row t-long">
                <span className="t-dim t-perm">{e.node.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"}</span>
                <span className="t-dim t-own">leonardo leonardo</span>
                <span className="t-dim t-size">{String(sizeOf(e.node)).padStart(5)}</span>
                <span className="t-dim t-date">{MONTH}</span>
                {dot(e.name) ? (
                  <span className="t-dir">{e.name}</span>
                ) : (
                  <Entry name={e.name} node={e.node} full={e.full} ctx={ctx} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="t-cols">
            {entries.map((e) =>
              dot(e.name) ? (
                <span key={e.name} className="t-dir">
                  {e.name}/
                </span>
              ) : (
                <Entry key={e.name} name={e.name} node={e.node} full={e.full} ctx={ctx} />
              )
            )}
          </div>
        );
        return targets.length > 1 ? (
          <div key={ti} className="mb-1">
            <div>{t}:</div>
            {body}
          </div>
        ) : (
          <div key={ti}>{body}</div>
        );
      });
      return <div>{blocks}</div>;
    },
  },
  cd: {
    desc: "change directory",
    usage: "cd [path]   (cd, cd ~, cd .., cd -)",
    run: (args, ctx) => {
      const target = args[0] ?? "~";
      const t = target === "-" ? ctx.prevCwd : target;
      const { path, node } = lookup(ctx.cwd, t);
      if (!node) return <Err>cd: {target}: No such file or directory</Err>;
      if (node.type !== "dir") return <Err>cd: {target}: Not a directory</Err>;
      ctx.setCwd(path);
      return target === "-" ? <span>{display(path)}</span> : null;
    },
  },
  pwd: { desc: "print working directory", run: (_a, ctx) => <span>{ctx.cwd}</span> },
  cat: {
    desc: "print files",
    usage: "cat <file...>",
    run: (args, ctx) => {
      const { rest } = split(args);
      if (!rest.length) return <Err>cat: missing file operand — try `ls`</Err>;
      return (
        <div>
          {rest.map((f, i) => {
            const { node } = lookup(ctx.cwd, f);
            if (!node) return <Err key={i}>cat: {f}: No such file or directory</Err>;
            if (node.type === "dir") return <Err key={i}>cat: {f}: Is a directory</Err>;
            if (node.binary)
              return (
                <div key={i}>
                  <Dim>{f}: binary file — use </Dim>
                  <G>open {f}</G>
                </div>
              );
            return (
              <div key={i} className={i ? "mt-1" : ""}>
                <FileText text={node.text} />
              </div>
            );
          })}
        </div>
      );
    },
  },
  head: { desc: "first lines of a file", usage: "head [-n N] <file>", run: (a, c) => headTail(a, c, "head") },
  tail: { desc: "last lines of a file", usage: "tail [-n N] <file>", run: (a, c) => headTail(a, c, "tail") },
  tree: {
    desc: "show the directory tree",
    usage: "tree [path]",
    run: (args, ctx) => {
      const { rest } = split(args);
      const { node, path } = lookup(ctx.cwd, rest[0] ?? ".");
      if (!node) return <Err>tree: {rest[0]}: No such file or directory</Err>;
      let dirs = 0;
      let files = 0;
      const rows: React.ReactNode[] = [];
      const rec = (n: FsNode, prefix: string, full: string) => {
        if (n.type !== "dir") return;
        const keys = Object.keys(n.children).sort();
        keys.forEach((k, i) => {
          const last = i === keys.length - 1;
          const c = n.children[k];
          if (c.type === "dir") dirs++;
          else files++;
          rows.push(
            <div key={full + "/" + k} className="t-tree">
              <Dim>{prefix + (last ? "└── " : "├── ")}</Dim>
              <span className={c.type === "dir" ? "t-dir" : ""}>{k}</span>
            </div>
          );
          rec(c, prefix + (last ? "    " : "│   "), full + "/" + k);
        });
      };
      rec(node, "", path);
      return (
        <div>
          <div className="t-dir">{display(path)}</div>
          {rows}
          <div className="mt-1">
            <Dim>
              {dirs} directories, {files} files
            </Dim>
          </div>
        </div>
      );
    },
  },
  find: {
    desc: "search for files by name",
    usage: "find [path] [-name pattern] [-type f|d]",
    run: (args, ctx) => {
      const { rest, opts } = split(args);
      const start = rest[0] ?? ".";
      const { node, path } = lookup(ctx.cwd, start);
      if (!node) return <Err>find: &apos;{start}&apos;: No such file or directory</Err>;
      const pat = opts["-name"];
      const re = pat
        ? new RegExp("^" + pat.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i")
        : null;
      const out: string[] = [];
      walk(path, node, (p, n) => {
        const base = p.split("/").pop() ?? "";
        if (opts["-type"] === "f" && n.type !== "file") return;
        if (opts["-type"] === "d" && n.type !== "dir") return;
        if (re && !re.test(base)) return;
        out.push(start === "." ? "." + p.slice(path.length) : start.replace(/\/$/, "") + p.slice(path.length));
      });
      if (!out.length) return <Dim>no matches</Dim>;
      return (
        <div>
          {out.map((o) => (
            <div key={o}>{o}</div>
          ))}
        </div>
      );
    },
  },
  grep: {
    desc: "search text in files",
    usage: "grep [-i] [-r] [-n] <pattern> [file|dir...]",
    run: (args, ctx) => {
      const { flags, rest } = split(args);
      const [pat, ...targets] = rest;
      if (!pat) return <Err>usage: grep [-i] [-r] [-n] pattern [file...]</Err>;
      let re: RegExp;
      try {
        re = new RegExp(pat, flags.has("-i") ? "gi" : "g");
      } catch {
        return <Err>grep: invalid pattern: {pat}</Err>;
      }
      const recursive = flags.has("-r") || flags.has("-R");
      if (!targets.length && !recursive) return <Err>grep: no input file (use -r to search the current folder)</Err>;
      const roots = targets.length ? targets : ["."];
      const hits: React.ReactNode[] = [];
      let n = 0;
      for (const t of roots) {
        const { node, path } = lookup(ctx.cwd, t);
        if (!node) {
          hits.push(<Err key={"e" + t}>grep: {t}: No such file or directory</Err>);
          continue;
        }
        if (node.type === "dir" && !recursive) {
          hits.push(<Err key={"d" + t}>grep: {t}: Is a directory</Err>);
          continue;
        }
        walk(path, node, (p, f) => {
          if (f.type !== "file" || f.binary) return;
          f.text.split("\n").forEach((line, i) => {
            re.lastIndex = 0;
            if (re.test(line) && n < 80) {
              n++;
              hits.push(
                <div key={p + i} className="t-grep">
                  <span className="t-cyan">{display(p)}</span>
                  <Dim>:{flags.has("-n") ? `${i + 1}:` : ""}</Dim>
                  <Linkify text={line} hl={re} />
                </div>
              );
            }
          });
        });
      }
      return hits.length ? <div>{hits}</div> : <Dim>no matches for &quot;{pat}&quot;</Dim>;
    },
  },
  wc: {
    desc: "count lines, words and bytes",
    usage: "wc <file...>",
    run: (args, ctx) => {
      const { rest } = split(args);
      if (!rest.length) return <Err>wc: missing file operand</Err>;
      return (
        <div>
          {rest.map((f) => {
            const { node } = lookup(ctx.cwd, f);
            if (!node) return <Err key={f}>wc: {f}: No such file or directory</Err>;
            if (node.type === "dir") return <Err key={f}>wc: {f}: Is a directory</Err>;
            const t = node.text;
            return (
              <div key={f}>
                {String(t.split("\n").length).padStart(6)} {String(t.split(/\s+/).filter(Boolean).length).padStart(6)}{" "}
                {String(t.length).padStart(6)} {f}
              </div>
            );
          })}
        </div>
      );
    },
  },
  file: {
    desc: "describe a file's type",
    usage: "file <path...>",
    run: (args, ctx) => (
      <div>
        {args.map((f) => {
          const { node } = lookup(ctx.cwd, f);
          if (!node) return <Err key={f}>{f}: cannot open (No such file or directory)</Err>;
          const kind =
            node.type === "dir" ? "directory" : node.binary ? "PDF document" : node.url ? "URL / link" : "UTF-8 text";
          return (
            <div key={f}>
              {f}: {kind}
            </div>
          );
        })}
      </div>
    ),
  },
  echo: {
    desc: "print text",
    usage: "echo [text...]   ($USER, $HOME, $PWD work)",
    run: (args, ctx) => (
      <span>
        {args
          .join(" ")
          .replace(/\$USER/g, "leonardo")
          .replace(/\$HOME/g, HOME)
          .replace(/\$PWD/g, ctx.cwd)}
      </span>
    ),
  },
  open: {
    desc: "open a file, folder or link",
    usage: "open <path | github | linkedin | x | instagram | email>",
    run: (args, ctx) => {
      const t = args[0];
      if (!t) return <Err>open: missing operand — try `open resume.pdf`</Err>;
      const social: Record<string, string> = {
        github: config.social.github,
        linkedin: config.social.linkedin,
        x: config.social.twitter,
        twitter: config.social.twitter,
        instagram: config.social.instagram,
        email: `mailto:${P.email}`,
      };
      const { node } = lookup(ctx.cwd, t);
      if (!node && social[t.toLowerCase()]) {
        window.open(social[t.toLowerCase()], "_blank", "noopener,noreferrer");
        return <Dim>opening {social[t.toLowerCase()]} ...</Dim>;
      }
      if (!node) return <Err>open: {t}: No such file or directory</Err>;
      if (node.type === "dir") return COMMANDS.ls.run([t], ctx);
      if (node.url) {
        if (node.url.startsWith("/#") || node.url === "/") ctx.navigate(node.url);
        else window.open(node.url, "_blank", "noopener,noreferrer");
        return <Dim>opening {node.url} ...</Dim>;
      }
      return COMMANDS.cat.run([t], ctx);
    },
  },
  man: {
    desc: "usage of a command",
    usage: "man <command>",
    run: (args) => {
      if (!args[0]) return <Err>What manual page do you want? e.g. `man ls`</Err>;
      const c = COMMANDS[args[0]];
      if (!c) return <Err>No manual entry for {args[0]}</Err>;
      return (
        <div>
          <div className="t-white">{args[0].toUpperCase()}(1)</div>
          <div>
            <G>NAME</G>
          </div>
          <div className="t-indent">
            {args[0]} — {c.desc || "no description"}
          </div>
          {c.usage && (
            <>
              <div>
                <G>SYNOPSIS</G>
              </div>
              <div className="t-indent">{c.usage}</div>
            </>
          )}
        </div>
      );
    },
  },
  which: {
    desc: "locate a command",
    usage: "which <command>",
    run: (args) => (
      <div>
        {args.map((a) => (COMMANDS[a] ? <div key={a}>/usr/bin/{a}</div> : <Err key={a}>{a} not found</Err>))}
      </div>
    ),
  },
  whoami: { desc: "print the current user", run: () => <span>leonardo</span> },
  id: {
    desc: "print user identity",
    run: () => <span>uid=1000(leonardo) gid=1000(leonardo) groups=1000(leonardo),27(sudo),100(creators)</span>,
  },
  hostname: { desc: "print the host name", run: () => <span>portfolio</span> },
  uname: {
    desc: "print system information",
    usage: "uname [-a]",
    run: (args) => <span>{args.includes("-a") ? "Linux portfolio 6.8.0-matrix #1 SMP PREEMPT x86_64 GNU/Linux" : "Linux"}</span>,
  },
  date: { desc: "print the date and time", run: () => <span>{new Date().toString()}</span> },
  uptime: {
    desc: "how long the system has been up",
    run: () => (
      <span>
        up since SEP 2021 (coding) · SEP 2025 (freelance) · load average: caffeine 0.9, curiosity 1.0, deadlines 0.3
      </span>
    ),
  },
  env: {
    desc: "print environment variables",
    run: (_a, ctx) => (
      <div>
        {[
          "USER=leonardo",
          `HOME=${HOME}`,
          `PWD=${ctx.cwd}`,
          "SHELL=/bin/matrix-sh",
          "LANG=en_US.UTF-8",
          "EDITOR=code",
          `LOCATION=${P.location}`,
          `STATUS=${P.status}`,
        ].map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    ),
  },
  history: {
    desc: "commands you've run",
    run: (_a, ctx) => (
      <div>
        {ctx.history.map((h, i) => (
          <div key={i}>
            <Dim>{String(i + 1).padStart(4)} </Dim> {h}
          </div>
        ))}
      </div>
    ),
  },
  clear: {
    desc: "clear the screen",
    run: (_a, ctx) => {
      ctx.clear();
      return null;
    },
  },
  /* -------------------- portfolio programs (extras) -------------------- */
  neofetch: {
    desc: "system info, portfolio edition",
    run: () => (
      <div>
        {[
          ["leonardo@portfolio", "─────────────────"],
          ["OS", "Portfolio OS (Next.js 14 · App Router)"],
          ["Host", P.location],
          ["Shell", "matrix-sh 1.0 (React 18)"],
          ["Languages", "TypeScript, JavaScript, Python, PHP, C++"],
          ["Frontend", "React, Next.js, Tailwind, GSAP, Framer Motion"],
          ["Backend", "Node.js, PostgreSQL, Supabase, Prisma"],
          ["3D", "Spline, PyOpenGL"],
          ["Editor", "VS Code + Claude Code"],
        ].map(([k, v]) => (
          <div key={k} className="t-row">
            <span className="t-green t-key" style={{ minWidth: "20ch" }}>
              {k}
            </span>
            <span className="t-val">{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  contributions: { desc: "live GitHub contribution heatmap", run: () => <ContributionHeatmap /> },
  streak: { desc: "GitHub streaks & stats", run: () => <StreakStats /> },
  matrix: {
    desc: "toggle the matrix rain background",
    run: (_a, ctx) => (
      <Dim>
        {ctx.toggleMatrix() ? "wake up, Leonardo... (run `matrix` again to calm down)" : "back to the real world."}
      </Dim>
    ),
  },
  theme: {
    desc: "switch light / dark theme",
    usage: "theme [light|dark]",
    run: (args, ctx) => {
      const want = args[0] === "light" || args[0] === "dark" ? args[0] : ctx.theme === "dark" ? "light" : "dark";
      ctx.setTheme(want);
      return <Dim>theme: {want}</Dim>;
    },
  },
  banner: { desc: "print the banner again", run: () => <Banner /> },
  gui: {
    desc: "leave the terminal, back to the 3D portfolio",
    run: (_a, ctx) => {
      ctx.navigate("/");
      return <Dim>exec gui ...</Dim>;
    },
  },
  exit: {
    desc: "leave the terminal",
    run: (_a, ctx) => {
      ctx.navigate("/");
      return <Dim>logout</Dim>;
    },
  },
  /* ------------------------------- hidden ------------------------------ */
  touch: readonly("touch"),
  mkdir: readonly("mkdir"),
  rmdir: readonly("rmdir"),
  mv: readonly("mv"),
  cp: readonly("cp"),
  chmod: readonly("chmod"),
  chown: readonly("chown"),
  ln: readonly("ln"),
  rm: {
    desc: "",
    hidden: true,
    run: (a) =>
      a.join(" ").includes("-rf") ? (
        <Err>rm: it is dangerous to operate recursively on &apos;/&apos; — and I have deploy keys. no.</Err>
      ) : (
        <Err>rm: cannot remove {a[0] ?? "file"}: Read-only file system</Err>
      ),
  },
  sudo: {
    desc: "",
    hidden: true,
    run: () => (
      <span>
        <span className="t-yellow">[sudo] password for leonardo:</span>{" "}
        <Dim>nice try. this is a portfolio, not prod.</Dim>
      </span>
    ),
  },
  vim: { desc: "", hidden: true, run: () => <Dim>you&apos;re now trapped. (kidding — press Esc, :q!, Enter)</Dim> },
  hack: {
    desc: "",
    hidden: true,
    run: () => (
      <div>
        <G>[■■■■■■■■■■■■■■■■■■■■] 100%</G>{" "}
        <Dim>access granted... to a very good portfolio. try `cat contact/email.txt`.</Dim>
      </div>
    ),
  },
};

// aliases
COMMANDS["ll"] = { ...COMMANDS.ls, hidden: true, run: (a, c) => COMMANDS.ls.run(["-l", ...a], c) };
COMMANDS["dir"] = { ...COMMANDS.ls, hidden: true };
COMMANDS["less"] = { ...COMMANDS.cat, hidden: true };
COMMANDS["more"] = { ...COMMANDS.cat, hidden: true };
COMMANDS["xdg-open"] = { ...COMMANDS.open, hidden: true };
COMMANDS["logout"] = { ...COMMANDS.exit, hidden: true };
COMMANDS["vi"] = COMMANDS.vim;
COMMANDS["nano"] = COMMANDS.vim;
COMMANDS["emacs"] = COMMANDS.vim;

export const COMMAND_NAMES = Object.keys(COMMANDS);

/* ------------------------------- banner ---------------------------------- */

export const BANNER_ART = [
  "██╗     ███████╗ ██████╗ ███╗   ██╗ █████╗ ██████╗ ██████╗  ██████╗ ",
  "██║     ██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔══██╗██╔══██╗██╔═══██╗",
  "██║     █████╗  ██║   ██║██╔██╗ ██║███████║██████╔╝██║  ██║██║   ██║",
  "██║     ██╔══╝  ██║   ██║██║╚██╗██║██╔══██║██╔══██╗██║  ██║██║   ██║",
  "███████╗███████╗╚██████╔╝██║ ╚████║██║  ██║██║  ██║██████╔╝╚██████╔╝",
  "╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ",
];

export function Banner() {
  return (
    <div>
      <pre
        data-ascii="skip"
        className="t-green t-glow m-0 select-none overflow-hidden"
        style={{ fontSize: "clamp(5px, 1.55vw, 13px)", lineHeight: 1.05 }}
        aria-label="Leonardo Malannino"
      >
        {BANNER_ART.join("\n")}
      </pre>
      <div className="t-dim mt-1">
        {P.title} · Hyrise Studios · {P.location}
      </div>
    </div>
  );
}

/** Minimal shell-style tokenizer: supports quotes. */
function tokenize(raw: string): string[] {
  const out: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

/* Secret commands: not in COMMANDS, so they stay out of help, man and Tab completion. */
const DESTRUCTIVE_RE =
  /^(cd \/ && )?sudo rm -rf (\/\*|\.|\/bin|--no-preserve-root( \/\*?)?|\/\*? --no-preserve-root)$|^sudo find \/ -delete$/;
const AURA_WORDS = new Set(["palle", "balle", "pisello", "aura"]);

export function runCommand(raw: string, ctx: CommandContext): Output {
  const line = raw.trim().replace(/\s+/g, " ").toLowerCase();
  if (DESTRUCTIVE_RE.test(line)) return <span>Nice try buddy. What about you run it in your terminal now?</span>;
  if (AURA_WORDS.has(line)) return <G>+10 punti aura</G>;
  const [name, ...args] = tokenize(raw.trim());
  const cmd = COMMANDS[name.toLowerCase()];
  if (!cmd) {
    return (
      <Err>
        bash: {name}: command not found — try <G>help</G>
      </Err>
    );
  }
  return cmd.run(args, ctx);
}

export { A, Dim, G };
