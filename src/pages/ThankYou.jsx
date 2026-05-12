import { useParams } from 'react-router-dom';
import { CheckCircle2, Sparkles } from 'lucide-react';
import MobileFrame from '../components/layout/MobileFrame';
import { useApp } from '../context/AppContext';

export default function ThankYou() {
  const { id } = useParams();
  const { getCandidate, ready } = useApp();
  const candidate = ready ? getCandidate(id) : null;

  const refNumber = id?.slice(0, 8).toUpperCase() || '—';

  return (
    <MobileFrame>
      <div className="min-h-screen md:min-h-[760px] flex flex-col p-6 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="flex items-center gap-2 text-primary-700 mb-8">
          <Sparkles size={18} />
          <span className="text-sm font-semibold">שאלון אישיותי</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6 animate-pop-in">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            <div className="absolute -inset-4 rounded-full bg-emerald-200/30 blur-xl -z-10" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            תודה רבה{candidate ? `, ${candidate.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 text-balance max-w-xs mb-2">
            סיימת את השאלון בהצלחה. התשובות שלך הועברו לטיפול המגייסת.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-xs text-balance">
            ניצור איתך קשר בקרוב להמשך התהליך.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-card">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
              מספר אסמכתא
            </div>
            <div className="font-bold text-lg text-gray-900 tabular-nums" dir="ltr">
              {refNumber}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pt-4">
          ניתן לסגור את החלון
        </div>
      </div>
    </MobileFrame>
  );
}
