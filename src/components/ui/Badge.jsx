const tones = {
  default: 'border-ink-line text-ink-soft bg-paper-light',
  ink: 'border-ink text-paper bg-ink',
  outline: 'border-ink text-ink bg-transparent',
  oxblood: 'border-oxblood text-oxblood bg-oxblood-ghost',
  sage: 'border-sage text-sage bg-sage-ghost',
  ochre: 'border-ochre text-ochre bg-ochre-ghost',
  success: 'border-sage text-sage bg-sage-ghost',
  warning: 'border-ochre text-ochre bg-ochre-ghost',
  danger: 'border-oxblood text-oxblood bg-oxblood-ghost',
  primary: 'border-ink text-ink bg-transparent',
  accent: 'border-oxblood text-oxblood bg-oxblood-ghost',
  purple: 'border-ink text-ink-soft bg-paper-dark',
  pink: 'border-oxblood text-oxblood bg-oxblood-ghost',
  teal: 'border-sage text-sage bg-sage-ghost',
  blue: 'border-ink-mute text-ink-soft bg-paper-light',
  amber: 'border-ochre text-ochre bg-ochre-ghost',
};

const sizes = {
  sm: 'text-[10px] tracking-wider2 px-2 py-[3px]',
  md: 'text-[11px] tracking-wider2 px-2.5 py-1',
  lg: 'text-[12px] tracking-wider2 px-3 py-1.5',
};

export default function Badge({
  children,
  tone = 'default',
  size = 'sm',
  className = '',
  leftIcon,
  ...props
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border font-medium uppercase
        ${tones[tone] || tones.default}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {leftIcon}
      {children}
    </span>
  );
}
