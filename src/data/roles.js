export const roles = [
  {
    id: 'sales',
    name: 'איש מכירות',
    desc: 'תפקיד פרונטלי, פגישות לקוחות, סגירת עסקאות',
    icon: 'Handshake',
    ideal: { E: 80, A: 65, C: 70, S: 75, O: 60 },
    weights: { E: 25, A: 20, C: 15, S: 25, O: 15 },
  },
  {
    id: 'pm',
    name: 'מנהל מוצר',
    desc: 'הובלת מוצר, תכנון, תיאום בין צוותים',
    icon: 'Compass',
    ideal: { E: 65, A: 70, C: 80, S: 75, O: 80 },
    weights: { E: 15, A: 20, C: 25, S: 15, O: 25 },
  },
  {
    id: 'dev',
    name: 'מפתח/ת',
    desc: 'כתיבת קוד, פתרון בעיות, חשיבה אנליטית',
    icon: 'Code2',
    ideal: { E: 45, A: 55, C: 80, S: 70, O: 75 },
    weights: { E: 10, A: 15, C: 30, S: 20, O: 25 },
  },
  {
    id: 'designer',
    name: 'מעצב/ת UX/UI',
    desc: 'חוויית משתמש, יצירתיות, אסתטיקה',
    icon: 'Palette',
    ideal: { E: 55, A: 70, C: 70, S: 65, O: 90 },
    weights: { E: 10, A: 20, C: 20, S: 15, O: 35 },
  },
  {
    id: 'service',
    name: 'שירות לקוחות',
    desc: 'מענה ללקוחות, סבלנות, פתרון תקלות',
    icon: 'Headphones',
    ideal: { E: 70, A: 85, C: 70, S: 80, O: 55 },
    weights: { E: 20, A: 30, C: 15, S: 25, O: 10 },
  },
  {
    id: 'manager',
    name: 'מנהל/ת צוות',
    desc: 'הובלת אנשים, החלטות, אחריות',
    icon: 'Users',
    ideal: { E: 75, A: 70, C: 80, S: 80, O: 65 },
    weights: { E: 20, A: 20, C: 20, S: 25, O: 15 },
  },
];

export function getRole(id) {
  return roles.find((r) => r.id === id);
}
