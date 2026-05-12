import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  MessageSquareQuote,
  Download,
  Mail,
  Phone,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ScoreBar from '../components/recruiter/ScoreBar';
import { useApp } from '../context/AppContext';
import { getRole } from '../data/roles';
import { questions } from '../data/questions';
import { dimensions, dimensionOrder } from '../data/dimensions';
import { calculateScores } from '../lib/scoring';
import { calculateFit, fitTone, fitLabel } from '../lib/fit';
import { generateInsights } from '../lib/insights';

function FitCircle({ fit }) {
  const tone = fitTone(fit);
  const colorMap = {
    success: { ring: 'text-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    warning: { ring: 'text-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
    danger: { ring: 'text-red-500', text: 'text-red-600', bg: 'bg-red-50' },
  };
  const c = colorMap[tone];
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fit / 100) * circumference;

  return (
    <div className={`relative w-40 h-40 ${c.bg} rounded-full flex items-center justify-center`}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" className="text-white/70" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          className={c.ring}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="text-center">
        <div className={`text-4xl font-extrabold tabular-nums ${c.text}`} dir="ltr">{fit}%</div>
        <div className="text-xs text-gray-600 mt-1">{fitLabel(fit)}</div>
      </div>
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
        <main className="flex-1 px-4 py-10 text-center">
          <p className="text-gray-500">לא נמצא מועמד</p>
          <Button className="mt-4" onClick={() => navigate('/')}>חזרה</Button>
        </main>
      </div>
    );
  }

  if (candidate.status !== 'completed' || !report) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 md:px-8 py-10 max-w-3xl mx-auto w-full">
          <PageHeader title={candidate.name} subtitle="ממתין לסיום השאלון" back backTo="/" />
          <Card className="text-center py-12">
            <div className="text-5xl mb-3">⏳</div>
            <h3 className="font-semibold text-gray-900 mb-1">המועמד עוד לא סיים</h3>
            <p className="text-sm text-gray-500 mb-5">
              הדוח יתעדכן אוטומטית כשהמועמד יסיים את השאלון
            </p>
            <Button onClick={() => navigate(`/link/${id}`)}>פתחי את הקישור</Button>
          </Card>
        </main>
      </div>
    );
  }

  const { role, scores, fit, insights, radarData } = report;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto w-full">
        <PageHeader
          title={candidate.name}
          subtitle={
            <span className="flex items-center gap-3 flex-wrap text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail size={13} /> <span dir="ltr">{candidate.email}</span></span>
              <span className="flex items-center gap-1"><Phone size={13} /> <span dir="ltr">{candidate.phone}</span></span>
            </span>
          }
          back
          backTo="/"
          action={
            <div className="flex items-center gap-2">
              <Badge tone="primary" size="md">{role.name}</Badge>
              <Button
                variant="secondary"
                leftIcon={<Download size={16} />}
                onClick={() => {
                  console.log('PDF export — coming soon', { candidate, scores, fit });
                  alert('יצוא PDF — בקרוב!');
                }}
              >
                הורדת PDF
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
              ציון התאמה כולל
            </div>
            <FitCircle fit={fit} />
            <p className="text-xs text-gray-500 mt-4 max-w-[220px] text-balance">
              משוקלל לפי חשיבות כל ממד לתפקיד {role.name}
            </p>
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">פרופיל אישיותי</h3>
                <p className="text-xs text-gray-500">מועמד מול אידיאלי לתפקיד</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary-500" /> המועמד
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-accent-500" /> אידיאלי
                </span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey="dim"
                    tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    tickCount={5}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      direction: 'rtl',
                    }}
                  />
                  <Radar
                    name="המועמד"
                    dataKey="candidate"
                    stroke="#4F46E5"
                    fill="#6366F1"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Radar
                    name="אידיאלי"
                    dataKey="ideal"
                    stroke="#0D9488"
                    fill="#14B8A6"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <h3 className="font-semibold text-gray-900">פירוט לפי ממדים</h3>
          </div>
          <div className="space-y-4">
            {dimensionOrder.map((d) => (
              <ScoreBar key={d} dim={d} score={scores[d]} ideal={role.ideal[d]} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            הסימן האנכי הקטן בכל פס מסמן את הציון האידיאלי לתפקיד.
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1 bg-emerald-50/40 border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <h3 className="font-semibold text-gray-900">חוזקות</h3>
            </div>
            {insights.strengths.length === 0 ? (
              <p className="text-sm text-gray-500">אין ממד שבולט במיוחד מעל הציפיות לתפקיד.</p>
            ) : (
              <ul className="space-y-3">
                {insights.strengths.map((s) => (
                  <li key={s.dim} className="bg-white rounded-lg p-3 border border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{s.name}</span>
                      <Badge tone="success" size="sm">{s.score}/100</Badge>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{s.copy}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="lg:col-span-1 bg-amber-50/40 border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <h3 className="font-semibold text-gray-900">נקודות לתשומת לב</h3>
            </div>
            {insights.concerns.length === 0 ? (
              <p className="text-sm text-gray-500">לא זוהו פערים משמעותיים מול דרישות התפקיד.</p>
            ) : (
              <ul className="space-y-3">
                {insights.concerns.map((c) => (
                  <li key={c.dim} className="bg-white rounded-lg p-3 border border-amber-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                      <Badge tone="warning" size="sm" dir="ltr">
                        {c.score} / {c.ideal}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{c.copy}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="lg:col-span-1 bg-primary-50/40 border-primary-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                <MessageSquareQuote size={18} />
              </div>
              <h3 className="font-semibold text-gray-900">שאלות לראיון</h3>
            </div>
            {insights.interviewQuestions.length === 0 ? (
              <p className="text-sm text-gray-500">אין צורך בשאלות מיקוד מיוחדות.</p>
            ) : (
              <ol className="space-y-3">
                {insights.interviewQuestions.map((iq, i) => (
                  <li key={i} className="bg-white rounded-lg p-3 border border-primary-100">
                    <Badge tone="primary" size="sm" className="mb-1.5">{iq.name}</Badge>
                    <p className="text-sm text-gray-800 leading-relaxed">{iq.q}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="text-xs text-gray-400 mt-6 text-center">
          הדוח מבוסס על שאלון BIG5 (50 שאלות) ומציג ציון התאמה משוקלל לתפקיד הספציפי.
        </div>
      </main>
    </div>
  );
}
