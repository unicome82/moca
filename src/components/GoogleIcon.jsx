export default function GoogleIcon({ name, size, filled = false, className = '' }) {
  return <span className={`google-symbol${filled ? ' is-filled' : ''} ${className}`} style={{ fontSize: size }} aria-hidden="true">{name}</span>;
}
