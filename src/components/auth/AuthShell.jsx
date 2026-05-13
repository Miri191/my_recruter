import { Sparkles } from 'lucide-react';

export default function AuthShell({ children, eyebrow, title, subtitle, footer }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 border-2 border-ink bg-paper-light flex items-center justify-center">
          <Sparkles size={20} className="text-petrol" />
        </div>
        <div>
          <div className="display text-3xl text-ink leading-none" dir="ltr">
            Persona
          </div>
          <div className="text-[11px] tracking-wider2 uppercase text-ink-mute mt-1">
            אבחון אישיותי
          </div>
        </div>
      </div>

      <div className="w-full max-w-[440px]">
        <div className="bg-paper-light border-2 border-ink shadow-petrol p-7 md:p-9 animate-fade-up">
          {eyebrow && <div className="eyebrow-petrol mb-2">{eyebrow}</div>}
          {title && <h1 className="display text-3xl text-ink mb-2">{title}</h1>}
          {subtitle && (
            <p className="text-[14px] text-ink-soft leading-relaxed mb-6">{subtitle}</p>
          )}
          {children}
        </div>
        {footer && (
          <div className="text-center text-[12px] text-ink-mute mt-5 leading-relaxed">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthInput({ label, hint, error, type = 'text', dir, ...props }) {
  return (
    <label className="block mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="eyebrow">{label}</span>
        {hint && <span className="text-[11px] text-ink-mute">{hint}</span>}
      </div>
      <input
        type={type}
        dir={dir}
        className={`w-full h-11 px-3 bg-paper border-2 text-[15px] transition-colors focus:outline-none
          ${error
            ? 'border-oxblood focus:border-oxblood'
            : 'border-ink-line focus:border-petrol'}
        `}
        {...props}
      />
      {error && (
        <span className="text-[12px] text-oxblood mt-1.5 block">{error}</span>
      )}
    </label>
  );
}

export function AuthError({ children }) {
  if (!children) return null;
  return (
    <div className="px-3 py-2 bg-oxblood-tint border border-oxblood/40 text-oxblood text-[13px] mb-4">
      {children}
    </div>
  );
}

export function AuthSuccess({ children }) {
  if (!children) return null;
  return (
    <div className="px-3 py-2 bg-forest-tint border border-forest/40 text-forest text-[13px] mb-4">
      {children}
    </div>
  );
}
