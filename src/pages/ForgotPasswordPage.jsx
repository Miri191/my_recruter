import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthShell, { AuthInput, AuthError } from '../components/auth/AuthShell';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthShell eyebrow="איפוס סיסמה" title="נשלח אליך אימייל">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 border-2 border-forest bg-forest-tint text-forest flex items-center justify-center mb-4">
            <Mail size={22} strokeWidth={1.75} />
          </div>
          <p className="text-[14px] text-ink-soft leading-relaxed mb-6">
            אם הכתובת רשומה אצלנו, תקבלי תוך כמה דקות הודעה עם קישור לאיפוס.
            בדקי גם בתיקיית הספאם.
          </p>
          <Link
            to="/login"
            className="inline-block eyebrow-petrol hover:underline-petrol font-medium"
          >
            ← חזרה להתחברות
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="איפוס סיסמה"
      title="שכחת את הסיסמה?"
      subtitle="הזיני את האימייל שאיתו נרשמת, ואנחנו נשלח לך קישור לאיפוס."
    >
      <AuthError>{error}</AuthError>
      <form onSubmit={onSubmit}>
        <AuthInput
          label="אימייל"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          dir="ltr"
          autoComplete="email"
          required
        />
        <Button type="submit" size="xl" fullWidth disabled={loading || !email}>
          {loading ? 'שולחת…' : 'שלחי קישור איפוס ←'}
        </Button>
      </form>

      <div className="rule my-6" />
      <div className="text-center">
        <Link to="/login" className="text-petrol text-[13px] font-medium hover:underline-petrol">
          ← חזרה להתחברות
        </Link>
      </div>
    </AuthShell>
  );
}
