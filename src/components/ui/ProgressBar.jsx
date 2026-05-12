export default function ProgressBar({
  value,
  max = 100,
  className = '',
  showLabel = false,
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full h-px bg-ink-line">
        <div
          className="absolute top-0 right-0 h-px bg-ink transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute -top-[3px] h-[7px] w-px bg-ink transition-all duration-500 ease-out"
          style={{ right: `calc(${pct}% - 0.5px)` }}
        />
      </div>
      {showLabel && (
        <div className="num text-[11px] text-ink-mute mt-2 text-left tracking-widish" dir="ltr">
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}
