import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { lock } from '../../lib/auth';

const navItems = [
  { to: '/dashboard', label: 'דשבורד', n: '01', end: true },
  { to: '/new', label: 'מועמד חדש', n: '02' },
  { to: '/roles', label: 'ניהול תפקידים', n: '03' },
];

function handleLogout() {
  lock();
  window.location.href = '/';
}

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-paper-light border-l border-ink-line h-screen sticky top-0">
      <div className="px-8 pt-10 pb-8">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-petrol" />
          <div className="eyebrow-petrol">פלטפורמת גיוס</div>
        </div>
        <div className="display text-3xl text-ink leading-none" dir="ltr">Persona</div>
        <div className="text-[13px] text-ink-soft mt-2 leading-snug">
          אבחון אישיותי של מועמדים
        </div>
      </div>

      <div className="mx-8 rule-ink mb-4" />

      <nav className="px-3 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `relative flex items-baseline gap-4 py-3 px-5 transition-all
              ${isActive
                ? 'bg-petrol-tint text-petrol border-r-[3px] border-petrol -mr-px'
                : 'text-ink-mute hover:text-ink hover:bg-paper-dark/40 border-r-[3px] border-transparent'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`num text-[11px] tracking-widish w-7 shrink-0 ${isActive ? 'text-petrol' : ''}`}>{item.n}</span>
                <span className="display text-[19px]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-8 py-5 border-t border-ink-line">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-between text-[12px] tracking-widish uppercase text-ink-mute hover:text-oxblood transition-colors font-medium py-2"
        >
          <span className="inline-flex items-center gap-2">
            <LogOut size={14} />
            התנתקות
          </span>
          <span className="text-[10px]">←</span>
        </button>
        <p className="text-[11px] text-ink-mute leading-relaxed mt-3">
          הנתונים שלך נשמרים בדפדפן בלבד.
        </p>
      </div>
    </aside>
  );
}
