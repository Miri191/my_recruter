import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { History } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import ScoreBar from '../components/recruiter/ScoreBar';
import AnalysisControls from '../components/report/AnalysisControls';
import RedFlagsSection from '../components/report/RedFlagsSection';
import WorkPatternsSection from '../components/report/WorkPatternsSection';
import CultureFitSection from '../components/report/CultureFitSection';
import FacetsSection from '../components/report/FacetsSection';
import RoleComparisonStrip from '../components/report/RoleComparisonStrip';
import ViewHistoryModal from '../components/report/ViewHistoryModal';
import { useApp } from '../context/AppContext';
import { getRole } from '../data/roles';
import { getTierItems, getTierMeta } from '../data/questionnaires';
import { dimensions, dimensionOrder } from '../data/dimensions';
import { calculateScores, calculateFacetScores } from '../lib/scoring';
import { calculateFit, fitLabel } from '../lib/fit';
import { generateInsights } from '../lib/insights';
import { generateAdvancedAnalysis } from '../lib/advancedAnalysis';
import { logView, getViewHistory } from '../lib/storage';

const nameToStroke = Object.values(dimensions).reduce((acc, d) => {
  acc[d.name] = d.classes.stroke;
  return acc;
}, {});

function CustomAxisTick({ x, y, payload, textAnchor }) {
  const color = nameToStroke[payload?.value] || '#1B1714';
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={12}
      fontFamily="Heebo, sans-serif"
      fontWeight={600}
      textAnchor={textAnchor}
      dy={4}
    >
      {payload?.value}
    </text>
  );
}

function RadarTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  const { dim, candidate, ideal } = point;
  const diff = candidate - ideal;
  const absDiff = Math.abs(diff);
  const diffColor =
    absDiff <= 10 ? 'text-forest' : absDiff <= 20 ? 'text-ochre' : 'text-oxblood';
  const diffLabel = diff === 0 ? 'תואם' : diff > 0 ? `+${diff} מעל` : `${diff} מתחת`;
  const dimColor = nameToStroke[dim] || '#1B1714';

  return (
    <div
      className="bg-paper-light border-2 border-ink shadow-ink-sm min-w-[200px] text-right"
      dir="rtl"
    >
      <div
        className="flex items-center gap-2 px-3.5 py-2 border-b border-ink-line"
        style={{ background: `${dimColor}14` }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: dimColor }} />
        <span className="display text-[15px] text-ink leading-none">{dim}</span>
      </div>
      <div className="px-3.5 py-2.5 space-y-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="eyebrow text-ink-mute leading-none">מועמד</span>
          <span className="num text-2xl text-ink leading-none" dir="ltr">{candidate}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="eyebrow text-ink-mute leading-none">נורמה</span>
          <span className="num text-2xl text-ink-soft leading-none" dir="ltr">{ideal}</span>
        </div>
        <div className="border-t border-ink-line pt-1.5 mt-1.5 flex items-baseline justify-between gap-4">
          <span className="eyebrow text-ink-mute leading-none">הפרש</span>
          <span className={`num text-sm font-medium leading-none ${diffColor}`} dir="ltr">{diffLabel}</span>
        </div>
      </div>
    </div>
  );
}

function DimensionLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 px-2">
      {dimensionOrder.map((d) => {
        const m = dimensions[d];
        return (
          <span key={d} className="flex items-center gap-1.5 text-[11px] tracking-widish uppercase">
            <span className={`w-2 h-2 rounded-full ${m.classes.dot}`} />
            <span className={`${m.classes.text} font-medium`}>{m.key}</span>
            <span className="text-ink-soft">{m.name}</span>
          </span>
        );
      })}
    </div>
  );
}

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
  const { getCandidate, ready, roles } = useApp();

  const candidate = ready ? getCandidate(id) : null;

  // Advanced analysis controls — default all on, medium depth, standard sector.
  const [layers, setLayers] = useState(['redflags', 'patterns', 'culture']);
  const [depth, setDepth] = useState('medium');
  const [sector, setSector] = useState('standard');
  const [historyOpen, setHistoryOpen] = useState(false);

  // Role comparison — defaults to the candidate's assigned role; can be
  // switched to any other role to see how the analysis changes for the
  // same answers. Doesn't mutate the candidate record.
  const [activeRoleId, setActiveRoleId] = useState(null);
  useEffect(() => {
    if (candidate?.roleId) setActiveRoleId(candidate.roleId);
  }, [candidate?.id, candidate?.roleId]);

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  // Candidate-intrinsic data (independent of role): 5 dim scores + facets.
  const candidateScores = useMemo(() => {
    if (!candidate || !candidate.answers) return null;
    const tier = candidate.tier || 'standard';
    const tierItems = getTierItems(tier);
    const tierMeta = getTierMeta(tier);
    const { normalized: scores } = calculateScores(candidate.answers, tierItems);
    const facets =
      tier === 'deep' ? calculateFacetScores(candidate.answers, tierItems) : null;
    return { tier, tierMeta, scores, facets };
  }, [candidate]);

  // Fit per role — used by the comparison strip. Cheap to compute.
  const rolesData = useMemo(() => {
    if (!candidateScores) return [];
    return roles
      .map((r) => ({ role: r, fit: calculateFit(candidateScores.scores, r).fit }))
      .sort((a, b) => b.fit - a.fit);
  }, [candidateScores, roles]);

  const activeRole = useMemo(() => {
    if (!candidate) return null;
    return (
      roles.find((r) => r.id === activeRoleId) ||
      getRole(candidate.roleId) ||
      roles.find((r) => r.id === candidate.roleId)
    );
  }, [activeRoleId, roles, candidate]);

  // Role-dependent computations: fit, insights, radar.
  const report = useMemo(() => {
    if (!candidateScores || !activeRole) return null;
    const { scores, facets, tier, tierMeta } = candidateScores;
    const { fit, dimFit } = calculateFit(scores, activeRole);
    const insights = generateInsights(scores, activeRole);
    const radarData = dimensionOrder.map((d) => ({
      dim: dimensions[d].name,
      candidate: scores[d],
      ideal: activeRole.ideal[d],
      fullMark: 100,
    }));
    return { role: activeRole, tier, tierMeta, scores, facets, fit, dimFit, insights, radarData };
  }, [candidateScores, activeRole]);

  // Advanced analysis — recomputes when scores/role/sector change. Other
  // controls (layers/depth) only affect rendering, not computation.
  const advanced = useMemo(() => {
    if (!report) return null;
    return generateAdvancedAnalysis(report.scores, report.role, {
      layers: ['redflags', 'patterns', 'culture'],
      depth,
      sector,
    });
  }, [report, depth, sector]);

  // Audit log: record one entry on initial mount of the candidate's report
  // with the default settings. Compliance trail.
  useEffect(() => {
    if (!candidate || !advanced) return;
    logView({
      candidateId: candidate.id,
      layersShown: layers,
      depth,
      sector,
      flagsDisplayed: (advanced.redflags || []).map((f) => f.id),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate?.id]);

  const viewHistory = useMemo(
    () => (candidate ? getViewHistory(candidate.id) : []),
    [candidate, historyOpen]
  );

  if (!ready) return null;

  if (!candidate) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-6 py-14 text-center">
          <p className="text-ink-soft">לא נמצא מועמד</p>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>חזרה</Button>
        </main>
      </div>
    );
  }

  if (candidate.status !== 'completed' || !report) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-6 md:px-12 py-14 max-w-3xl mx-auto w-full">
          <PageHeader title={candidate.name} subtitle="ממתין לסיום השאלון" back backTo="/dashboard" />
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

  const { role, tier, tierMeta, scores, facets, fit, insights, radarData } = report;
  const isQuick = tier === 'quick';
  const isDeep = tier === 'deep';
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
          eyebrow={`דוח אישי · הוגש ב־${completedDate}`}
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
          backTo="/dashboard"
          action={
            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="inline-flex items-center gap-2 h-11 px-4 bg-paper-light border border-ink-line text-ink-soft hover:border-petrol hover:text-petrol transition-all text-[12px] tracking-widish uppercase font-medium"
                title="היסטוריית צפיות"
              >
                <History size={14} />
                <span className="hidden md:inline">היסטוריה</span>
                <span className="num text-[11px] text-ink-mute" dir="ltr">
                  ({viewHistory.length})
                </span>
              </button>
              <Button
                variant="primary"
                onClick={() => window.print()}
                title="הדפסה / שמירה כ-PDF"
              >
                הורד PDF ↓
              </Button>
            </div>
          }
        />

        {/* Tier indicator — shows which questionnaire the candidate filled */}
        <div className="mb-6 flex items-center gap-3 bg-paper-light border border-ink-line px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] tracking-wider2 uppercase font-semibold ${
            isQuick ? 'border-forest/40 text-forest bg-forest-tint'
              : isDeep ? 'border-plum/40 text-plum bg-plum-tint'
              : 'border-petrol/40 text-petrol bg-petrol-tint'
          }`}>
            שאלון {tierMeta.name}
          </span>
          <span className="num text-[12px] text-ink-soft" dir="ltr">
            {tierMeta.itemCount} שאלות · α = {tierMeta.validity.alphaRange} ({tierMeta.validity.label})
          </span>
        </div>

        {isQuick && (
          <div className="mb-6 bg-ochre-tint border border-ochre/40 border-r-[4px] border-r-ochre p-4">
            <div className="text-[13px] text-ochre leading-relaxed">
              <span className="font-semibold">דוח זה מבוסס על שאלון מהיר.</span>{' '}
              לניתוח עומק מלא (דגלים פונקציונליים, דפוסי עבודה, התאמה תרבותית) —
              מומלץ להזמין את המועמד לשאלון סטנדרטי או מעמיק.
            </div>
          </div>
        )}

        {!isQuick && (
          <div className="no-print">
            <AnalysisControls
              layers={layers}
              onToggleLayer={toggleLayer}
              depth={depth}
              onDepthChange={setDepth}
              sector={sector}
              onSectorChange={setSector}
            />
          </div>
        )}

        {/* Print-only summary banner — shows current view settings in PDF */}
        <div className="print-only hidden mb-6 pb-3 border-b border-ink-line text-[10pt]">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-semibold"><span dir="ltr">Persona</span> · דוח אישיותי</span>
            <span dir="ltr">
              {new Date().toLocaleDateString('he-IL', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="text-[9pt] text-ink-mute">
            עומק תובנות: {depth === 'shallow' ? 'קצר' : depth === 'deep' ? 'עומק' : 'בינוני'}
            {' · '}
            שכבות: {layers.join(', ')}
            {sector === 'regulated' ? ' · מצב סקטור מפוקח' : ''}
          </div>
        </div>

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
                <h2 className="display text-2xl text-ink">פרופיל אישיות</h2>
              </div>
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-widish">
                <span className="flex items-center gap-2 text-petrol font-medium">
                  <span className="w-4 h-[3px] bg-petrol" /> המועמד
                </span>
                <span className="flex items-center gap-2 text-brick font-medium">
                  <span className="w-4 border-t-[3px] border-dashed border-brick" /> נורמה
                </span>
              </div>
            </div>
            <div className="rule-petrol mb-2" />
            <div className="h-80 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <defs>
                    <radialGradient id="candidateFill" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="#1A5868" stopOpacity={0.10} />
                      <stop offset="100%" stopColor="#1A5868" stopOpacity={0.30} />
                    </radialGradient>
                    <radialGradient id="idealFill" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="#B85C38" stopOpacity={0.04} />
                      <stop offset="100%" stopColor="#B85C38" stopOpacity={0.10} />
                    </radialGradient>
                  </defs>
                  <PolarGrid stroke="#E0DCD3" strokeDasharray="2 4" />
                  <PolarAngleAxis dataKey="dim" tick={<CustomAxisTick />} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#7B7264', fontSize: 9, fontFamily: 'Heebo, sans-serif' }}
                    tickCount={5}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<RadarTooltip />}
                    cursor={{ stroke: '#1A5868', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Radar
                    name="נורמה"
                    dataKey="ideal"
                    stroke="#B85C38"
                    fill="url(#idealFill)"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={{ fill: '#B85C38', stroke: '#B85C38', r: 2.5 }}
                  />
                  <Radar
                    name="המועמד"
                    dataKey="candidate"
                    stroke="#1A5868"
                    fill="url(#candidateFill)"
                    strokeWidth={2.5}
                    dot={{ fill: '#FBFAF7', stroke: '#1A5868', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#1A5868', stroke: '#FBFAF7', strokeWidth: 2, r: 6 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-ink-line/60 pt-3">
              <div className="eyebrow mb-2 text-ink-mute">מקרא ממדים</div>
              <DimensionLegend />
            </div>
          </Card>
        </section>

        <Card variant="elev" padding="p-7 md:p-8" className="mb-12">
          <div className="flex items-baseline gap-4 mb-5">
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
            הצבע של הפס מסמן את גובה ההתאמה:{' '}
            <span className="text-forest font-medium">ירוק — תואם</span>,{' '}
            <span className="text-ochre font-medium">חמרה — פער קל</span>,{' '}
            <span className="text-oxblood font-medium">אדום — פער גדול</span>.
          </p>
        </Card>

        {!isQuick && advanced && layers.includes('redflags') && (
          <RedFlagsSection flags={advanced.redflags} depth={depth} />
        )}

        {!isQuick && advanced && layers.includes('patterns') && advanced.patterns && (
          <WorkPatternsSection patterns={advanced.patterns} depth={depth} />
        )}

        {!isQuick && advanced && layers.includes('culture') && (
          <CultureFitSection culture={advanced.culture} depth={depth} />
        )}

        {isDeep && facets && <FacetsSection facets={facets} />}

        <header className="flex items-baseline gap-4 mb-5">
          <h2 className="display text-2xl text-ink">סיכום והמלצות</h2>
          <div className="flex-1 rule h-px" />
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
          <Card variant="elev" accent="forest" padding="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-forest" />
              <div className="eyebrow text-forest font-semibold">מה בולט לטובה</div>
            </div>
            <h3 className="display text-2xl text-ink mb-2">חוזקות</h3>
            <div className="rule mb-5" />
            {insights.strengths.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                אין ממד שבולט במיוחד מעל הציפיות לתפקיד.
              </p>
            ) : (
              <ul className="space-y-5">
                {insights.strengths.map((s) => {
                  const dimMeta = dimensions[s.dim];
                  return (
                    <li key={s.dim}>
                      <div className="flex items-baseline justify-between mb-1.5 gap-2">
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${dimMeta.classes.dot} shrink-0 self-center`} />
                          <span className="display text-[17px] text-ink">{s.name}</span>
                        </div>
                        <Badge tone="forest" size="sm">
                          <span className="num" dir="ltr">{s.score}/100</span>
                        </Badge>
                      </div>
                      <p className="text-[13px] text-ink-soft leading-relaxed">{s.copy}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card variant="elev" accent="ochre" padding="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-ochre" />
              <div className="eyebrow text-ochre font-semibold">לבדוק בראיון</div>
            </div>
            <h3 className="display text-2xl text-ink mb-2">נקודות לתשומת לב</h3>
            <div className="rule mb-5" />
            {insights.concerns.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                לא זוהו פערים משמעותיים מול דרישות התפקיד.
              </p>
            ) : (
              <ul className="space-y-5">
                {insights.concerns.map((c) => {
                  const dimMeta = dimensions[c.dim];
                  return (
                    <li key={c.dim}>
                      <div className="flex items-baseline justify-between mb-1.5 gap-2">
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${dimMeta.classes.dot} shrink-0 self-center`} />
                          <span className="display text-[17px] text-ink">{c.name}</span>
                        </div>
                        <Badge tone="ochre" size="sm">
                          <span className="num" dir="ltr">{c.score} / {c.ideal}</span>
                        </Badge>
                      </div>
                      <p className="text-[13px] text-ink-soft leading-relaxed">{c.copy}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card variant="elev" accent="petrol" padding="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-petrol" />
              <div className="eyebrow-petrol">לשאול בראיון</div>
            </div>
            <h3 className="display text-2xl text-ink mb-2">שאלות לראיון</h3>
            <div className="rule mb-5" />
            {insights.interviewQuestions.length === 0 ? (
              <p className="text-[14px] text-ink-soft leading-relaxed">
                אין צורך בשאלות מיקוד מיוחדות.
              </p>
            ) : (
              <ol className="space-y-5">
                {insights.interviewQuestions.map((iq, i) => {
                  const dimMeta = dimensions[iq.dim];
                  return (
                    <li key={i} className="flex gap-3">
                      <span className={`num text-[12px] tracking-widish ${dimMeta.classes.text} pt-1 w-6 shrink-0 font-semibold`} dir="ltr">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 border font-medium uppercase text-[10px] tracking-wider2 px-2 py-[3px] mb-2 ${dimMeta.classes.bgGhost} ${dimMeta.classes.text} ${dimMeta.classes.borderSoft}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dimMeta.classes.dot}`} />
                          {iq.name}
                        </span>
                        <p className="text-[14px] text-ink-soft leading-relaxed">{iq.q}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </section>

        <RoleComparisonStrip
          rolesData={rolesData}
          activeRoleId={activeRoleId}
          assignedRoleId={candidate.roleId}
          onSelect={setActiveRoleId}
        />

        <section className="border-t border-ink-line pt-6 mb-6">
          <div className="eyebrow-petrol mb-2">מתודולוגיה</div>
          <div className="text-[12px] text-ink-soft leading-relaxed max-w-3xl">
            <p className="mb-2">
              חמשת הציונים BIG5 מחושבים על פי{' '}
              <span className="font-medium text-ink">
                {isDeep ? 'IPIP-NEO-120 (Johnson 2014)' : 'IPIP-50 (Goldberg 1992)'}
              </span>{' '}
              — שאלון מאומת מדעית של ה-International Personality Item Pool,
              שמשמש בעשורים האחרונים במחקרים פסיכולוגיים, ארגוניים, וקליניים
              ברחבי העולם.
            </p>
            <p className="mb-2 text-ink-mute">
              ציון התאמה לתפקיד, פירוט החוזקות, הדגלים, דפוסי העבודה, וההתאמה
              התרבותית — אלו שכבות פרשנות שנבנו מעל הציונים על-פי ספרות מחקרית
              רלוונטית, ואינן חלק מ-IPIP עצמה.
            </p>
            <p className="text-ink-mute text-[11px]">
              השאלונים מבוססים על International Personality Item Pool (IPIP)
              בנחלת הכלל. התרגום העברי על ידי ד״ר שאול אורג, אוניברסיטת בן־גוריון.
            </p>
          </div>
        </section>

        <footer className="border-t-2 border-ink pt-6 flex items-baseline justify-between text-[11px] tracking-widish uppercase text-ink-mute">
          <span><span dir="ltr">Persona</span> · אבחון אישיותי</span>
          <span className="num" dir="ltr">№ {id?.slice(0, 8).toUpperCase()}</span>
          <span>BIG5 · IPIP-50</span>
        </footer>
      </main>

      {historyOpen && (
        <ViewHistoryModal
          history={viewHistory}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </div>
  );
}
