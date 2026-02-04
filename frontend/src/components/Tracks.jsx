function Tracks() {
  return (
    <section id="tracks" className="tracks-section">
      <div className="container">

        <div className="section-header">
          <h2>Core <span>Tracks</span></h2>
          <p>
            Two powerful domains driving the future of technology
          </p>
        </div>

        <div className="advanced-tracks">

          {/* AI TRACK */}
          <div className="track-box ai-track">
            <div className="track-icon">🧠</div>
            <h3>Artificial Intelligence</h3>
            <p>
              Explore intelligent systems, machine learning models,
              neural networks, and data-driven decision making.
            </p>

            <ul>
              <li>Machine Learning</li>
              <li>Neural Networks</li>
              <li>Computer Vision</li>
              <li>AI Applications</li>
            </ul>
          </div>

          {/* ROBOTICS TRACK */}
          <div className="track-box robotics-track">
            <div className="track-icon">🤖</div>
            <h3>Robotics</h3>
            <p>
              Design, control, and automate intelligent machines
              integrating hardware and software systems.
            </p>

            <ul>
              <li>Autonomous Robots</li>
              <li>Embedded Systems</li>
              <li>Sensors & Actuators</li>
              <li>Automation</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Tracks;
