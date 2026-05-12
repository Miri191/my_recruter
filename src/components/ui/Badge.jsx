const tones = {
  default: 'border-ink-line text-ink-soft bg-paper-light',
  ink: 'border-ink text-paper-light bg-ink',
  outline: 'border-ink text-ink bg-paper-light',
  petrol: 'border-petrol/40 text-petrol bg-petrol-tint',
  petrolSolid: 'border-petrol text-paper-light bg-petrol',
  brick: 'border-brick/40 text-brick-deep bg-brick-tint',
  brickSolid: 'border-brick text-paper-light bg-brick',
  forest: 'border-forest/40 text-forest bg-forest-tint',
  ochre: 'border-ochre/40 text-ochre bg-ochre-tint',
  oxblood: 'border-oxblood/40 text-oxblood bg-oxblood-tint',
  success: 'border-forest/40 text-forest bg-forest-tint',
  warning: 'border-ochre/50 text-ochre bg-ochre-tint',
  danger: 'border-oxblood/40 text-oxblood bg-oxblood-tint',
  primary: 'border-petrol/40 text-petrol bg-petrol-tint',
  accent: 'border-brick/40 text-brick-deep bg-brick-tint',
  purple: 'border-petrol/40 text-petrol bg-petrol-tint',
  pink: 'border-brick/40 text-brick-deep bg-brick-tint',
  teal: 'border-forest/40 text-forest bg-forest-tint',
  blue: 'border-petrol/40 text-petrol bg-petrol-tint',
  amber: 'border-ochre/50 text-ochre bg-ochre-tint',
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
