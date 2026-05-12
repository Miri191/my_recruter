const variants = {
  primary:
    'bg-petrol text-paper-light border border-petrol hover:bg-petrol-soft hover:shadow-ink-sm hover:-translate-x-px hover:-translate-y-px active:translate-x-0 active:translate-y-0 active:shadow-none',
  secondary:
    'bg-paper-light text-ink border border-ink hover:bg-ink hover:text-paper-light',
  ghost:
    'bg-transparent text-ink-soft border border-transparent hover:border-ink-line hover:text-ink',
  accent:
    'bg-brick text-paper-light border border-brick hover:bg-brick-soft hover:shadow-ink-sm hover:-translate-x-px hover:-translate-y-px',
  outline:
    'bg-transparent text-petrol border border-petrol hover:bg-petrol hover:text-paper-light',
  danger:
    'bg-transparent text-oxblood border border-oxblood hover:bg-oxblood hover:text-paper-light',
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
        uppercase tracking-widish whitespace-nowrap
        transition-all duration-150 ease-out touch-manipulation select-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none
        focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol
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
