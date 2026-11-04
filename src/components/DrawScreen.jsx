import { useState } from "react";
import { useTranslation } from "react-i18next";
import { decks } from "../data/decks.js";
import useCards from "../hooks/useCards.js";
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
  const { t } = useTranslation();
  const [hasRevealedCard, setHasRevealedCard] = useState(false);
  const deck = decks.find(({ id }) => id === deckId);
  const collection = useCards().collections[deckId];
  const card = collection?.[cardIndex] ?? collection?.[0];
  const flipped = revealStage === "revealed";
  const isQuestion = deckId === "ice";
  const isBalance = deckId === "balance";
  const isShortBalanceChoices =
    isBalance &&
    [card?.optionA, card?.optionB].every(
      (choice) => Array.from(choice?.replace(/\s/g, "") ?? "").length <= 4,
    );

  if (!deck || !card) {
    return (
      <section className="draw-page draw-empty-state">
        <h1>{t("draw.loadErrorTitle")}</h1>
        <p>{t("draw.loadErrorBody")}</p>
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
        <h1>{t(`decks.${deck.id}.title`)}</h1>
        <p>
          {t(`draw.guide.${deckId}`)}
        </p>
      </div>
      <div className="draw-stage">
        <CardFlip
          deckId={deckId}
          isFlipped={flipped}
          className={revealStage === "replacing" ? "is-replacing" : ""}
          onClick={handleCardClick}
          onTransitionEnd={handleFlipTransitionEnd}
          aria-label={flipped ? t("draw.next") : t(`draw.reveal.${deckId}`)}
          backContent={
            <span className="card-back-mark">

              <span className="card-back-ornament" aria-hidden="true">
                <span className="card-back-brand">MOCA</span>
                <span className="card-back-game" lang="en">{deck.en}</span>
              </span>
              <span className="card-back-star" aria-hidden="true">✦</span>
              <span className="card-back-tagline">{t("common.tagline")}</span>
              <span className="card-back-logo" aria-hidden="true">MOCA</span>
            </span>
          }
          frontContent={
            <>
              <span className="card-front-symbol">❋</span>
              <span className="card-front-tag">MOCA</span>
              {isBalance ? (
                <span className="card-prompt balance-prompt">
                  {card.question && (
                    <span className="balance-question">{card.question}</span>
                  )}
                  <span
                    className={`balance-choices${
                      isShortBalanceChoices ? " " : " is-stacked"
                    }`}
                  >
                    <span className="balance-choice">{card.optionA}</span>
                    <span className="balance-vs" aria-hidden="true">
                      VS
                    </span>
                    <span className="balance-choice">{card.optionB}</span>
                  </span>
                </span>
              ) : (
                <span className="card-prompt">
                  {isQuestion ? card.question : card.solution}
                </span>
              )}
            </>
          }
        />
      </div>
      <div className="draw-bottom">
        <span className="draw-hint">
          {flipped || hasRevealedCard ? t("draw.hintNext") : t("draw.hintFlip")}
        </span>
      </div>
    </section>
  );
}
