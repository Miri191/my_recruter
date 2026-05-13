import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileFrame from '../components/layout/MobileFrame';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { getTierItems, getTierMeta, likertLabels } from '../data/questionnaires';
import { getRole } from '../data/roles';
import { useApp } from '../context/AppContext';
import { seededShuffle } from '../lib/shuffle';

function WelcomeScreen({ candidate, role, tierMeta, onStart }) {
  const firstName = candidate.name.split(' ')[0];
  return (
    <div className="min-h-screen md:min-h-[760px] flex flex-col p-7 md:p-9 bg-paper-light">
      <div className="flex items-baseline justify-between mb-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-petrol" />
          <span className="eyebrow-petrol">שאלון אישיותי</span>
        </div>
        <div className="eyebrow num" dir="ltr">Persona</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <div className="rule-petrol mb-5" />
          <h1 className="display text-[44px] md:text-[52px] text-ink leading-[1.05] text-balance">
            שלום,<br/>
            <span className="text-petrol-deep">{firstName}.</span>
          </h1>
        </div>

        <p className="text-[16px] text-ink-soft leading-relaxed mb-3 text-balance">
          הוזמנת למלא שאלון אישיותי קצר לקראת התקדמות בתהליך גיוס לתפקיד{' '}
          <span className="underline-petrol text-petrol-deep font-medium">{role.name}</span>.
        </p>
        <p className="text-[15px] text-ink-soft leading-relaxed mb-10">
          אין תשובות נכונות או שגויות — תני את התשובה הראשונה שעולה לך.
          המידע ישמש את המגייסת בלבד.
        </p>

        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-0 bg-paper-dark/30 border border-ink-line mb-8">
            <div className="py-4 pl-3 pr-3 border-l border-ink-line">
              <div className="num display text-2xl text-petrol leading-none">{tierMeta.itemCount}</div>
              <div className="text-[11px] text-ink-mute mt-1.5">שאלות</div>
            </div>
            <div className="py-4 pl-3 pr-3 border-l border-ink-line">
              <div className="num display text-2xl text-petrol leading-none">~{tierMeta.estimatedMinutes}</div>
              <div className="text-[11px] text-ink-mute mt-1.5">דקות</div>
            </div>
            <div className="py-4 pl-3 pr-3">
              <div className="num display text-2xl text-petrol leading-none">5</div>
              <div className="text-[11px] text-ink-mute mt-1.5">ממדים</div>
            </div>
          </div>

          <Button onClick={onStart} size="xl" fullWidth>
            בואו נתחיל ←
          </Button>
          <div className="eyebrow text-center mt-4 text-ink-mute">
            מבוסס על שאלון BIG5 (IPIP)
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionScreen({ items, index, answer, onAnswer, onPrev, onNext }) {
  const total = items.length;
  const item = items[index];
  const progress = ((index + 1) / total) * 100;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="min-h-screen md:min-h-[760px] flex flex-col bg-paper-light">
      <div className="sticky top-0 z-10 bg-paper-light/95 backdrop-blur-sm px-7 md:px-9 pt-5 pb-4 border-b border-ink-line">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-widish uppercase font-semibold text-petrol">
            <span className="w-1.5 h-1.5 rounded-full bg-petrol" />
            שאלון אישיותי
          </span>
          <span className="num text-[12px] tracking-widish text-ink-mute" dir="ltr">
            {num} / {total}
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="flex-1 px-7 md:px-9 py-8 flex flex-col">
        <div className="mb-8">
          <div className="num text-[11px] tracking-widish text-petrol mb-3 font-medium" dir="ltr">
            שאלה {num}
          </div>
          <h2 className="display text-[26px] md:text-[28px] text-ink leading-[1.25] text-balance">
            {item.text}
          </h2>
        </div>

        <div className="mb-8 space-y-2">
          {likertLabels.map((opt) => {
            const selected = answer === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                onClick={() => onAnswer(opt.v)}
                className={`
                  group w-full text-right py-3.5 px-4 border-2 transition-all duration-150
                  flex items-center justify-between gap-4 min-h-[60px]
                  ${selected
                    ? 'border-petrol bg-petrol-tint text-petrol-deep shadow-petrol-sm -translate-x-px -translate-y-px'
                    : 'border-ink-line bg-paper-light text-ink-soft hover:border-petrol/60 hover:bg-petrol-tint/30 hover:text-ink'}
                `}
              >
                <div className="flex items-baseline gap-4 flex-1 min-w-0">
                  <span className={`num text-[12px] tracking-widish w-6 shrink-0 font-medium ${selected ? 'text-petrol' : 'text-ink-mute'}`} dir="ltr">
                    0{opt.v}
                  </span>
                  <span className={`text-[15px] text-balance ${selected ? 'font-medium' : ''}`}>
                    {opt.t}
                  </span>
                </div>
                <span
                  className={`
                    w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                    ${selected ? 'border-petrol bg-petrol' : 'border-ink-line bg-paper-light group-hover:border-petrol/60'}
                  `}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-paper-light" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-ink-line">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            className="eyebrow text-ink-soft hover:text-petrol disabled:opacity-30 disabled:hover:text-ink-soft transition-colors"
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
  const tier = candidate?.tier || 'standard';
  // Shuffle per-candidate so consecutive items don't all probe the same
  // trait. Deterministic — same candidate sees the same order on refresh.
  const tierItems = useMemo(
    () => seededShuffle(getTierItems(tier), candidate?.id),
    [tier, candidate?.id]
  );
  const tierMeta = useMemo(() => getTierMeta(tier), [tier]);

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (ready && candidate && candidate.status === 'completed') {
      navigate(`/q/${id}/done`, { replace: true });
    }
  }, [ready, candidate, id, navigate]);

  const total = tierItems.length;
  const currentAnswer = useMemo(
    () => answers[tierItems[index]?.id],
    [answers, index, tierItems]
  );

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
    const itemId = tierItems[index].id;
    setAnswers((a) => ({ ...a, [itemId]: v }));
    if (index < total - 1) setTimeout(() => setIndex((i) => i + 1), 320);
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
        <WelcomeScreen
          candidate={candidate}
          role={role}
          tierMeta={tierMeta}
          onStart={() => setStarted(true)}
        />
      ) : (
        <QuestionScreen
          items={tierItems}
          index={index}
          answer={currentAnswer}
          onAnswer={onAnswer}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </MobileFrame>
  );
}
