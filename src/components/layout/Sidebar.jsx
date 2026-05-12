import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'דשבורד', n: '01', end: true },
  { to: '/new', label: 'מועמד חדש', n: '02' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-paper-light border-l border-ink-line h-screen sticky top-0">
      <div className="px-8 pt-10 pb-8">
        <div className="eyebrow mb-2">Recruiter — Edition 01</div>
        <div className="display text-3xl text-ink leading-none">אורקל</div>
        <div className="text-[13px] text-ink-soft mt-2 leading-snug">
          פנקס אבחון אישיותי לקראת ראיון
        </div>
      </div>

      <div className="mx-8 rule-ink mb-6" />

      <nav className="px-8 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-baseline gap-4 py-3 transition-all
              ${isActive ? 'text-ink' : 'text-ink-mute hover:text-ink'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="num text-[11px] tracking-widish w-7 shrink-0">{item.n}</span>
                <span className={`display text-[19px] ${isActive ? 'underline-ink' : 'group-hover:underline-ink'}`}>
                  {item.label}
                </span>
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
