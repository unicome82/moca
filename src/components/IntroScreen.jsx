import GoogleIcon from "./GoogleIcon.jsx";

export default function IntroScreen({ onStart }) {
  return (
    <section className="intro-page">
      <div className="main-visual" aria-hidden="true">
        <div className="visual-sparkle visual-sparkle-one">❋</div>
        <div className="visual-sparkle visual-sparkle-two">✦</div>
        <div className="visual-orbit" />
        <div className="visual-orbit visual-orbit-dotted" />
        <div className="visual-card visual-card-back"></div>
        <div className="visual-card visual-card-front">
          <div className="visual-sun">❋</div>
          <span className="visual-card-index">MOCA</span>
        </div>
      </div>
      <div className="intro-copy">
        <span className="eyebrow">
          <GoogleIcon name="auto_awesome" size={16} /> 대화가 필요할 때
        </span>
        <h1>
          <span>오늘,</span>
          <br />
          어떤 카드가 필요하세요?
        </h1>
        <p>심심한 순간, 카드 한 장으로 분위기를 바꿔요.</p>
        <a
          className="btn black"
          href="?screen=home"
          onClick={(event) => {
            event.preventDefault();
            onStart();
          }}
        >
          카드 고르기
        </a>
      </div>
    </section>
  );
}
