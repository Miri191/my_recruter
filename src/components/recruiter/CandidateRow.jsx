import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { getRole } from '../../data/roles';
import { calculateScores } from '../../lib/scoring';
import { calculateFit } from '../../lib/fit';
import { getTierItems } from '../../data/questionnaires';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: 'short', year: '2-digit' });
}

export default function CandidateRow({ candidate, index, onDelete }) {
  const navigate = useNavigate();
  const role = getRole(candidate.roleId);
  const completed = candidate.status === 'completed';

  let fit = null;
  if (completed && candidate.answers) {
    const tierItems = getTierItems(candidate.tier || 'standard');
    const { normalized } = calculateScores(candidate.answers, tierItems);
    fit = calculateFit(normalized, role).fit;
  }

  const fitColor =
    fit == null ? 'text-ink-line'
      : fit >= 75 ? 'text-forest'
        : fit >= 55 ? 'text-ochre'
          : 'text-oxblood';

  const goTo = () => {
    if (completed) navigate(`/report/${candidate.id}`);
    else navigate(`/link/${candidate.id}`);
  };

  const n = String(index + 1).padStart(3, '0');
  const stripeColor = completed ? 'bg-forest' : 'bg-ochre';

  return (
    <tr
      className={`border-b border-ink-line/70 hover:bg-paper-dark/60 transition-colors cursor-pointer group ${completed ? '' : ''}`}
      onClick={goTo}
    >
      <td className="py-5 pr-3 align-middle relative">
        <span className={`absolute right-0 top-2 bottom-2 w-[3px] ${stripeColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
        <div className="num text-[11px] tracking-widish text-ink-mute pl-2">{n}</div>
      </td>
      <td className="py-5 px-4 align-middle">
        <div className="flex items-center gap-3">
          <span className={`display text-[15px] leading-none w-9 h-9 inline-flex items-center justify-center shrink-0 ${
            completed ? 'bg-petrol text-paper-light' : 'bg-paper-dark text-ink-soft border border-ink-line'
          }`}>
            {candidate.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="display text-[17px] text-ink truncate group-hover:underline-petrol">
              {candidate.name}
            </div>
            <div className="text-[12px] text-ink-mute mt-0.5 truncate" dir="ltr">
              {candidate.email}
            </div>
          </div>
        </div>
      </td>
      <td className="py-5 px-4 align-middle">
        <div className="text-[13px] text-ink-soft">{role?.name || '—'}</div>
      </td>
      <td className="py-5 px-4 align-middle">
        {completed ? (
          <Badge tone="success">הושלם</Badge>
        ) : (
          <Badge tone="warning">ממתין</Badge>
        )}
      </td>
      <td className="py-5 px-4 align-middle">
        <span className="num text-[13px] text-ink-soft" dir="ltr">
          {formatDate(candidate.createdAt)}
        </span>
      </td>
      <td className="py-5 px-4 align-middle">
        {fit != null ? (
          <span className={`num text-2xl font-medium ${fitColor}`} dir="ltr">
            {fit}
            <span className="text-ink-mute text-base font-normal">%</span>
          </span>
        ) : (
          <span className="num text-ink-line">—</span>
        )}
      </td>
      <td className="py-5 px-4 align-middle">
        <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
          {!completed && (
            <button
              type="button"
              onClick={() => navigate(`/link/${candidate.id}`)}
              className="text-[11px] tracking-widish uppercase text-petrol hover:underline-petrol font-medium"
              title="קישור"
            >
              קישור
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`למחוק את ${candidate.name}?`)) onDelete(candidate.id);
            }}
            className="text-[11px] tracking-widish uppercase text-ink-mute hover:text-oxblood"
            title="מחיקה"
          >
            מחק
          </button>
          <span className="text-petrol text-lg leading-none">←</span>
        </div>
      </td>
    </tr>
  );
}
