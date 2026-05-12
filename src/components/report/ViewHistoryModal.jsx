import { X, Clock } from 'lucide-react';

function formatTimestamp(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const layerLabels = {
  redflags: 'דגלים',
  patterns: 'דפוסים',
  culture: 'תרבות',
};

const depthLabels = {
  shallow: 'קצר',
  medium: 'בינוני',
  deep: 'עומק',
};

export default function ViewHistoryModal({ history, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper-light border-2 border-ink shadow-ink max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b border-ink-line">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 border border-petrol/30 bg-petrol-tint text-petrol flex items-center justify-center shrink-0">
              <Clock size={20} strokeWidth={1.75} />
            </div>
            <div>
              <div className="eyebrow-petrol mb-1">היסטוריית צפיות</div>
              <h3 className="display text-2xl text-ink leading-tight">תיעוד גישות לדוח</h3>
              <p className="text-[12px] text-ink-mute mt-1">
                {history.length} צפיות מתועדות (לצורכי compliance)
              </p>
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

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {history.length === 0 ? (
            <div className="p-8 text-center text-ink-mute text-[13px]">
              אין צפיות מתועדות עדיין.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-paper-dark/40 border-b border-ink-line">
                  <th className="py-3 px-4 text-right eyebrow">מתי</th>
                  <th className="py-3 px-4 text-right eyebrow">שכבות</th>
                  <th className="py-3 px-4 text-right eyebrow">עומק</th>
                  <th className="py-3 px-4 text-right eyebrow">סקטור</th>
                  <th className="py-3 px-4 text-right eyebrow">דגלים</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((entry, i) => (
                  <tr key={i} className="border-b border-ink-line/60">
                    <td className="py-3 px-4 num text-[12px] text-ink-soft" dir="ltr">
                      {formatTimestamp(entry.viewedAt)}
                    </td>
                    <td className="py-3 px-4 text-[12px] text-ink-soft">
                      {entry.layersShown?.length
                        ? entry.layersShown.map((l) => layerLabels[l] || l).join(', ')
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-[12px] text-ink-soft">
                      {depthLabels[entry.depth] || entry.depth || '—'}
                    </td>
                    <td className="py-3 px-4 text-[12px] text-ink-soft">
                      {entry.sector === 'regulated' ? 'מפוקח' : 'רגיל'}
                    </td>
                    <td className="py-3 px-4 num text-[12px] text-ink-soft" dir="ltr">
                      {entry.flagsDisplayed?.length ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
