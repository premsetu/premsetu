import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="page-shell" style={{ minHeight: "60vh", justifyContent: "center", alignItems: "center" }}>
    <div style={{ textAlign: "center", display: "grid", gap: "22px" }}>
      <span className="eyebrow">404 — Page not found</span>
      <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>This page does not exist.</h1>
      <p className="muted-copy">The link may have moved, or you may have followed an old URL. Let us get you back.</p>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <Link to="/" className="primary-button">Back to Home</Link>
        <Link to="/matches" className="secondary-button">Browse Matches</Link>
      </div>
    </div>
  </section>
);

export default NotFound;
