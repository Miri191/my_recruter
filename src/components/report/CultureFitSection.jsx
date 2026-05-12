import { Building2 } from 'lucide-react';

function CultureRow({ dim, depth }) {
  // Color the marker by tilt — left=indigo (traditional), right=plum (modern), mid=petrol
  const tilt = dim.position < 40 ? 'left' : dim.position > 60 ? 'right' : 'mid';
  const markerColor =
    tilt === 'left' ? 'bg-indigo' : tilt === 'right' ? 'bg-plum' : 'bg-petrol';
  const labelColor =
    tilt === 'left' ? 'text-indigo' : tilt === 'right' ? 'text-plum' : 'text-petrol';

  return (
    <article className="bg-paper-light border border-ink-line p-5">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <span className="text-[14px] text-ink-soft font-medium">{dim.leftPole}</span>
        <span className={`num text-[13px] ${labelColor} font-semibold`} dir="ltr">
          {dim.position}
          <span className="text-ink-mute mr-0.5">/100</span>
        </span>
        <span className="text-[14px] text-ink-soft font-medium">{dim.rightPole}</span>
      </div>

      <div className="relative h-2 bg-paper-dark border border-ink-line/60 mb-1">
        <div className="absolute top-0 right-1/2 w-px h-full bg-ink-line/80" />
        <div
          className={`absolute -top-1.5 h-[14px] w-[3px] ${markerColor} transition-all duration-700 ease-out`}
          style={{ right: `calc(${dim.position}% - 1.5px)` }}
        >
          <span
            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${markerColor} rotate-45`}
          />
        </div>
      </div>
      <div className="flex justify-between text-[10px] tracking-widish uppercase text-ink-mute">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>

      {depth !== 'shallow' && (
        <>
          <div className="rule my-4" />
          <p className="text-[13px] text-ink-soft leading-relaxed mb-3">
            {depth === 'deep' ? dim.explanation_deep : dim.explanation_medium}
          </p>

          <div className="flex items-start gap-2 bg-petrol-tint border border-petrol/30 p-3">
            <Building2 size={14} className="text-petrol shrink-0 mt-0.5" />
            <div>
              <div className="eyebrow-petrol mb-1">ארגונים שתואמים את הפרופיל</div>
              <p className="text-[13px] text-ink leading-relaxed">{dim.bestFitOrgs}</p>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

export default function CultureFitSection({ culture, depth }) {
  return (
    <section className="mb-12">
      <header className="flex items-baseline gap-4 mb-5">
        <span className="num text-[11px] tracking-widish text-plum font-semibold">C</span>
        <h2 className="display text-2xl text-ink">התאמה תרבותית ארגונית</h2>
        <div className="flex-1 rule h-px" />
      </header>

      <p className="text-[13px] text-ink-mute mb-5 max-w-2xl leading-relaxed">
        5 ממדים שמתארים באיזה סביבה ארגונית הפרופיל ישגשג. אינדיגו = נטייה למסורתי, פלום = נטייה למודרני, פטרול = איזון.
      </p>

      <div className="space-y-3">
        {culture.map((dim) => (
          <CultureRow key={dim.id} dim={dim} depth={depth} />
        ))}
      </div>
    </section>
  );
}
