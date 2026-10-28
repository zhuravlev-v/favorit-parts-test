function EmptyState({ message }) {
  return (
    <div className="alert theme-secondary" role="status">
      {message}
    </div>
  )
}

export default EmptyState
