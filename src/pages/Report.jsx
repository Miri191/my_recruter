import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ScoreBar from '../components/recruiter/ScoreBar';
import { useApp } from '../context/AppContext';
import { getRole } from '../data/roles';
import { questions } from '../data/questions';
import { dimensions, dimensionOrder } from '../data/dimensions';
import { calculateScores } from '../lib/scoring';
import { calculateFit, fitLabel } from '../lib/fit';
import { generateInsights } from '../lib/insights';

function FitDisplay({ fit }) {
  const tone =
    fit >= 75 ? 'text-sage' : fit >= 55 ? 'text-ochre' : 'text-oxblood';
  return (
    <div className="text-center">
      <div className="eyebrow mb-3">ציון התאמה כולל</div>
      <div className="rule-ink mb-6" />
      <div className={`display ${tone}`} dir="ltr">
        <span className="text-[120px] md:text-[160px] leading-[0.9]">{fit}</span>
        <span className="text-5xl text-ink-mute">%</span>
      </div>
      <div className="rule-ink mt-6" />
      <div className="eyebrow mt-3">{fitLabel(fit)}</div>
    </div>
  );
}

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidate, ready } = useApp();

  const candidate = ready ? getCandidate(id) : null;

  const report = useMemo(() => {
    if (!candidate || !candidate.answers) return null;
    const role = getRole(candidate.roleId);
    const scores = calculateScores(candidate.answers, questions);
    const { fit, dimFit } = calculateFit(scores, role);
    const insights = generateInsights(scores, role);
    const radarData = dimensionOrder.map((d) => ({
      dim: dimensions[d].name,
      candidate: scores[d],
      ideal: role.ideal[d],
      fullMark: 100,
    }));
    return { role, scores, fit, dimFit, insights, radarData };
  }, [candidate]);

  if (!ready) return null;

  if (!candidate) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-6 py-14 text-center">
          <p className="text-ink-soft">לא נמצא מועמד</p>
          <Button className="mt-4" onClick={() => navigate('/')}>חזרה</Button>
        </main>
      </div>
    );
  }

  if (candidate.status !== 'completed' || !report) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-6 md:px-12 py-14 max-w-3xl mx-auto w-full">
          <PageHeader title={candidate.name} subtitle="ממתין לסיום השאלון" back backTo="/" />
          <div className="bg-paper-light border border-ink-line p-12 text-center">
            <div className="eyebrow mb-3">סטטוס</div>
            <h3 className="display text-2xl text-ink mb-2">המועמד עוד לא סיים</h3>
            <div className="rule mx-auto w-10 mb-4" />
            <p className="text-sm text-ink-soft mb-6">
              הדוח יתעדכן אוטומטית כשהמועמד יסיים את השאלון
            </p>
            <Button onClick={() => navigate(`/link/${id}`)}>פתח קישור ←</Button>
          </div>
        </main>
      </div>
    );
  }

  const { role, scores, fit, insights, radarData } = report;
  const completedDate = candidate.completedAt
    ? new Date(candidate.completedAt).toLocaleDateString('he-IL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 md:px-12 py-8 md:py-14 max-w-6xl mx-auto w-full">
        <PageHeader
          eyebrow={`גליון אישי · ${completedDate}`}
          title={candidate.name}
          subtitle={
            <span className="flex items-center gap-4 flex-wrap text-sm text-ink-soft">
              <span dir="ltr">{candidate.email}</span>
              <span className="text-ink-line">·</span>
              <span dir="ltr">{candidate.phone}</span>
              <span className="text-ink-line">·</span>
              <span>{role.name}</span>
            </span>
          }
          back
          backTo="/"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                console.log('PDF export — coming soon', { candidate, scores, fit });
                alert('יצוא PDF — בקרוב');
              }}
            >
              הורד PDF ↓
            </Button>
          }
        />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-center">
          <div className="lg:col-span-5">
            <FitDisplay fit={fit} />
            <p className="text-[13px] text-ink-mute mt-6 text-center max-w-xs mx-auto leading-relaxed">
              ציון משוקלל לפי חשיבות כל ממד אישיות לתפקיד <span className="text-ink underline-ink">{role.name}</span>.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="eyebrow mb-1">פרק I</div>
                <h2 className="display text-2xl text-ink">פרופיל אישיות</h2>
              </div>
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-widish">
                <span className="flex items-center gap-2 text-ink">
                  <span className="w-4 h-px bg-ink" /> המועמד
                </span>
                <span className="flex items-center gap-2 text-oxblood">
                  <span className="w-4 border-t border-dashed border-oxblood" /> אידיאלי
                </span>
              </div>
            </div>
            <div className="rule-ink mb-2" />
            <div className="h-80 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="#C9BFA9" strokeDasharray="2 4" />
                  <PolarAngleAxis
                    dataKey="dim"
                    tick={{ fill: '#1B1714', fontSize: 12, fontFamily: 'Frank Ruhl Libre, serif' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#7B7264', fontSize: 9, fontFamily: 'Heebo, sans-serif' }}
                    tickCount={5}
                    axisLine={false}
                  />
                  <Radar
                    name="המועמד"
                    dataKey="candidate"
                    stroke="#1B1714"
                    fill="#1B1714"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                  />
                  <Radar
                    name="אידיאלי"
                    dataKey="ideal"
                    stroke="#7A2929"
                    fill="#7A2929"
                    fillOpacity={0.05}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="num text-[11px] tracking-widish text-ink-mute">II</span>
            <h2 className="display text-2xl text-ink">פירוט לפי ממדים</h2>
            <div className="flex-1 rule-ink h-px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
            {dimensionOrder.map((d) => (
              <ScoreBar key={d} dim={d} score={scores[d]} ideal={role.ideal[d]} />
            ))}
          </div>
          <p className="text-[12px] text-ink-mute mt-5 leading-relaxed max-w-md">
            הקו האנכי האדום מסמן את הציון האידיאלי לתפקיד. הקו השחור — ציון המועמד.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="eyebrow mb-2">פרק III · א</div>
            <h3 className="display text-2xl text-ink mb-3">חוזקות</h3>
            <div className="rule-ink mb-5" />
            {insights.strengths.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                אין ממד שבולט במיוחד מעל הציפיות לתפקיד.
              </p>
            ) : (
              <ul className="space-y-5">
                {insights.strengths.map((s) => (
                  <li key={s.dim} className="border-r-2 border-sage pr-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="display text-[17px] text-ink">{s.name}</span>
                      <span className="num text-sage text-sm" dir="ltr">{s.score}/100</span>
                    </div>
                    <p className="text-[13px] text-ink-soft leading-relaxed">{s.copy}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="eyebrow mb-2">פרק III · ב</div>
            <h3 className="display text-2xl text-ink mb-3">נקודות לתשומת לב</h3>
            <div className="rule-ink mb-5" />
            {insights.concerns.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                לא זוהו פערים משמעותיים מול דרישות התפקיד.
              </p>
            ) : (
              <ul className="space-y-5">
                {insights.concerns.map((c) => (
                  <li key={c.dim} className="border-r-2 border-oxblood pr-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="display text-[17px] text-ink">{c.name}</span>
                      <span className="num text-oxblood text-sm" dir="ltr">
                        {c.score} / {c.ideal}
                      </span>
                    </div>
                    <p className="text-[13px] text-ink-soft leading-relaxed">{c.copy}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="eyebrow mb-2">פרק III · ג</div>
            <h3 className="display text-2xl text-ink mb-3">שאלות לראיון</h3>
            <div className="rule-ink mb-5" />
            {insights.interviewQuestions.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                אין צורך בשאלות מיקוד מיוחדות.
              </p>
            ) : (
              <ol className="space-y-5">
                {insights.interviewQuestions.map((iq, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="num text-[11px] tracking-widish text-ink-mute pt-1 w-6 shrink-0" dir="ltr">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="eyebrow text-ink-mute mb-1.5">{iq.name}</div>
                      <p className="text-[14px] text-ink-soft leading-relaxed">{iq.q}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <footer className="border-t-2 border-ink pt-6 flex items-baseline justify-between text-[11px] tracking-widish uppercase text-ink-mute">
          <span>אורקל · אבחון אישיות</span>
          <span className="num" dir="ltr">№ {id?.slice(0, 8).toUpperCase()}</span>
          <span>BIG5 · IPIP 50</span>
        </footer>
      </main>
    </div>
  );
}
