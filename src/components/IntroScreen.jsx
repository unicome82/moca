import GoogleIcon from "./GoogleIcon.jsx";

export default function IntroScreen({ onStart }) {
  return (
    <section className="intro-page">
      <div className="hero-art" aria-hidden="true">
        <div className="hero-sparkle sparkle-one">❋</div>
        <div className="hero-sparkle sparkle-two">✦</div>
        <div className="hero-orbit" />
        <div className="hero-orbit dotted" />
        <div className="hero-card hero-card-back"></div>
        <div className="hero-card hero-card-front">
          <div className="hero-sun">❋</div>
          <span className="hero-card-index">MOCA</span>
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
