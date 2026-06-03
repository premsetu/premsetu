import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";
import { getSocket } from "../utils/socket";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return undefined;
    }

    const fetchUnread = async () => {
      try {
        const { data } = await api.get("/chat/unread-count");
        setUnreadCount(data.count || 0);
      } catch {
        // silently ignore
      }
    };

    fetchUnread();

    const socket = getSocket();
    if (!socket) return undefined;

    const handleNewMessage = (msg) => {
      if (msg.receiver._id === user?._id && !location.pathname.startsWith("/chat/")) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("chat:new-message", handleNewMessage);
    return () => socket.off("chat:new-message", handleNewMessage);
  }, [user, location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/chat/")) {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const firstName = user?.fullName?.split(" ")?.[0] || "Member";

  const navClassName = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <header className="navbar-shell">
      <nav className="navbar">
        <Link to="/" className="brand-mark">
          <span className="brand-icon">PS</span>
          <span className="brand-copy">
            <strong>PremSetu</strong>
            <small>Thoughtful matchmaking for modern Indian families</small>
          </span>
        </Link>

        <button type="button" className="menu-toggle" onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className={navClassName}>
            Home
          </NavLink>
          {user ? (
            <>
              <span className="nav-user-chip">Namaste, {firstName}</span>
              <NavLink to="/dashboard" className={navClassName}>
                Dashboard
              </NavLink>
              <NavLink to="/matches" className={navClassName}>
                Matches
              </NavLink>
              <NavLink to="/chat-list" className={navClassName} style={{ position: "relative" }}>
                Messages
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    minWidth: 18,
                    height: 18,
                    borderRadius: "999px",
                    background: "var(--clay)",
                    color: "#fff",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    display: "grid",
                    placeItems: "center",
                    padding: "0 4px"
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </NavLink>
              <NavLink to="/profile" className={navClassName}>
                My Profile
              </NavLink>
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClassName}>
                Login
              </NavLink>
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
