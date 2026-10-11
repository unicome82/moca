/** Shared two-sided card. Each screen supplies its own face content. */
export default function CardFlip({
  isFlipped = false,
  className = "",
  onClick,
  onTransitionEnd,
  ariaLabel,
  backContent,
  frontContent,
}) {
  const classes = ["draw-card", isFlipped && "is-flipped", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="draw-card-inner" onTransitionEnd={onTransitionEnd}>
        <span className="card-face card-back">{backContent}</span>
        <span className="card-face card-front">{frontContent}</span>
      </span>
    </button>
  );
}
