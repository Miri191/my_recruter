import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { getRole } from '../data/roles';

export default function CandidateLink() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidate, showToast, ready } = useApp();
  const [copied, setCopied] = useState(false);

  const candidate = getCandidate(id);
  const link = useMemo(() => `${window.location.origin}/q/${id}`, [id]);

  if (ready && !candidate) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-6 py-14 text-center">
          <p className="text-ink-soft">לא נמצא מועמד</p>
          <Button className="mt-4" onClick={() => navigate('/')}>חזרה לדשבורד</Button>
        </main>
      </div>
    );
  }
  if (!candidate) return null;

  const role = getRole(candidate.roleId);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      showToast('הקישור הועתק', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      showToast('הקישור הועתק', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const waMsg = encodeURIComponent(
    `היי ${candidate.name}, שלחתי לך שאלון אישיותי קצר (כ-5 דק') לקראת ראיון לתפקיד ${role.name}. תוכל/י למלא כאן: ${link}`
  );
  const emailSubject = encodeURIComponent(`שאלון אישיותי — ${role.name}`);
  const emailBody = encodeURIComponent(
    `שלום ${candidate.name},\n\nלקראת התקדמות בתהליך הגיוס לתפקיד ${role.name}, נשמח שתמלא/י שאלון אישיותי קצר (כ-5 דקות):\n${link}\n\nתודה!`
  );

  const phoneDigits = (candidate.phone || '').replace(/\D/g, '');
  const waPhone = phoneDigits.startsWith('0') ? `972${phoneDigits.slice(1)}` : phoneDigits;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 md:px-12 py-8 md:py-14 max-w-4xl mx-auto w-full">
        <PageHeader
          eyebrow="הזמנה הופקה"
          title="הקישור מוכן לשליחה"
          back
          backTo="/"
        />

        <Card variant="elev" accent="petrol" padding="p-7 md:p-9" className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-forest" />
            <span className="eyebrow text-forest font-semibold">נוצר בהצלחה</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 mb-6">
            <div className="min-w-0">
              <div className="eyebrow mb-1">מועמד</div>
              <div className="display text-3xl text-ink truncate">{candidate.name}</div>
              <div className="text-[13px] text-ink-soft mt-1" dir="ltr">
                {candidate.email} · {candidate.phone}
              </div>
            </div>
            <Badge tone="petrolSolid" size="lg">{role.name}</Badge>
          </div>

          <div className="rule-petrol mb-6" />

          <div className="mb-6">
            <div className="eyebrow-petrol mb-3">קישור אישי</div>
            <div className="flex items-stretch gap-3">
              <div
                className="flex-1 min-w-0 px-4 h-12 flex items-center bg-petrol-tint border-2 border-petrol/40 text-[13px] text-petrol-deep truncate font-mono"
                dir="ltr"
              >
                {link}
              </div>
              <Button onClick={copyLink} variant={copied ? 'accent' : 'primary'}>
                {copied ? '✓ הועתק' : 'העתיקי'}
              </Button>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-3">שיתוף מהיר</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href={`https://wa.me/${waPhone}?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 px-4 h-12 border border-ink-line bg-paper-light hover:border-forest hover:bg-forest-tint transition-all"
              >
                <span className="eyebrow group-hover:text-forest font-medium">WhatsApp</span>
                <span className="text-ink-mute group-hover:text-forest">←</span>
              </a>
              <a
                href={`mailto:${candidate.email}?subject=${emailSubject}&body=${emailBody}`}
                className="group flex items-center justify-between gap-3 px-4 h-12 border border-ink-line bg-paper-light hover:border-petrol hover:bg-petrol-tint transition-all"
              >
                <span className="eyebrow group-hover:text-petrol font-medium">Email</span>
                <span className="text-ink-mute group-hover:text-petrol">←</span>
              </a>
              <a
                href={`sms:${candidate.phone}?body=${waMsg}`}
                className="group flex items-center justify-between gap-3 px-4 h-12 border border-ink-line bg-paper-light hover:border-brick hover:bg-brick-tint transition-all"
              >
                <span className="eyebrow group-hover:text-brick font-medium">SMS</span>
                <span className="text-ink-mute group-hover:text-brick">←</span>
              </a>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={() => navigate('/')}>
            ← חזרה לדשבורד
          </Button>
          <button
            type="button"
            onClick={() => window.open(link, '_blank')}
            className="eyebrow-petrol hover:underline-petrol font-medium"
          >
            תצוגה מקדימה של השאלון →
          </button>
        </div>
      </main>
    </div>
  );
}
