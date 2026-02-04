import collegeLogo from "../assets/college-logo.png";


function SponsorsCommittee() {
  return (
    <section className="sponsors-section">
      <div className="container">
        {/* Sponsors */}
        <div className="section-header">
          <h2>Our <span>Sponsors</span></h2>
          <p>Supported by innovation-driven organizations</p>
        </div>

        <div className="infinite-slider">
          <div className="slider-track">
            {/* Repeat logos for infinite effect */}
            <div className="sponsor-box">Sponsor 1</div>
            <div className="sponsor-box">Sponsor 2</div>
            <div className="sponsor-box">Sponsor 3</div>
            <div className="sponsor-box">Sponsor 4</div>
            <div className="sponsor-box">Sponsor 5</div>

            <div className="sponsor-box">Sponsor 1</div>
            <div className="sponsor-box">Sponsor 2</div>
            <div className="sponsor-box">Sponsor 3</div>
            <div className="sponsor-box">Sponsor 4</div>
            <div className="sponsor-box">Sponsor 5</div>
          </div>
        </div>

        {/* Committee */}
        <div className="section-header committee-header">
          <h2>Organizing <span>Committee</span></h2>
          <p>Team behind VAIVIDHYA 2K26</p>
        </div>

        <div className="infinite-slider slow">
          <div className="slider-track">
            <div className="committee-card">
              <div className="member-img">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Member" />
              </div>
              <h3>Dr. A</h3>
              <p>Faculty Coordinator</p>
            </div>
            <div className="committee-card">
              <div className="member-img">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Member" />
              </div>
              <h3>Student B</h3>
              <p>Lead Organizer</p>
            </div>
            <div className="committee-card">
              <div className="member-img">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Member" />
              </div>
              <h3>Student C</h3>
              <p>Tech Lead</p>
            </div>
            <div className="committee-card">
              <div className="member-img">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Member" />
              </div>
              <h3>Student D</h3>
              <p>Design Lead</p>
            </div>
            <div className="committee-card">
              <div className="member-img">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Member" />
              </div>
              <h3>Student E</h3>
              <p>Media Lead</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default SponsorsCommittee;
