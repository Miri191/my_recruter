import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  ClipboardList,
  BarChart3,
  Flag,
  Users,
  FileDown,
  Lock,
  Compass,
  ArrowLeft,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { dimensions, dimensionOrder } from '../data/dimensions';

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 border-2 border-ink bg-paper-light flex items-center justify-center">
        <Sparkles size={18} className="text-petrol" />
      </div>
      <div>
        <div className="display text-2xl text-ink leading-none" dir="ltr">
          Persona
        </div>
        <div className="text-[10px] tracking-wider2 uppercase text-ink-mute mt-0.5">
          אבחון אישיותי
        </div>
      </div>
    </div>
  );
}

function CTAButton({ onClick, variant = 'primary', children, size = 'lg' }) {
  const variants = {
    primary:
      'bg-ink text-paper-light hover:bg-petrol border-2 border-ink hover:border-petrol shadow-petrol-sm hover:-translate-y-px',
    secondary:
      'bg-paper-light text-ink border-2 border-ink hover:bg-ink hover:text-paper-light',
  };
  const sizes = {
    md: 'h-11 px-5 text-[13px]',
    lg: 'h-12 px-6 text-[14px]',
    xl: 'h-14 px-8 text-[15px]',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-3 font-semibold uppercase tracking-widish
        transition-all duration-200 touch-manipulation select-none
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </button>
  );
}

function DimensionLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[11px] tracking-widish uppercase">
      {dimensionOrder.map((d) => {
        const m = dimensions[d];
        return (
          <span key={d} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${m.classes.dot}`} />
            <span className={`${m.classes.text} font-semibold`}>{m.key}</span>
            <span className="text-ink-soft">{m.name}</span>
          </span>
        );
      })}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const goToApp = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-paper">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur border-b border-ink-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Logo />
          <CTAButton onClick={goToApp} size="md">
            כניסה למערכת
            <ArrowLeft size={14} />
          </CTAButton>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-petrol" />
              <span className="eyebrow-petrol">כלי גיוס חכם</span>
            </div>
            <h1 className="display text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.05] text-balance mb-6">
              לפני שאת מזמינה לראיון —{' '}
              <span className="text-petrol">הכירי</span>{' '}
              אותה קודם.
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-soft leading-relaxed mb-8 max-w-xl text-balance">
              קורות חיים מספרים מה היא עשתה. ראיונות מספרים מה היא רוצה שתחשבי.
              Persona מראה לך מי היא באמת — לפני שאת מקבלת החלטה.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <CTAButton onClick={goToApp} size="xl">
                כניסה למערכת
                <ArrowLeft size={16} />
              </CTAButton>
              <a
                href="#how-it-works"
                className="eyebrow-petrol hover:underline-petrol font-semibold"
              >
                איך זה עובד?
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10 pt-6 border-t border-ink-line">
              <div className="flex items-center gap-2 text-[12px]">
                <ShieldCheck size={14} className="text-forest" />
                <span className="text-ink-soft">מבוסס מחקר IPIP-50</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <Clock size={14} className="text-petrol" />
                <span className="text-ink-soft">5 דקות למילוי</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <Lock size={14} className="text-ink-soft" />
                <span className="text-ink-soft">נתונים מקומיים בלבד</span>
              </div>
            </div>
          </div>

          {/* Hero visual — stylized "radar" preview */}
          <div className="relative">
            <div className="bg-paper-light border-2 border-ink shadow-petrol p-7 md:p-9 relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="eyebrow-petrol mb-1">דוח לדוגמה</div>
                  <div className="display text-[19px] text-ink">דנה כהן</div>
                </div>
                <span className="num text-3xl text-forest font-medium" dir="ltr">
                  87
                  <span className="text-base text-ink-mute">%</span>
                </span>
              </div>
              <div className="rule-petrol mb-5" />

              <div className="space-y-3 mb-5">
                {[
                  { d: 'E', score: 82, max: 80 },
                  { d: 'A', score: 70, max: 65 },
                  { d: 'C', score: 78, max: 75 },
                  { d: 'S', score: 75, max: 75 },
                  { d: 'O', score: 68, max: 60 },
                ].map(({ d, score, max }) => {
                  const m = dimensions[d];
                  return (
                    <div key={d}>
                      <div className="flex items-baseline justify-between mb-1 text-[11px]">
                        <span className={`${m.classes.text} font-semibold uppercase tracking-widish`}>
                          {m.key} · {m.name}
                        </span>
                        <span className="num text-ink-soft" dir="ltr">
                          {score}/{max}
                        </span>
                      </div>
                      <div className="relative h-[5px] bg-paper-dark">
                        <div
                          className={`absolute right-0 top-0 h-full ${m.classes.bar}`}
                          style={{ width: `${score}%` }}
                        />
                        <div
                          className="absolute -top-0.5 h-2 w-px bg-ink"
                          style={{ right: `${max}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-baseline justify-between text-[11px] tracking-widish uppercase pt-4 border-t border-ink-line text-ink-mute">
                <span>מנהל מוצר</span>
                <span className="text-forest font-semibold">התאמה גבוהה</span>
              </div>
            </div>

            {/* Decorative floating sticker */}
            <div className="hidden md:block absolute -bottom-5 -right-5 bg-brick text-paper-light border-2 border-ink shadow-ink-sm px-4 py-3 rotate-3">
              <div className="text-[10px] tracking-wider2 uppercase opacity-90">3 שכבות ניתוח</div>
              <div className="display text-lg leading-none mt-1">דגלים, דפוסים, תרבות</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Problem / Solution ===== */}
      <section className="border-y-2 border-ink py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="eyebrow text-oxblood font-semibold mb-3">הבעיה</div>
              <h2 className="display text-3xl md:text-4xl text-ink mb-6 leading-tight text-balance">
                90% מהחלטות הגיוס מבוססות על תחושת בטן.
              </h2>
              <ul className="space-y-4 text-[15px] text-ink-soft leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-oxblood shrink-0 mt-1">·</span>
                  <span>
                    <strong className="text-ink font-medium">קו"חים מוטים.</strong>{' '}
                    מי שיודע לכתוב טוב יותר זוכה להזדמנות — לא בהכרח מי שמתאים לתפקיד.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-oxblood shrink-0 mt-1">·</span>
                  <span>
                    <strong className="text-ink font-medium">ראיונות מטעים.</strong>{' '}
                    מועמדים מציגים מה שהם חושבים שאת רוצה לשמוע — לא איך הם באמת יעבדו.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-oxblood shrink-0 mt-1">·</span>
                  <span>
                    <strong className="text-ink font-medium">טעות גיוס יקרה.</strong>{' '}
                    החלפת עובד עולה 50%–200% מהשכר השנתי שלו, ומשפיעה על כל הצוות.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-oxblood shrink-0 mt-1">·</span>
                  <span>
                    <strong className="text-ink font-medium">העבר לא תמיד מנבא.</strong>{' '}
                    מועמדת מצוינת בתפקיד קודם — לא בהכרח מתאימה לתפקיד שלך.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <div className="eyebrow text-forest font-semibold mb-3">המענה שלנו</div>
              <h2 className="display text-3xl md:text-4xl text-ink mb-6 leading-tight text-balance">
                שכבת נתונים אובייקטיבית, לפני הראיון.
              </h2>
              <ul className="space-y-4 text-[15px] text-ink-soft leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-forest shrink-0 mt-1">✓</span>
                  <span>
                    <strong className="text-ink font-medium">שאלון מאומת מדעית.</strong>{' '}
                    BIG5 — המודל הנפוץ בעולם להערכת אישיות מקצועית, על בסיס עשורים של מחקר.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest shrink-0 mt-1">✓</span>
                  <span>
                    <strong className="text-ink font-medium">5 דקות מהמועמד.</strong>{' '}
                    שאלון קצר במובייל — לא דורש זמן יקר ממך או מהמועמד.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest shrink-0 mt-1">✓</span>
                  <span>
                    <strong className="text-ink font-medium">ציון התאמה ברור לתפקיד.</strong>{' '}
                    משוקלל לפי מה שחשוב לתפקיד הספציפי — לא ציון גנרי.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest shrink-0 mt-1">✓</span>
                  <span>
                    <strong className="text-ink font-medium">שאלות מותאמות לראיון.</strong>{' '}
                    הדוח מציע לך בדיוק מה לשאול — איך לאמת או להפריך את התובנות לפני שאת מחליטה.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section id="how-it-works" className="bg-paper-light border-b-2 border-ink py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex items-baseline gap-4 mb-12">
            <h2 className="display text-3xl md:text-4xl text-ink">איך זה עובד</h2>
            <div className="flex-1 rule-petrol h-px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                n: '01',
                icon: ClipboardList,
                color: 'petrol',
                title: 'יוצרים מועמד',
                desc: 'בוחרים תפקיד (6 מוכנים + אפשרות ליצור משלך), ממלאים פרטים — ומקבלים קישור אישי לשליחה.',
              },
              {
                n: '02',
                icon: Mail,
                color: 'brick',
                title: 'שולחים למועמד',
                desc: 'שולחים את הקישור ב-WhatsApp, מייל או SMS. המועמד עונה במובייל ב-5 דקות. אין צורך להוריד אפליקציה.',
              },
              {
                n: '03',
                icon: BarChart3,
                color: 'forest',
                title: 'מקבלים תמונה ברורה',
                desc: 'ציון התאמה ברור, פרופיל אישיות, איפה הוא חזק ואיפה כדאי לבדוק, ושאלות מותאמות לראיון.',
              },
            ].map(({ n, icon: Icon, color, title, desc }) => {
              const colorMap = {
                petrol: { bg: 'bg-petrol-tint', text: 'text-petrol', border: 'border-petrol/40' },
                brick: { bg: 'bg-brick-tint', text: 'text-brick', border: 'border-brick/40' },
                forest: { bg: 'bg-forest-tint', text: 'text-forest', border: 'border-forest/40' },
              };
              const c = colorMap[color];
              return (
                <div key={n}>
                  <div className={`w-14 h-14 border-2 ${c.border} ${c.bg} ${c.text} flex items-center justify-center mb-5`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className={`num text-[12px] tracking-widish ${c.text} font-semibold mb-2`}>שלב {n}</div>
                  <h3 className="display text-2xl text-ink mb-3">{title}</h3>
                  <p className="text-[14px] text-ink-soft leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BIG5 dimensions ===== */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <div className="text-center mb-12">
          <div className="eyebrow-petrol mb-3">מה אנחנו מודדים</div>
          <h2 className="display text-3xl md:text-4xl text-ink mb-4">חמישה ממדים שמרכיבים אישיות</h2>
          <p className="text-[15px] text-ink-soft max-w-2xl mx-auto leading-relaxed">
            BIG5 הוא המודל המוביל בעולם להערכת אישיות בעבודה. הוא מבוסס על עשורים של מחקר
            ועל מאות אלפי משתתפים — וכל אדם מקבל ציון על-פני חמישה ממדים בלתי-תלויים.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {dimensionOrder.map((d) => {
            const m = dimensions[d];
            return (
              <div
                key={d}
                className={`bg-paper-light border-2 ${m.classes.border.replace('border-', 'border-')}/30 ${m.classes.bgGhost} p-5`}
              >
                <div className={`num display text-4xl ${m.classes.text} mb-2 leading-none`}>
                  {m.key}
                </div>
                <div className="display text-lg text-ink mb-2">{m.name}</div>
                <p className="text-[12px] text-ink-soft leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="bg-paper-light border-y-2 border-ink py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex items-baseline gap-4 mb-12">
            <h2 className="display text-3xl md:text-4xl text-ink">מה תקבלי</h2>
            <div className="flex-1 rule-petrol h-px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              {
                icon: ClipboardList,
                color: 'text-petrol',
                bg: 'bg-petrol-tint border-petrol/40',
                title: '50 שאלות BIG5 בעברית',
                desc: 'שאלון IPIP-50 המאומת — לא חיתוך שרירותי. כתוב בעברית מקצועית ועברה התאמה תרבותית. 5 דק׳ למילוי במובייל.',
              },
              {
                icon: Flag,
                color: 'text-oxblood',
                bg: 'bg-oxblood-tint border-oxblood/40',
                title: 'דגלים פונקציונליים',
                desc: '8 דפוסי סיכון מבוססי מחקר (שחיקה, פרפקציוניזם, חוסר התמדה) — עם שאלות מובילות לראיון וטיפים למנהל.',
              },
              {
                icon: Compass,
                color: 'text-brick',
                bg: 'bg-brick-tint border-brick/40',
                title: 'דפוסי עבודה צפויים',
                desc: 'תקשורת, קבלת החלטות, התמודדות עם קונפליקטים, מוטיבציה — כל דפוס מנותח ומקושר לנפוצות בשטח.',
              },
              {
                icon: Users,
                color: 'text-forest',
                bg: 'bg-forest-tint border-forest/40',
                title: 'התאמה תרבותית',
                desc: '5 ממדים ארגוניים (היררכיה, קצב, חדשנות, שיתוף, פורמליות) + רשימת ארגונים מתאימים לפרופיל.',
              },
              {
                icon: FileDown,
                color: 'text-ochre',
                bg: 'bg-ochre-tint border-ochre/40',
                title: 'דוח PDF להורדה',
                desc: 'כפתור אחד מפיק דוח PDF איכותי לארכוב/שיתוף. כולל את כל הנתונים והניתוחים בעיצוב נקי.',
              },
              {
                icon: ShieldCheck,
                color: 'text-indigo',
                bg: 'bg-indigo-tint border-indigo/40',
                title: 'מצב סקטור מפוקח',
                desc: 'לבנקאות, בריאות וביטחון — מסתיר תובנות שעלולות ליצור סיכון אפליה, כל פי הנחיות רגולציה.',
              },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex gap-5">
                <div className={`w-12 h-12 border-2 ${bg} ${color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="display text-xl text-ink mb-2">{title}</h3>
                  <p className="text-[14px] text-ink-soft leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-ink-line">
            <DimensionLegend />
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-24 text-center">
        <div className="eyebrow-petrol mb-4">מוכנה לנסות?</div>
        <h2 className="display text-4xl md:text-5xl text-ink mb-5 text-balance">
          תפסיקי לנחש. תתחילי לדעת.
        </h2>
        <p className="text-[16px] text-ink-soft mb-8 max-w-xl mx-auto leading-relaxed text-balance">
          5 דקות ליצור קישור. 5 דקות למועמד למלא. דקה לראות תמונה ברורה.
        </p>
        <CTAButton onClick={goToApp} size="xl">
          כניסה למערכת
          <ArrowLeft size={16} />
        </CTAButton>
        <p className="text-[11px] text-ink-mute mt-4">
          המערכת מוגנת בסיסמה.
        </p>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t-2 border-ink bg-paper-light">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3 text-[11px] tracking-widish uppercase text-ink-mute">
            <span dir="ltr" className="display text-ink text-base">Persona</span>
            <span>·</span>
            <span>אבחון אישיותי לגיוס</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] tracking-widish uppercase text-ink-mute">
            <span>BIG5 · IPIP-50</span>
            <span>·</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
