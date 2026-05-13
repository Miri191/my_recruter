import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthShell, { AuthInput, AuthError } from '../components/auth/AuthShell';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

function translateAuthError(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  if (lower.includes('invalid login') || lower.includes('invalid credentials'))
    return 'אימייל או סיסמה שגויים';
  if (lower.includes('email not confirmed'))
    return 'יש לאשר את האימייל לפני ההתחברות. בדקי את תיבת הדואר.';
  if (lower.includes('too many'))
    return 'יותר מדי ניסיונות. נסי שוב בעוד כמה דקות.';
  return message;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isSupabaseEnabled } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(form.email.trim(), form.password);
      const next = location.state?.from?.pathname || '/dashboard';
      navigate(next, { replace: true });
    } catch (err) {
      setError(translateAuthError(err.message));
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="כניסה"
      title="ברוכה השבה"
      subtitle="התחברי כדי להמשיך לעבוד עם המועמדים והדוחות שלך."
      footer={
        <>
          <span dir="ltr">© Persona 2026</span> · <Link to="/" className="hover:underline-petrol">חזרה לאתר</Link>
        </>
      }
    >
      {!isSupabaseEnabled && (
        <div className="mb-4 px-3 py-2 bg-ochre-tint border border-ochre/40 text-ochre text-[12px]">
          המערכת רצה במצב מקומי (ללא backend). תוכלי להמשיך לדשבורד עם הסיסמה הקיימת — אין צורך בחשבון.
        </div>
      )}

      <AuthError>{error}</AuthError>

      <form onSubmit={onSubmit}>
        <AuthInput
          label="אימייל"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="example@mail.com"
          dir="ltr"
          autoComplete="email"
          required
        />

        <label className="block mb-2">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="eyebrow">סיסמה</span>
            <Link to="/forgot-password" className="text-[11px] text-petrol hover:underline-petrol font-medium">
              שכחת סיסמה?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              dir="ltr"
              autoComplete="current-password"
              required
              className="w-full h-11 pl-11 pr-3 bg-paper border-2 border-ink-line text-[15px] focus:outline-none focus:border-petrol transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute top-1/2 -translate-y-1/2 left-3 text-ink-mute hover:text-petrol"
              tabIndex={-1}
              aria-label={showPw ? 'הסתרי' : 'הציגי'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <Button
          type="submit"
          size="xl"
          fullWidth
          disabled={loading || !form.email || !form.password}
          className="mt-4"
        >
          {loading ? 'מתחברת…' : 'התחברי ←'}
        </Button>
      </form>

      <div className="rule my-6" />

      <div className="text-center text-[13px] text-ink-soft">
        עוד אין לך חשבון?{' '}
        <Link to="/signup" className="text-petrol font-medium hover:underline-petrol">
          הירשמי כאן
        </Link>
      </div>
    </AuthShell>
  );
}
