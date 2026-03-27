import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar-shell">
      <nav className="navbar">
        <Link to="/" className="brand-mark">
          <span className="brand-icon">PS</span>
          <span>
            PremSetu
            <small>Bridge of Love</small>
          </span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/">Home</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/matches">Matches</NavLink>
              <NavLink to="/profile">My Profile</NavLink>
              <button className="ghost-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="primary-button small">
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
