import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const tones = {
  success: { icon: CheckCircle2, classes: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  warning: { icon: AlertTriangle, classes: 'bg-amber-50 border-amber-200 text-amber-800' },
  info: { icon: Info, classes: 'bg-primary-50 border-primary-200 text-primary-800' },
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
  const Icon = conf.icon;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lift ${conf.classes}`}>
        <Icon size={18} />
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
