export default function GoogleIcon({ name, size = 24, filled = false, className = '' }) {
  return <span className={`google-symbol${filled ? ' is-filled' : ''} ${className}`} style={{ fontSize: size }} aria-hidden="true">{name}</span>;
}
