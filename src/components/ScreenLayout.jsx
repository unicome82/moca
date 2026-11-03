import { assetUrl } from "../utils/assetUrl.js";
import GoogleIcon from "./GoogleIcon.jsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { themeOptions } from "../config/appConfig.js";

export default function ScreenLayout({
  children,
  showBack,
  onBack,
  onHome,
  screen,
  isCardScreen,
  isCardRevealed,
  theme,
  themeImages,
  onThemeChange,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerStuck, setHeaderStuck] = useState(false);
  const touchStartY = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    setHeaderHidden(false);
    if (screen === "intro") setSettingsOpen(false);
  }, [screen]);

  // iOS Safari tints the status bar / toolbar with the body background,
  // so match it to whatever is actually painted at the top of the screen.
  useLayoutEffect(() => {
    const shell = document.querySelector(".app-shell");
    if (!shell) return undefined;

    const isTransparent = (color) =>
      !color || color === "transparent" || /rgba\(.*,\s*0\)$/.test(color);

    const syncSurfaceColor = () => {
      const topElements = document.elementsFromPoint(window.innerWidth / 2, 1);
      const painted = topElements
        .map((element) => getComputedStyle(element).backgroundColor)
        .find((color) => !isTransparent(color));
      const backgroundColor =
        painted || getComputedStyle(shell).getPropertyValue("--ui-bg").trim();
      if (!backgroundColor) return;

      document.documentElement.style.backgroundColor = backgroundColor;
      document.body.style.backgroundColor = backgroundColor;
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.setAttribute("content", backgroundColor);
    };

    syncSurfaceColor();
    const frame = requestAnimationFrame(syncSurfaceColor);
    const timer = setTimeout(syncSurfaceColor, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [theme, screen, headerStuck]);

  // Once the page scrolls, pin the header with a solid background.
  useEffect(() => {
    const syncStuck = () => setHeaderStuck(window.scrollY > 8);
    syncStuck();
    window.addEventListener("scroll", syncStuck, { passive: true });
    return () => window.removeEventListener("scroll", syncStuck);
  }, [screen]);

  // On the landing, the pinned header reuses the intro's own background
  // (color, pattern or photo with its overlay) instead of a flat color.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const props = [
      "backgroundColor",
      "backgroundImage",
      "backgroundSize",
      "backgroundPosition",
      "backgroundRepeat",
      "color",
    ];
    props.forEach((prop) => {
      header.style[prop] = "";
    });
    if (!headerStuck) return;

    const isClear = (color) => /rgba\(.*,\s*0\)$|transparent/.test(color);
    const source = [".theme-landing .intro", ".theme-landing .poster", ".theme-landing"]
      .map((selector) => document.querySelector(selector))
      .find((element) => {
        if (!element) return false;
        const { backgroundColor, backgroundImage } = getComputedStyle(element);
        return backgroundImage !== "none" || !isClear(backgroundColor);
      });
    if (!source) return;

    const style = getComputedStyle(source);
    const overlay = ["::before", "::after"]
      .map((pseudo) => getComputedStyle(source, pseudo))
      .find(
        (pseudo) =>
          pseudo.content !== "none" &&
          !isClear(pseudo.backgroundColor),
      );
    const layers = [style.backgroundImage].filter((layer) => layer !== "none");
    if (overlay) {
      const tint = overlay.backgroundColor;
      layers.unshift(`linear-gradient(${tint}, ${tint})`);
    }

    header.style.backgroundColor = isClear(style.backgroundColor) ? "" : style.backgroundColor;
    header.style.backgroundImage = layers.join(", ") || "none";
    header.style.backgroundSize = overlay ? `auto, ${style.backgroundSize}` : style.backgroundSize;
    header.style.backgroundPosition = overlay
      ? `0 0, ${style.backgroundPosition}`
      : style.backgroundPosition;
    header.style.backgroundRepeat = overlay
      ? `no-repeat, ${style.backgroundRepeat}`
      : style.backgroundRepeat;
    header.style.color = style.color;
  }, [headerStuck, theme, screen]);

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
    <main
      className="app-shell"
      data-theme={theme}
      style={{
        "--theme-pattern-image": assetUrl(`images/heropatterns/${themeImages.pattern}`),
        "--theme-photo-image": assetUrl(`images/skins/${themeImages.photo}`),
        "--theme-illustration-image": assetUrl(`images/skins/${themeImages.illustration}`),
        "--theme-scenery-image": assetUrl(`images/skins/${themeImages.scenery}`),
        "--theme-cutout-image": assetUrl(`images/skins/${themeImages.cutout}`),
      }}
    >
      <div className={`app-frame ${headerHidden ? "is-header-hidden" : ""}`}>
        <header
          ref={headerRef}
          className={`header ${headerHidden ? "is-hidden" : ""} ${headerStuck ? "is-stuck" : ""}`}
        >
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
            {screen !== "intro" && (
            <button
              className={`btn icon settings-toggle ${settingsOpen ? "is-active" : ""}`}
              onClick={() => setSettingsOpen((open) => !open)}
              aria-label="설정"
              aria-expanded={settingsOpen}
              aria-controls="appearance-settings"
            >
              <GoogleIcon name="settings" size={20} filled />
            </button>
            )}
            {screen !== "intro" && settingsOpen && (
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
                            onClick={() => {
                              if (option.id === theme) return;
                              setSettingsOpen(false);
                              onThemeChange(option.id);
                            }}
                            aria-pressed={theme === option.id}
                          >
                            <GoogleIcon name={option.icon} size={20} />
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
