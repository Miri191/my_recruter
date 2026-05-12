export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-14 px-6 bg-white rounded-xl border border-dashed border-gray-200">
      {icon && (
        <div className="mx-auto w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
