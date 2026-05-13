import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Building2, User, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { lock } from '../../lib/auth';

export default function UserMenu({ variant = 'sidebar' }) {
  const navigate = useNavigate();
  const { user, profile, organization, signOut, isSupabaseEnabled } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Without Supabase, fall back to the legacy logout button.
  if (!isSupabaseEnabled || !user) {
    return (
      <button
        type="button"
        onClick={() => {
          lock();
          window.location.href = '/';
        }}
        className="w-full inline-flex items-center justify-between text-[12px] tracking-widish uppercase text-ink-mute hover:text-oxblood transition-colors font-medium py-2"
      >
        <span className="inline-flex items-center gap-2">
          <LogOut size={14} />
          התנתקות
        </span>
        <span className="text-[10px]">←</span>
      </button>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'משתמשת';
  const email = profile?.email || user.email;
  const orgName = organization?.name || '';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate('/');
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={`w-full flex items-center gap-3 py-2 transition-colors hover:text-ink ${
          open ? 'text-ink' : 'text-ink-soft'
        }`}
      >
        <span className="w-9 h-9 bg-petrol text-paper-light flex items-center justify-center font-semibold shrink-0">
          {initial}
        </span>
        <div className="flex-1 min-w-0 text-right">
          <div className="text-[13px] font-medium text-ink truncate">{displayName}</div>
          <div className="text-[11px] text-ink-mute truncate" dir="ltr">{email}</div>
        </div>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 left-0 bg-paper-light border-2 border-ink shadow-ink z-50">
          <div className="p-4 border-b border-ink-line">
            <div className="text-[12px] text-ink-mute mb-0.5">מחוברת כ</div>
            <div className="text-[14px] font-medium text-ink">{displayName}</div>
            <div className="text-[12px] text-ink-mute mt-0.5" dir="ltr">{email}</div>
          </div>

          {orgName && (
            <div className="p-4 border-b border-ink-line flex items-center gap-2.5">
              <Building2 size={14} className="text-petrol shrink-0" />
              <div>
                <div className="text-[10px] tracking-wider2 uppercase text-ink-mute">ארגון</div>
                <div className="text-[13px] text-ink">{orgName}</div>
              </div>
            </div>
          )}

          <div className="p-2">
            <button
              type="button"
              disabled
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink-mute hover:bg-paper-dark/40 opacity-50 cursor-not-allowed"
              title="בקרוב"
            >
              <User size={14} />
              <span>הפרופיל שלי</span>
              <span className="mr-auto text-[10px] tracking-wider2 uppercase">בקרוב</span>
            </button>
            <button
              type="button"
              disabled
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink-mute hover:bg-paper-dark/40 opacity-50 cursor-not-allowed"
              title="בקרוב"
            >
              <HelpCircle size={14} />
              <span>עזרה</span>
              <span className="mr-auto text-[10px] tracking-wider2 uppercase">בקרוב</span>
            </button>
            <div className="border-t border-ink-line my-1" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-oxblood hover:bg-oxblood-tint transition-colors"
            >
              <LogOut size={14} />
              <span>התנתקות</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
