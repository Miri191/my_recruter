/**
 * BIG5 dimension scoring — follows IPIP-50 (Goldberg 1992) methodology.
 *
 * Source: https://ipip.ori.org — "50-Item Set of IPIP Big-Five Factor Markers"
 *
 * Method (per IPIP scoring guidance):
 *  1. Each item is rated 1–5 on a Likert scale ("Very Inaccurate" → "Very Accurate").
 *  2. Reverse-keyed items have their score flipped to `6 - response` before summing.
 *     The reverse-key flags in `data/questions.js` match the official IPIP-50 key sheet.
 *  3. For each dimension (E/A/C/N/O), the 10 items are averaged.
 *     (We average instead of summing — equivalent, just scales differently.)
 *  4. Neuroticism (N) is converted to Emotional Stability (S) by inverting the
 *     direction. This is an optional convention that many modern HR tools follow
 *     (positive framing for the recruiter). The underlying calculation is identical.
 *  5. The 1–5 average is mapped linearly to a 0–100 scale for display:
 *        score = ((avg - 1) / 4) * 100
 *     i.e. an average of 3.0 → 50, average of 5.0 → 100.
 *
 * Note: this 0-100 transformation is "percent of maximum" — NOT a population
 * percentile. IPIP also provides norm tables for converting raw sums to
 * percentiles relative to a general population sample. Switching to percentile
 * scoring is a possible upgrade if normative comparison becomes important.
 */

export function calculateScores(answers, questions) {
  const sums = { E: 0, A: 0, C: 0, S: 0, O: 0 };
  const counts = { E: 0, A: 0, C: 0, S: 0, O: 0 };

  questions.forEach((q) => {
    const ans = answers?.[q.n];
    if (!ans) return;

    // Step 2: apply reverse-keying per IPIP key sheet.
    let score = q.r ? 6 - ans : ans;
    let dim = q.d;

    // Step 4: flip Neuroticism → Emotional Stability so a higher score
    // means more stable (positive framing). For N items, direct-keyed
    // becomes reversed and vice versa.
    if (q.d === 'N') {
      dim = 'S';
      score = q.r ? ans : 6 - ans;
    }

    sums[dim] += score;
    counts[dim] += 1;
  });

  // Step 3 + 5: average the 10 items per dimension, then scale 1-5 → 0-100.
  const result = {};
  Object.keys(sums).forEach((d) => {
    const avg = counts[d] ? sums[d] / counts[d] : 3;
    result[d] = Math.round(((avg - 1) / 4) * 100);
  });
  return result;
}
