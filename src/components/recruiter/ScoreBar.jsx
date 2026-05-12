import { dimensions } from '../../data/dimensions';

export default function ScoreBar({ dim, score, ideal }) {
  const meta = dimensions[dim];
  const diff = score - ideal;
  const within = Math.abs(diff) <= 10;
  const diffLabel = diff === 0 ? 'תואם' : diff > 0 ? `+${diff}` : `${diff}`;
  const diffTone = within ? 'text-sage' : Math.abs(diff) <= 20 ? 'text-ochre' : 'text-oxblood';

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between mb-2.5 gap-3">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="num text-[11px] tracking-widish text-ink-mute uppercase shrink-0">{meta.key}</span>
          <span className="display text-[17px] text-ink truncate">{meta.name}</span>
        </div>
        <div className="flex items-baseline gap-4 shrink-0">
          <span className={`num text-[12px] tracking-widish ${diffTone}`} dir="ltr">{diffLabel}</span>
          <span className="num text-xl text-ink" dir="ltr">
            {score}
            <span className="text-ink-mute font-normal mx-0.5">/</span>
            <span className="text-ink-mute font-normal">{ideal}</span>
          </span>
        </div>
      </div>
      <div className="relative h-[2px] bg-ink-line">
        <div
          className="absolute top-0 right-0 h-[2px] bg-ink transition-all duration-700 ease-out"
          style={{ width: `${score}%` }}
        />
        <div
          className="absolute -top-1 h-3 w-px bg-oxblood"
          style={{ right: `calc(${ideal}% - 0.5px)` }}
          title="ציון אידיאלי לתפקיד"
        />
      </div>
    </div>
  );
}
