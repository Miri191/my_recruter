import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PageHeader({ title, subtitle, action, back = false, backTo }) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {back && (
          <button
            type="button"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 flex items-center justify-center transition-all"
            aria-label="חזרה"
          >
            <ArrowRight size={18} />
          </button>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
