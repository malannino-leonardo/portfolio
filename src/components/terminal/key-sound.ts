/**
 * Mechanical keyboard clicks for the terminal input.
 * One small sprite (/sounds/keys.wav) holds 14 regular keystrokes and 3 heavy
 * ones (Enter / Space). Played through Web Audio for low latency, with a little
 * pitch and level variation so fast typing never sounds like a loop.
 * The AudioContext is created lazily on the first key press (a user gesture).
 */

const SRC = "/sounds/keys.wav";
const VOLUME = 0.45;
// [offset, duration] in seconds inside the sprite
const NORMAL: [number, number][] = [
  [0.02, 0.1075], [0.1475, 0.1054], [0.2729, 0.1037], [0.3966, 0.1067], [0.5233, 0.0856],
  [0.6289, 0.0988], [0.7477, 0.1064], [0.8741, 0.0834], [0.9775, 0.1048], [1.1022, 0.1038],
  [1.226, 0.1057], [1.3517, 0.0977], [1.4694, 0.0963], [1.5857, 0.1048],
];
const HEAVY: [number, number][] = [[1.7105, 0.0846], [1.8151, 0.0784], [1.9135, 0.1035]];
const MODIFIERS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "Fn", "AltGraph", "OS"]);

let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let data: Promise<ArrayBuffer | null> | null = null;
let decoding: Promise<void> | null = null;
let lastIdx = -1;

const fetchData = () =>
  (data ??= fetch(SRC)
    .then((r) => (r.ok ? r.arrayBuffer() : null))
    .catch(() => null));

/** Download the sprite ahead of time (no AudioContext yet, so no autoplay warnings). */
export function preloadKeySound() {
  fetchData();
}

/** Create the context inside a user gesture and decode the sprite once. */
function ensure() {
  if (decoding) return decoding;
  const AC: typeof AudioContext | undefined =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return (decoding = Promise.resolve());
  ctx = new AC();
  decoding = fetchData()
    .then((buf) =>
      buf ? new Promise<AudioBuffer>((res, rej) => ctx!.decodeAudioData(buf, res, rej)) : null
    )
    .then((b) => {
      buffer = b;
    })
    .catch(() => {
      /* no sound, no problem */
    });
  return decoding;
}

function play(key: string) {
  if (!ctx || !buffer) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const heavy = key === "Enter" || key === " ";
  const pool = heavy ? HEAVY : NORMAL;
  let i = (Math.random() * pool.length) | 0;
  if (!heavy && i === lastIdx) i = (i + 1) % pool.length; // never the same click twice in a row
  if (!heavy) lastIdx = i;
  const [offset, dur] = pool[i];

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = 0.94 + Math.random() * 0.12;
  const gain = ctx.createGain();
  gain.gain.value = VOLUME * (0.8 + Math.random() * 0.3) * (key === "Backspace" ? 0.85 : 1);
  src.connect(gain).connect(ctx.destination);
  src.start(0, offset, dur);
}

/** Call from a keydown handler. */
export function playKeySound(key: string, repeat = false) {
  if (MODIFIERS.has(key)) return;
  if (repeat && Math.random() < 0.5) return; // auto-repeat: thinner, like a held key
  if (buffer) play(key);
  else ensure().then(() => play(key)); // first key: decode (a few ms) then click
}
