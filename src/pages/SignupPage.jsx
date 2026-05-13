import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import AuthShell, { AuthInput, AuthError } from '../components/auth/AuthShell';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'bg-ink-line' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 2) return { score, label: 'חלשה', color: 'bg-oxblood', pct: (score / 6) * 100 };
  if (score <= 4) return { score, label: 'בינונית', color: 'bg-ochre', pct: (score / 6) * 100 };
  return { score, label: 'חזקה', color: 'bg-forest', pct: 100 };
}

function translateAuthError(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  if (lower.includes('already registered') || lower.includes('user already'))
    return 'כתובת האימייל כבר רשומה במערכת. נסי להתחבר.';
  if (lower.includes('weak password') || lower.includes('password should'))
    return 'הסיסמה חלשה מדי. בחרי סיסמה עם לפחות 8 תווים, אות גדולה ומספר.';
  if (lower.includes('not configured'))
    return 'המערכת רצה במצב מקומי כרגע — נשמח שתחזרי בקרוב.';
  return message;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, isSupabaseEnabled } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    organizationName: '',
    email: '',
    password: '',
    confirm: '',
    terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pwStrength = useMemo(() => passwordStrength(form.password), [form.password]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = 'נא להזין שם מלא (לפחות 2 תווים)';
    if (!form.organizationName.trim() || form.organizationName.trim().length < 2)
      e.organizationName = 'נא להזין שם ארגון';
    if (!form.email.trim()) e.email = 'נא להזין אימייל';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'אימייל לא תקין';
    if (form.password.length < 8) e.password = 'הסיסמה חייבת להכיל לפחות 8 תווים';
    else if (!/[A-Z]/.test(form.password))
      e.password = 'הסיסמה חייבת לכלול לפחות אות גדולה אחת';
    else if (!/\d/.test(form.password))
      e.password = 'הסיסמה חייבת לכלול לפחות ספרה אחת';
    if (form.confirm !== form.password) e.confirm = 'הסיסמאות אינן זהות';
    if (!form.terms) e.terms = 'יש לאשר את תנאי השימוש';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(
        form.email.trim(),
        form.password,
        form.fullName.trim(),
        form.organizationName.trim()
      );
      setSubmitted(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(translateAuthError(err.message));
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthShell eyebrow="אומתי את האימייל" title="נשלח אליך מייל אישור">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 border-2 border-forest bg-forest-tint text-forest flex items-center justify-center mb-4">
            <CheckCircle2 size={26} strokeWidth={1.75} />
          </div>
          <p className="text-[14px] text-ink-soft leading-relaxed mb-6">
            שלחנו לך הודעת אימות לאימייל{' '}
            <span dir="ltr" className="text-ink font-medium">
              {form.email}
            </span>
            .<br />
            לחצי על הקישור בהודעה כדי להפעיל את החשבון.
          </p>
          <Link
            to="/login"
            className="inline-block eyebrow-petrol hover:underline-petrol font-medium"
          >
            ← למסך ההתחברות
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="הרשמה"
      title="יצירת חשבון חדש"
      subtitle="פתחי חשבון לארגון שלך. רק שדות הסיסמה ייאומתו מיידית — המייל יתקבל כתנאי להתחברות."
      footer={
        <>
          <Link to="/" className="hover:underline-petrol">חזרה לאתר</Link>
        </>
      }
    >
      {!isSupabaseEnabled && (
        <div className="mb-4 px-3 py-2 bg-ochre-tint border border-ochre/40 text-ochre text-[12px]">
          ההרשמה תהיה זמינה כשהמערכת תופעל במצב cloud. כרגע ניתן להמשיך לדשבורד עם הסיסמה הקיימת.
        </div>
      )}

      <AuthError>{error}</AuthError>

      <form onSubmit={onSubmit}>
        <AuthInput
          label="שם מלא"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="דנה לוי"
          error={errors.fullName}
          autoComplete="name"
        />

        <AuthInput
          label="שם הארגון"
          value={form.organizationName}
          onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
          placeholder="לדוגמה: Aman Digital"
          error={errors.organizationName}
          autoComplete="organization"
        />

        <AuthInput
          label="אימייל"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="example@mail.com"
          dir="ltr"
          error={errors.email}
          autoComplete="email"
        />

        <label className="block mb-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="eyebrow">סיסמה</span>
            <span className="text-[11px] text-ink-mute">מינימום 8 תווים, אות גדולה ומספר</span>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              dir="ltr"
              autoComplete="new-password"
              required
              className={`w-full h-11 pl-11 pr-3 bg-paper border-2 text-[15px] focus:outline-none transition-colors ${
                errors.password ? 'border-oxblood focus:border-oxblood' : 'border-ink-line focus:border-petrol'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute top-1/2 -translate-y-1/2 left-3 text-ink-mute hover:text-petrol"
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-paper-dark border border-ink-line/60">
                  <div
                    className={`h-full ${pwStrength.color} transition-all duration-200`}
                    style={{ width: `${pwStrength.pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-ink-mute font-medium" dir="ltr">
                  {pwStrength.label}
                </span>
              </div>
            </div>
          )}
          {errors.password && (
            <span className="text-[12px] text-oxblood mt-1.5 block">{errors.password}</span>
          )}
        </label>

        <AuthInput
          label="אימות סיסמה"
          type={showPw ? 'text' : 'password'}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          dir="ltr"
          error={errors.confirm}
          autoComplete="new-password"
        />

        <label className="flex items-start gap-3 mb-4 cursor-pointer group">
          <span
            className={`w-5 h-5 border-2 flex items-center justify-center transition-all shrink-0 mt-0.5
              ${form.terms
                ? 'border-petrol bg-petrol text-paper-light'
                : 'border-ink-line bg-paper-light group-hover:border-petrol'}
            `}
          >
            {form.terms && <span className="text-xs leading-none">✓</span>}
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
          />
          <span className="text-[13px] text-ink-soft leading-relaxed">
            אני מאשרת את <a href="#" className="text-petrol underline-petrol">תנאי השימוש</a> ואת{' '}
            <a href="#" className="text-petrol underline-petrol">מדיניות הפרטיות</a>
          </span>
        </label>
        {errors.terms && (
          <span className="text-[12px] text-oxblood mb-3 block">{errors.terms}</span>
        )}

        <Button type="submit" size="xl" fullWidth disabled={loading} className="mt-2">
          {loading ? 'יוצרת חשבון…' : 'יצירת חשבון ←'}
        </Button>
      </form>

      <div className="rule my-6" />
      <div className="text-center text-[13px] text-ink-soft">
        כבר יש לך חשבון?{' '}
        <Link to="/login" className="text-petrol font-medium hover:underline-petrol">
          התחברי
        </Link>
      </div>
    </AuthShell>
  );
}
