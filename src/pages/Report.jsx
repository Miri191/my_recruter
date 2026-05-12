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
import Card from '../components/ui/Card';
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
    fit >= 75 ? { color: 'text-forest', bg: 'bg-forest-tint', border: 'border-forest', accent: 'forest' }
      : fit >= 55 ? { color: 'text-ochre', bg: 'bg-ochre-tint', border: 'border-ochre', accent: 'ochre' }
        : { color: 'text-oxblood', bg: 'bg-oxblood-tint', border: 'border-oxblood', accent: 'oxblood' };

  return (
    <Card variant="elev" accent={tone.accent} padding="p-8" className="text-center">
      <div className="eyebrow mb-3">ציון התאמה כולל</div>
      <div className="rule-petrol mx-auto w-16 mb-5" />
      <div className={`display ${tone.color}`} dir="ltr">
        <span className="text-[120px] md:text-[150px] leading-[0.9] font-medium">{fit}</span>
        <span className="text-5xl text-ink-mute">%</span>
      </div>
      <div className={`inline-block mt-4 px-3 py-1 border ${tone.border} ${tone.bg} ${tone.color} text-[12px] tracking-widish uppercase font-medium`}>
        {fitLabel(fit)}
      </div>
    </Card>
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
          <Card variant="elev" accent="ochre" padding="p-12" className="text-center">
            <Badge tone="warning" size="lg" className="mb-4">ממתין</Badge>
            <h3 className="display text-2xl text-ink mb-2">המועמד עוד לא סיים</h3>
            <div className="rule mx-auto w-10 mb-4" />
            <p className="text-sm text-ink-soft mb-6">
              הדוח יתעדכן אוטומטית כשהמועמד יסיים את השאלון
            </p>
            <Button onClick={() => navigate(`/link/${id}`)}>פתחי קישור ←</Button>
          </Card>
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
          eyebrow={`גליון אישי · הוגש ב־${completedDate}`}
          title={candidate.name}
          subtitle={
            <span className="flex items-center gap-4 flex-wrap text-sm text-ink-soft">
              <span dir="ltr">{candidate.email}</span>
              <span className="text-ink-line">·</span>
              <span dir="ltr">{candidate.phone}</span>
              <span className="text-ink-line">·</span>
              <Badge tone="petrol" size="md">{role.name}</Badge>
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

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <FitDisplay fit={fit} />
            <p className="text-[13px] text-ink-mute mt-4 text-center max-w-xs mx-auto leading-relaxed">
              ציון משוקלל לפי חשיבות כל ממד אישיות לתפקיד{' '}
              <span className="text-petrol underline-petrol font-medium">{role.name}</span>.
            </p>
          </div>

          <Card variant="elev" padding="p-6" className="lg:col-span-7">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="eyebrow-petrol mb-1">פרק I</div>
                <h2 className="display text-2xl text-ink">פרופיל אישיות</h2>
              </div>
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-widish">
                <span className="flex items-center gap-2 text-petrol font-medium">
                  <span className="w-4 h-[3px] bg-petrol" /> המועמד
                </span>
                <span className="flex items-center gap-2 text-brick font-medium">
                  <span className="w-4 border-t-[3px] border-dashed border-brick" /> אידיאלי
                </span>
              </div>
            </div>
            <div className="rule-petrol mb-2" />
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
                    stroke="#1A5868"
                    fill="#1A5868"
                    fillOpacity={0.22}
                    strokeWidth={2}
                  />
                  <Radar
                    name="אידיאלי"
                    dataKey="ideal"
                    stroke="#B85C38"
                    fill="#B85C38"
                    fillOpacity={0.08}
                    strokeWidth={2}
                    strokeDasharray="5 3"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <Card variant="elev" padding="p-7 md:p-8" className="mb-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="num text-[11px] tracking-widish text-petrol font-medium">II</span>
            <h2 className="display text-2xl text-ink">פירוט לפי ממדים</h2>
            <div className="flex-1 rule h-px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            {dimensionOrder.map((d) => (
              <ScoreBar key={d} dim={d} score={scores[d]} ideal={role.ideal[d]} />
            ))}
          </div>
          <p className="text-[12px] text-ink-mute mt-5 leading-relaxed max-w-lg">
            <span className="inline-block w-3 h-[2px] bg-ink align-middle mx-1" /> מסמן את הציון האידיאלי לתפקיד.
            הצבע של הפס מסמן את גובה ההתאמה: ירוק — תואם, חמרה — פער קל, אדום — פער גדול.
          </p>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
          <Card variant="elev" accent="forest" padding="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-forest" />
              <div className="eyebrow text-forest font-semibold">פרק III · א</div>
            </div>
            <h3 className="display text-2xl text-ink mb-2">חוזקות</h3>
            <div className="rule mb-5" />
            {insights.strengths.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                אין ממד שבולט במיוחד מעל הציפיות לתפקיד.
              </p>
            ) : (
              <ul className="space-y-5">
                {insights.strengths.map((s) => (
                  <li key={s.dim}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="display text-[17px] text-ink">{s.name}</span>
                      <Badge tone="forest" size="sm">
                        <span className="num" dir="ltr">{s.score}/100</span>
                      </Badge>
                    </div>
                    <p className="text-[13px] text-ink-soft leading-relaxed">{s.copy}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card variant="elev" accent="ochre" padding="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-ochre" />
              <div className="eyebrow text-ochre font-semibold">פרק III · ב</div>
            </div>
            <h3 className="display text-2xl text-ink mb-2">נקודות לתשומת לב</h3>
            <div className="rule mb-5" />
            {insights.concerns.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                לא זוהו פערים משמעותיים מול דרישות התפקיד.
              </p>
            ) : (
              <ul className="space-y-5">
                {insights.concerns.map((c) => (
                  <li key={c.dim}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="display text-[17px] text-ink">{c.name}</span>
                      <Badge tone="ochre" size="sm">
                        <span className="num" dir="ltr">{c.score} / {c.ideal}</span>
                      </Badge>
                    </div>
                    <p className="text-[13px] text-ink-soft leading-relaxed">{c.copy}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card variant="elev" accent="petrol" padding="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-petrol" />
              <div className="eyebrow-petrol">פרק III · ג</div>
            </div>
            <h3 className="display text-2xl text-ink mb-2">שאלות לראיון</h3>
            <div className="rule mb-5" />
            {insights.interviewQuestions.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                אין צורך בשאלות מיקוד מיוחדות.
              </p>
            ) : (
              <ol className="space-y-5">
                {insights.interviewQuestions.map((iq, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="num text-[12px] tracking-widish text-petrol pt-1 w-6 shrink-0 font-semibold" dir="ltr">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <Badge tone="petrol" size="sm" className="mb-2">{iq.name}</Badge>
                      <p className="text-[14px] text-ink-soft leading-relaxed">{iq.q}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
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
