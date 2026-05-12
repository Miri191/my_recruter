export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6 bg-paper-light border border-ink-line">
      {icon && (
        <div className="mx-auto w-12 h-12 border border-ink text-ink flex items-center justify-center mb-5">
          {icon}
        </div>
      )}
      <div className="eyebrow mb-3">פנקס ריק</div>
      {title && <h3 className="display text-2xl text-ink mb-2">{title}</h3>}
      <div className="rule mx-auto w-12 my-4" />
      {description && (
        <p className="text-sm text-ink-soft max-w-sm mx-auto mb-6 leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
