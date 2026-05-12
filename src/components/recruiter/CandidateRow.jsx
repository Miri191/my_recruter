import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { getRole } from '../../data/roles';
import { calculateScores } from '../../lib/scoring';
import { calculateFit } from '../../lib/fit';
import { questions } from '../../data/questions';

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
    const scores = calculateScores(candidate.answers, questions);
    fit = calculateFit(scores, role).fit;
  }

  const fitTone =
    fit == null
      ? 'text-ink-line'
      : fit >= 75
        ? 'text-sage'
        : fit >= 55
          ? 'text-ochre'
          : 'text-oxblood';

  const goTo = () => {
    if (completed) navigate(`/report/${candidate.id}`);
    else navigate(`/link/${candidate.id}`);
  };

  const n = String(index + 1).padStart(3, '0');

  return (
    <tr
      className="border-b border-ink-line hover:bg-paper-dark/40 transition-colors cursor-pointer group"
      onClick={goTo}
    >
      <td className="py-5 px-4 align-top">
        <div className="num text-[11px] tracking-widish text-ink-mute pt-1">{n}</div>
      </td>
      <td className="py-5 px-4 align-top">
        <div className="flex items-baseline gap-3">
          <span className="display text-[15px] text-ink leading-none w-7 h-7 border border-ink rounded-full inline-flex items-center justify-center shrink-0">
            {candidate.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="display text-[17px] text-ink truncate group-hover:underline-ink">
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
          <Badge tone="default">ממתין</Badge>
        )}
      </td>
      <td className="py-5 px-4 align-middle">
        <span className="num text-[13px] text-ink-soft" dir="ltr">
          {formatDate(candidate.createdAt)}
        </span>
      </td>
      <td className="py-5 px-4 align-middle">
        {fit != null ? (
          <span className={`num text-2xl ${fitTone}`} dir="ltr">
            {fit}
            <span className="text-ink-mute text-base">%</span>
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
              className="text-[11px] tracking-widish uppercase text-ink-soft hover:text-ink hover:underline-ink"
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
            className="text-[11px] tracking-widish uppercase text-ink-mute hover:text-oxblood hover:underline-ink"
            title="מחיקה"
          >
            מחק
          </button>
          <span className="text-ink-soft text-lg leading-none">←</span>
        </div>
      </td>
    </tr>
  );
}
