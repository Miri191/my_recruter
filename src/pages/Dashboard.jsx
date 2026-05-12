import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import CandidateRow from '../components/recruiter/CandidateRow';
import { useApp } from '../context/AppContext';
import { roles, getRole } from '../data/roles';
import { questions } from '../data/questions';
import { calculateScores } from '../lib/scoring';
import { calculateFit } from '../lib/fit';

function StatBlock({ eyebrow, value, suffix, note, accent }) {
  const accentMap = {
    petrol: { eyebrowCol: 'text-petrol', numCol: 'text-ink', dot: 'bg-petrol' },
    ochre: { eyebrowCol: 'text-ochre', numCol: 'text-ink', dot: 'bg-ochre' },
    forest: { eyebrowCol: 'text-forest', numCol: 'text-ink', dot: 'bg-forest' },
    brick: { eyebrowCol: 'text-brick', numCol: 'text-ink', dot: 'bg-brick' },
  };
  const a = accentMap[accent] || accentMap.petrol;
  return (
    <Card variant="elev" accent={accent} padding="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
        <span className={`eyebrow ${a.eyebrowCol} font-semibold`}>{eyebrow}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`display text-5xl md:text-[56px] leading-none ${a.numCol}`} dir="ltr">
          {value}
        </span>
        {suffix && (
          <span className="display text-2xl text-ink-mute leading-none">{suffix}</span>
        )}
      </div>
      {note && <div className="text-[12px] text-ink-mute mt-3">{note}</div>}
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { candidates, deleteCandidate } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => {
    const total = candidates.length;
    const completed = candidates.filter((c) => c.status === 'completed');
    const pending = total - completed.length;
    let avgFit = 0;
    if (completed.length) {
      const sum = completed.reduce((acc, c) => {
        const role = getRole(c.roleId);
        const scores = calculateScores(c.answers, questions);
        return acc + calculateFit(scores, role).fit;
      }, 0);
      avgFit = Math.round(sum / completed.length);
    }
    return { total, completed: completed.length, pending, avgFit };
  }, [candidates]);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (roleFilter !== 'all' && c.roleId !== roleFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !(c.phone || '').includes(q)
        ) return false;
      }
      return true;
    });
  }, [candidates, search, roleFilter, statusFilter]);

  const today = new Date().toLocaleDateString('he-IL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 md:px-12 py-8 md:py-14 max-w-[1400px] w-full mx-auto">
        <PageHeader
          eyebrow={`גליון יומי · ${today}`}
          title="פנקס המועמדים"
          subtitle="כל המועמדים שהוזמנו לשאלון, סטטוס מילוי וציון התאמה משוקלל לתפקיד."
          action={
            <Button size="lg" onClick={() => navigate('/new')}>
              + מועמד חדש
            </Button>
          }
        />

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12">
          <StatBlock accent="petrol" eyebrow="סך הכל" value={stats.total} note="מועמדים בפנקס" />
          <StatBlock accent="ochre" eyebrow="ממתינים" value={stats.pending} note="טרם הגישו תשובות" />
          <StatBlock accent="forest" eyebrow="הושלמו" value={stats.completed} note="זמינים לקריאה" />
          <StatBlock
            accent="brick"
            eyebrow="ממוצע התאמה"
            value={stats.avgFit || '—'}
            suffix={stats.avgFit ? '%' : ''}
            note="לפי משקלות התפקיד"
          />
        </section>

        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <div className="eyebrow-petrol mb-2">פרק II · רשימה</div>
              <h2 className="display text-2xl text-ink">כל המועמדים</h2>
            </div>
            <div className="text-[12px] text-ink-mute">
              <span className="num text-ink font-medium">{filtered.length}</span> מתוך{' '}
              <span className="num">{candidates.length}</span>
            </div>
          </div>
          <div className="rule-petrol mb-5" />

          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
            <div className="relative flex-1">
              <span className="absolute top-1/2 -translate-y-1/2 right-0 text-ink-mute text-[11px] tracking-widish uppercase">חיפוש</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="שם · אימייל · טלפון"
                className="w-full h-11 pr-16 pl-3 bg-transparent border-b-2 border-ink-line text-[14px] focus:outline-none focus:border-petrol transition-colors"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-11 px-3 bg-paper-light border border-ink-line text-[13px] focus:outline-none focus:border-petrol transition-colors cursor-pointer"
            >
              <option value="all">כל התפקידים</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-3 bg-paper-light border border-ink-line text-[13px] focus:outline-none focus:border-petrol transition-colors cursor-pointer"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="pending">ממתין</option>
              <option value="completed">הושלם</option>
            </select>
          </div>
        </section>

        {filtered.length === 0 ? (
          <EmptyState
            title={candidates.length === 0 ? 'אין מועמדים עדיין' : 'לא נמצאו מועמדים'}
            description={
              candidates.length === 0
                ? 'התחילי בהוספת מועמד חדש כדי לשלוח לו שאלון אישיות.'
                : 'נסי לשנות את מסנני החיפוש למעלה.'
            }
            action={
              candidates.length === 0 ? (
                <Button onClick={() => navigate('/new')}>הוסיפי מועמד ראשון</Button>
              ) : null
            }
          />
        ) : (
          <Card variant="elev" padding="p-0" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-paper-dark/40">
                  <tr className="border-b-2 border-ink">
                    <th className="py-3 pr-3 pl-2 text-right eyebrow">№</th>
                    <th className="py-3 px-4 text-right eyebrow">מועמד</th>
                    <th className="py-3 px-4 text-right eyebrow">תפקיד</th>
                    <th className="py-3 px-4 text-right eyebrow">סטטוס</th>
                    <th className="py-3 px-4 text-right eyebrow">תאריך</th>
                    <th className="py-3 px-4 text-right eyebrow">התאמה</th>
                    <th className="py-3 px-4 text-left eyebrow">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <CandidateRow key={c.id} candidate={c} index={i} onDelete={deleteCandidate} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
