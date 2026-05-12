import { useState } from 'react';
import { MessageCircle, Lightbulb, Swords, Flame, X, Info } from 'lucide-react';

const iconMap = {
  message: MessageCircle,
  bulb: Lightbulb,
  swords: Swords,
  flame: Flame,
};

const cardMeta = {
  communication: {
    label: 'תקשורת',
    iconKey: 'message',
    accent: 'petrol',
  },
  decisions: {
    label: 'קבלת החלטות',
    iconKey: 'bulb',
    accent: 'ochre',
  },
  conflict: {
    label: 'התמודדות עם קונפליקטים',
    iconKey: 'swords',
    accent: 'brick',
  },
  motivation: {
    label: 'מוטיבציה',
    iconKey: 'flame',
    accent: 'forest',
  },
};

const accentClasses = {
  petrol: { icon: 'bg-petrol-tint text-petrol border-petrol/30', eyebrow: 'text-petrol', border: 'border-r-petrol' },
  ochre: { icon: 'bg-ochre-tint text-ochre border-ochre/30', eyebrow: 'text-ochre', border: 'border-r-ochre' },
  brick: { icon: 'bg-brick-tint text-brick border-brick/30', eyebrow: 'text-brick', border: 'border-r-brick' },
  forest: { icon: 'bg-forest-tint text-forest border-forest/30', eyebrow: 'text-forest', border: 'border-r-forest' },
};

function PatternCard({ kind, pattern, depth, onOpen }) {
  const meta = cardMeta[kind];
  const Icon = iconMap[meta.iconKey];
  const a = accentClasses[meta.accent];

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`text-right bg-paper-light border border-ink-line ${a.border} border-r-[4px] p-5 hover:shadow-ink-sm hover:-translate-x-px hover:-translate-y-px transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 border flex items-center justify-center ${a.icon}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <span className={`eyebrow ${a.eyebrow} font-semibold`}>{meta.label}</span>
      </div>
      <div className="display text-[19px] text-ink mb-2 leading-snug">{pattern.style}</div>
      {depth !== 'shallow' && (
        <p className="text-[13px] text-ink-soft leading-relaxed">{pattern.explanation_medium}</p>
      )}
      {kind === 'motivation' && depth !== 'shallow' && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <div className="eyebrow text-forest font-semibold mb-1">מניעים</div>
            <ul className="text-[12px] text-ink-soft space-y-0.5">
              {pattern.drivers.map((d) => (
                <li key={d}>· {d}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow text-oxblood font-semibold mb-1">מאיטים</div>
            <ul className="text-[12px] text-ink-soft space-y-0.5">
              {pattern.demotivators.map((d) => (
                <li key={d}>· {d}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="mt-3 text-[11px] tracking-widish uppercase text-ink-mute">
        ← לחצי לפרטים מלאים
      </div>
    </button>
  );
}

function PatternModal({ kind, pattern, depth, onClose }) {
  const meta = cardMeta[kind];
  const Icon = iconMap[meta.iconKey];
  const a = accentClasses[meta.accent];

  return (
    <div
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper-light border-2 border-ink shadow-ink max-w-xl w-full max-h-[85vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b border-ink-line">
          <div className="flex items-start gap-3">
            <div className={`w-11 h-11 border flex items-center justify-center ${a.icon} shrink-0`}>
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div>
              <div className={`eyebrow ${a.eyebrow} font-semibold mb-1`}>{meta.label}</div>
              <h3 className="display text-2xl text-ink leading-tight">{pattern.style}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 border border-ink-line hover:border-ink hover:bg-paper-dark flex items-center justify-center transition-all"
            aria-label="סגור"
          >
            <X size={16} />
          </button>
        </header>

        <div className="p-6">
          <div className="eyebrow mb-2">תיאור הדפוס</div>
          <p className="text-[14px] text-ink leading-relaxed mb-5">
            {depth === 'shallow' ? pattern.explanation_medium : pattern.explanation_medium}
          </p>

          {(depth === 'deep' || depth === 'medium') && (
            <>
              <div className="eyebrow mb-2">רקע מקצועי</div>
              <p className="text-[13px] text-ink-soft leading-relaxed mb-5">
                {pattern.explanation_deep}
              </p>
            </>
          )}

          {kind === 'motivation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="bg-forest-tint border border-forest/30 p-4">
                <div className="eyebrow text-forest font-semibold mb-2">מה מניע אותו/ה</div>
                <ul className="text-[14px] text-ink leading-relaxed space-y-1">
                  {pattern.drivers.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-oxblood-tint border border-oxblood/30 p-4">
                <div className="eyebrow text-oxblood font-semibold mb-2">מה ייקטין אותה/ו</div>
                <ul className="text-[14px] text-ink leading-relaxed space-y-1">
                  {pattern.demotivators.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-petrol-tint border border-petrol/30 p-4 flex items-start gap-2.5">
            <Info size={16} className="text-petrol shrink-0 mt-0.5" />
            <div>
              <div className="eyebrow-petrol mb-1">טיפ למנהל המגייס</div>
              <p className="text-[13px] text-ink leading-relaxed">{pattern.managerTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkPatternsSection({ patterns, depth }) {
  const [open, setOpen] = useState(null);

  return (
    <section className="mb-12">
      <header className="flex items-baseline gap-4 mb-5">
        <span className="num text-[11px] tracking-widish text-petrol font-semibold">B</span>
        <h2 className="display text-2xl text-ink">דפוסי עבודה צפויים</h2>
        <div className="flex-1 rule h-px" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(patterns).map(([kind, pattern]) => (
          <PatternCard
            key={kind}
            kind={kind}
            pattern={pattern}
            depth={depth}
            onOpen={() => setOpen(kind)}
          />
        ))}
      </div>

      {open && (
        <PatternModal
          kind={open}
          pattern={patterns[open]}
          depth={depth}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
