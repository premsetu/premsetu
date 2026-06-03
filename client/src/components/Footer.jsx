import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-card footer-brand">
      <h3>PremSetu</h3>
      <p>
        A calm, family-friendly matrimonial space for thoughtful introductions, detailed profiles, and private
        conversations that move at the right pace.
      </p>
      <div className="footer-chip-row">
        <span className="chip">Made for Indian matchmaking</span>
        <span className="chip">Simple English, warm guidance</span>
      </div>
      <p className="support-line">English main, thoda sa warm Hinglish touch for ease and clarity.</p>
    </div>

    <div className="footer-card footer-column">
      <h4>Explore</h4>
      <div className="footer-link-list">
        <a href="/#how-it-works">How It Works</a>
        <a href="/#success-stories">Success Stories</a>
        <a href="/#culture-fit">Indian Family Fit</a>
      </div>
    </div>

    <div className="footer-card footer-column">
      <h4>Inside PremSetu</h4>
      <div className="footer-link-list">
        <Link to="/register">Create Profile</Link>
        <Link to="/matches">Browse Matches</Link>
        <Link to="/profile">My Profile</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
