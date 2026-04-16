function MessageBanner({ type = "success", message }) {
  if (!message) return null;
  return <p className={`message ${type}`}>{message}</p>;
}

export default MessageBanner;
