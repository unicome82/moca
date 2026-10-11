import { liarCategories } from "../data/decks.js";
import GoogleIcon from "./GoogleIcon.jsx";

export default function LiarSetupScreen({
  playerCount,
  categoryId,
  onPlayerCountChange,
  onCategoryChange,
  onStart,
}) {
  return (
    <section className="draw-page">
      <div className="draw-heading">
        <h1>라이어게임</h1>
        <p>인원과 카테고리를 선택해주세요.</p>
      </div>
      <div className="setup-section">
        <div className="eyebrow">인원 (3명 ~ 12명)</div>
        <div className="player-picker">
          <button
            className="btn white icon small"
            onClick={() => onPlayerCountChange(Math.max(3, playerCount - 1))}
            aria-label="인원 줄이기"
          >
            <GoogleIcon name="remove" size={24} />
          </button>
          <strong>{playerCount}</strong>
          <button
            className="btn white icon small"
            onClick={() => onPlayerCountChange(Math.min(12, playerCount + 1))}
            aria-label="인원 늘리기"
          >
            <GoogleIcon name="add" size={24} />
          </button>
        </div>
      </div>
      <div className="setup-section category-section">
        <div className="eyebrow">카테고리</div>
        <div className="select-wrap">
          {liarCategories.map((category) => (
            <button
              className={`btn white option ${categoryId === category.id ? "selected" : ""}`}
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      <button className="btn black" onClick={onStart}>
        게임 시작하기
      </button>
    </section>
  );
}
