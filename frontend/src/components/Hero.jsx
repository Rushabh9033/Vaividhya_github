import Countdown from "./Countdown";

function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="ai-bg"></div>
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <h1 className="hero-title">
          VAIVIDHYA <span>2K26</span>
        </h1>

        <p className="hero-subtitle">
          Where <span>AI</span>, <span>Robotics</span> & Future Innovation Converge
        </p>

        <div className="hero-meta">
          <span>📅 20-21 FEBRUARY, 2026</span>
          <span className="divider"></span>
          <span>📍 SSASIT, SURAT</span>
        </div>

        <div className="hero-actions">
          <a href="/register" className="hero-btn-primary">Register Now</a>
          <a href="/events" className="hero-btn-secondary">Explore Event</a>
        </div>

        {/* Countdown Timer */}
        <Countdown targetDate="2026-02-20T09:00:00" />
      </div>
    </section>
  );
}

export default Hero;

