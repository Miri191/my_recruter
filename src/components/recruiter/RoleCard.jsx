export default function RoleCard({ role, selected, onClick, index }) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full text-right p-5 border-2 transition-all duration-200
        ${selected
          ? 'border-petrol bg-petrol-tint shadow-petrol-sm -translate-x-px -translate-y-px'
          : 'border-ink-line bg-paper-light hover:border-petrol/60 hover:bg-petrol-tint/40'}
      `}
    >
      {selected && (
        <span className="absolute top-3 left-3 w-6 h-6 rounded-full bg-petrol text-paper-light flex items-center justify-center text-xs">
          ✓
        </span>
      )}
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <span className={`num text-[11px] tracking-widish ${selected ? 'text-petrol' : 'text-ink-mute'}`}>N° {n}</span>
        <span className={`text-[10px] tracking-wider2 uppercase ${selected ? 'text-petrol font-semibold' : 'text-ink-mute'}`}>
          {selected ? 'נבחר' : 'לבחירה'}
        </span>
      </div>
      <div className={`h-px mb-3 ${selected ? 'bg-petrol/40' : 'bg-ink-line'}`} />
      <div className={`display text-xl leading-tight mb-2 ${selected ? 'text-petrol-deep' : 'text-ink'}`}>
        {role.name}
      </div>
      <p className={`text-[13px] leading-relaxed ${selected ? 'text-ink-soft' : 'text-ink-soft'}`}>{role.desc}</p>
    </button>
  );
}
