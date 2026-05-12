import { Building2, Info } from 'lucide-react';

// Marker color by tilt — left = indigo (traditional), right = plum (modern),
// mid = petrol (balanced).
const tiltColors = {
  strongLeft: { bar: 'bg-indigo', text: 'text-indigo' },
  left: { bar: 'bg-indigo', text: 'text-indigo' },
  mid: { bar: 'bg-petrol', text: 'text-petrol' },
  right: { bar: 'bg-plum', text: 'text-plum' },
  strongRight: { bar: 'bg-plum', text: 'text-plum' },
};

function CultureRow({ dim, depth }) {
  const colors = tiltColors[dim.tilt] || tiltColors.mid;

  return (
    <article className="bg-paper-light border border-ink-line p-6">
      <header className="flex items-baseline justify-between gap-4 mb-1">
        <h3 className="display text-[20px] text-ink">{dim.title}</h3>
        <span className="num text-[12px] text-ink-mute" dir="ltr">
          {dim.position}/100
        </span>
      </header>

      <div className={`text-[14px] font-medium ${colors.text} mb-4`}>
        {dim.tiltLabel}
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between text-[12px] text-ink-soft mb-1.5">
          <span>{dim.leftPole}</span>
          <span>{dim.rightPole}</span>
        </div>
        <div className="relative h-[6px] bg-paper-dark border border-ink-line/60">
          <div className="absolute top-0 right-1/2 w-px h-full bg-ink-line" />
          <div
            className={`absolute -top-[5px] h-4 w-[3px] ${colors.bar} transition-all duration-700 ease-out shadow-sm`}
            style={{ right: `calc(${dim.position}% - 1.5px)` }}
          >
            <span
              className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${colors.bar} rotate-45`}
            />
          </div>
        </div>
      </div>

      {depth !== 'shallow' && (
        <p className="text-[14px] text-ink leading-relaxed mb-4">{dim.read}</p>
      )}

      <div className="flex items-start gap-2.5 bg-petrol-tint border border-petrol/30 p-3">
        <Building2 size={15} className="text-petrol shrink-0 mt-0.5" />
        <div>
          <div className="eyebrow-petrol mb-1">ארגונים מתאימים</div>
          <p className="text-[13px] text-ink leading-relaxed">{dim.bestFitOrgs}</p>
        </div>
      </div>

      {depth === 'deep' && dim.whyBased && (
        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-ink-line/60">
          <Info size={13} className="text-ink-mute shrink-0 mt-0.5" />
          <p className="text-[12px] text-ink-mute leading-relaxed italic">
            <span className="font-medium not-italic">איך זה חושב: </span>
            {dim.whyBased}
          </p>
        </div>
      )}
    </article>
  );
}

export default function CultureFitSection({ culture, depth }) {
  return (
    <section className="mb-12">
      <header className="flex items-baseline gap-4 mb-3">
        <span className="num text-[11px] tracking-widish text-plum font-semibold">C</span>
        <h2 className="display text-2xl text-ink">התאמה תרבותית ארגונית</h2>
        <div className="flex-1 rule h-px" />
      </header>

      <p className="text-[14px] text-ink-soft mb-6 max-w-2xl leading-relaxed">
        חמישה ממדים שעוזרים להבין באיזה סוג ארגון המועמדת תפרח. כל ממד יש לו שני קצוות —
        הסמן מציג לאן הפרופיל נוטה.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {culture.map((dim) => (
          <CultureRow key={dim.id} dim={dim} depth={depth} />
        ))}
      </div>
    </section>
  );
}
