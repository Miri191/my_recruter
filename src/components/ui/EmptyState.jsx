export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6 bg-paper-light border border-ink-line">
      {icon && (
        <div className="mx-auto w-12 h-12 border-2 border-petrol text-petrol flex items-center justify-center mb-5">
          {icon}
        </div>
      )}
      <div className="eyebrow-petrol mb-3">פנקס ריק</div>
      {title && <h3 className="display text-2xl text-ink mb-2">{title}</h3>}
      <div className="rule-petrol mx-auto w-16 my-4" />
      {description && (
        <p className="text-sm text-ink-soft max-w-sm mx-auto mb-6 leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
