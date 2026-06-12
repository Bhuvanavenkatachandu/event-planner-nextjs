import Link from 'next/link';

export default function EmptyState({ icon = '🗂', title = 'Nothing Here', message = '', actionLabel, actionHref }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary mt-4">{actionLabel}</Link>
      )}
    </div>
  );
}
