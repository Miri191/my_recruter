import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const tones = {
  success: { mark: '✓', label: 'אישור', classes: 'bg-paper border-ink text-ink' },
  warning: { mark: '!', label: 'שימי לב', classes: 'bg-ochre-ghost border-ochre text-ochre' },
  info: { mark: '·', label: 'הודעה', classes: 'bg-paper border-ink text-ink' },
};

export default function Toast() {
  const { toast, clearToast } = useApp();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2800);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;
  const conf = tones[toast.tone] || tones.success;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className={`flex items-center gap-4 px-5 py-3 border shadow-ink-sm ${conf.classes}`}>
        <span className="display text-xl leading-none">{conf.mark}</span>
        <div className="h-6 w-px bg-current opacity-30" />
        <div>
          <div className="eyebrow text-current opacity-70 leading-none mb-0.5">{conf.label}</div>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      </div>
    </div>
  );
}
