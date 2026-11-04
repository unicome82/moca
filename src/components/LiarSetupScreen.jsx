import { useTranslation } from "react-i18next";
import useCards from "../hooks/useCards.js";
import GoogleIcon from "./GoogleIcon.jsx";

export default function LiarSetupScreen({
  playerCount,
  categoryId,
  onPlayerCountChange,
  onCategoryChange,
  onStart,
}) {
  const { t } = useTranslation();
  const { liarCategories } = useCards();

  return (
    <section className="draw-page">
      <div className="draw-heading">
        <h1>{t("liarSetup.title")}</h1>
        <p>{t("liarSetup.description")}</p>
      </div>
      <div className="setup-section">
        <div className="eyebrow">{t("liarSetup.players", { min: 3, max: 12 })}</div>
        <div className="player-picker">
          <button
            className="btn white icon"
            onClick={() => onPlayerCountChange(Math.max(3, playerCount - 1))}
            aria-label={t("liarSetup.decrease")}
          >
            <GoogleIcon name="remove" size={24} />
          </button>
          <strong>{playerCount}</strong>
          <button
            className="btn white icon"
            onClick={() => onPlayerCountChange(Math.min(12, playerCount + 1))}
            aria-label={t("liarSetup.increase")}
          >
            <GoogleIcon name="add" size={24} />
          </button>
        </div>
      </div>
      <div className="setup-section category-section">
        <div className="eyebrow">{t("liarSetup.category")}</div>
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
        {t("liarSetup.start")}
      </button>
    </section>
  );
}
