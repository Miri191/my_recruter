import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Clock, CheckCircle2, TrendingUp, UserPlus } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import CandidateRow from '../components/recruiter/CandidateRow';
import { useApp } from '../context/AppContext';
import { roles, getRole } from '../data/roles';
import { questions } from '../data/questions';
import { calculateScores } from '../lib/scoring';
import { calculateFit } from '../lib/fit';

function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  const toneClasses = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    warning: 'bg-amber-50 text-amber-600',
    success: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${toneClasses[tone]}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 leading-none" dir="ltr">
          {value}
        </div>
        <div className="text-sm text-gray-500 mt-1">{label}</div>
      </div>
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
        ) {
          return false;
        }
      }
      return true;
    });
  }, [candidates, search, roleFilter, statusFilter]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 md:py-10 max-w-[1400px] w-full mx-auto">
        <PageHeader
          title="פלטפורמת אבחון אישיותי"
          subtitle="ניהול מועמדים, שליחת שאלון BIG5 וניתוח התאמה לתפקיד"
          action={
            <Button
              size="lg"
              onClick={() => navigate('/new')}
              leftIcon={<Plus size={18} />}
            >
              מועמד חדש
            </Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard icon={Users} label='סה"כ מועמדים' value={stats.total} tone="primary" />
          <StatCard icon={Clock} label="ממתינים" value={stats.pending} tone="warning" />
          <StatCard icon={CheckCircle2} label="הושלמו" value={stats.completed} tone="success" />
          <StatCard
            icon={TrendingUp}
            label="ממוצע התאמה"
            value={stats.avgFit ? `${stats.avgFit}%` : '—'}
            tone="accent"
          />
        </div>

        <Card padding="p-4 md:p-5" className="mb-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש לפי שם, אימייל או טלפון"
                className="w-full h-11 pr-10 pl-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
            >
              <option value="all">כל התפקידים</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="pending">ממתין</option>
              <option value="completed">הושלם</option>
            </select>
          </div>
        </Card>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<UserPlus size={24} />}
            title={candidates.length === 0 ? 'אין מועמדים עדיין' : 'לא נמצאו מועמדים'}
            description={
              candidates.length === 0
                ? 'התחילי בהוספת מועמד חדש כדי לשלוח לו את שאלון האישיות'
                : 'נסי לשנות את מסנני החיפוש'
            }
            action={
              candidates.length === 0 ? (
                <Button onClick={() => navigate('/new')} leftIcon={<Plus size={18} />}>
                  הוסיפי מועמד ראשון
                </Button>
              ) : null
            }
          />
        ) : (
          <Card padding="p-0" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-right">
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      שם
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      תפקיד
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      סטטוס
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      תאריך
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      התאמה
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <CandidateRow key={c.id} candidate={c} onDelete={deleteCandidate} />
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
