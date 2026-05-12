import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Button from '../components/ui/Button';
import RoleCard from '../components/recruiter/RoleCard';
import { roles } from '../data/roles';
import { useApp } from '../context/AppContext';

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="eyebrow">{label}</span>
        {hint && <span className="text-[11px] text-ink-mute">{hint}</span>}
      </div>
      {children}
      {error && <span className="text-[12px] text-oxblood mt-1.5 block">{error}</span>}
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
    showToast('המועמד נכתב לפנקס', 'success');
    setTimeout(() => navigate(`/link/${c.id}`), 150);
  };

  const inputBase =
    'w-full h-11 px-0 bg-transparent border-b border-ink-line text-[15px] focus:outline-none focus:border-ink transition-colors placeholder:text-ink-mute';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 md:px-12 py-8 md:py-14 max-w-4xl mx-auto w-full">
        <PageHeader
          eyebrow="פרק III · הזמנה חדשה"
          title="מועמד חדש"
          subtitle="ראשית — בחירת תפקיד. אחר־כך פרטי המועמד. בסוף — נפיק קישור אישי לשליחה."
          back
          backTo="/"
        />

        <form onSubmit={onSubmit}>
          <section className="mb-12">
            <div className="flex items-baseline gap-4 mb-5">
              <span className="num text-[11px] tracking-widish text-ink-mute">01</span>
              <h2 className="display text-2xl text-ink">בחירת תפקיד</h2>
              <div className="flex-1 rule h-px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r, i) => (
                <RoleCard
                  key={r.id}
                  role={r}
                  index={i}
                  selected={roleId === r.id}
                  onClick={() => {
                    setRoleId(r.id);
                    setErrors((e) => ({ ...e, role: undefined }));
                  }}
                />
              ))}
            </div>
            {errors.role && <p className="text-[12px] text-oxblood mt-3">{errors.role}</p>}
          </section>

          <section className="mb-12">
            <div className="flex items-baseline gap-4 mb-5">
              <span className="num text-[11px] tracking-widish text-ink-mute">02</span>
              <h2 className="display text-2xl text-ink">פרטי המועמד</h2>
              <div className="flex-1 rule h-px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <div className="md:col-span-2">
                <Field label="שם מלא" error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={setField('name')}
                    placeholder="דנה לוי"
                    className={inputBase}
                  />
                </Field>
              </div>
              <Field label="אימייל" hint="לזיהוי בלבד" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={setField('email')}
                  placeholder="example@mail.com"
                  className={inputBase}
                  dir="ltr"
                />
              </Field>
              <Field label="טלפון" hint="לשיתוף ב־WhatsApp" error={errors.phone}>
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
          </section>

          <div className="rule-ink mb-6" />
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="eyebrow text-ink-soft hover:text-ink"
            >
              ביטול
            </button>
            <Button type="submit" size="lg" disabled={submitting}>
              הפק קישור ←
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
