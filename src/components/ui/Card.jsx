export default function Card({
  children,
  className = '',
  padding = 'p-6',
  as: Tag = 'div',
  hover = false,
  variant = 'default',
  ...props
}) {
  const variants = {
    default: 'bg-paper-light border border-ink-line',
    ink: 'bg-paper-light border border-ink',
    plain: 'bg-transparent border border-ink-line',
  };
  return (
    <Tag
      className={`
        ${variants[variant]}
        ${padding}
        ${hover ? 'transition-all duration-200 hover:border-ink hover:shadow-ink-sm hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer' : ''}
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
