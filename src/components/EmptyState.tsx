interface EmptyStateProps {
  title: string
  message: string
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  )
}
