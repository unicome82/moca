import { useState } from "react";
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
    ? "키워드를 공개합니다" // 키워드 공개
    : isLiarReveal
      ? selectedLiarIndex === liarIndex
        ? "정답입니다" // 라이어 맞추기를 성공했을 때
        : `라이어는 ${liarIndex + 1}번입니다` // 라이어 맞추기를 실패했을 때
      : isLiarCheck
        ? "라이어를 선택하세요" // 라이어 번호 선택 단계
        : isLiarReady
          ? "키워드를 모두 확인했습니다" // 키워드 모두 확인
          : stage === "pass"
            ? "카드를 확인하세요" // 다음 플레이어 카드확인
            : "확인했어요"; // 키워드 확인
  const description = isKeywordReveal
    ? "" // 키워드 공개 설명 문구
    : isLiarReveal
      ? "" // 라이어 결과 설명 문구
      : isLiarCheck
        ? "라이어라고 생각되는 번호를 선택해주세요" // 라이어 선택
        : isLiarReady
          ? "토론 후 라이어를 선택해주세요" // 키워드 모두 확인
          : stage === "pass"
            ? "" // 카드 확인 전
            : "카드를 가리고 다음 플레이어에게 건네주세요"; // 키워드 확인 후

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
            aria-label="라이어 번호 선택"
          >
            {Array.from({ length: playerCount }, (_, index) => (
              <button
                key={index}
                type="button"
                className={`btn white option ${selectedLiarIndex === index ? "selected" : ""}`}
                aria-pressed={selectedLiarIndex === index}
                onClick={() => setSelectedLiarIndex(index)}
              >
                {index + 1}번
              </button>
            ))}
          </div>
        ) : isLiarReveal ? (
          <div className="liar-guess-panel liar-result-panel">
            <p className="liar-guess-result">
              {selectedLiarIndex === liarIndex
                ? "키워드를 맞추면 라이어가 승리합니다" // 라이어를 맞혔을 때
                : "라이어가 승리하였습니다"}
            </p>
          </div>
        ) : (
          <CardFlip
            isFlipped={isRevealed}
            className={`${stage === "handoff" ? "is-handoff" : ""} ${isKeywordReveal ? "liar-guess-panel" : ""}`}
            onClick={stage === "pass" ? onReveal : undefined}
            onTransitionEnd={handleHandoffTransitionEnd}
            aria-label={
              isRevealed ? "키워드가 공개됐습니다" : "키워드 확인하기"
            }
            backContent={
              <span className="card-back-mark">

                <span className="card-back-ornament">
                  <span className="card-back-brand">MOCA</span>
                  <span className="card-back-game" lang="en">LIAR GAME</span>
                </span>
                <span className="card-back-star" aria-hidden="true">✦</span>
                <span className="card-back-tagline">세상의 모든 카드</span>
                <span className="card-back-logo" aria-hidden="true">MOCA</span>
                <span className="card-back-bottom">
                  {playerIndex + 1}번 플레이어
                </span>
              </span>
            }
            frontContent={
              <>
                <span className="card-front-symbol">❋</span>
                <span className="card-front-tag">MOCA</span>
                <span className="card-prompt">
                  {isLiarReveal
                    ? `라이어는 ${liarIndex + 1}번 입니다` // 라이어 공개
                    : isKeywordReveal
                      ? keyword // 키워드 공개
                      : isLiar
                        ? "당신은 라이어입니다" // 라이어 카드
                        : keyword}
                </span>
                <span className="eyebrow">
                  {isLiarReveal
                    ? "키워드를 맞추면 라이어가 승리합니다"
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
            라이어 선택하기
          </button>
        )}
        {/* {stage === "pass" && (
          <button className="btn black" onClick={onReveal}>
            카드 확인하기
          </button>
        )} */}
        {stage === "shown" && (
          <button className="btn line" onClick={onHide}>
            확인했어요
          </button>
        )}
        {isLiarCheck && (
          <button
            className="btn black"
            onClick={() => onRevealLiar(selectedLiarIndex)}
            disabled={selectedLiarIndex === null}
          >
            라이어 확인하기
          </button>
        )}
        {isLiarReveal && (
          <button className="btn black" onClick={onRevealKeyword}>
            키워드 확인하기
          </button>
        )}
        {isKeywordReveal && (
          <>
            <button className="btn line" onClick={onRestart}>
              <GoogleIcon name="refresh" size={20} /> 게임 다시하기{" "}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
