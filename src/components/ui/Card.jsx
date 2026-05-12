export default function Card({
  children,
  className = '',
  padding = 'p-6',
  as: Tag = 'div',
  hover = false,
  variant = 'default',
  accent,
  ...props
}) {
  const variants = {
    default: 'bg-paper-light border border-ink-line',
    elev: 'card-elev',
    ink: 'bg-paper-light border border-ink',
    plain: 'bg-transparent border border-ink-line',
  };
  const accents = {
    petrol: 'border-r-[3px] border-r-petrol',
    brick: 'border-r-[3px] border-r-brick',
    forest: 'border-r-[3px] border-r-forest',
    ochre: 'border-r-[3px] border-r-ochre',
    oxblood: 'border-r-[3px] border-r-oxblood',
    ink: 'border-r-[3px] border-r-ink',
  };
  return (
    <Tag
      className={`
        ${variants[variant]}
        ${accent ? accents[accent] : ''}
        ${padding}
        ${hover ? 'transition-all duration-200 hover:border-ink hover:shadow-ink-sm hover:-translate-x-px hover:-translate-y-px cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ eyebrow, title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        {title && <h2 className="display text-2xl text-ink">{title}</h2>}
        {subtitle && <p className="text-sm text-ink-soft mt-2 leading-relaxed">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
