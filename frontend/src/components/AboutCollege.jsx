import collegeLogo from "../assets/college-logo.png";

function AboutCollege() {
  return (
    <section className="about-college-section">
      <div className="container">

        <div className="about-college-logo">
          <img src={collegeLogo} alt="College Logo" />
        </div>

        <div className="section-header">
          <h2>About the <span>College</span></h2>
          <p>
            Institution nurturing innovation, excellence, and future technologists
          </p>
        </div>

        <div className="about-college-content">
          <p>
            <strong>SSASIT</strong> is a premier institution committed to
            academic excellence, innovation, and technological advancement.
            The college provides a dynamic learning environment that encourages
            students to explore emerging technologies and real-world problem solving.
          </p>

          <p>
            Through initiatives like <strong>VAIVIDHYA 2K26</strong>, the institution
            promotes hands-on learning, interdisciplinary collaboration, and exposure
            to cutting-edge domains such as Artificial Intelligence and Robotics.
          </p>
        </div>

      </div>
    </section>
  );
}

export default AboutCollege;
