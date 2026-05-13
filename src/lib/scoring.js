/**
 * BIG5 dimension + facet scoring — IPIP-50 / IPIP-NEO-120 methodology.
 *
 * Source: https://ipip.ori.org — Goldberg (1992) for the 50-item markers,
 * Johnson (2014) for the 120-item NEO with 30 facets.
 *
 * Method:
 *  1. Each item is rated 1–5 on a Likert scale.
 *  2. Reverse-keyed items have their score flipped to `6 - response`.
 *     The reverse-key flags match the official IPIP key sheets.
 *  3. For each dimension (E/A/C/N/O), items are averaged.
 *  4. Neuroticism (N) is converted to Emotional Stability (S) for positive
 *     framing — the underlying calculation is identical.
 *  5. Both raw average (1–5 sums) and normalized 0–100 are returned.
 *
 * tierItems shape: array of { id, dimension, reverse, [facet, facetName] }
 * answers shape: { [itemId]: 1..5 }
 */

export function calculateScores(answers, tierItems) {
  const sums = { E: 0, A: 0, C: 0, S: 0, O: 0 };
  const counts = { E: 0, A: 0, C: 0, S: 0, O: 0 };

  tierItems.forEach((item) => {
    const response = answers?.[item.id];
    if (response === undefined || response === null) return;

    let value = item.reverse ? 6 - response : response;
    let dim = item.dimension;

    if (item.dimension === 'N') {
      dim = 'S';
      value = item.reverse ? response : 6 - response;
    }

    sums[dim] += value;
    counts[dim] += 1;
  });

  const raw = {};
  const normalized = {};

  ['E', 'A', 'C', 'S', 'O'].forEach((dim) => {
    if (counts[dim] > 0) {
      raw[dim] = sums[dim];
      const avg = sums[dim] / counts[dim];
      normalized[dim] = Math.round(((avg - 1) / 4) * 100);
    } else {
      raw[dim] = 0;
      normalized[dim] = 50; // neutral default if no items
    }
  });

  return { raw, normalized };
}

/**
 * Compute per-facet scores (only meaningful for the deep tier, where items
 * have a `facet` field). Returns an object keyed by facet id:
 *   { N1: { name, dimension, sum, count, normalized }, N2: { ... }, ... }
 */
export function calculateFacetScores(answers, tierItems) {
  const facetScores = {};

  tierItems.forEach((item) => {
    if (!item.facet) return;
    const response = answers?.[item.id];
    if (response === undefined || response === null) return;

    if (!facetScores[item.facet]) {
      facetScores[item.facet] = {
        sum: 0,
        count: 0,
        name: item.facetName,
        dimension: item.dimension === 'N' ? 'S' : item.dimension,
      };
    }

    let value = item.reverse ? 6 - response : response;
    if (item.dimension === 'N') {
      value = item.reverse ? response : 6 - response;
    }

    facetScores[item.facet].sum += value;
    facetScores[item.facet].count += 1;
  });

  Object.keys(facetScores).forEach((facet) => {
    const f = facetScores[facet];
    if (f.count > 0) {
      const avg = f.sum / f.count;
      f.normalized = Math.round(((avg - 1) / 4) * 100);
    } else {
      f.normalized = 50;
    }
  });

  return facetScores;
}
