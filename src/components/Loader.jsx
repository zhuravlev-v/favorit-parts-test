function Loader({ message }) {
  return (
    <div
      className="d-flex align-items-center gap-3 py-3"
      role="status"
      aria-live="polite"
    >
      <span className="spinner-border" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export default Loader
