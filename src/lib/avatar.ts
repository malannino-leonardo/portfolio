export const generateAvatar = (seed?: string) => {
  if (seed) return seed;
  return Math.floor(Math.random() * 100 + 1).toString();
};

export const getAvatarUrl = (seed: string) => {
  // Background color is applied via CSS to avoid API rate limiting
  // Seeds are numeric 1-100; anything else (e.g. from a remote peer) falls back to "1"
  const safeSeed = /^(?:[1-9]\d?|100)$/.test(seed) ? seed : "1";
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(safeSeed)}`;
};

export const AVATAR_OPTIONS = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
