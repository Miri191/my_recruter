import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Copy, MessageCircle, Mail, MessageSquare, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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
        <main className="flex-1 px-4 py-10 text-center">
          <p className="text-gray-500">לא נמצא מועמד</p>
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
      showToast('הקישור הועתק ללוח', 'success');
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
  const waPhone = phoneDigits.startsWith('0')
    ? `972${phoneDigits.slice(1)}`
    : phoneDigits;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto w-full">
        <PageHeader title="הקישור נוצר" back backTo="/" />

        <Card className="bg-emerald-50 border-emerald-200 text-center mb-5 animate-pop-in" padding="p-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <CheckCircle2 size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-emerald-900 mb-1">הקישור נוצר בהצלחה</h2>
          <p className="text-sm text-emerald-700">
            שלחי את הקישור ל-{candidate.name} בערוץ הנוח לכם
          </p>
        </Card>

        <Card className="mb-5">
          <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                מועמד
              </div>
              <div className="text-lg font-bold text-gray-900">{candidate.name}</div>
              <div className="text-sm text-gray-500" dir="ltr">{candidate.email} · {candidate.phone}</div>
            </div>
            <Badge tone="primary" size="md">{role.name}</Badge>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              קישור לשיתוף
            </div>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 min-w-0 px-3 h-11 flex items-center bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 truncate" dir="ltr">
                {link}
              </div>
              <Button
                onClick={copyLink}
                variant={copied ? 'accent' : 'primary'}
                leftIcon={copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              >
                {copied ? 'הועתק' : 'העתקה'}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">שיתוף מהיר</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <a
              href={`https://wa.me/${waPhone}?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all font-medium text-sm"
            >
              <MessageCircle size={18} />
              שליחה ב-WhatsApp
            </a>
            <a
              href={`mailto:${candidate.email}?subject=${emailSubject}&body=${emailBody}`}
              className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all font-medium text-sm"
            >
              <Mail size={18} />
              שליחה במייל
            </a>
            <a
              href={`sms:${candidate.phone}?body=${waMsg}`}
              className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all font-medium text-sm"
            >
              <MessageSquare size={18} />
              שליחה ב-SMS
            </a>
          </div>
        </Card>

        <div className="flex justify-between items-center mt-6">
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            rightIcon={<ArrowLeft size={16} />}
          >
            חזרה לדשבורד
          </Button>
          <button
            type="button"
            onClick={() => window.open(link, '_blank')}
            className="text-sm text-primary-700 hover:text-primary-900 font-medium underline-offset-4 hover:underline"
          >
            תצוגה מקדימה של השאלון
          </button>
        </div>
      </main>
    </div>
  );
}
