import { AlertTriangle, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import { dimensions, dimensionOrder } from '../../data/dimensions';

const levelConfig = {
  consistent: {
    icon: CheckCircle2,
    label: 'תשובות עקביות',
    eyebrow: 'איכות תשובות',
    border: 'border-forest/40',
    bg: 'bg-forest-tint',
    text: 'text-forest',
    accent: 'border-r-forest',
    iconBg: 'bg-forest text-paper-light',
  },
  mild: {
    icon: AlertTriangle,
    label: 'חוסר עקביות קל',
    eyebrow: 'איכות תשובות · התראה',
    border: 'border-ochre/40',
    bg: 'bg-ochre-tint',
    text: 'text-ochre',
    accent: 'border-r-ochre',
    iconBg: 'bg-ochre text-paper-light',
  },
  high: {
    icon: ShieldAlert,
    label: 'חוסר עקביות משמעותי',
    eyebrow: 'איכות תשובות · התראה',
    border: 'border-oxblood/40',
    bg: 'bg-oxblood-tint',
    text: 'text-oxblood',
    accent: 'border-r-oxblood',
    iconBg: 'bg-oxblood text-paper-light',
  },
};

const interpretations = {
  mild: [
    'ייתכן שחלק מהשאלות לא היו ברורות לחלוטין למועמד/ת — שווה לחזור על 2-3 דוגמאות בראיון.',
    'ייתכן שהמועמד/ת מבטא/ת אישיות גמישה שמשתנה לפי הקשר — לוודא יציבות בתפקיד.',
    'הציונים עדיין שמישים — אך כדאי לאמת אותם בראיון.',
  ],
  high: [
    'ייתכן שהמועמד/ת ניסה/תה להציג עצמו/ה באופן שיתאים למה ש"חיפשנו" — לבחון אותנטיות.',
    'ייתכן שהשאלון לא נקרא בעיון — לשקול לחזור על השאלון או לדחות את התוצאות.',
    'ייתכן שמדובר בקושי אישיותי בעקביות עצמית — לבדוק בראיון התנהגותי מובנה.',
    'הציונים פחות אמינים — מומלץ לא להסתמך עליהם כראיה יחידה.',
  ],
};

export default function ConsistencyAlert({ consistency }) {
  if (!consistency) return null;
  // For 'consistent' show a compact pill, not a full alert.
  if (consistency.level === 'consistent') {
    return (
      <div className="mb-6 inline-flex items-center gap-2 border border-forest/40 bg-forest-tint text-forest px-3 py-1.5 text-[11px] tracking-widish uppercase font-semibold">
        <CheckCircle2 size={13} />
        <span>תשובות עקביות</span>
        <span className="num text-forest" dir="ltr">
          {consistency.consistencyScore}%
        </span>
      </div>
    );
  }

  const c = levelConfig[consistency.level];
  const Icon = c.icon;
  const items = interpretations[consistency.level] || [];

  // Find the dimension with worst inconsistency to highlight
  const worstDim = Object.entries(consistency.detailsByDim || {}).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <section className={`mb-6 ${c.bg} ${c.border} ${c.accent} border-2 border-r-[5px] p-5`}>
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 ${c.iconBg} flex items-center justify-center shrink-0`}>
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <div>
            <div className={`eyebrow ${c.text} font-semibold mb-1`}>{c.eyebrow}</div>
            <h3 className={`display text-xl ${c.text} leading-tight`}>{c.label}</h3>
          </div>
        </div>
        <div className="text-left shrink-0">
          <div className={`num display text-3xl ${c.text} leading-none`} dir="ltr">
            {consistency.consistencyScore}%
          </div>
          <div className="text-[10px] tracking-widish uppercase text-ink-mute mt-1">
            עקביות
          </div>
        </div>
      </header>

      <p className="text-[14px] text-ink leading-relaxed mb-4 max-w-2xl">
        המועמד/ת ענה/תה תשובות מנוגדות לזוגות שאלות שמודדות את אותה תכונה.
        זה לא בהכרח שלילי — אבל דורש פירוש זהיר של הציונים.
      </p>

      <div className="mb-4">
        <div className={`eyebrow ${c.text} font-semibold mb-2`}>פירושים אפשריים</div>
        <ul className="space-y-1.5">
          {items.map((s, i) => (
            <li key={i} className="flex gap-2 text-[13px] text-ink leading-relaxed">
              <span className={`${c.text} shrink-0`}>·</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {worstDim && (
        <div className="pt-3 border-t border-ink-line/60 flex items-center gap-2.5">
          <Info size={13} className="text-ink-mute shrink-0" />
          <p className="text-[12px] text-ink-soft">
            הממד עם חוסר העקביות הגבוה ביותר:{' '}
            <span className={`font-semibold ${dimensions[worstDim[0]].classes.text}`}>
              {dimensions[worstDim[0]].name}
            </span>
            {' · '}
            <span className="text-ink-mute">
              ממוצע סטייה ב-{consistency.pairsAnalyzed} זוגות שאלות:{' '}
              <span className="num" dir="ltr">{consistency.avgInconsistency}</span>
            </span>
          </p>
        </div>
      )}

      {/* Per-dimension breakdown — small bars */}
      <div className="mt-3 pt-3 border-t border-ink-line/60">
        <div className="eyebrow text-ink-mute mb-2">פירוט לפי ממד</div>
        <div className="grid grid-cols-5 gap-3">
          {dimensionOrder.map((d) => {
            const v = consistency.detailsByDim?.[d];
            if (v === undefined) return null;
            const dimMeta = dimensions[d];
            const pct = Math.min(100, (v / 4) * 100);
            return (
              <div key={d}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className={`text-[10px] font-semibold ${dimMeta.classes.text}`}>
                    {dimMeta.key}
                  </span>
                  <span className="num text-[10px] text-ink-soft" dir="ltr">{v}</span>
                </div>
                <div className="relative h-1 bg-paper-dark border border-ink-line/60">
                  <div
                    className={`absolute top-0 right-0 h-full ${
                      v < 1 ? 'bg-forest' : v < 1.6 ? 'bg-ochre' : 'bg-oxblood'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
