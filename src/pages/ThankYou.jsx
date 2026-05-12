import { useParams } from 'react-router-dom';
import MobileFrame from '../components/layout/MobileFrame';
import { useApp } from '../context/AppContext';

export default function ThankYou() {
  const { id } = useParams();
  const { getCandidate, ready } = useApp();
  const candidate = ready ? getCandidate(id) : null;
  const refNumber = id?.slice(0, 8).toUpperCase() || '—';
  const firstName = candidate?.name?.split(' ')[0] || '';

  return (
    <MobileFrame>
      <div className="min-h-screen md:min-h-[760px] flex flex-col p-7 md:p-9 bg-paper-light">
        <div className="flex items-baseline justify-between mb-12">
          <div className="eyebrow">פנקס אישיות · סיום</div>
          <div className="eyebrow num">Fin.</div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="mb-8">
            <div className="eyebrow mb-3">פיסה</div>
            <div className="rule-ink mb-6" />
            <h1 className="display text-[52px] md:text-[64px] text-ink leading-[0.95] text-balance">
              תודה{firstName ? `,` : '.'}<br/>
              {firstName && (
                <span className="text-ink-soft">{firstName}.</span>
              )}
            </h1>
          </div>

          <p className="text-[16px] text-ink-soft leading-relaxed mb-3 text-balance">
            סיימת את השאלון בהצלחה. התשובות עברו לטיפול המגייסת —
            ניצור איתך קשר בקרוב להמשך התהליך.
          </p>

          <div className="mt-auto pt-10">
            <div className="rule mb-5" />
            <div className="flex items-baseline justify-between">
              <div>
                <div className="eyebrow mb-1.5">מספר אסמכתא</div>
                <div className="num display text-2xl text-ink tracking-widish" dir="ltr">
                  {refNumber}
                </div>
              </div>
              <div className="text-left">
                <div className="eyebrow mb-1.5">תאריך</div>
                <div className="num text-[13px] text-ink-soft" dir="ltr">
                  {new Date().toLocaleDateString('he-IL', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div className="rule-ink mt-6" />
            <div className="eyebrow text-center mt-4 text-ink-mute">
              ניתן לסגור את החלון
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
