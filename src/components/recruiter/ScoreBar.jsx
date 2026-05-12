import { dimensions } from '../../data/dimensions';

export default function ScoreBar({ dim, score, ideal }) {
  const meta = dimensions[dim];
  const diff = score - ideal;
  const absDiff = Math.abs(diff);
  const within = absDiff <= 10;
  const tone =
    within ? 'forest' : absDiff <= 20 ? 'ochre' : 'oxblood';
  const barColor =
    within ? 'bg-forest' : absDiff <= 20 ? 'bg-ochre' : 'bg-oxblood';
  const diffLabel = diff === 0 ? 'תואם' : diff > 0 ? `+${diff}` : `${diff}`;
  const toneText =
    tone === 'forest' ? 'text-forest' : tone === 'ochre' ? 'text-ochre' : 'text-oxblood';

  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between mb-2.5 gap-3">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="num text-[10px] tracking-widish text-ink-mute uppercase shrink-0 border border-ink-line px-1.5 py-0.5">
            {meta.key}
          </span>
          <span className="display text-[17px] text-ink truncate">{meta.name}</span>
        </div>
        <div className="flex items-baseline gap-4 shrink-0">
          <span className={`num text-[12px] tracking-widish ${toneText}`} dir="ltr">{diffLabel}</span>
          <span className="num text-xl text-ink" dir="ltr">
            {score}
            <span className="text-ink-mute font-normal mx-0.5">/</span>
            <span className="text-ink-mute font-normal">{ideal}</span>
          </span>
        </div>
      </div>
      <div className="relative h-2 bg-paper-dark/50 border border-ink-line/60">
        <div
          className={`absolute top-0 right-0 h-full ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
        <div
          className="absolute -top-1.5 h-[14px] w-[2px] bg-ink"
          style={{ right: `calc(${ideal}% - 1px)` }}
          title="ציון אידיאלי לתפקיד"
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-ink rotate-45" />
        </div>
      </div>
    </div>
  );
}
