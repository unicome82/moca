import { Component, createRef, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { decks } from "../data/decks.js";
import GoogleIcon from "../components/GoogleIcon.jsx";

function measure(element) {
  const rect = element.getBoundingClientRect();
  const { transform } = getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(transform);
  return {
    element,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: element.offsetWidth * Math.hypot(matrix.a, matrix.b),
    height: element.offsetHeight * Math.hypot(matrix.c, matrix.d),
    angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
    transform,
  };
}

// Capture geometry before React changes the layout, including browser navigation.
class LandingTransition extends Component {
  node = createRef();
  animations = [];

  getSnapshotBeforeUpdate(previousProps) {
    if (previousProps.expanded === this.props.expanded) return null;
    const selector = this.props.theme === "folio" ? ".logo, .intro .copy, .list > .card" : ".logo, .intro .copy";
    return [...this.node.current.querySelectorAll(selector)].map(measure);
  }

  componentDidUpdate(previousProps, previousState, before) {
    if (!before) return;
    this.animations.forEach(animation => animation.cancel());
    this.animations = [];
    if (reducedMotion()) return;

    const after = before.map(({ element }) => measure(element));
    this.animations = before.flatMap((old, index) => {
      const next = after[index];
      if (!old.width || !old.height || !next.width || !next.height) return [];
      const base = next.transform === "none" ? "" : next.transform;
      return [old.element.animate([
        {
          transformOrigin: "center center",
          transform: `translate(${old.x - next.x}px, ${old.y - next.y}px) ${base} rotate(${old.angle - next.angle}deg) scale(${old.width / next.width}, ${old.height / next.height})`,
        },
        { transformOrigin: "center center", transform: next.transform },
      ], { duration: this.props.theme === "folio" ? 900 : 950, easing: "cubic-bezier(.22, 1, .36, 1)" })];
    });
  }

  componentWillUnmount() {
    this.animations.forEach(animation => animation.cancel());
  }

  render() {
    return <div ref={this.node}>{this.props.children}</div>;
  }
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const transitionTime = theme => reducedMotion() ? 0 : theme === "shape" ? 700 : 1100;

export default function ThemeLanding({ theme, expanded, onExpand, onCollapse, onNavigate }) {
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const previous = useRef(expanded);
  const gestureLock = useRef(0);
  const [palette] = useState(() => ["blue", "green", "cream"][Math.floor(Math.random() * 3)]);
  const [variations] = useState(() => decks.map((_, index) => ({
    "--index": index, "--shift": `${(index % 2 ? 1 : -1) * (15 + Math.random() * 15)}cqw`,
    "--skew-x": `${12 + Math.random() * 14}deg`, "--skew-y": `${Math.random() * 20 - 10}deg`,
    "--rotation": `${Math.random() * 40 - 20}deg`, "--scale-x": .5 + Math.random() * .5,
    "--scale-y": 1.5 + Math.random(), "--radius": index % 2 ? "50%" : "8%",
  })));

  useLayoutEffect(() => {
    if (previous.current === expanded) return;
    previous.current = expanded;
    const duration = transitionTime(theme);
    gestureLock.current = performance.now() + duration;
    const keepTop = () => {
      if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "instant" });
    };
    keepTop();
    // Touch momentum and layout changes can scroll Safari after navigation.
    window.addEventListener("scroll", keepTop, { passive: true });
    const timer = window.setTimeout(() => {
      keepTop();
      window.removeEventListener("scroll", keepTop);
    }, duration);
    if (expanded && document.activeElement === trigger.current) list.current.focus({ preventScroll: true });
    if (!expanded && list.current.contains(document.activeElement)) trigger.current.focus({ preventScroll: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", keepTop);
    };
  }, [expanded, theme]);

  useEffect(() => {
    let distance = 0, last = 0, direction = 0, touch = null;
    const ignored = event => event.target.closest("input, select, textarea, [role='dialog'], [data-no-gesture]");
    const move = forward => {
      if (performance.now() < gestureLock.current || forward === expanded) return;
      gestureLock.current = performance.now() + transitionTime(theme);
      forward ? onExpand() : onCollapse();
    };
    const wheel = event => {
      if (ignored(event) || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (performance.now() < gestureLock.current) { event.preventDefault(); return; }
      const forward = event.deltaY > 0;
      if (expanded ? forward || window.scrollY > 2 : !forward) return;
      event.preventDefault();
      const now = performance.now();
      if (now - last > 250 || direction !== Math.sign(event.deltaY)) distance = 0;
      direction = Math.sign(event.deltaY);
      last = now;
      distance += Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (distance > 70) { distance = 0; move(forward); }
    };
    const start = event => {
      touch = !ignored(event) && event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY, top: window.scrollY <= 2 } : null;
    };
    const end = event => {
      const point = event.changedTouches[0];
      if (touch && point) {
        const dy = touch.y - point.clientY;
        if (Math.abs(dy) > 45 && Math.abs(dy) > Math.abs(touch.x - point.clientX)
          && (dy > 0 || (touch.top && window.scrollY <= 2))) move(dy > 0);
      }
      touch = null;
    };
    const touchmove = event => {
      if (ignored(event) || event.touches.length !== 1) return;
      if (performance.now() < gestureLock.current) { event.preventDefault(); return; }
      if (!touch || expanded) return;
      const point = event.touches[0];
      const dy = touch.y - point.clientY;
      if (Math.abs(dy) <= Math.abs(touch.x - point.clientX)) return;
      event.preventDefault();
      if (dy > 45) move(true);
    };
    const cancel = () => { touch = null; };
    const node = root.current;
    const controller = new AbortController();
    for (const [type, handler] of Object.entries({ wheel, touchstart: start, touchmove, touchend: end, touchcancel: cancel })) {
      node.addEventListener(type, handler, { passive: type !== "wheel" && type !== "touchmove", signal: controller.signal });
    }
    return () => controller.abort();
  }, [expanded, onExpand, onCollapse, theme]);

  const copy = <div className="copy" lang="ko">
    {theme === "prism" && <button ref={trigger} className="trigger" aria-label="카드 펼쳐 보기" aria-expanded={expanded} aria-controls="theme-cards" onClick={onExpand} />}
    {/* <p className="event">{theme === "folio" ? "CARDS FOR EVERY MOMENT" : "MOCA"}</p> */}
    {theme !== "press" && <p className="event">{theme === "folio" ? "모든 순간을 위한 카드" : "MOCA"}</p>}
    {/* <h1>Cards for Every Moment</h1> */}
    <h1>세상의 모든 카드</h1>
    {/* <p className="subtitle">From your own interests to the stories we share.<br />Bring something new to your everyday.</p> */}
    <p className="subtitle">혼자만의 취향부터 우리 사이의 이야기까지<br />익숙한 하루에 새로운 재미를 더해보세요.</p>
  </div>;
  const hideCards = theme !== "shape" && !expanded;
  const cards = <ul ref={list} className="list" id="theme-cards" tabIndex={-1} inert={hideCards} aria-hidden={hideCards}>
    {decks.map((deck, index) => {
      const target = deck.id === "liar" ? "liar-setup" : deck.id;
      return <li className="card" key={deck.id} data-tone={["blue", "pink", "green", "yellow"][index]} style={variations[index]}>
        <a className="deck-link" href={`?screen=${target}`} aria-label={`${deck.title} 열기`} onClick={event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault(); onNavigate(target);
        }}>
          <span className="icon" aria-hidden="true"><GoogleIcon name={deck.icon} /></span>
          {/* <h2>{deck.en}</h2> */}
          <h2>{theme === "folio" && !expanded ? deck.en : deck.title}</h2><p>{deck.copy}</p>
        </a>
      </li>;
    })}
  </ul>;
  const animated = ["folio", "retro", "press"].includes(theme);
  const Transition = animated ? LandingTransition : Fragment;
  const transitionProps = animated ? { expanded, theme } : {};
  return <section ref={root} data-theme={theme} data-palette={palette} className={`theme-landing ${expanded ? "is-expanded" : ""}`}>
    <Transition {...transitionProps}>
    <div className="visual"><div className={`poster ${expanded ? "is-expanded has-entered" : ""}`}>
      {theme === "prism" ? <>{cards}{copy}</> : <>
        <header className="intro" role={expanded ? undefined : "button"} tabIndex={expanded ? undefined : 0}
          ref={trigger} aria-label={expanded ? undefined : "카드 펼쳐 보기"} aria-expanded={expanded} aria-controls="theme-cards"
          onClick={() => !expanded && onExpand()} onKeyDown={event => {
            if (!expanded && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onExpand(); }
          }}>
          {theme === "shape" ? <div className="shapes" aria-hidden="true">{[0, 1, 2, 3].map(i => <div className="shape" key={i} />)}</div>
            : <div className="logo" aria-label="MOCA">{theme === "retro" ? <><span>M</span><span>O</span><span>C</span><span>A</span></> : "MOCA"}</div>}
          {copy}
        </header>
        {/* {theme === "press" && <div className="catalog"><span>MOCA COLLECTION</span><span>{decks.length} DECKS</span></div>} */}
        {theme === "press" && <div className="catalog"><span>MOCA 카드 모음</span><span>{decks.length}개의 카드덱</span></div>}
        {cards}
      </>}
    </div></div>
    {expanded && (
      <footer className="landing-copyright">
        COPYRIGHT MOCA © 2026. ALL RIGHTS RESERVED.
      </footer>
    )}
    </Transition>
  </section>;
}
