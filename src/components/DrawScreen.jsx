import { useState } from "react";
import { cardCollections, decks } from "../data/decks.js";
import CardFlip from "./CardFlip.jsx";
import GoogleIcon from "./GoogleIcon.jsx";

export default function DrawScreen({
  deckId,
  cardIndex,
  revealStage,
  onReveal,
  onReplace,
  onReplaceComplete,
}) {
  const [hasRevealedCard, setHasRevealedCard] = useState(false);
  const deck = decks.find(({ id }) => id === deckId);
  const collection = cardCollections[deckId];
  const card = collection?.[cardIndex] ?? collection?.[0];
  const flipped = revealStage === "revealed";
  const isQuestion = deckId === "ice";

  if (!deck || !card) {
    return (
      <section className="draw-page draw-empty-state">
        <h1>카드를 불러오지 못했어요.</h1>
        <p>메인 화면에서 다시 선택해 주세요.</p>
      </section>
    );
  }

  const handleCardClick = () => {
    if (revealStage === "revealed") onReplace();
    if (revealStage === "hidden" || revealStage === "replacing") {
      setHasRevealedCard(true);
      onReveal();
    }
  };

  const handleFlipTransitionEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      event.propertyName === "transform" &&
      revealStage === "replacing"
    ) {
      onReplaceComplete();
    }
  };

  return (
    <section className={`draw-page draw-${deck.type}`}>
      <div className="draw-heading">
        <span className="eyebrow">{deck.en}</span>
        <h1>{deck.title}</h1>
        <p>
          {isQuestion
            ? "카드를 눌러 질문을 확인하세요."
            : "카드를 눌러 해결책을 확인하세요."}
        </p>
      </div>
      <div className="draw-stage">
        <CardFlip
          isFlipped={flipped}
          className={revealStage === "replacing" ? "is-replacing" : ""}
          onClick={handleCardClick}
          onTransitionEnd={handleFlipTransitionEnd}
          aria-label={
            flipped
              ? "다음 카드 뽑기"
              : isQuestion
                ? "질문 보기"
                : "해결책 보기"
          }
          backContent={
            <span className="card-back-mark">
              <span className="card-back-symbol">❋</span>
              <span className="card-back-ornament" aria-hidden="true">
                MOCA
              </span>
            </span>
          }
          frontContent={
            <>
              <span className="card-front-symbol">❋</span>
              <span className="card-front-tag">MOCA</span>
              <span className="card-prompt">
                {isQuestion ? card.question : card.solution}
              </span>
            </>
          }
        />
      </div>
      <div className="draw-bottom">
        <span className="draw-hint">
          {flipped || hasRevealedCard
            ? "카드를 눌러 다음 내용을 확인하세요."
            : "카드를 눌러 뒤집어 보세요."}
        </span>
      </div>
    </section>
  );
}
