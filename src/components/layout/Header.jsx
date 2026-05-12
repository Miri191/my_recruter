import { useNavigate } from 'react-router-dom';

export default function PageHeader({ eyebrow, title, subtitle, action, back = false, backTo }) {
  const navigate = useNavigate();

  return (
    <header className="mb-10 animate-fade-up">
      <div className="flex items-start justify-between gap-6 mb-4">
        <div className="flex-1 min-w-0">
          {back && (
            <button
              type="button"
              onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
              className="eyebrow text-ink-soft hover:text-ink transition-colors mb-3 inline-flex items-center gap-2"
            >
              <span className="text-base leading-none">→</span>
              חזרה
            </button>
          )}
          {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
          <h1 className="display text-4xl md:text-5xl text-ink text-balance">{title}</h1>
          {subtitle && (
            <div className="text-sm text-ink-soft mt-3 leading-relaxed">{subtitle}</div>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="rule-ink h-px animate-rule-in origin-right" />
    </header>
  );
}
