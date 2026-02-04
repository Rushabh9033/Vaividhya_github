import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-content">

        {/* Left: Event Info */}
        <div className="footer-block">
          <h3>VAIVIDHYA 2K26</h3>
          <p>
            A national-level technical event focused on
            Artificial Intelligence and Robotics.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div className="footer-block">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#tracks">Tracks</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#register">Register</a></li>
          </ul>
        </div>

        {/* Right: Contact */}
        <div className="footer-block">
          <h4>Contact</h4>
          <p>Email: vaividhya2k26@gmail.com</p>
          <p>Phone: +91 9XXXXXXXXX</p>

          <div className="footer-socials">
            <Link href="#">Instagram</Link>
            <Link href="#">LinkedIn</Link>
            <Link href="#">Twitter</Link>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © 2026 VAIVIDHYA | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
