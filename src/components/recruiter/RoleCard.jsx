import { Handshake, Compass, Code2, Palette, Headphones, Users } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

const iconMap = {
  Handshake,
  Compass,
  Code2,
  Palette,
  Headphones,
  Users,
};

export default function RoleCard({ role, selected, onClick }) {
  const Icon = iconMap[role.icon] || Users;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full text-right p-5 rounded-xl border-2 transition-all duration-200
        ${selected
          ? 'border-primary-500 bg-primary-50 shadow-lift'
          : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors
          ${selected ? 'bg-brand-gradient text-white' : 'bg-gray-100 text-gray-600'}`}>
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">{role.name}</div>
          <div className="text-xs text-gray-500 mt-1 leading-relaxed">{role.desc}</div>
        </div>
        {selected && (
          <CheckCircle2 size={20} className="text-primary-600 shrink-0" />
        )}
      </div>
    </button>
  );
}
