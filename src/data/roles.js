import { loadCustomRoles } from '../lib/storage';

export const defaultRoles = [
  {
    id: 'sales',
    name: 'איש/ת מכירות',
    desc: 'תפקיד פרונטלי, מגע יומיומי עם לקוחות',
    icon: 'Handshake',
    ideal: { E: 80, A: 65, C: 70, S: 75, O: 60 },
    weights: { E: 25, A: 20, C: 15, S: 25, O: 15 },
    traits: ['יכולת הצגה', 'עמידה בלחץ', 'אסרטיביות', 'יכולת שכנוע'],
    recommendedTier: 'standard',
    tierRationale:
      'תפקיד מכירות דורש ניתוח מאוזן של אישיות חברתית, יציבות רגשית ומוטיבציה.',
    isCustom: false,
  },
  {
    id: 'pm',
    name: 'מנהל/ת פרויקטים',
    desc: 'ניהול לוחות זמנים, תקציבים, בעלי עניין',
    icon: 'Compass',
    ideal: { E: 65, A: 70, C: 90, S: 80, O: 65 },
    weights: { E: 15, A: 20, C: 30, S: 25, O: 10 },
    traits: ['חשיבה אסטרטגית', 'יכולת תיאום', 'עבודה בצוות', 'ראייה כוללת'],
    recommendedTier: 'standard',
    tierRationale:
      'ניהול פרויקטים דורש שילוב של מצפוניות, חברתיות ויציבות רגשית.',
    isCustom: false,
  },
  {
    id: 'dev',
    name: 'מפתח/ת תוכנה',
    desc: 'כתיבת קוד, פתרון בעיות, עבודת צוות',
    icon: 'Code2',
    ideal: { E: 45, A: 60, C: 85, S: 70, O: 85 },
    weights: { E: 5, A: 15, C: 30, S: 20, O: 30 },
    traits: ['חשיבה אנליטית', 'יכולת ריכוז', 'פתרון בעיות', 'למידה עצמית'],
    recommendedTier: 'standard',
    tierRationale:
      'תפקיד פיתוח דורש מצפוניות ופתיחות אינטלקטואלית. שאלון סטנדרטי מספק תמונה מקיפה.',
    isCustom: false,
  },
  {
    id: 'designer',
    name: 'מעצב/ת UX/UI',
    desc: 'יצירתיות, אמפתיה למשתמש, שיתוף פעולה',
    icon: 'Palette',
    ideal: { E: 60, A: 80, C: 70, S: 65, O: 90 },
    weights: { E: 10, A: 25, C: 15, S: 15, O: 35 },
    traits: ['יצירתיות', 'חוש אסתטי', 'אמפתיה למשתמש', 'חשיבה ויזואלית'],
    recommendedTier: 'standard',
    tierRationale:
      'תפקידי עיצוב דורשים פתיחות ויצירתיות. שאלון סטנדרטי מספק את התובנות הנדרשות.',
    isCustom: false,
  },
  {
    id: 'service',
    name: 'נציג/ת שירות לקוחות',
    desc: 'סבלנות, אמפתיה, יציבות תחת לחץ',
    icon: 'Headphones',
    ideal: { E: 70, A: 90, C: 75, S: 85, O: 55 },
    weights: { E: 20, A: 30, C: 15, S: 30, O: 5 },
    traits: ['סבלנות', 'אמפתיה', 'תקשורת מעולה', 'התמדה'],
    recommendedTier: 'quick',
    tierRationale:
      'תפקיד שירות לקוחות לרוב מגייסים בכמות גדולה. שאלון מהיר נותן את התובנות הנחוצות בזמן סביר.',
    isCustom: false,
  },
  {
    id: 'manager',
    name: 'מנהל/ת צוות / יחידה',
    desc: 'הובלת אנשים, החלטות, חזון',
    icon: 'Users',
    ideal: { E: 75, A: 75, C: 80, S: 85, O: 75 },
    weights: { E: 20, A: 20, C: 20, S: 25, O: 15 },
    traits: ['מנהיגות', 'יכולת החלטה', 'תקשורת', 'אחריותיות'],
    recommendedTier: 'deep',
    tierRationale:
      'תפקיד ניהולי הוא תפקיד מפתח שמשפיע על הצוות. שאלון מעמיק נותן ניתוח של 30 תת-מימדים כולל יכולות הובלה.',
    isCustom: false,
  },
];

export const availableIcons = [
  'Handshake', 'Compass', 'Code2', 'Palette', 'Headphones', 'Users',
  'Briefcase', 'Target', 'TrendingUp', 'Sparkles', 'Zap', 'Heart',
  'Shield', 'Crown', 'Lightbulb', 'Wrench',
];

export function getRoles() {
  const custom = loadCustomRoles();
  const merged = defaultRoles.map((d) => {
    const override = custom.find((c) => c.id === d.id);
    return override ? { ...d, ...override, isCustom: false, hasOverride: true } : d;
  });
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
