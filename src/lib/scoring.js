export function calculateScores(answers, questions) {
  const sums = { E: 0, A: 0, C: 0, S: 0, O: 0 };
  const counts = { E: 0, A: 0, C: 0, S: 0, O: 0 };

  questions.forEach((q) => {
    const ans = answers?.[q.n];
    if (!ans) return;

    let score = q.r ? 6 - ans : ans;
    let dim = q.d;

    if (q.d === 'N') {
      dim = 'S';
      score = q.r ? ans : 6 - ans;
    }

    sums[dim] += score;
    counts[dim] += 1;
  });

  const result = {};
  Object.keys(sums).forEach((d) => {
    const avg = counts[d] ? sums[d] / counts[d] : 3;
    result[d] = Math.round(((avg - 1) / 4) * 100);
  });
  return result;
}
