import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RoleCard from '../components/recruiter/RoleCard';
import { roles } from '../data/roles';
import { useApp } from '../context/AppContext';

function Field({ label, icon: Icon, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
          />
        )}
        {children}
      </div>
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  );
}

export default function NewInvitation() {
  const navigate = useNavigate();
  const { createCandidate, showToast } = useApp();
  const [roleId, setRoleId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!roleId) e.role = 'יש לבחור תפקיד';
    if (!form.name.trim()) e.name = 'יש למלא שם מלא';
    if (!form.email.trim()) e.email = 'יש למלא אימייל';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'אימייל לא תקין';
    if (!form.phone.trim()) e.phone = 'יש למלא טלפון';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const c = createCandidate({
      roleId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    showToast('המועמד נוצר בהצלחה', 'success');
    setTimeout(() => navigate(`/link/${c.id}`), 150);
  };

  const inputBase =
    'w-full h-11 pr-10 pl-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto w-full">
        <PageHeader
          title="מועמד חדש"
          subtitle="מלאי פרטים ובחרי תפקיד — אנחנו ניצור קישור לשליחה"
          back
          backTo="/"
        />

        <form onSubmit={onSubmit} className="space-y-5">
          <Card>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">1. בחרי תפקיד</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                כל תפקיד מוגדר עם פרופיל אישיות אידיאלי שונה
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map((r) => (
                <RoleCard
                  key={r.id}
                  role={r}
                  selected={roleId === r.id}
                  onClick={() => {
                    setRoleId(r.id);
                    setErrors((e) => ({ ...e, role: undefined }));
                  }}
                />
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-600 mt-3">{errors.role}</p>}
          </Card>

          <Card>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">2. פרטי המועמד</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                המידע ישמש לזיהוי בלבד — לא נשלח אוטומטית
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="שם מלא" icon={User} error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={setField('name')}
                    placeholder="לדוגמה: דנה לוי"
                    className={inputBase}
                  />
                </Field>
              </div>
              <Field label="אימייל" icon={Mail} error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={setField('email')}
                  placeholder="example@mail.com"
                  className={inputBase}
                  dir="ltr"
                />
              </Field>
              <Field label="טלפון" icon={Phone} error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={setField('phone')}
                  placeholder="050-0000000"
                  className={inputBase}
                  dir="ltr"
                />
              </Field>
            </div>
          </Card>

          <div className="flex justify-between items-center gap-3 sticky bottom-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              ביטול
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              rightIcon={<ArrowLeft size={18} />}
            >
              צרי קישור
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
