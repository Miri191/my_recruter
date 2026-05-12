import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/', label: 'דשבורד', icon: LayoutDashboard, end: true },
  { to: '/new', label: 'מועמד חדש', icon: UserPlus },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-l border-gray-200 h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-tight">פלטפורמת גיוס</div>
            <div className="text-xs text-gray-500 leading-tight">אבחון אישיותי</div>
          </div>
        </div>
      </div>

      <nav className="px-3 py-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm mb-1 transition-all
                ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-gray-100">
        <div className="text-xs text-gray-400 leading-relaxed">
          הנתונים נשמרים מקומית בדפדפן (localStorage). אין צורך בשרת.
        </div>
      </div>
    </aside>
  );
}
