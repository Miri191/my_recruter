import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'דשבורד', n: '01', end: true },
  { to: '/new', label: 'מועמד חדש', n: '02' },
  { to: '/roles', label: 'ניהול תפקידים', n: '03' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-paper-light border-l border-ink-line h-screen sticky top-0">
      <div className="px-8 pt-10 pb-8">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-petrol" />
          <div className="eyebrow-petrol">Recruiter — Edition 01</div>
        </div>
        <div className="display text-3xl text-ink leading-none" dir="ltr">Persona</div>
        <div className="text-[13px] text-ink-soft mt-2 leading-snug">
          פנקס אבחון אישיותי לקראת ראיון
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

      <div className="px-8 py-7 border-t border-ink-line">
        <div className="eyebrow mb-2">Colophon</div>
        <p className="text-[12px] text-ink-soft leading-relaxed">
          הנתונים נשמרים מקומית בדפדפן — אין שרת. הוצא לאור מעל פנקס פפירוס.
        </p>
      </div>
    </aside>
  );
}
