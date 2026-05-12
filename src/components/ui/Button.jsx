const variants = {
  primary:
    'bg-ink text-paper border border-ink hover:bg-ink-soft hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-ink-sm active:translate-x-0 active:translate-y-0 active:shadow-none',
  secondary:
    'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper',
  ghost:
    'bg-transparent text-ink-soft border border-transparent hover:border-ink-line hover:text-ink',
  accent:
    'bg-oxblood text-paper border border-oxblood hover:bg-oxblood-soft',
  danger:
    'bg-transparent text-oxblood border border-oxblood hover:bg-oxblood hover:text-paper',
};

const sizes = {
  sm: 'h-9 px-3 text-[12px]',
  md: 'h-11 px-5 text-[13px]',
  lg: 'h-12 px-6 text-[14px]',
  xl: 'h-14 px-8 text-[15px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2.5 font-medium
        uppercase tracking-widish
        transition-all duration-150 ease-out touch-manipulation select-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none
        focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
