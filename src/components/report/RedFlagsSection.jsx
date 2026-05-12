import { Flag, Info } from 'lucide-react';

const severityMap = {
  low: {
    label: 'נמוך',
    border: 'border-r-forest',
    bg: 'bg-forest-tint',
    text: 'text-forest',
    badge: 'border-forest/40 text-forest bg-forest-tint',
  },
  mid: {
    label: 'בינוני',
    border: 'border-r-ochre',
    bg: 'bg-ochre-tint',
    text: 'text-ochre',
    badge: 'border-ochre/40 text-ochre bg-ochre-tint',
  },
  high: {
    label: 'גבוה',
    border: 'border-r-oxblood',
    bg: 'bg-oxblood-tint',
    text: 'text-oxblood',
    badge: 'border-oxblood/40 text-oxblood bg-oxblood-tint',
  },
};

function FlagCard({ flag, depth }) {
  const sev = severityMap[flag.severity] || severityMap.low;
  return (
    <article
      className={`bg-paper-light border border-ink-line ${sev.border} border-r-[4px] p-5`}
    >
      <header className="flex items-baseline justify-between gap-3 mb-2">
        <h4 className="display text-[19px] text-ink leading-tight">{flag.title}</h4>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 border font-medium uppercase text-[10px] tracking-wider2 px-2 py-[3px] ${sev.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${sev.text.replace('text-', 'bg-')}`} />
          חומרה: {sev.label}
        </span>
      </header>

      <p className="text-[14px] text-ink-soft leading-relaxed mb-3">{flag.summary}</p>

      {depth !== 'shallow' && (
        <>
          <div className="rule mb-3" />
          <p className="text-[13px] text-ink-soft leading-relaxed mb-4">
            {depth === 'deep' ? flag.detail_deep : flag.detail_medium}
          </p>
        </>
      )}

      {depth !== 'shallow' && flag.interviewProbes?.length > 0 && (
        <div className="mb-3">
          <div className="eyebrow-petrol mb-2">שאלות מובילות לראיון</div>
          <ul className="space-y-1.5">
            {flag.interviewProbes.map((q, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-ink-soft leading-relaxed">
                <span className="num text-petrol shrink-0" dir="ltr">
                  0{i + 1}
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {depth === 'deep' && flag.managerTip && (
        <div className="border-t border-ink-line/60 pt-3 mt-3 flex items-start gap-2">
          <Info size={14} className="text-petrol shrink-0 mt-0.5" />
          <p className="text-[13px] text-ink-soft italic leading-relaxed">
            <span className="text-petrol font-medium not-italic">טיפ למנהל המגייס: </span>
            {flag.managerTip}
          </p>
        </div>
      )}
    </article>
  );
}

export default function RedFlagsSection({ flags, depth }) {
  return (
    <section className="mb-12">
      <header className="flex items-baseline gap-4 mb-5">
        <span className="num text-[11px] tracking-widish text-oxblood font-semibold">A</span>
        <Flag size={18} className="text-oxblood shrink-0" />
        <h2 className="display text-2xl text-ink">דגלים פונקציונליים</h2>
        <div className="flex-1 rule h-px" />
        <span className="num text-[12px] text-ink-mute">{flags.length} דגלים</span>
      </header>

      {flags.length === 0 ? (
        <div className="bg-forest-tint border border-forest/30 border-r-[4px] border-r-forest p-5">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="display text-[17px] text-forest">אין דגלים פונקציונליים מהותיים</span>
          </div>
          <p className="text-[13px] text-ink-soft leading-relaxed">
            הפרופיל לא מציג דפוסים שדורשים תשומת לב מיוחדת מעבר להתאמה הכללית לתפקיד.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {flags.map((f) => (
            <FlagCard key={f.id} flag={f} depth={depth} />
          ))}
        </div>
      )}
    </section>
  );
}
