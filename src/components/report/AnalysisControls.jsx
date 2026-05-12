import { ShieldAlert } from 'lucide-react';

const layerLabels = {
  redflags: 'דגלים פונקציונליים',
  patterns: 'דפוסי עבודה',
  culture: 'התאמה תרבותית',
};

const depthOptions = [
  { id: 'shallow', label: 'קצר', sub: 'כותרות בלבד' },
  { id: 'medium', label: 'בינוני', sub: 'הסברים' },
  { id: 'deep', label: 'עומק', sub: 'הסבר + מחקר' },
];

export default function AnalysisControls({
  layers,
  onToggleLayer,
  depth,
  onDepthChange,
  sector,
  onSectorChange,
}) {
  return (
    <section className="bg-paper-light border border-ink-line p-5 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-8 gap-y-5 items-start">
        <div>
          <div className="eyebrow-petrol mb-3">שכבות ניתוח</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(layerLabels).map(([id, label]) => {
              const active = layers.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onToggleLayer(id)}
                  className={`
                    h-9 px-4 text-[12px] tracking-widish uppercase font-medium border-2 transition-all
                    ${active
                      ? 'bg-petrol text-paper-light border-petrol'
                      : 'bg-paper-light text-ink-soft border-ink-line hover:border-petrol hover:text-petrol'}
                  `}
                >
                  {active ? '✓' : '○'}  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="eyebrow-petrol mb-3">עומק תובנות</div>
          <div className="inline-flex border-2 border-ink-line bg-paper-light overflow-hidden">
            {depthOptions.map((opt) => {
              const active = depth === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onDepthChange(opt.id)}
                  className={`
                    flex flex-col items-center justify-center px-4 py-1.5 text-[12px] uppercase tracking-widish font-medium transition-all min-w-[88px]
                    ${active
                      ? 'bg-petrol text-paper-light'
                      : 'text-ink-soft hover:bg-petrol-tint hover:text-petrol'}
                    ${opt.id !== 'shallow' ? 'border-r border-ink-line' : ''}
                  `}
                  style={{ direction: 'rtl' }}
                >
                  <span>{opt.label}</span>
                  <span className={`text-[9px] tracking-normal normal-case font-normal mt-0.5 ${active ? 'opacity-80' : 'text-ink-mute'}`}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-ink-line/60 mt-5 pt-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <span
            className={`
              w-5 h-5 border-2 flex items-center justify-center transition-all shrink-0
              ${sector === 'regulated'
                ? 'border-oxblood bg-oxblood text-paper-light'
                : 'border-ink-line bg-paper-light group-hover:border-oxblood'}
            `}
          >
            {sector === 'regulated' && <span className="text-xs leading-none">✓</span>}
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={sector === 'regulated'}
            onChange={(e) =>
              onSectorChange(e.target.checked ? 'regulated' : 'standard')
            }
          />
          <span className="text-sm text-ink-soft group-hover:text-ink">
            <span className="font-medium">סקטור מפוקח</span>
            <span className="text-ink-mute text-[12px] mr-2">
              (בנקאות, ביטחון, בריאות, ממשלה)
            </span>
          </span>
        </label>

        {sector === 'regulated' && (
          <div className="mt-3 flex items-start gap-2.5 bg-oxblood-tint border border-oxblood/40 px-4 py-3 text-[13px] text-oxblood">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>
              מצב סקטור מפוקח: חלק מהתובנות מוסתרות בהתאם להנחיות רגולציה כדי למנוע סיכון אפליה.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
