import {
  Star,
  RotateCcw,
  Handshake,
  Compass,
  Code2,
  Palette,
  Headphones,
  Users,
  Briefcase,
  Target,
  TrendingUp,
  Sparkles,
  Zap,
  Heart,
  Shield,
  Crown,
  Lightbulb,
  Wrench,
} from 'lucide-react';

const iconMap = {
  Handshake, Compass, Code2, Palette, Headphones, Users,
  Briefcase, Target, TrendingUp, Sparkles, Zap, Heart,
  Shield, Crown, Lightbulb, Wrench,
};

function fitTone(fit) {
  if (fit >= 75) return { text: 'text-forest', bg: 'bg-forest-tint', border: 'border-forest/40' };
  if (fit >= 55) return { text: 'text-ochre', bg: 'bg-ochre-tint', border: 'border-ochre/40' };
  return { text: 'text-oxblood', bg: 'bg-oxblood-tint', border: 'border-oxblood/40' };
}

function RoleChip({ role, fit, isActive, isAssigned, onClick }) {
  const Icon = iconMap[role.icon] || Briefcase;
  const tone = fitTone(fit);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative shrink-0 text-right border-2 transition-all duration-150 px-3.5 py-2.5 min-w-[180px]
        ${isActive
          ? 'border-ink bg-paper-light shadow-ink-sm -translate-x-px -translate-y-px'
          : 'border-ink-line bg-paper-light hover:border-ink-soft'}
      `}
    >
      {isAssigned && (
        <span
          className="absolute -top-2 right-2 inline-flex items-center gap-1 bg-petrol text-paper-light text-[9px] tracking-wider2 uppercase font-semibold px-1.5 py-0.5"
          title="התפקיד שהוצמד בעת יצירת המועמד"
        >
          <Star size={9} className="fill-current" />
          הוצמד
        </span>
      )}

      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={15} className="text-ink-soft shrink-0" strokeWidth={1.75} />
          <span className="text-[13px] font-medium text-ink truncate">{role.name}</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className={`inline-block px-1.5 py-0.5 border ${tone.border} ${tone.bg} ${tone.text} text-[10px] tracking-wider2 uppercase font-semibold`}>
          {fit >= 75 ? 'גבוה' : fit >= 55 ? 'בינוני' : 'נמוך'}
        </span>
        <span className={`num text-2xl ${tone.text} font-medium`} dir="ltr">
          {fit}
          <span className="text-base text-ink-mute">%</span>
        </span>
      </div>
    </button>
  );
}

export default function RoleComparisonStrip({
  rolesData,
  activeRoleId,
  assignedRoleId,
  onSelect,
}) {
  const isViewingAlt = activeRoleId !== assignedRoleId;
  const activeRole = rolesData.find((r) => r.role.id === activeRoleId)?.role;

  return (
    <section className="mb-6 no-print">
      <header className="flex items-baseline justify-between gap-3 mb-3">
        <div>
          <div className="eyebrow-petrol mb-0.5">השוואת תפקידים</div>
          <p className="text-[12px] text-ink-mute leading-relaxed">
            אותן תשובות BIG5 — חישוב התאמה לפי כל אחד מהתפקידים. לחיצה על תפקיד תחליף את כל הניתוח.
          </p>
        </div>
        {isViewingAlt && (
          <button
            type="button"
            onClick={() => onSelect(assignedRoleId)}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 border border-ink-line bg-paper-light text-ink-soft hover:border-petrol hover:text-petrol transition-all text-[11px] tracking-widish uppercase font-medium"
          >
            <RotateCcw size={12} />
            חזרה למוצמד
          </button>
        )}
      </header>

      <div className="rule-petrol mb-3" />

      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
        {rolesData.map(({ role, fit }) => (
          <RoleChip
            key={role.id}
            role={role}
            fit={fit}
            isActive={role.id === activeRoleId}
            isAssigned={role.id === assignedRoleId}
            onClick={() => onSelect(role.id)}
          />
        ))}
      </div>

      {isViewingAlt && activeRole && (
        <div className="mt-3 flex items-start gap-2.5 bg-ochre-tint border border-ochre/40 px-4 py-3">
          <Star size={14} className="text-ochre shrink-0 mt-0.5" />
          <div className="text-[13px] text-ochre leading-relaxed">
            <span className="font-semibold">תצוגה זמנית:</span> ניתוח לפי דרישות{' '}
            <span className="font-medium">{activeRole.name}</span> — לא משפיע על התפקיד
            שהוצמד למועמד.
          </div>
        </div>
      )}
    </section>
  );
}
