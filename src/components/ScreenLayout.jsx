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
  const [headerOverIntro, setHeaderOverIntro] = useState(false);
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

  // Pin the header once the page scrolls. On the landing, the intro (copy area)
  // itself becomes the sticky header: it scrolls up until only a header-high
  // strip is left, so its own background never gets cut.
  useLayoutEffect(() => {
    const header = headerRef.current;
    const landing = document.querySelector(".theme-landing");
    const intro = landing?.querySelector(".intro");
    const isClear = (color) => /rgba\(.*,\s*0\)$|transparent/.test(color);
    const hasBackground = (element) => {
      const { backgroundImage, backgroundColor } = getComputedStyle(element);
      return backgroundImage !== "none" || !isClear(backgroundColor);
    };

    const reset = () => {
      if (intro) {
        intro.style.position = "";
        intro.style.top = "";
        intro.style.zIndex = "";
      }
      landing?.classList.remove("is-intro-pinned");
      if (header) {
        header.style.color = "";
        header.style.backgroundColor = "";
      }
      setHeaderOverIntro(false);
    };

    const sync = () => {
      if (!header) return;
      const introSticks = screen === "home" && intro && hasBackground(intro);
      if (!introSticks) {
        // No painted intro: give the pinned header the landing's own background color.
        const surface = landing
          ? [".poster", ".visual"]
              .map((selector) => landing.querySelector(selector))
              .concat(landing)
              .find((element) => element && !isClear(getComputedStyle(element).backgroundColor))
          : null;
        header.style.backgroundColor = surface
          ? getComputedStyle(surface).backgroundColor
          : "";
        setHeaderOverIntro(false);
        setHeaderStuck(window.scrollY > 8);
        return;
      }
      header.style.backgroundColor = "";
      const headerHeight = header.offsetHeight;
      const travel = intro.offsetHeight - headerHeight;
      intro.style.position = "sticky";
      intro.style.top = `${-travel}px`;
      intro.style.zIndex = "5";
      const pinned = window.scrollY >= travel - 1;
      landing.classList.toggle("is-intro-pinned", pinned);
      setHeaderOverIntro(true);
      header.style.color = getComputedStyle(intro).color;
      setHeaderStuck(pinned);
    };

    sync();
    const timer = setTimeout(sync, 1000); // after the expand animation
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      reset();
    };
  }, [screen, theme]);

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
          className={`header ${headerHidden ? "is-hidden" : ""} ${headerStuck ? "is-stuck" : ""} ${headerOverIntro ? "is-over-intro" : ""}`}
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
