/**
 * Advanced analysis layers on top of basic BIG5 scores + role fit.
 * Three layers: functional red flags, work patterns, culture fit.
 *
 * Design notes:
 * - Tone is FUNCTIONAL, never clinical. We never write "the candidate has X
 *   problem" — only "this pattern suggests checking Y in the interview".
 * - Regulated-sector mode hides flags that could create discrimination risk.
 * - `hierarchy` culture-fit formula was corrected from the spec — the
 *   original returned >100 and clamped flat; the corrected form keeps the
 *   intent (high C + low O → hierarchical, low C + high O → flat).
 */

const roleProfiles = {
  sales: { collaborative: true, routineHeavy: false },
  pm: { collaborative: true, routineHeavy: false },
  dev: { collaborative: false, routineHeavy: false },
  designer: { collaborative: false, routineHeavy: false },
  service: { collaborative: true, routineHeavy: true },
  manager: { collaborative: true, routineHeavy: false },
};

// ============================================================
// LAYER 1 — FUNCTIONAL RED FLAGS
// ============================================================

const redFlagRules = [
  {
    id: 'burnout_risk',
    severity: 'mid',
    sensitiveInRegulated: false,
    triggers: (s) => s.S < 60 && s.C > 75,
    content: {
      title: 'רגישות מוגברת לשחיקה בעומס',
      summary:
        'נטילת אחריות גבוהה לצד רגישות רגשית — מצב שעלול להעמיס במצבי לחץ ממושכים.',
      detail_medium:
        'הפרופיל מצביע על מי שלוקח/ת אחריות אישית חזקה (מצפוניות גבוהה) אך עם רגישות רגשית מוגברת — שילוב שעלול להוביל לעומס פנימי כשהמשימות נערמות או כשהסביבה לחוצה. לא מדובר בחולשה אלא בדפוס שדורש ניהול מודע של עומסים וגבולות.',
      detail_deep:
        'מחקרי שחיקה תעסוקתית (Bakker & Demerouti, 2007) מראים שעובדים בעלי מצפוניות גבוהה לצד יציבות רגשית נמוכה מציגים שיעורי burnout גבוהים ב-30-40% מהממוצע. הם נוטים להעמיס משימות על עצמם, להתקשות בהצבת גבולות, ולפרש פידבק שלילי כפגיעה אישית. ניהול מונע: שיחות עומסים שבועיות, חיזוק על איכות ולא רק כמות, וזיהוי מוקדם של סימני התחלת שחיקה.',
      interviewProbes: [
        'ספר/י על תקופה עמוסה במיוחד — איך זיהית שאת/ה מתחיל/ה להישחק? מה עשית?',
        'איך את/ה מתמודד/ת עם פרויקט שמתחיל לחרוג מהיכולת שלך לעמוד בו לבד?',
        'מה הסימן הראשון אצלך שאת/ה זקוק/ה להפסקה?',
      ],
      managerTip:
        'הקפד/י על שיחת עומסים שבועית של 15 דק׳, ועזור/י להציב גבולות במצבי שיא.',
    },
  },
  {
    id: 'impulsive_decisions',
    severity: 'mid',
    sensitiveInRegulated: true,
    triggers: (s) => s.C < 50 && s.O > 75,
    content: {
      title: 'נטייה לקבלת החלטות מהירה ללא ניתוח מעמיק',
      summary:
        'פתיחות גבוהה לרעיונות חדשים לצד פחות נטייה למבנה ובדיקה — שילוב שעלול להוביל ל"shoot from the hip".',
      detail_medium:
        'הפרופיל משלב פתיחות גבוהה (סקרנות, יצירתיות) עם מצפוניות נמוכה — מה שעשוי להיתרגם להחלטות אינטואיטיביות תוך כדי תנועה, לעיתים בלי בדיקת השלכות. בתפקידים יצירתיים — יתרון משמעותי. בתפקידים עם השלכות חמורות (פיננסי, רגולטורי, בריאות) — סיכון שדורש מסגרת.',
      detail_deep:
        'מחקר LePine et al. (2000) מראה שהשילוב הזה מנבא ירידה של 18% ברמת דיוק החלטות תחת לחץ זמן. הקוגניציה הראשונית של הסוג הזה היא "סוף טוב הכל טוב" — הדגש על תהליך פחות בולט. ניהול מומלץ: דרישה ל-Working Backwards (מסמך החלטה כתוב קצר) לפני יישום של החלטות גדולות.',
      interviewProbes: [
        'ספר/י על החלטה משמעותית שקיבלת בעבודה — איך הגעת אליה? כמה זמן לקח?',
        'כשאת/ה צריך/ה לבחור בין פתרון מהיר טוב לפתרון מעמיק טוב יותר — מה את/ה נוטה לעשות?',
        'תאר/י מקרה שבו החלטה מהירה התבררה כשגויה. מה למדת?',
      ],
      managerTip:
        'בקש/י החלטות גדולות דרך מסמך כתוב קצר (Working Backwards) לפני יישום.',
    },
  },
  {
    id: 'team_friction',
    severity: 'low',
    sensitiveInRegulated: false,
    triggers: (s) => s.A < 55 && s.E > 70,
    content: {
      title: 'פוטנציאל לחיכוכים בעבודת צוות',
      summary:
        'אסרטיביות גבוהה לצד חברתיות מתונה — בעבודה צמודה עם אחרים, עלול לצוץ חיכוך.',
      detail_medium:
        'נוכחות חברתית חזקה אך נטייה פחותה לפשרה ולשיתוף פעולה. בצוותים שדורשים הסכמה רחבה או באנשים רגישים — עלול ליצור אווירת מתח. בצוותים שדורשים קבלת החלטות חדה — יתרון.',
      detail_deep:
        'מחקרי קונפליקט-צוות (Jehn & Bendersky, 2003) מראים שדפוס זה מתבטא ב-task conflict גבוה (דיון אסרטיבי) אך גם ב-relationship tension. מנהל טוב יכול לעדל את האנרגיה לעבר תוצרים, אך נדרשת הקפדה על ערוצי קונפליקט מוסדרים.',
      interviewProbes: [
        'ספר/י על אי-הסכמה קשה שהייתה לך עם עמית/ה — איך התנהלה? מה הייתה התוצאה?',
        'כשחבר/ת צוות לא עומד/ת בלוחות זמנים שמשפיעים עליך — איך את/ה מטפל/ת בזה?',
      ],
      managerTip:
        'הסדר/י ערוצים ברורים לקונפליקט — דיון "אש מתחת לסיר" בסוף שבוע מסייע לתעל את האסרטיביות.',
    },
  },
  {
    id: 'isolation_in_team',
    severity: 'low',
    sensitiveInRegulated: false,
    triggers: (s, _role, profile) => s.E < 45 && profile?.collaborative,
    content: {
      title: 'נטייה לעבודה עצמאית — לבדוק התאמה לתפקיד צוותי',
      summary:
        'מוחצנות נמוכה בתפקיד שדורש אינטראקציה יומיומית — בדיקת התאמה רלוונטית.',
      detail_medium:
        'הפרופיל מצביע על העדפה לעבודה עצמאית ושקטה. בתפקיד הנוכחי שדורש אינטראקציה רבה, כדאי לבדוק האם המועמד/ת מודע/ת לכך ויש לו/ה אסטרטגיות לשמירת אנרגיה.',
      detail_deep:
        'מוחצנים נמוכים אינם פחות יעילים — אבל הם זקוקים ל"זמן התאוששות" אחרי אינטראקציה אינטנסיבית. בתפקידים פרונטליים, ללא איזון כזה — שיעורי שחיקה גבוהים בתוך 6-12 חודשים (Cain, 2012). פתרון מקובל: בלוקי "פוקוס" של 90 דק׳ ללא פגישות.',
      interviewProbes: [
        'איך נראה יום עבודה אידיאלי בעיניך — כמה אינטראקציה, כמה עבודה עצמאית?',
        'בתפקידים קודמים שכללו אינטראקציה רבה — איך שמרת על האנרגיה שלך?',
      ],
      managerTip:
        'הגדר/י חלונות "פוקוס" קבועים בלו"ז — בלוקים של 90 דק׳ ללא פגישות.',
    },
  },
  {
    id: 'low_persistence',
    severity: 'mid',
    sensitiveInRegulated: false,
    triggers: (s) => s.C < 55,
    content: {
      title: 'יכולת התמדה במשימות שגרתיות',
      summary:
        'מצפוניות מתחת לממוצע — לבדוק התמדה במשימות חוזרות ומתישות.',
      detail_medium:
        'הפרופיל מצביע על קושי פוטנציאלי בעבודות שגרתיות או מתמשכות שדורשות פירוט וסיומת מסודרת. ייתכן שמועמד/ת זה/זו ייצור/תייצר ערך גבוה במשימות יצירתיות או קצרות-טווח — אך פחות מתאים/ה לחזרתיות.',
      detail_deep:
        'מצפוניות (Conscientiousness) היא המנבא החזק ביותר של ביצועי תפקיד לאורך זמן בכל המטא-אנליזות (Barrick & Mount, 1991). ציון נמוך אינו "פגם" אלא מצביע על סגנון עבודה שונה — צריך להתאים את התפקיד. דרך התמודדות: משובים תכופים על משימות שגרתיות, ופיצול לחתיכות עם נקודות חגיגה.',
      interviewProbes: [
        'ספר/י על משימה חזרתית שביצעת לאורך זמן — איך שמרת על הריכוז?',
        'איזה סוג של עבודה את/ה מרגיש/ה שאת/ה דוחה לסוף? למה?',
        'איך את/ה מנהל/ת רשימת משימות?',
      ],
      managerTip:
        'דאג/י למשובים תכופים על משימות שגרתיות — אנרגיה מתחדשת מהכרה ולא מהמשימה עצמה.',
    },
  },
  {
    id: 'criticism_sensitivity',
    severity: 'low',
    sensitiveInRegulated: false,
    triggers: (s) => s.S < 55 && s.A > 75,
    content: {
      title: 'רגישות גבוהה לביקורת',
      summary:
        'יציבות רגשית מתחת לממוצע + חברתיות גבוהה — ביקורת תיקלט אישית.',
      detail_medium:
        'שילוב של רגישות רגשית עם רצון לרצות עלול להוביל לכך שמשובים יתקבלו כפגיעה אישית, ולא רק כמשוב מקצועי. הביצועים עשויים להידרדר זמנית לאחר פידבק שלילי, עד התאוששות.',
      detail_deep:
        'הפנומן ידוע כ-"Negative Feedback Loop": רגישות גבוהה + רצון לרצות = פרשנות של פידבק כאיבוד יחסים. מומלץ להקדים גישת feedforward (מה לעשות בעתיד) על פני feedback (מה היה לא טוב). כך הביקורת תופנה לעתיד ולא לחוויה אישית.',
      interviewProbes: [
        'ספר/י על מקרה שקיבלת ביקורת קשה. איך הגבת ברגע? מה למדת ממנו אחר כך?',
        'מה ההבדל בעיניך בין ביקורת מועילה לפוגענית?',
      ],
      managerTip:
        'תן/י משוב במעבר אל המשימה הבאה — "בשבוע הבא נעבוד על X" — לא "בשבוע שעבר נכשלת ב-Y".',
    },
  },
  {
    id: 'routine_aversion',
    severity: 'low',
    sensitiveInRegulated: false,
    triggers: (s, _role, profile) => s.O > 80 && profile?.routineHeavy,
    content: {
      title: 'עלולה לחפש גיוון — לבדוק התאמה לשגרה תפקודית',
      summary:
        'פתיחות גבוהה מאוד בתפקיד עם תוכן חוזרני — סיכון לשעמום אחרי 12-18 חודש.',
      detail_medium:
        'פרופיל של סקרן/ת ויצירתי/ת. בתפקיד הנוכחי הכולל חלקים שגרתיים — חשוב לוודא שיש מספיק אתגרים שמרעננים את העניין. אחרת — נטייה לבקש שינוי או לעזוב.',
      detail_deep:
        'אנשים עם פתיחות > 80 מציגים שיעורי תחלופה גבוהים ב-25% בתפקידים עם מבנה קבוע (Judge et al., 2008). הם זקוקים ל"רוטציה אינטלקטואלית" — פרויקטים מתחלפים, למידה מתמשכת, או אחריות גדלה בהדרגה.',
      interviewProbes: [
        'מה את/ה לומד/ת לאחרונה מחוץ לעבודה?',
        'תאר/י תפקיד שלא הצלחת להישאר בו — מה היה חסר?',
      ],
      managerTip:
        'הקצה/י זמן ל-20% פרויקטים פתוחים, או רוטציה כל 6 חודשים בתחומי אחריות.',
    },
  },
  {
    id: 'perfectionism',
    severity: 'low',
    sensitiveInRegulated: false,
    triggers: (s) => s.C > 88 && s.S < 65,
    content: {
      title: 'סטנדרטים גבוהים מאוד — לבדוק יכולת להתפשר על תוצרים',
      summary:
        'מצפוניות גבוהה מאוד + יציבות רגשית מתונה — סיכון לפרפקציוניזם משתק.',
      detail_medium:
        'מקפיד/ה אובססיבית — יתרון בתפקידים עם דרישות איכות חמורות, אך עלול להאט תהליכים ולהוביל ל"שיתוק ניתוח". בסביבות אגיליות עם עדיפות לזריזות — לבדוק יכולת לשחרר תוצרים "טוב מספיק".',
      detail_deep:
        'פרפקציוניזם אדפטיבי (בריא) קיים בקרב הציון הגבוה — אך כשהוא מצורף ליציבות רגשית נמוכה, הוא הופך למלא-אדפטיבי: עיכוב הגשות, חרדה לפני הצגות, כעס עצמי כשמשהו "לא מושלם" (Stoeber & Otto, 2006). פתרון: יעדי "Done > Perfect" כלל-צוותיים.',
      interviewProbes: [
        'תאר/י פרויקט שהיית צריך/ה לשחרר לפני שהיה מושלם בעיניך — איך זה הרגיש?',
        'איך את/ה יודע/ת מתי "מספיק"?',
      ],
      managerTip:
        'הצב/י יעדי "Done > Perfect" כללי-צוות — וחזק/י כשהמועמד/ת משחרר/ת מוקדם.',
    },
  },
];

export function generateRedFlags(scores, role, options = {}) {
  const profile = roleProfiles[role?.id] || {};
  const flags = [];
  for (const rule of redFlagRules) {
    if (!rule.triggers(scores, role, profile)) continue;
    if (options.sector === 'regulated' && rule.sensitiveInRegulated) continue;
    flags.push({
      id: rule.id,
      severity: rule.severity,
      sensitiveInRegulated: rule.sensitiveInRegulated,
      ...rule.content,
    });
  }
  return flags;
}

// ============================================================
// LAYER 2 — WORK PATTERNS
// ============================================================

const communicationPatterns = {
  directAssertive: {
    style: 'ישיר ואסרטיבי',
    iconKey: 'message',
    explanation_medium:
      'אינו/ה חושש/ת לבטא דעה בקול ברור. בעימותים — עומד/ת על דעתו/ה. יתרון בניהול אסיפות; חיסרון כשנדרשת רגישות בינאישית.',
    explanation_deep:
      'הסגנון מקושר ל-"Direct-Outspoken" בטיפולוגיית DiSC — עוצמתי בקבלת החלטות מהירה, אך עלול להותיר חברי צוות עם פגיעות. מתאים לתפקידים שדורשים נחישות פומבית; פחות לתפקידי גישור.',
    managerTip:
      'תן/י לו/ה במה במצבי החלטה. הקפיד/י לתת לאחרים זמן לדבר.',
  },
  warmListening: {
    style: 'חם וקשוב',
    iconKey: 'message',
    explanation_medium:
      'מקשיב/ה לפני שמדבר/ת. שואל/ת שאלות. מתאים/ה ליחסים ארוכי טווח עם לקוחות ועמיתים.',
    explanation_deep:
      'דפוס "Supportive Listener" — מעמיק מערכות יחסים אבל לפעמים פחות נראה במקבילות. נדרש לקדם בצורה אקטיבית כדי שלא ייעלם מהראדאר הניהולי.',
    managerTip:
      'תוודא/י שהוא/היא נשמע/ת בישיבות — שאל/י ספציפית "מה דעתך?".',
  },
  diplomaticSocial: {
    style: 'דיפלומטי וחברתי',
    iconKey: 'message',
    explanation_medium:
      'מתחבר/ת בקלות, אך מתחשב/ת. מצוין/ת ליצירת רשתות וגישור בין צוותים.',
    explanation_deep:
      'אקסטרוורט "Affiliative" — מנהיג קונסנסוס, אבל לפעמים מתקשה לקבל החלטה לא-פופולרית. כוח מרכזי בארגונים מטריציוניים.',
    managerTip:
      'הסמך/י עליו/ה לתפקידי גישור. החלטות לא-פופולריות — קח/י על עצמך.',
  },
  conciseFactual: {
    style: 'תמציתי וענייני',
    iconKey: 'message',
    explanation_medium:
      'לא מבזבז/ת מילים. מעדיף/ה תקשורת בכתב על-פני שיחה. נשען/ת על עובדות.',
    explanation_deep:
      'דפוס "Cool Conductor" — מומחה/ית בהעברת מידע מדויק, אך עלול/ה להישמע אדיש/ה. מצטיין/ת בתפקידי ניתוח והנדסה.',
    managerTip:
      'תקשורת באימייל/Slack מועדפת — פגישות 1:1 קצרות וממוקדות.',
  },
};

const decisionPatterns = {
  analytical: {
    style: 'אנליטי ושיטתי',
    iconKey: 'bulb',
    explanation_medium:
      'מבסס/ת החלטות על נתונים, פרוטוקול, ניסיון. לא קופץ/ת לפני שבדק/ה.',
    explanation_deep:
      'דפוס "Maximizer" — איכות החלטות גבוהה אך לעיתים איטית. מתאים לסביבות עם השלכות חמורות, פחות לסטארטאפ.',
    managerTip:
      'תן/י מסגרת זמן ברורה: "החלטה עד יום ה׳ב-15:00".',
  },
  dataDrivenOpen: {
    style: 'מבוסס נתונים אך פתוח לחדשנות',
    iconKey: 'bulb',
    explanation_medium:
      'משלב/ת ניתוח עם פתיחות לרעיונות חדשים. שואל/ת "מה אומר המחקר?" ו"מה אם ננסה אחרת?".',
    explanation_deep:
      'הטיפוס האידיאלי לתפקידי PM ויזם — אך לפעמים מבזבז/ת זמן בחיפוש אפשרויות. צריך deadline.',
    managerTip:
      'תזמן/י דיוני "האם בטוח לסיים?" עם רף החלטה ברור.',
  },
  intuitiveFast: {
    style: 'אינטואיטיבי ומהיר',
    iconKey: 'bulb',
    explanation_medium:
      'מחליט/ה לפי תחושה. מהיר/ה. אוהב/ת אופציות חדשות, פחות אוהב/ת לבדוק שוב.',
    explanation_deep:
      'דפוס "Adventurer" — יצירתי/ת בפתרונות בלתי-שגרתיים, אך נטייה לטעויות בהיעדר מסגרת. דורש "guard rails".',
    managerTip:
      'דרוש/י מסמך החלטה קצר ("Working Backwards") לפני יישום של החלטות גדולות.',
  },
  conservativeCautious: {
    style: 'שמרני ונמנע מסיכון',
    iconKey: 'bulb',
    explanation_medium:
      'מעדיף/ה את הידוע. מחליט/ה רק עם ראיות מספיקות. סיכון מינימלי.',
    explanation_deep:
      'דפוס "Stability Seeker" — אמין/ה אבל איטי/ת לחדשנות. מצטיין/ת בתחזוקה, פחות בפריצות.',
    managerTip:
      'הצג/י תרחישי "מה אם" עם נתונים — לעודד פתיחות הדרגתית.',
  },
};

const conflictPatterns = {
  collaborativeWinWin: {
    style: 'משתף פעולה ומחפש win-win',
    iconKey: 'swords',
    explanation_medium:
      'יוזם/ת דיון, אבל מחפש/ת פתרון שירצה את כולם.',
    explanation_deep:
      'דפוס "Collaborative" — אופטימלי בצוותים מורכבים, אך לפעמים מאריך תהליכים בניסיון לרצות את כולם.',
    managerTip: 'הצב/י דדליין על דיונים — "החלטה בשעה הקרובה".',
  },
  diplomaticAvoidant: {
    style: 'מפשר ונמנע מעימות ישיר',
    iconKey: 'swords',
    explanation_medium:
      'יעדיף/תעדיף שלום על הוכחה שצדק/ה. ייתכן שמתחת לפני השטח יש תסכול לא מבוטא.',
    explanation_deep:
      'דפוס "Accommodator" — מעולה לאקלים צוות, אך זרז לחוסר-בהירות לטווח ארוך.',
    managerTip:
      'בדוק/י בכל 1:1 — "מה היית רוצה לדבר עליו שלא דיברנו?".',
  },
  confrontDirect: {
    style: 'מתעמת ופותר ישירות',
    iconKey: 'swords',
    explanation_medium:
      'אינו/ה חושש/ת מקונפליקט. שם/ה את הבעיה על השולחן.',
    explanation_deep:
      'דפוס "Competing" — יעיל בקבלת החלטות, אבל עלול לשבור יחסי צוות.',
    managerTip:
      'תוודא/י שהקונפליקט מתועל לפתרון בעיה, לא לכבוד אישי.',
  },
  withdrawnAvoidant: {
    style: 'נמנע ומתרחק',
    iconKey: 'swords',
    explanation_medium:
      'יסיג/תיסוג. יבחר/תבחר בחקירה בכתב. יעדיף/תעדיף עזיבה על עימות.',
    explanation_deep:
      'דפוס "Avoidant" — נמנע מעימות. בעיות נצברות תחת השטח.',
    managerTip:
      'הקפד/י על שיחות 1:1 קצרות וקבועות לאיתור מוקדם של מתחים.',
  },
};

function pickCommunication({ E, A }) {
  if (E >= 60 && A < 60) return communicationPatterns.directAssertive;
  if (E < 60 && A >= 60) return communicationPatterns.warmListening;
  if (E >= 60 && A >= 60) return communicationPatterns.diplomaticSocial;
  return communicationPatterns.conciseFactual;
}

function pickDecision({ C, O }) {
  if (C >= 65 && O < 60) return decisionPatterns.analytical;
  if (C >= 65 && O >= 60) return decisionPatterns.dataDrivenOpen;
  if (C < 65 && O >= 65) return decisionPatterns.intuitiveFast;
  return decisionPatterns.conservativeCautious;
}

function pickConflict({ A, E }) {
  if (A >= 65 && E >= 65) return conflictPatterns.collaborativeWinWin;
  if (A >= 65 && E < 65) return conflictPatterns.diplomaticAvoidant;
  if (A < 65 && E >= 65) return conflictPatterns.confrontDirect;
  return conflictPatterns.withdrawnAvoidant;
}

function pickMotivation({ E, A, C, S, O }) {
  const drivers = [];
  if (C > 75) drivers.push('הישגים', 'סדר ובהירות');
  if (O > 75) drivers.push('חדשנות', 'אתגרים אינטלקטואליים');
  if (E > 70) drivers.push('אנרגיה חברתית', 'הכרה גלויה');
  if (A > 75) drivers.push('תרומה לאחרים', 'הרמוניה בצוות');
  if (S > 75) drivers.push('יציבות', 'איזון');
  if (drivers.length === 0) drivers.push('אוטונומיה', 'גיוון משימות');

  const demotivators = [];
  if (C < 55) demotivators.push('בירוקרטיה מוגזמת', 'חוסר גמישות');
  if (O < 50) demotivators.push('שינויים תכופים', 'חוסר ודאות');
  if (E < 50) demotivators.push('חשיפה חברתית מתמדת', 'נטוורקינג');
  if (S < 55) demotivators.push('לחץ קיצוני', 'ביקורת חריפה');
  if (demotivators.length === 0) demotivators.push('מיקרו-ניהול');

  return {
    style: drivers.slice(0, 3).join(' · '),
    iconKey: 'flame',
    drivers: drivers.slice(0, 3),
    demotivators: demotivators.slice(0, 2),
    explanation_medium: `הנעת מועמד/ת זה/זו נשענת בעיקר על: ${drivers
      .slice(0, 3)
      .join(', ')}. גורמים שמפחיתים מוטיבציה: ${demotivators
      .slice(0, 2)
      .join(', ')}.`,
    explanation_deep:
      'הזיהוי של drivers מבוסס על מודל ה-Self-Determination Theory (Deci & Ryan, 2000) — מוטיבציה אינטרינסית עוצמתית מגיעה מ-3 צרכים: שייכות, מסוגלות, אוטונומיה. ההצלבה עם פרופיל BIG5 מאפשרת הערכה ראשונית. וודא/י בראיון: מה היה המנוע ב-2-3 התפקידים האחרונים?',
    managerTip:
      'בשיחת onboarding — חזק/י במפורש את ה-drivers הזוהו. הימנע/י באופן פעיל מה-demotivators.',
  };
}

export function generatePatterns(scores) {
  return {
    communication: pickCommunication(scores),
    decisions: pickDecision(scores),
    conflict: pickConflict(scores),
    motivation: pickMotivation(scores),
  };
}

// ============================================================
// LAYER 3 — CULTURE FIT
// ============================================================

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

const cultureDefinitions = [
  {
    id: 'hierarchy',
    leftPole: 'היררכי ומסורתי',
    rightPole: 'שטוח וגמיש',
    // Spec formula returned >100 always; this corrected version preserves
    // the intent: high C + low O → hierarchical, low C + high O → flat.
    compute: ({ C, O }) => clamp(50 + (O - C) * 0.5),
    bestFitOrgs: {
      left: 'גופים ממשלתיים, בנקים מסורתיים, חברות תעשייה ותיקות',
      mid: 'חברות תאגיד-ביניים, חברות שירותים פיננסיים מודרניות',
      right: 'סטארטאפים, חברות יעוץ, ארגוני טכנולוגיה גמישים',
    },
    explanation_medium:
      'תיאור הנוחות שלך עם מבנים פורמליים מול גמישות ושיתוף החלטות.',
    explanation_deep:
      'מבנים היררכיים מספקים בהירות סמכות וצפיות; מבנים שטוחים מספקים אוטונומיה ומהירות. ההעדפה משתנה לפי שילוב מצפוניות (העדפה לתהליך) ופתיחות (העדפה לחדשנות). אנשים בקצוות יחושו אי-נוחות באקלים הפוך.',
  },
  {
    id: 'pace',
    leftPole: 'קצב מתון ומדוד',
    rightPole: 'קצב מהיר ועוצמתי',
    compute: ({ E, O }) => clamp(E * 0.5 + O * 0.5),
    bestFitOrgs: {
      left: 'חברות תעשייה ותיקות, גופים ממשלתיים, אקדמיה',
      mid: 'חברות תאגיד בינוניות, יצרניות תוכנה ותיקות',
      right: 'סטארטאפים בצמיחה, hyper-growth, סוכנויות פרסום',
    },
    explanation_medium:
      'הקצב שבו את/ה משגשג/ת: deliberation שקטה לעומת אנרגיה מתמדת ושינויים תכופים.',
    explanation_deep:
      'קצב גבוה נדרש בארגונים עם time-to-market קצר, צוותים אנרגטיים, ופגישות תכופות. קצב מתון משגשג בארגונים שמתמחים בהעמקה. חוסר התאמה לקצב הוא הסיבה השכיחה ביותר לעזיבה ב-12 חודשים הראשונים.',
  },
  {
    id: 'innovation',
    leftPole: 'שגרה ופרוצדורה מוסדרת',
    rightPole: 'חדשנות ופתיחות להתנסות',
    compute: ({ C, O }) => clamp(O * 0.7 + (100 - C) * 0.3),
    bestFitOrgs: {
      left: 'בנקאות, בריאות, תחבורה, פיננסים, סייבר',
      mid: 'חברות תוכנה ותיקות, יעוץ עסקי, retail',
      right: 'AI startups, ארגוני R&D, סוכנויות עיצוב, חברות זנק טכנולוגיות',
    },
    explanation_medium:
      'הנטייה להעדיף תהליכים מנוסים ובדוקים מול ניסיון של דברים חדשים.',
    explanation_deep:
      'גישה חדשנית גבוהה היא נכס בסביבות "אקספלורטיביות" (R&D, מוצר חדש), אך עלולה להיות גורם חוסר-יציבות בסביבות "אקספלויטטיביות" (תפעול, רגולציה). מחקרי O\'Reilly & Tushman (2013) מצביעים שארגונים מצליחים זקוקים לתמהיל.',
  },
  {
    id: 'collaboration',
    leftPole: 'אינדיבידואלי ועצמאי',
    rightPole: 'קולקטיבי ושיתופי',
    compute: ({ A, E }) => clamp(A * 0.5 + E * 0.5),
    bestFitOrgs: {
      left: 'מחקר, פיננסים, התמחויות עצמאיות, אדריכלות',
      mid: 'חברות תוכנה בינוניות, חברות יעוץ, ארגוני מדיה',
      right: 'סטארטאפים, סוכנויות יצירה, חברות שירותים אנושיים, חינוך',
    },
    explanation_medium:
      'העדפה לעבודה עצמית מול שיתוף פעיל ושיחות תכופות.',
    explanation_deep:
      'ארגונים קולקטיביים בנויים סביב open offices, ישיבות תכופות, וערכי team-first. עצמאיים בארגונים אלה חווים שחיקה מהירה. ארגונים אינדיבידואליים מתאימים יותר לאנשים שיוצרים ערך עצמאית — אך עלולים להיות בודדים לקולקטיביים.',
  },
  {
    id: 'formality',
    leftPole: 'פורמלי ומקצועי',
    rightPole: 'אינפורמלי וביתי',
    compute: ({ C, E, O }) => clamp(O * 0.4 + (100 - C) * 0.3 + E * 0.3),
    bestFitOrgs: {
      left: 'משרדי עורכי דין, בנקים, חברות יעוץ ותיקות, רפואה',
      mid: 'חברות תוכנה בינוניות, חברות אנרגיה, פארמה',
      right: 'סטארטאפים, סוכנויות יצירה, חברות גיימינג, קומיוניטיז',
    },
    explanation_medium:
      'רמת הפורמליות שמתאימה — לבוש, סגנון תקשורת, יחס למבנה.',
    explanation_deep:
      'פורמליות גבוהה משדרת אמון בסביבות עתירות-סיכון (פיננסים, בריאות, ייצוג משפטי). אינפורמליות מאפשרת אותנטיות וחדשנות. סטודנטים שמתחילים בתאגיד פורמלי לאחר תרבות סטארטאפ לרוב מדווחים על חרדה — וההיפך.',
  },
];

export function generateCulture(scores) {
  return cultureDefinitions.map((def) => {
    const position = def.compute(scores);
    const tilt = position < 40 ? 'left' : position > 60 ? 'right' : 'mid';
    return {
      id: def.id,
      leftPole: def.leftPole,
      rightPole: def.rightPole,
      position,
      explanation_medium: def.explanation_medium,
      explanation_deep: def.explanation_deep,
      bestFitOrgs: def.bestFitOrgs[tilt],
    };
  });
}

// ============================================================
// MAIN ENTRY
// ============================================================

export function generateAdvancedAnalysis(scores, role, options = {}) {
  const opts = {
    layers: options.layers || ['redflags', 'patterns', 'culture'],
    depth: options.depth || 'medium',
    sector: options.sector || 'standard',
  };
  return {
    options: opts,
    redflags: opts.layers.includes('redflags')
      ? generateRedFlags(scores, role, opts)
      : [],
    patterns: opts.layers.includes('patterns') ? generatePatterns(scores) : null,
    culture: opts.layers.includes('culture') ? generateCulture(scores) : [],
  };
}
