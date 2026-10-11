import GoogleIcon from "./GoogleIcon.jsx";
import { decks } from "../data/decks.js";

export default function MainListScreen({ onNavigate }) {
  return (
    <section className="home-page">
      <div className="welcome-row">
        <div>
          <h1>어떤 카드를 뽑아볼까요?</h1>
          <span className="eyebrow">원하는 주제를 눌러주세요</span>
        </div>
      </div>
      <div className="deck-list">
        {decks.map((deck) => {
          const target = deck.id === "liar" ? "liar-setup" : deck.id;
          return (
            <a
              className="deck-card"
              key={deck.id}
              href={`?screen=${target}`}
              aria-label={`${deck.title} 화면 열기`}
              onClick={(event) => {
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) return;

                event.preventDefault();
                onNavigate(target);
              }}
            >
              <div className="deck-content">
                <span className="deck-en">{deck.en}</span>
                <h2>{deck.title}</h2>
                <p>
                  {deck.copy.split("\n").map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
              <span className="deck-symbol" aria-hidden="true">
                <GoogleIcon name={deck.icon} size={40} />
              </span>
            </a>
          );
        })}
      </div>
      <footer className="site-footer">
        <span className="copyright">
          COPYRIGHT MOCA © 2026. ALL RIGHT RESERVED.
        </span>
      </footer>
    </section>
  );
}
