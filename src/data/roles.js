import { loadCustomRoles } from '../lib/storage';

export const defaultRoles = [
  {
    id: 'sales',
    name: 'איש מכירות',
    desc: 'תפקיד פרונטלי, פגישות לקוחות, סגירת עסקאות',
    icon: 'Handshake',
    ideal: { E: 80, A: 65, C: 70, S: 75, O: 60 },
    weights: { E: 25, A: 20, C: 15, S: 25, O: 15 },
    traits: ['יכולת הצגה', 'עמידה בלחץ', 'אסרטיביות', 'יכולת שכנוע'],
    isCustom: false,
  },
  {
    id: 'pm',
    name: 'מנהל מוצר',
    desc: 'הובלת מוצר, תכנון, תיאום בין צוותים',
    icon: 'Compass',
    ideal: { E: 65, A: 70, C: 80, S: 75, O: 80 },
    weights: { E: 15, A: 20, C: 25, S: 15, O: 25 },
    traits: ['חשיבה אסטרטגית', 'יכולת תיאום', 'עבודה בצוות', 'ראייה כוללת'],
    isCustom: false,
  },
  {
    id: 'dev',
    name: 'מפתח/ת',
    desc: 'כתיבת קוד, פתרון בעיות, חשיבה אנליטית',
    icon: 'Code2',
    ideal: { E: 45, A: 55, C: 80, S: 70, O: 75 },
    weights: { E: 10, A: 15, C: 30, S: 20, O: 25 },
    traits: ['חשיבה אנליטית', 'יכולת ריכוז', 'פתרון בעיות', 'למידה עצמית'],
    isCustom: false,
  },
  {
    id: 'designer',
    name: 'מעצב/ת UX/UI',
    desc: 'חוויית משתמש, יצירתיות, אסתטיקה',
    icon: 'Palette',
    ideal: { E: 55, A: 70, C: 70, S: 65, O: 90 },
    weights: { E: 10, A: 20, C: 20, S: 15, O: 35 },
    traits: ['יצירתיות', 'חוש אסתטי', 'אמפתיה למשתמש', 'חשיבה ויזואלית'],
    isCustom: false,
  },
  {
    id: 'service',
    name: 'שירות לקוחות',
    desc: 'מענה ללקוחות, סבלנות, פתרון תקלות',
    icon: 'Headphones',
    ideal: { E: 70, A: 85, C: 70, S: 80, O: 55 },
    weights: { E: 20, A: 30, C: 15, S: 25, O: 10 },
    traits: ['סבלנות', 'אמפתיה', 'תקשורת מעולה', 'התמדה'],
    isCustom: false,
  },
  {
    id: 'manager',
    name: 'מנהל/ת צוות',
    desc: 'הובלת אנשים, החלטות, אחריות',
    icon: 'Users',
    ideal: { E: 75, A: 70, C: 80, S: 80, O: 65 },
    weights: { E: 20, A: 20, C: 20, S: 25, O: 15 },
    traits: ['מנהיגות', 'יכולת החלטה', 'תקשורת', 'אחריותיות'],
    isCustom: false,
  },
];

export const availableIcons = [
  'Handshake', 'Compass', 'Code2', 'Palette', 'Headphones', 'Users',
  'Briefcase', 'Target', 'TrendingUp', 'Sparkles', 'Zap', 'Heart',
  'Shield', 'Crown', 'Lightbulb', 'Wrench',
];

/**
 * Merge defaults with localStorage customizations.
 * Custom records with same id as a default REPLACE the default.
 * Custom records with new ids are APPENDED.
 */
export function getRoles() {
  const custom = loadCustomRoles();
  const customIds = new Set(custom.map((r) => r.id));
  const merged = defaultRoles.map((d) => {
    const override = custom.find((c) => c.id === d.id);
    return override ? { ...d, ...override, isCustom: false, hasOverride: true } : d;
  });
  // Append truly custom roles (ids not in defaults)
  const defaultIds = new Set(defaultRoles.map((r) => r.id));
  custom.forEach((c) => {
    if (!defaultIds.has(c.id)) merged.push({ ...c, isCustom: true });
  });
  return merged;
}

export function getRole(id) {
  return getRoles().find((r) => r.id === id);
}

export function isDefaultRoleId(id) {
  return defaultRoles.some((r) => r.id === id);
}
