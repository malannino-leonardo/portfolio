/**
 * ASCII reveal engine.
 *
 * Decodes text into place through a grid of ASCII glyphs (inspired by
 * https://quanhoangindex.github.io/ascii-reveal/). Works directly on DOM text
 * nodes so it can be applied to *every* piece of text on a page without
 * touching the React components that render it.
 *
 * Design notes
 *  - Text nodes are revealed the first time their parent element scrolls into
 *    view (IntersectionObserver) so nothing is animated off-screen.
 *  - One shared requestAnimationFrame loop drives all active nodes and only
 *    rewrites a node when its glyphs actually change (throttled "tick").
 *  - If anything else (React) changes a node while it is animating, the
 *    animation for that node is cancelled and the foreign value is kept.
 *  - Elements can opt out with `data-ascii="skip"`.
 */

const GLYPHS = ".:-=+*#%@01<>/\\|[]{}";
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CANVAS",
  "SVG",
  "TITLE",
  "CODE",
  "PRE",
]);

export interface AsciiRevealOptions {
  /** Multiplier applied to every duration (use <1 on low-power devices). */
  speed?: number;
  /** Milliseconds between glyph shuffles. */
  tick?: number;
  /** Max number of nodes animated at once; extra nodes are shown instantly. */
  maxActive?: number;
}

interface Entry {
  node: Text;
  original: string;
  written: string;
  start: number;
  duration: number;
  lastTick: number;
  parent: Element | null;
}

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export class AsciiReveal {
  private opts: Required<AsciiRevealOptions>;
  private seen = new WeakSet<Text>();
  private groups = new WeakMap<Element, Set<Text>>();
  private io: IntersectionObserver | null = null;
  private mo: MutationObserver | null = null;
  private active = new Map<Text, Entry>();
  private glowCount = new WeakMap<Element, number>();
  private raf = 0;
  private retry = new Map<Element, number>();

  constructor(options: AsciiRevealOptions = {}) {
    this.opts = { speed: 1, tick: 55, maxActive: 80, ...options };
  }

  /** Start observing `root` (and everything added to it later). */
  start(root: HTMLElement = document.body) {
    if (this.io) return;
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) this.trigger(e.target);
        }
      },
      { threshold: 0.01 }
    );
    this.scan(root);
    this.mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "childList") {
          r.addedNodes.forEach((n) => this.scan(n));
        } else if (r.type === "characterData" && r.target.nodeType === 3) {
          // New content written by someone else: treat as fresh text unless
          // it is one of our own frame writes.
          const t = r.target as Text;
          const a = this.active.get(t);
          if (a && a.written === t.data) return;
          if (a) this.finish(a, false);
          if (!this.seen.has(t)) this.register(t);
        }
      }
    });
    this.mo.observe(root, { childList: true, subtree: true, characterData: true });
  }

  /** Stop observing and restore any text that is mid-animation. */
  stop() {
    this.io?.disconnect();
    this.mo?.disconnect();
    this.io = null;
    this.mo = null;
    for (const entry of Array.from(this.active.values())) this.finish(entry, true);
    this.retry.forEach((id) => clearTimeout(id));
    this.retry.clear();
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private shouldSkip(el: Element | null): boolean {
    for (let cur = el; cur; cur = cur.parentElement) {
      if (SKIP_TAGS.has(cur.tagName.toUpperCase())) return true;
      if ((cur as HTMLElement).dataset?.ascii === "skip") return true;
      if ((cur as HTMLElement).isContentEditable) return true;
    }
    return false;
  }

  private scan(n: Node) {
    if (n.nodeType === 3) {
      this.register(n as Text);
      return;
    }
    if (n.nodeType !== 1) return;
    const el = n as Element;
    if (this.shouldSkip(el)) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let cur = walker.nextNode();
    while (cur) {
      this.register(cur as Text);
      cur = walker.nextNode();
    }
  }

  private register(t: Text) {
    if (this.seen.has(t) || !t.data.trim()) return;
    const parent = t.parentElement;
    if (!parent || this.shouldSkip(parent)) return;
    let set = this.groups.get(parent);
    if (!set) {
      set = new Set();
      this.groups.set(parent, set);
    }
    set.add(t);
    this.io?.observe(parent);
  }

  private isShown(el: Element) {
    const anyEl = el as HTMLElement & {
      checkVisibility?: (o: object) => boolean;
    };
    if (typeof anyEl.checkVisibility === "function") {
      return anyEl.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
    }
    return true;
  }

  private trigger(parent: Element) {
    // Wait while an ancestor is faded out (e.g. entrance animations), so the
    // decode is visible instead of finishing invisibly.
    if (!this.isShown(parent)) {
      if (this.retry.has(parent)) return;
      let tries = 0;
      const id = window.setInterval(() => {
        tries++;
        if (this.isShown(parent) || tries > 50) {
          clearInterval(id);
          this.retry.delete(parent);
          this.run(parent);
        }
      }, 120);
      this.retry.set(parent, id as unknown as number);
      return;
    }
    this.run(parent);
  }

  private run(parent: Element) {
    this.io?.unobserve(parent);
    const set = this.groups.get(parent);
    if (!set) return;
    this.groups.delete(parent);
    const now = performance.now();
    let offset = 0;
    set.forEach((t) => {
      if (!t.isConnected || this.seen.has(t)) return;
      this.seen.add(t);
      const original = t.data;
      const len = original.length;
      if (this.active.size >= this.opts.maxActive || len < 2) return;
      const duration = Math.min(1100, 260 + len * 14) * this.opts.speed;
      const entry: Entry = {
        node: t,
        original,
        written: original,
        start: now + offset,
        duration,
        lastTick: 0,
        parent: t.parentElement,
      };
      offset += 40 * this.opts.speed; // slight stagger between sibling nodes
      this.active.set(t, entry);
      this.glow(entry.parent, 1);
    });
    if (this.active.size && !this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  private glow(el: Element | null, delta: number) {
    if (!el) return;
    const n = (this.glowCount.get(el) ?? 0) + delta;
    this.glowCount.set(el, Math.max(0, n));
    el.classList.toggle("ascii-revealing", n > 0);
  }

  private finish(entry: Entry, restore: boolean) {
    this.active.delete(entry.node);
    if (restore && entry.node.data === entry.written) {
      entry.written = entry.original;
      entry.node.data = entry.original;
    }
    this.glow(entry.parent, -1);
  }

  private frame = (now: number) => {
    this.raf = 0;
    for (const entry of Array.from(this.active.values())) {
      const { node } = entry;
      if (!node.isConnected || node.data !== entry.written) {
        // removed, or changed by someone else: stop touching it.
        this.finish(entry, false);
        continue;
      }
      if (now < entry.start) {
        // Not started yet: hide behind glyphs.
        if (entry.lastTick === 0) {
          entry.lastTick = now;
          this.write(entry, 0);
        }
        continue;
      }
      const p = (now - entry.start) / entry.duration;
      if (p >= 1) {
        node.data = entry.original;
        entry.written = entry.original;
        this.finish(entry, false);
        continue;
      }
      if (now - entry.lastTick >= this.opts.tick) {
        entry.lastTick = now;
        this.write(entry, p);
      }
    }
    if (this.active.size) this.raf = requestAnimationFrame(this.frame);
  };

  /** Compose the frame: revealed prefix + glyph window + (dim) remaining. */
  private write(entry: Entry, p: number) {
    const src = entry.original;
    const len = src.length;
    // eased front position
    const eased = 1 - Math.pow(1 - p, 2);
    const front = Math.floor(eased * len);
    let out = "";
    for (let i = 0; i < len; i++) {
      const c = src[i];
      if (i < front || c === " " || c === "\n" || c === "\t" || c === " ") {
        out += c;
      } else {
        out += randomGlyph();
      }
    }
    entry.written = out;
    entry.node.data = out;
  }
}
