function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert theme-danger" role="alert">
      <p className="mb-3">{message || 'Не удалось выполнить запрос.'}</p>
      <button
        className="btn-outline btn-sm theme-danger"
        type="button"
        onClick={onRetry}
      >
        Повторить запрос
      </button>
    </div>
  )
}

export default ErrorMessage
