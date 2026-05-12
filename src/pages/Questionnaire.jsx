import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import MobileFrame from '../components/layout/MobileFrame';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { questions, likertLabels } from '../data/questions';
import { dimensions } from '../data/dimensions';
import { getRole } from '../data/roles';
import { useApp } from '../context/AppContext';

function WelcomeScreen({ candidate, role, onStart }) {
  return (
    <div className="min-h-screen md:min-h-[760px] flex flex-col p-6 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="flex items-center gap-2 text-primary-700 mb-8">
        <Sparkles size={18} />
        <span className="text-sm font-semibold">שאלון אישיותי</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-brand-gradient text-white text-3xl font-bold flex items-center justify-center mb-6 shadow-lift">
          {candidate.name.charAt(0)}
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2 text-balance">
          שלום {candidate.name.split(' ')[0]} 👋
        </h1>
        <p className="text-center text-gray-600 mb-1">
          הוזמנת למלא שאלון אישיותי קצר
        </p>
        <p className="text-center text-gray-500 text-sm mb-8">
          לקראת התקדמות בתהליך הגיוס לתפקיד <span className="font-semibold text-primary-700">{role.name}</span>
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-xl p-3.5 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">כ-5 דקות</div>
              <div className="text-xs text-gray-500">50 שאלות קצרות, בקצב שלך</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-xl p-3.5 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-700 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">אין תשובות נכונות</div>
              <div className="text-xs text-gray-500">תני את התשובה הראשונה שעולה לך</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-xl p-3.5 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">פרטי ודיסקרטי</div>
              <div className="text-xs text-gray-500">המידע משמש את המגייסת בלבד</div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={onStart} size="xl" fullWidth rightIcon={<ArrowLeft size={20} />}>
        בואו נתחיל
      </Button>
    </div>
  );
}

function QuestionScreen({ index, answer, onAnswer, onPrev, onNext, total }) {
  const q = questions[index];
  const dim = dimensions[q.d === 'N' ? 'S' : q.d];
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="min-h-screen md:min-h-[760px] flex flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2.5">
          <Badge tone={dim.color} size="md">{dim.name}</Badge>
          <span className="text-xs text-gray-500 font-semibold tabular-nums" dir="ltr">
            {index + 1} / {total}
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="flex-1 px-5 py-8 flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed mb-8 text-balance min-h-[64px]">
          {q.t}
        </h2>

        <div className="space-y-2.5 mb-8">
          {likertLabels.map((opt) => {
            const selected = answer === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                onClick={() => onAnswer(opt.v)}
                className={`
                  w-full text-right p-4 rounded-xl border-2 font-medium text-sm
                  touch-manipulation transition-all duration-150
                  flex items-center justify-between gap-3 min-h-[56px]
                  ${selected
                    ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-lift'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-primary-300 hover:bg-primary-50/40 active:bg-primary-100/60'}
                `}
              >
                <span className="text-balance">{opt.t}</span>
                <span
                  className={`
                    w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center
                    transition-all
                    ${selected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 bg-white'}
                  `}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={onPrev}
            disabled={index === 0}
            rightIcon={<ArrowRight size={18} />}
          >
            הקודם
          </Button>
          <Button
            onClick={onNext}
            disabled={!answer}
            leftIcon={<ArrowLeft size={18} />}
          >
            {index === total - 1 ? 'סיום' : 'הבא'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Questionnaire() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidate, submitAnswers, ready } = useApp();

  const candidate = getCandidate(id);
  const role = candidate ? getRole(candidate.roleId) : null;

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (ready && candidate && candidate.status === 'completed') {
      navigate(`/q/${id}/done`, { replace: true });
    }
  }, [ready, candidate, id, navigate]);

  const total = questions.length;
  const currentAnswer = useMemo(() => answers[questions[index].n], [answers, index]);

  if (!ready) return null;

  if (!candidate) {
    return (
      <MobileFrame>
        <div className="min-h-screen md:min-h-[760px] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            !
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">קישור לא תקין</h1>
          <p className="text-gray-500 mb-6">לא נמצא שאלון תואם לקישור הזה. בדקי עם המגייסת.</p>
        </div>
      </MobileFrame>
    );
  }

  const onAnswer = (v) => {
    const qn = questions[index].n;
    setAnswers((a) => ({ ...a, [qn]: v }));
    if (index < total - 1) {
      setTimeout(() => setIndex((i) => i + 1), 280);
    }
  };

  const onNext = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      submitAnswers(id, answers);
      navigate(`/q/${id}/done`, { replace: true });
    }
  };

  const onPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <MobileFrame>
      {!started ? (
        <WelcomeScreen
          candidate={candidate}
          role={role}
          onStart={() => setStarted(true)}
        />
      ) : (
        <QuestionScreen
          index={index}
          answer={currentAnswer}
          onAnswer={onAnswer}
          onPrev={onPrev}
          onNext={onNext}
          total={total}
        />
      )}
    </MobileFrame>
  );
}
