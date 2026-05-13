import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import AuthShell, { AuthError } from '../components/auth/AuthShell';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

function passwordStrength(pw) {
  if (!pw) return { pct: 0, label: '', color: 'bg-ink-line' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  const pct = (score / 5) * 100;
  if (score <= 2) return { pct, label: 'חלשה', color: 'bg-oxblood' };
  if (score <= 3) return { pct, label: 'בינונית', color: 'bg-ochre' };
  return { pct, label: 'חזקה', color: 'bg-forest' };
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, user } = useAuth();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const pwStrength = useMemo(() => passwordStrength(form.password), [form.password]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => navigate('/dashboard'), 2500);
      return () => clearTimeout(t);
    }
  }, [done, navigate]);

  const validate = () => {
    const e = {};
    if (form.password.length < 8) e.password = 'הסיסמה חייבת להכיל לפחות 8 תווים';
    else if (!/[A-Z]/.test(form.password)) e.password = 'הסיסמה חייבת לכלול אות גדולה';
    else if (!/\d/.test(form.password)) e.password = 'הסיסמה חייבת לכלול ספרה';
    if (form.confirm !== form.password) e.confirm = 'הסיסמאות אינן זהות';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await updatePassword(form.password);
      setDone(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell eyebrow="הסיסמה עודכנה" title="הכל מוכן">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 border-2 border-forest bg-forest-tint text-forest flex items-center justify-center mb-4">
            <CheckCircle2 size={26} strokeWidth={1.75} />
          </div>
          <p className="text-[14px] text-ink-soft leading-relaxed">
            הסיסמה עודכנה בהצלחה. מעבירה אותך לדשבורד...
          </p>
        </div>
      </AuthShell>
    );
  }

  if (!user) {
    return (
      <AuthShell eyebrow="קישור לא תקין" title="הגעת לפה דרך קישור שפג תוקף">
        <p className="text-[14px] text-ink-soft leading-relaxed mb-5">
          קישור איפוס הסיסמה פג תוקפו או שנוצל כבר. בקשי קישור חדש.
        </p>
        <Button onClick={() => navigate('/forgot-password')} fullWidth>
          לבקש קישור חדש
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="איפוס סיסמה"
      title="בחירת סיסמה חדשה"
      subtitle="בחרי סיסמה חדשה. עדיף שתהיה ארוכה וייחודית."
    >
      <AuthError>{error}</AuthError>

      <form onSubmit={onSubmit}>
        <label className="block mb-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="eyebrow">סיסמה חדשה</span>
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
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-paper-dark border border-ink-line/60">
                <div
                  className={`h-full ${pwStrength.color} transition-all`}
                  style={{ width: `${pwStrength.pct}%` }}
                />
              </div>
              <span className="text-[11px] text-ink-mute font-medium">{pwStrength.label}</span>
            </div>
          )}
          {errors.password && (
            <span className="text-[12px] text-oxblood mt-1.5 block">{errors.password}</span>
          )}
        </label>

        <label className="block mb-4">
          <span className="eyebrow block mb-1.5">אימות סיסמה</span>
          <input
            type={showPw ? 'text' : 'password'}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            dir="ltr"
            autoComplete="new-password"
            required
            className={`w-full h-11 px-3 bg-paper border-2 text-[15px] focus:outline-none transition-colors ${
              errors.confirm ? 'border-oxblood focus:border-oxblood' : 'border-ink-line focus:border-petrol'
            }`}
          />
          {errors.confirm && (
            <span className="text-[12px] text-oxblood mt-1.5 block">{errors.confirm}</span>
          )}
        </label>

        <Button type="submit" size="xl" fullWidth disabled={loading} className="mt-2">
          {loading ? 'מעדכנת…' : 'עדכני סיסמה ←'}
        </Button>
      </form>
    </AuthShell>
  );
}
