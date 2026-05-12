import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileFrame from '../components/layout/MobileFrame';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { questions, likertLabels } from '../data/questions';
import { dimensions } from '../data/dimensions';
import { getRole } from '../data/roles';
import { useApp } from '../context/AppContext';

function WelcomeScreen({ candidate, role, onStart }) {
  const firstName = candidate.name.split(' ')[0];
  return (
    <div className="min-h-screen md:min-h-[760px] flex flex-col p-7 md:p-9 bg-paper-light">
      <div className="flex items-baseline justify-between mb-10">
        <div className="eyebrow">פנקס אישיות</div>
        <div className="eyebrow num">N° 01</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <div className="eyebrow mb-3">פתח דבר</div>
          <div className="rule-ink mb-5" />
          <h1 className="display text-[44px] md:text-[52px] text-ink leading-[1.05] text-balance">
            שלום,<br/>
            {firstName}.
          </h1>
        </div>

        <p className="text-[16px] text-ink-soft leading-relaxed mb-3 text-balance">
          הוזמנת למלא שאלון אישיותי קצר לקראת התקדמות בתהליך גיוס לתפקיד{' '}
          <span className="underline-ink text-ink">{role.name}</span>.
        </p>
        <p className="text-[15px] text-ink-soft leading-relaxed mb-10">
          אין תשובות נכונות או שגויות — תני את התשובה הראשונה שעולה לך.
          המידע ישמש את המגייסת בלבד.
        </p>

        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-0 border-y border-ink-line mb-8">
            <div className="py-4 pl-3 border-l border-ink-line">
              <div className="num display text-2xl text-ink leading-none">50</div>
              <div className="text-[11px] text-ink-mute mt-1.5">שאלות</div>
            </div>
            <div className="py-4 pl-3 border-l border-ink-line">
              <div className="num display text-2xl text-ink leading-none">~5</div>
              <div className="text-[11px] text-ink-mute mt-1.5">דקות</div>
            </div>
            <div className="py-4 pl-3">
              <div className="num display text-2xl text-ink leading-none">5</div>
              <div className="text-[11px] text-ink-mute mt-1.5">ממדים</div>
            </div>
          </div>

          <Button onClick={onStart} size="xl" fullWidth>
            פתח את הפנקס ←
          </Button>
          <div className="eyebrow text-center mt-4 text-ink-mute">
            BIG5 · International Personality Item Pool
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionScreen({ index, answer, onAnswer, onPrev, onNext, total }) {
  const q = questions[index];
  const dim = dimensions[q.d === 'N' ? 'S' : q.d];
  const progress = ((index + 1) / total) * 100;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="min-h-screen md:min-h-[760px] flex flex-col bg-paper-light">
      <div className="sticky top-0 z-10 bg-paper-light/95 backdrop-blur-sm px-7 md:px-9 pt-5 pb-4 border-b border-ink-line">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="eyebrow">{dim.key} · {dim.name}</span>
          </div>
          <span className="num text-[12px] tracking-widish text-ink-mute" dir="ltr">
            {num} / {total}
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="flex-1 px-7 md:px-9 py-8 flex flex-col">
        <div className="mb-8">
          <div className="num text-[11px] tracking-widish text-ink-mute mb-3" dir="ltr">
            QUESTION № {num}
          </div>
          <h2 className="display text-[26px] md:text-[28px] text-ink leading-[1.25] text-balance">
            {q.t}
          </h2>
        </div>

        <div className="mb-8">
          {likertLabels.map((opt) => {
            const selected = answer === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                onClick={() => onAnswer(opt.v)}
                className={`
                  group w-full text-right py-4 px-1 border-b border-ink-line
                  flex items-center justify-between gap-4 min-h-[58px]
                  transition-all duration-150
                  ${selected ? 'text-ink' : 'text-ink-soft hover:text-ink'}
                `}
              >
                <div className="flex items-baseline gap-4 flex-1 min-w-0">
                  <span className={`num text-[11px] tracking-widish w-5 shrink-0 ${selected ? 'text-ink' : 'text-ink-mute'}`} dir="ltr">
                    0{opt.v}
                  </span>
                  <span className={`text-[15px] text-balance ${selected ? 'underline-ink' : 'group-hover:underline-ink'}`}>
                    {opt.t}
                  </span>
                </div>
                <span
                  className={`
                    w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-all
                    ${selected ? 'border-ink bg-ink' : 'border-ink-line bg-transparent group-hover:border-ink'}
                  `}
                >
                  {selected && <span className="w-1.5 h-1.5 rounded-full bg-paper" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-ink">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            className="eyebrow text-ink-soft hover:text-ink disabled:opacity-30 disabled:hover:text-ink-soft transition-colors"
          >
            → הקודם
          </button>
          <Button onClick={onNext} disabled={!answer}>
            {index === total - 1 ? 'סיום ←' : 'הבא ←'}
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
        <div className="min-h-screen md:min-h-[760px] flex flex-col items-center justify-center p-10 text-center">
          <div className="eyebrow text-oxblood mb-3">404 · קישור לא תקין</div>
          <h1 className="display text-3xl text-ink mb-3">לא נמצא שאלון</h1>
          <div className="rule mx-auto w-10 mb-4" />
          <p className="text-ink-soft text-sm">בדקי עם המגייסת שהקישור עדכני.</p>
        </div>
      </MobileFrame>
    );
  }

  const onAnswer = (v) => {
    const qn = questions[index].n;
    setAnswers((a) => ({ ...a, [qn]: v }));
    if (index < total - 1) setTimeout(() => setIndex((i) => i + 1), 280);
  };

  const onNext = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      submitAnswers(id, answers);
      navigate(`/q/${id}/done`, { replace: true });
    }
  };

  const onPrev = () => index > 0 && setIndex((i) => i - 1);

  return (
    <MobileFrame>
      {!started ? (
        <WelcomeScreen candidate={candidate} role={role} onStart={() => setStarted(true)} />
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
