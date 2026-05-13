import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RoleCard from '../components/recruiter/RoleCard';
import TierSelector, { AboutQuestionnairesModal } from '../components/recruiter/TierSelector';
import { useApp } from '../context/AppContext';
import { DEFAULT_TIER } from '../data/questionnaires';

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
  const { createCandidate, showToast, roles } = useApp();
  const [roleId, setRoleId] = useState(null);
  const [tier, setTier] = useState(DEFAULT_TIER);
  const [tierUserOverride, setTierUserOverride] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const prevRoleRef = useRef(null);

  // Auto-update tier when role changes — only if user hasn't manually overridden.
  useEffect(() => {
    if (!roleId) return;
    if (prevRoleRef.current === roleId) return;
    prevRoleRef.current = roleId;
    if (tierUserOverride) return;
    const role = roles.find((r) => r.id === roleId);
    if (role?.recommendedTier) {
      setTier(role.recommendedTier);
    }
  }, [roleId, roles, tierUserOverride]);

  const handleTierChange = (newTier) => {
    setTier(newTier);
    setTierUserOverride(true);
  };

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

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const c = await createCandidate({
        roleId,
        tier,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      showToast('המועמד נוסף בהצלחה', 'success');
      setTimeout(() => navigate(`/link/${c.id}`), 150);
    } catch (err) {
      console.error('Failed to create candidate:', err);
      showToast(err?.message || 'שגיאה ביצירת מועמד', 'error');
      setSubmitting(false);
    }
  };

  const inputBase =
    'w-full h-11 px-3 bg-paper-light border-2 border-ink-line text-[15px] focus:outline-none focus:border-petrol transition-colors';

  const selectedRole = roleId ? roles.find((r) => r.id === roleId) : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 md:px-12 py-8 md:py-14 max-w-4xl mx-auto w-full">
        <PageHeader
          eyebrow="הזמנה חדשה"
          title="מועמד חדש"
          subtitle="ראשית — בחירת תפקיד. אחר־כך סוג השאלון. בסוף — פרטי המועמד וקישור לשליחה."
          back
          backTo="/dashboard"
        />

        <form onSubmit={onSubmit}>
          {/* Section 1: Role */}
          <Card variant="elev" padding="p-7 md:p-8" className="mb-6">
            <div className="flex items-baseline gap-4 mb-5">
              <span className="num text-[11px] tracking-widish text-petrol font-semibold">01</span>
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
          </Card>

          {/* Section 2: Questionnaire tier */}
          <Card variant="elev" padding="p-7 md:p-8" className="mb-6">
            <div className="flex items-baseline gap-4 mb-5">
              <span className="num text-[11px] tracking-widish text-petrol font-semibold">02</span>
              <h2 className="display text-2xl text-ink">סוג השאלון</h2>
              <div className="flex-1 rule h-px" />
              <button
                type="button"
                onClick={() => setAboutOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] tracking-widish uppercase text-petrol hover:underline-petrol font-medium"
                title="מה זה?"
              >
                <Info size={13} />
                מה זה?
              </button>
            </div>

            <TierSelector
              tier={tier}
              recommendedTier={selectedRole?.recommendedTier}
              recommendedRoleName={selectedRole?.name}
              onChange={handleTierChange}
            />

            {selectedRole?.tierRationale && tier === selectedRole.recommendedTier && (
              <p className="text-[12px] text-ink-mute mt-3 leading-relaxed">
                {selectedRole.tierRationale}
              </p>
            )}
          </Card>

          {/* Section 3: Candidate details */}
          <Card variant="elev" padding="p-7 md:p-8" className="mb-6">
            <div className="flex items-baseline gap-4 mb-5">
              <span className="num text-[11px] tracking-widish text-petrol font-semibold">03</span>
              <h2 className="display text-2xl text-ink">פרטי המועמד</h2>
              <div className="flex-1 rule h-px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
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
          </Card>

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="eyebrow text-ink-soft hover:text-ink"
            >
              ביטול
            </button>
            <Button type="submit" size="lg" disabled={submitting}>
              הפיקי קישור ←
            </Button>
          </div>
        </form>

        {aboutOpen && <AboutQuestionnairesModal onClose={() => setAboutOpen(false)} />}
      </main>
    </div>
  );
}
