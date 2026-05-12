export function calculateFit(scores, role) {
  let totalDiff = 0;
  let totalWeight = 0;
  const dimFit = {};

  Object.keys(role.ideal).forEach((d) => {
    const diff = Math.abs(scores[d] - role.ideal[d]);
    const w = role.weights[d];
    totalDiff += diff * w;
    totalWeight += w;
    dimFit[d] = Math.max(0, 100 - diff);
  });

  const fit = Math.max(0, Math.round(100 - totalDiff / totalWeight));
  return { fit, dimFit };
}

export function fitTone(fit) {
  if (fit >= 75) return 'success';
  if (fit >= 55) return 'warning';
  return 'danger';
}

export function fitLabel(fit) {
  if (fit >= 85) return 'התאמה מצוינת';
  if (fit >= 75) return 'התאמה גבוהה';
  if (fit >= 55) return 'התאמה בינונית';
  if (fit >= 35) return 'התאמה נמוכה';
  return 'חוסר התאמה';
}
