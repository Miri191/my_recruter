export default function RoleCard({ role, selected, onClick, index }) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full text-right p-5 border transition-all duration-200
        ${selected
          ? 'border-ink bg-paper-light shadow-ink-sm -translate-x-px -translate-y-px'
          : 'border-ink-line bg-transparent hover:border-ink hover:bg-paper-light/60'}
      `}
    >
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <span className="num text-[11px] tracking-widish text-ink-mute">N° {n}</span>
        <span className={`text-[10px] tracking-wider2 uppercase ${selected ? 'text-ink' : 'text-ink-mute'}`}>
          {selected ? '✓ נבחר' : 'לבחירה'}
        </span>
      </div>
      <div className="rule mb-3" />
      <div className="display text-xl text-ink leading-tight mb-2">{role.name}</div>
      <p className="text-[13px] text-ink-soft leading-relaxed">{role.desc}</p>
    </button>
  );
}
