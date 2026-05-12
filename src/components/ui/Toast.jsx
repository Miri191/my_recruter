import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const tones = {
  success: {
    mark: '✓',
    label: 'אישור',
    classes: 'bg-forest-tint border-forest text-forest',
    markBg: 'bg-forest text-paper-light',
  },
  warning: {
    mark: '!',
    label: 'שימי לב',
    classes: 'bg-ochre-tint border-ochre text-ochre',
    markBg: 'bg-ochre text-paper-light',
  },
  info: {
    mark: '·',
    label: 'הודעה',
    classes: 'bg-petrol-tint border-petrol text-petrol',
    markBg: 'bg-petrol text-paper-light',
  },
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
      <div className={`flex items-center gap-3 pr-2 pl-5 py-2 border-2 shadow-ink-sm ${conf.classes}`}>
        <span className={`w-8 h-8 inline-flex items-center justify-center text-base ${conf.markBg}`}>
          {conf.mark}
        </span>
        <div>
          <div className="text-[10px] tracking-wider2 uppercase opacity-70 leading-none mb-0.5">{conf.label}</div>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      </div>
    </div>
  );
}
