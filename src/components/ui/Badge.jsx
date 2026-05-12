const tones = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  accent: 'bg-accent-50 text-accent-700 border-accent-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  pink: 'bg-pink-50 text-pink-700 border-pink-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export default function Badge({
  children,
  tone = 'default',
  size = 'sm',
  className = '',
  leftIcon,
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${tones[tone] || tones.default}
        ${sizes[size]}
        ${className}
      `}
    >
      {leftIcon}
      {children}
    </span>
  );
}
