/**
 * Deterministic seeded shuffle — Fisher-Yates with a small PRNG.
 *
 * Used to randomize questionnaire order per candidate so consecutive items
 * don't all probe the same trait, while keeping the order stable for that
 * candidate (refreshing the page returns the same order, the scoring still
 * works because items are looked up by id, not index).
 */

// Mulberry32 — tiny, fast, statistically decent for non-crypto shuffling.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export function seededShuffle(arr, seedStr) {
  if (!arr || arr.length < 2) return [...(arr || [])];
  const rng = mulberry32(hashString(String(seedStr || 'default')));
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
