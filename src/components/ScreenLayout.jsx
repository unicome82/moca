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

  // Match the browser chrome and the body to what is actually painted on screen.
  useLayoutEffect(() => {
    const shell = document.querySelector(".app-shell");
    if (!shell) return undefined;

    const isTransparent = (color) =>
      !color || color === "transparent" || /rgba\(.*,\s*0\)$/.test(color);

    // Only full-width surfaces count: a card under the sample point is not the page.
    const paintedAt = (y) =>
      document
        .elementsFromPoint(window.innerWidth / 2, y)
        .filter((element) => element.getBoundingClientRect().width >= window.innerWidth - 1)
        .map((element) => getComputedStyle(element).backgroundColor)
        .find((color) => !isTransparent(color));

    // The status bar takes the color at the top of the screen, while the body
    // shows past the page edges (below the footer, overscroll), so it matches
    // the bottom of the page instead: a dark pinned header must not leak there.
    const syncSurfaceColor = () => {
      const fallback = getComputedStyle(shell).getPropertyValue("--ui-bg").trim();
      const topColor = paintedAt(1) || fallback;
      const bottomColor = paintedAt(window.innerHeight - 1) || fallback;
      if (!topColor || !bottomColor) return;

      document.documentElement.style.backgroundColor = bottomColor;
      document.body.style.backgroundColor = bottomColor;
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.setAttribute("content", topColor);
    };

    syncSurfaceColor();
    const frame = requestAnimationFrame(syncSurfaceColor);
    const timer = setTimeout(syncSurfaceColor, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [theme, screen, headerStuck]);

  // Pin the header once the page scrolls. On the landing home, the intro (copy
  // area) itself becomes the sticky header: it scrolls up until only a
  // header-high strip is left, and its MOCA logo shrinks into the header's
  // left side while the rest of the copy fades out.
  useLayoutEffect(() => {
    const header = headerRef.current;
    const landing = document.querySelector(".theme-landing");
    const homeIntro = screen === "home" ? landing?.querySelector(".intro") : null;
    // Only intros with a logo (the MOCA wordmark, or Shape's four shapes) collapse
    // into the header strip.
    const intro = homeIntro?.querySelector(":scope > .logo, :scope > .shapes")
      ? homeIntro
      : null;
    const logo = intro?.querySelector(":scope > .logo");
    const isClear = (color) => /rgba\(.*,\s*0\)$|transparent/.test(color);
    const LOGO_HEIGHT = 26;
    let metrics = null;
    // Scroll events fire every frame; only write styles when the pin state flips.
    let lastProgress = null;

    const surfaceColor = () => {
      if (!landing) return "";
      const surface = [".poster", ".visual"]
        .map((selector) => landing.querySelector(selector))
        .concat(landing)
        .find((element) => element && !isClear(getComputedStyle(element).backgroundColor));
      if (surface) return getComputedStyle(surface).backgroundColor;
      const frame = document.querySelector(".app-frame");
      return frame ? getComputedStyle(frame).backgroundColor : "";
    };

    const clearLogo = () => {
      if (!logo) return;
      logo.style.transform = "";
      logo.style.transformOrigin = "";
      logo.style.transition = "";
    };

    // Measure the untransformed layout once (and again on resize).
    const measure = () => {
      if (!intro || !header) return;
      clearLogo();
      // Where the intro's bottom sits in the page decides when it is fully pinned.
      intro.style.position = "";
      intro.style.top = "";
      const flowRect = intro.getBoundingClientRect();
      intro.style.position = "sticky";
      intro.style.zIndex = "5";
      if (isClear(getComputedStyle(intro).backgroundColor)) {
        intro.style.backgroundColor = surfaceColor();
      }
      // Lets CSS extend a narrower (padded) intro to the full width while pinned.
      intro.style.setProperty("--pin-surface", getComputedStyle(intro).backgroundColor);
      const headerHeight = header.offsetHeight;
      const travel = Math.max(0, intro.offsetHeight - headerHeight);
      const pinAt = Math.max(0, flowRect.bottom + window.scrollY - headerHeight);
      const introRect = intro.getBoundingClientRect();
      const safeTop = parseFloat(getComputedStyle(header).paddingTop) || 0;
      const settings = header.querySelector(".settings-toggle");
      // Mirror the visible gap to the right of the settings icon.
      const icon = settings?.firstElementChild || settings;
      const sideGap = icon
        ? window.innerWidth - icon.getBoundingClientRect().right
        : 20;
      // Used by CSS to place Shape's four shapes in the header strip.
      intro.style.setProperty("--pin-logo-left", `${sideGap}px`);
      intro.style.setProperty(
        "--pin-logo-bottom",
        `${(headerHeight - safeTop - LOGO_HEIGHT) / 2}px`,
      );
      intro.style.setProperty("--pin-logo-height", `${LOGO_HEIGHT}px`);
      let logoMetrics = null;
      if (logo) {
        const range = document.createRange();
        range.selectNodeContents(logo);
        const text = range.getBoundingClientRect();
        const box = logo.getBoundingClientRect();
        // Horizontal edge from the text itself (logos may be centered in a wide box),
        // vertical size from the box (its line-height hugs the glyphs).
        const height = Math.min(text.height, box.height);
        const scale = Math.min(1, LOGO_HEIGHT / height);
        const targetTop =
          safeTop + (headerHeight - safeTop - height * scale) / 2 + travel;
        logoMetrics = {
          origin: `${text.left - box.left}px 0px`,
          dx: sideGap - (text.left - introRect.left),
          dy: targetTop - (box.top - introRect.top),
          scale,
        };
      }
      metrics = { pinAt, logo: logoMetrics, color: getComputedStyle(intro).color };
      lastProgress = null;
      intro.style.top = `${-travel}px`;
    };

    const sync = () => {
      if (!header) return;
      if (!intro) {
        const stuck = window.scrollY > 8;
        if (stuck === lastProgress) return;
        lastProgress = stuck;
        header.style.setProperty("--header-surface", surfaceColor());
        setHeaderOverIntro(false);
        setHeaderStuck(stuck);
        return;
      }
      if (!metrics) measure();
      const { pinAt, logo: logoMetrics, color } = metrics;
      // Switch at once (no gradual transition) when the copy area has scrolled past.
      const progress = pinAt && window.scrollY >= pinAt - 1 ? 1 : 0;
      if (progress === lastProgress) return;
      lastProgress = progress;
      intro.style.setProperty("--pin-progress", progress.toFixed(3));
      landing.classList.toggle("is-intro-pinned", progress === 1);
      if (logo && logoMetrics && progress === 0) {
        clearLogo();
      } else if (logo && logoMetrics) {
        const { origin, dx, dy, scale } = logoMetrics;
        logo.style.transition = "none";
        logo.style.transformOrigin = origin;
        logo.style.transform = `translate(${dx * progress}px, ${dy * progress}px) scale(${1 + (scale - 1) * progress})`;
      }
      header.style.color = color;
      setHeaderOverIntro(true);
      setHeaderStuck(progress >= 1);
    };

    const remeasure = () => {
      metrics = null;
      sync();
    };

    sync();
    // Re-measure once the expand animation has settled and whenever the intro resizes.
    const timers = [400, 1000, 2000].map((delay) => setTimeout(remeasure, delay));
    const observer = intro ? new ResizeObserver(remeasure) : null;
    observer?.observe(intro);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      timers.forEach(clearTimeout);
      observer?.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", remeasure);
      clearLogo();
      if (intro) {
        ["position", "top", "zIndex", "backgroundColor"].forEach((prop) => {
          intro.style[prop] = "";
        });
        ["--pin-progress", "--pin-surface", "--pin-logo-left", "--pin-logo-bottom", "--pin-logo-height"].forEach(
          (name) => intro.style.removeProperty(name),
        );
        landing?.classList.remove("is-intro-pinned");
      }
      if (header) {
        header.style.color = "";
        header.style.removeProperty("--header-surface");
      }
      setHeaderOverIntro(false);
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
