import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronLeft, Link2, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import { getRole } from '../../data/roles';
import { calculateScores } from '../../lib/scoring';
import { calculateFit, fitTone } from '../../lib/fit';
import { questions } from '../../data/questions';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function CandidateRow({ candidate, onDelete }) {
  const navigate = useNavigate();
  const role = getRole(candidate.roleId);
  const completed = candidate.status === 'completed';

  let fit = null;
  if (completed && candidate.answers) {
    const scores = calculateScores(candidate.answers, questions);
    fit = calculateFit(scores, role).fit;
  }

  const fitToneClass = fit == null
    ? 'text-gray-400'
    : fitTone(fit) === 'success'
      ? 'text-emerald-600'
      : fitTone(fit) === 'warning'
        ? 'text-amber-600'
        : 'text-red-600';

  const goTo = () => {
    if (completed) navigate(`/report/${candidate.id}`);
    else navigate(`/link/${candidate.id}`);
  };

  return (
    <tr
      className="border-b border-gray-100 hover:bg-primary-50/30 transition-colors cursor-pointer"
      onClick={goTo}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-gradient text-white flex items-center justify-center font-semibold shrink-0">
            {candidate.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">{candidate.name}</div>
            <div className="text-xs text-gray-500 truncate">{candidate.email}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <Badge tone="primary">{role?.name || '—'}</Badge>
      </td>
      <td className="py-4 px-4">
        {completed ? (
          <Badge tone="success" leftIcon={<CheckCircle2 size={12} />}>
            הושלם
          </Badge>
        ) : (
          <Badge tone="warning" leftIcon={<Clock size={12} />}>
            ממתין
          </Badge>
        )}
      </td>
      <td className="py-4 px-4 text-sm text-gray-600" dir="ltr">
        {formatDate(candidate.createdAt)}
      </td>
      <td className="py-4 px-4">
        {fit != null ? (
          <span className={`font-bold text-lg ${fitToneClass}`} dir="ltr">
            {fit}%
          </span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          {!completed && (
            <button
              type="button"
              onClick={() => navigate(`/link/${candidate.id}`)}
              className="w-8 h-8 rounded-lg text-gray-500 hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all"
              aria-label="קישור"
              title="קישור"
            >
              <Link2 size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`למחוק את ${candidate.name}?`)) onDelete(candidate.id);
            }}
            className="w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all"
            aria-label="מחיקה"
            title="מחיקה"
          >
            <Trash2 size={16} />
          </button>
          <button
            type="button"
            onClick={goTo}
            className="w-8 h-8 rounded-lg text-gray-500 hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all"
            aria-label="פתח"
            title={completed ? 'דוח' : 'קישור'}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
