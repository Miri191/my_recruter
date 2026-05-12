export default function ProgressBar({
  value,
  max = 100,
  className = '',
  barClassName = 'bg-brand-gradient',
  showLabel = false,
  height = 'h-2.5',
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${barClassName} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-gray-500 mt-1.5 text-left" dir="ltr">
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}
