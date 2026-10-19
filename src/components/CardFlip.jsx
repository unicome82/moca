import { useState } from "react";
import { prismShapes } from "../themes/prismShapes.js";

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
  const [folioColor] = useState(() => Math.floor(Math.random() * 5));
  const [retroColor] = useState(() => Math.floor(Math.random() * 2));
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
        <span className="card-face card-back" data-folio-color={folioColor} data-retro-color={retroColor}>
          <span className="card-back-skin" aria-hidden="true" />
          <span className="prism-backdrop" aria-hidden="true">
            {prismShapes.map(({ tone, style }) => (
              <span className="prism-backdrop-shape" key={tone} data-tone={tone} style={style} />
            ))}
          </span>
          <span className="shape-backdrop" aria-hidden="true">
            {[0, 1, 2, 3].map(index => <span className="shape" key={index} />)}
          </span>
          {backContent}
        </span>
        <span className="card-face card-front">{frontContent}</span>
      </span>
    </button>
  );
}
