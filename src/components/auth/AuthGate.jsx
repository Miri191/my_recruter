import { useState } from 'react';
import { Sparkles, Lock, Eye, EyeOff } from 'lucide-react';
import { isUnlocked, unlock } from '../../lib/auth';
import Button from '../ui/Button';

function LoginScreen({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    setTimeout(() => {
      if (unlock(pw)) {
        onSuccess();
      } else {
        setError(true);
        setSubmitting(false);
        setPw('');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-paper">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 border-2 border-ink bg-paper-light flex items-center justify-center">
            <Sparkles size={22} className="text-petrol" />
          </div>
          <div>
            <div className="display text-3xl text-ink leading-none" dir="ltr">Persona</div>
            <div className="eyebrow-petrol mt-1">פנקס אבחון אישיותי</div>
          </div>
        </div>

        <div className="bg-paper-light border-2 border-ink shadow-petrol p-8 animate-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={14} className="text-petrol" />
            <span className="eyebrow-petrol">כניסה למערכת</span>
          </div>
          <h1 className="display text-3xl text-ink mb-2">שלום</h1>
          <p className="text-[14px] text-ink-soft leading-relaxed mb-7">
            המערכת מוגנת בסיסמה. הזיני אותה כדי להמשיך.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              <span className="eyebrow block mb-2">סיסמה</span>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value);
                    setError(false);
                  }}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`
                    w-full h-12 pl-12 pr-3 bg-paper border-2 text-[15px] tracking-wide
                    focus:outline-none transition-colors
                    ${error
                      ? 'border-oxblood focus:border-oxblood'
                      : 'border-ink-line focus:border-petrol'}
                  `}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute top-1/2 -translate-y-1/2 left-3 text-ink-mute hover:text-petrol transition-colors"
                  tabIndex={-1}
                  aria-label={show ? 'הסתרי' : 'הציגי'}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="mt-3 px-3 py-2 bg-oxblood-tint border border-oxblood/40 text-oxblood text-[13px]">
                סיסמה שגויה. נסי שוב.
              </div>
            )}

            <Button
              type="submit"
              size="xl"
              fullWidth
              disabled={!pw || submitting}
              className="mt-6"
            >
              {submitting ? 'בודקת…' : 'כניסה ←'}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6 text-[11px] text-ink-mute leading-relaxed">
          הגנה זו מספקת חיכוך כנגד מבקרים מקריים, לא אבטחה מלאה.<br />
          לאבטחה אמיתית של נתוני מועמדים — נדרש backend.
        </div>
      </div>
    </div>
  );
}

export default function AuthGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => isUnlocked());

  if (!unlocked) {
    return <LoginScreen onSuccess={() => setUnlocked(true)} />;
  }
  return children;
}
