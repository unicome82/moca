import { useState } from "react";
import { useTranslation } from "react-i18next";
import CardFlip from "./CardFlip.jsx";
import GoogleIcon from "./GoogleIcon.jsx";

export default function LiarGameScreen({
  playerCount,
  categoryName,
  keyword,
  liarIndex,
  playerIndex,
  stage,
  onReveal,
  onHide,
  onHandoffComplete,
  onStartLiarSelection,
  onRevealLiar,
  onRevealKeyword,
  onRestart,
}) {
  const { t } = useTranslation();
  const [selectedLiarIndex, setSelectedLiarIndex] = useState(null);
  const isLastPlayer = playerIndex === playerCount - 1;
  const isLiarReady = stage === "liar-ready";
  const isRevealed =
    stage === "shown" || stage === "liar-reveal" || stage === "keyword";
  const isLiarCheck = stage === "liar-check";
  const isLiarReveal = stage === "liar-reveal";
  const isKeywordReveal = stage === "keyword";
  const isResult = isLiarReveal || isKeywordReveal;
  const isLiar = playerIndex === liarIndex;

  const handleHandoffTransitionEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      event.propertyName === "transform" &&
      stage === "handoff"
    ) {
      onHandoffComplete();
    }
  };

  const title = isKeywordReveal
    ? t("liarGame.title.keyword") // 키워드 공개
    : isLiarReveal
      ? selectedLiarIndex === liarIndex
        ? t("liarGame.title.correct") // 라이어 맞추기를 성공했을 때
        : t("liarGame.title.wrong", { number: liarIndex + 1 }) // 라이어 맞추기를 실패했을 때
      : isLiarCheck
        ? t("liarGame.title.choose") // 라이어 번호 선택 단계
        : isLiarReady
          ? t("liarGame.title.allChecked") // 키워드 모두 확인
          : stage === "pass"
            ? t("liarGame.title.pass") // 다음 플레이어 카드확인
            : t("liarGame.title.shown"); // 키워드 확인
  const description = isKeywordReveal
    ? "" // 키워드 공개 설명 문구
    : isLiarReveal
      ? "" // 라이어 결과 설명 문구
      : isLiarCheck
        ? t("liarGame.description.choose") // 라이어 선택
        : isLiarReady
          ? t("liarGame.description.allChecked") // 키워드 모두 확인
          : stage === "pass"
            ? "" // 카드 확인 전
            : t("liarGame.description.shown"); // 키워드 확인 후

  return (
    <section
      className={`draw-page draw-liar ${stage === "pass" ? "is-waiting" : ""}`}
    >
      <div className="draw-heading">
        <span className="eyebrow">LIAR GAME</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className={`draw-stage ${isLiarReady ? "liar-guess-panel" : ""}`}>
        {isLiarReady ? null : isLiarCheck ? (
          <div
            className="select-wrap liar-guess-panel"
            role="group"
            aria-label={t("liarGame.pickerLabel")}
          >
            {Array.from({ length: playerCount }, (_, index) => (
              <button
                key={index}
                type="button"
                className={`btn white option ${selectedLiarIndex === index ? "selected" : ""}`}
                aria-pressed={selectedLiarIndex === index}
                onClick={() => setSelectedLiarIndex(index)}
              >
                {t("liarGame.playerNumber", { number: index + 1 })}
              </button>
            ))}
          </div>
        ) : isLiarReveal ? (
          <div className="liar-guess-panel liar-result-panel">
            <p className="liar-guess-result">
              {selectedLiarIndex === liarIndex
                ? t("liarGame.liarWinsIfKeyword") // 라이어를 맞혔을 때
                : t("liarGame.liarWins")}
            </p>
          </div>
        ) : (
          <CardFlip
            deckId="liar"
            isFlipped={isRevealed}
            className={`${stage === "handoff" ? "is-handoff" : ""} ${isKeywordReveal ? "liar-guess-panel" : ""}`}
            onClick={stage === "pass" ? onReveal : undefined}
            onTransitionEnd={handleHandoffTransitionEnd}
            aria-label={
              isRevealed ? t("liarGame.keywordRevealed") : t("liarGame.checkKeyword")
            }
            backContent={
              <span className="card-back-mark">

                <span className="card-back-ornament">
                  <span className="card-back-brand">MOCA</span>
                  <span className="card-back-game" lang="en">LIAR GAME</span>
                </span>
                <span className="card-back-star" aria-hidden="true">✦</span>
                <span className="card-back-tagline">{t("common.tagline")}</span>
                <span className="card-back-logo" aria-hidden="true">MOCA</span>
                <span className="card-back-bottom">
                  {t("liarGame.player", { number: playerIndex + 1 })}
                </span>
              </span>
            }
            frontContent={
              <>
                <span className="card-front-symbol">❋</span>
                <span className="card-front-tag">MOCA</span>
                <span className="card-prompt">
                  {isLiarReveal
                    ? t("liarGame.liarIs", { number: liarIndex + 1 }) // 라이어 공개
                    : isKeywordReveal
                      ? keyword // 키워드 공개
                      : isLiar
                        ? t("liarGame.youAreLiar") // 라이어 카드
                        : keyword}
                </span>
                <span className="eyebrow">
                  {isLiarReveal
                    ? t("liarGame.liarWinsIfKeyword")
                    : isKeywordReveal
                      ? ``
                      : `[ ${categoryName} ]`}
                </span>
              </>
            }
          />
        )}
      </div>

      <div className={`draw-bottom ${""}`}>
        {isLiarReady && (
          <button className="btn black" onClick={onStartLiarSelection}>
            {t("liarGame.chooseLiar")}
          </button>
        )}
        {/* {stage === "pass" && (
          <button className="btn black" onClick={onReveal}>
            {t("liarGame.title.pass")}
          </button>
        )} */}
        {stage === "shown" && (
          <button className="btn line" onClick={onHide}>
            {t("liarGame.checked")}
          </button>
        )}
        {isLiarCheck && (
          <button
            className="btn black"
            onClick={() => onRevealLiar(selectedLiarIndex)}
            disabled={selectedLiarIndex === null}
          >
            {t("liarGame.checkLiar")}
          </button>
        )}
        {isLiarReveal && (
          <button className="btn black" onClick={onRevealKeyword}>
            {t("liarGame.checkKeyword")}
          </button>
        )}
        {isKeywordReveal && (
          <>
            <button className="btn line" onClick={onRestart}>
              <GoogleIcon name="refresh" size={20} /> {t("liarGame.restart")}{" "}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
