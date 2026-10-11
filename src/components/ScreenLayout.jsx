import GoogleIcon from "./GoogleIcon.jsx";
import { useEffect, useRef, useState } from "react";
import { skinOptions, themeOptions } from "../config/appConfig.js";

export default function ScreenLayout({
  children,
  showBack,
  onBack,
  onHome,
  screen,
  isCardScreen,
  isCardRevealed,
  theme,
  skin,
  onThemeChange,
  onSkinChange,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const touchStartY = useRef(null);

  useEffect(() => {
    setHeaderHidden(false);
  }, [screen]);

  useEffect(() => {
    if (isCardRevealed) setHeaderHidden(true);
  }, [isCardRevealed]);

  useEffect(() => {
    if (!isCardScreen) return undefined;

    const handleWheel = (event) => {
      if (event.deltaY < -8) setHeaderHidden(false);
      if (event.deltaY > 8) setHeaderHidden(true);
    };
    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };
    const handleTouchEnd = (event) => {
      const endY = event.changedTouches[0]?.clientY;
      if (touchStartY.current === null || endY === undefined) return;

      const movement = endY - touchStartY.current;
      if (movement > 24) setHeaderHidden(false);
      if (movement < -24) setHeaderHidden(true);
      touchStartY.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isCardScreen]);

  return (
    <main className="app-shell" data-theme={theme} data-skin={skin}>
      <div className={`app-frame ${headerHidden ? "is-header-hidden" : ""}`}>
        <header className={`header ${headerHidden ? "is-hidden" : ""}`}>
          {showBack ? (
            <button
              className="btn icon"
              onClick={onBack}
              aria-label="이전 화면으로"
            >
              <GoogleIcon name="arrow_left_alt" size={24} />
            </button>
          ) : (
            <button
              className="btn brand-mark"
              onClick={onHome}
              aria-label="인트로로 이동"
            >
              <span className="brand-dot" aria-hidden="true">
                ❋
              </span>
              <span>MOCA</span>
            </button>
          )}
          <div className="header-actions">
            <button
              className={`btn icon settings-toggle ${settingsOpen ? "is-active" : ""}`}
              onClick={() => setSettingsOpen((open) => !open)}
              aria-label="설정"
              aria-expanded={settingsOpen}
              aria-controls="appearance-settings"
            >
              <GoogleIcon name="settings" size={20} filled />
            </button>
            {settingsOpen && (
              <div
                className="popup-wrap"
                onClick={() => setSettingsOpen(false)}
              >
                <section
                  className="popup"
                  id="appearance-settings"
                  aria-label="화면 설정"
                  role="dialog"
                  aria-modal="true"
                  onClick={(event) => event.stopPropagation()}
                >
                  <header className="popup-header">
                    <span>Settings</span>
                    <button
                      type="button"
                      className="btn icon small btn-close"
                      onClick={() => setSettingsOpen(false)}
                      aria-label="설정 닫기"
                    >
                      <GoogleIcon name="close" size={20} />
                    </button>
                  </header>
                  <div className="popup-inner">
                    <div className="settings-group">
                      <h4>테마</h4>
                      <div className="theme-options">
                        {themeOptions.map((option) => (
                          <button
                            key={option.id}
                            className={`btn theme-option theme-option-${option.id} ${theme === option.id ? "selected" : ""}`}
                            onClick={() => onThemeChange(option.id)}
                            aria-pressed={theme === option.id}
                          >
                            <GoogleIcon name={option.icon} size={20} />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="settings-group">
                      <h4>스킨</h4>
                      <div className="skin-options">
                        {skinOptions.map((option) => (
                          <button
                            key={option.id}
                            className={`btn skin-option ${skin === option.id ? "selected" : ""}`}
                            onClick={() => onSkinChange(option.id)}
                            aria-pressed={skin === option.id}
                          >
                            <GoogleIcon name={option.icon} size={18} />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <footer className="popup-footer">
                    <button
                      className="btn line"
                      onClick={() => setSettingsOpen(false)}
                    >
                      닫기
                    </button>
                  </footer>
                </section>
              </div>
            )}
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
