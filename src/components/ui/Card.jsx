export default function Card({
  children,
  className = '',
  padding = 'p-6',
  as: Tag = 'div',
  hover = false,
  ...props
}) {
  return (
    <Tag
      className={`
        bg-white rounded-xl border border-gray-100 shadow-card
        ${padding}
        ${hover ? 'transition-all duration-200 hover:shadow-lift hover:border-primary-200 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div>
        {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
