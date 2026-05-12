import { dimensions } from '../data/dimensions';

const strengthCopy = {
  E: 'אנרגיה חברתית גבוהה — יפעל היטב במצבים פרונטליים, ידע להניע אנשים סביבו.',
  A: 'אמפתיה ושיתוף פעולה — נוח לעבוד איתו, יודע להקשיב ולהתחשב באחרים.',
  C: 'מאורגן ואחראי — יעקוב אחרי משימות, יעמוד בזמנים, ידייק בפרטים.',
  S: 'יציבות רגשית — שומר על קור רוח תחת לחץ, מקבל החלטות שקולות.',
  O: 'סקרנות ויצירתיות — מחפש פתרונות חדשים, פתוח לרעיונות מורכבים.',
};

const concernCopyLow = {
  E: 'אנרגיה חברתית נמוכה — ייתכן שיתקשה במצבים פרונטליים אינטנסיביים או רשת חיצונית.',
  A: 'נטייה פחותה לשיתוף פעולה — שווה לבדוק איך מתמודד עם קונפליקטים בצוות.',
  C: 'אתגר במשמעת/ארגון — ייתכן שיזדקק למסגרת ברורה יותר ולמעקב.',
  S: 'רגישות ללחץ — חשוב לבדוק איך הוא מנהל מצבי משבר ועומס.',
  O: 'נטייה מועטה לחדשנות — מעדיף שגרה ידועה, פחות מתאים לסביבה משתנה.',
};

const concernCopyHigh = {
  E: 'אנרגיה חברתית גבוהה מאוד — ייתכן שיתקשה במשימות אישיות שדורשות ריכוז שקט.',
  C: 'מצפוניות גבוהה מאוד — שווה לוודא שאינו פרפקציוניסט עד כדי האטה.',
};

const interviewBank = {
  E: [
    'ספר על מצב שבו היה עליך לדבר מול קהל / לקוח חשוב — איך הרגשת? איך התכוננת?',
    'מתי לאחרונה היה עליך לקחת יוזמה חברתית בקבוצה לא מוכרת? איך התנהל המהלך?',
  ],
  A: [
    'תאר קונפליקט שהיה לך עם עמית לעבודה. איך גישרת ביניכם?',
    'באיזה אופן אתה מבטא תמיכה בחבר צוות שמתקשה?',
  ],
  C: [
    'איך אתה מנהל מספר משימות במקביל? תן דוגמה ספציפית מהשבוע האחרון.',
    'תאר פרויקט שבו הצלחת לעמוד בלוח זמנים תחת לחץ. מה היה הסוד?',
  ],
  S: [
    'ספר על משבר מקצועי משמעותי שעברת. איך הגבת ברגע? איך התאוששת?',
    'איך אתה שומר על איזון רגשי כשמשהו לא עובד? תן כלי ספציפי.',
  ],
  O: [
    'תאר רעיון יצירתי שיזמת בעבודה. איך הגעת אליו? איך הצגת אותו?',
    'מתי לאחרונה למדת משהו חדש לחלוטין? איך התקדמת?',
  ],
};

export function generateInsights(scores, role) {
  const strengths = [];
  const concerns = [];
  const questions = [];

  Object.keys(role.ideal).forEach((d) => {
    const score = scores[d];
    const ideal = role.ideal[d];
    const diff = score - ideal;

    if (score >= 70 && Math.abs(diff) <= 15) {
      strengths.push({
        dim: d,
        name: dimensions[d].name,
        score,
        copy: strengthCopy[d],
      });
    }

    if (diff <= -20) {
      concerns.push({
        dim: d,
        name: dimensions[d].name,
        score,
        ideal,
        gap: Math.abs(diff),
        copy: concernCopyLow[d],
      });
      (interviewBank[d] || []).slice(0, 1).forEach((q) =>
        questions.push({ dim: d, name: dimensions[d].name, q })
      );
    } else if ((d === 'E' || d === 'C') && diff >= 25) {
      concerns.push({
        dim: d,
        name: dimensions[d].name,
        score,
        ideal,
        gap: diff,
        copy: concernCopyHigh[d] || `${dimensions[d].name} מעל הצפוי — שווה לבדוק.`,
      });
    }
  });

  if (concerns.length === 0) {
    Object.keys(role.ideal).forEach((d) => {
      const score = scores[d];
      const ideal = role.ideal[d];
      if (score < ideal - 10 && interviewBank[d]) {
        questions.push({ dim: d, name: dimensions[d].name, q: interviewBank[d][0] });
      }
    });
  }

  if (questions.length < 3) {
    const sortedByWeight = Object.entries(role.weights)
      .sort((a, b) => b[1] - a[1])
      .map(([d]) => d);
    for (const d of sortedByWeight) {
      if (questions.length >= 3) break;
      const existing = questions.find((q) => q.dim === d);
      if (existing) continue;
      const bank = interviewBank[d] || [];
      const text = bank[questions.filter((q) => q.dim === d).length] || bank[0];
      if (text) questions.push({ dim: d, name: dimensions[d].name, q: text });
    }
  }

  return { strengths, concerns, interviewQuestions: questions.slice(0, 5) };
}
