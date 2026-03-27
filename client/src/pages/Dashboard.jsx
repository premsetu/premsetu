import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import ProfileCard from "../components/ProfileCard";
import MatchCard from "../components/MatchCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [completion, setCompletion] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState({
    sent: 0,
    received: 0,
    matches: 0
  });

  useEffect(() => {
    const loadDashboard = async () => {
      const [profileRes, suggestionRes, sentRes, receivedRes, matchRes] = await Promise.all([
        api.get("/profile/me"),
        api.get("/matches/suggestions?limit=4"),
        api.get("/matches/interests-sent"),
        api.get("/matches/interests-received"),
        api.get("/matches/my-matches")
      ]);

      setCompletion(profileRes.data.completionPercentage || 0);
      setSuggestions(suggestionRes.data.users || []);
      setStats({
        sent: sentRes.data.users.length,
        received: receivedRes.data.users.length,
        matches: matchRes.data.users.length
      });
    };

    loadDashboard().catch(() => null);
  }, []);

  const handleInterest = async (id) => {
    try {
      const { data } = await api.post(`/matches/interest/${id}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send interest.");
    }
  };

  return (
    <section className="page-shell">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">Your Dashboard</span>
          <h1>Hello, {user?.fullName?.split(" ")[0]}</h1>
          <p>Track your profile, review new interest requests, and discover meaningful matches.</p>
        </div>
        <Link className="primary-button" to="/edit-profile">
          Complete Profile
        </Link>
      </div>

      <div className="progress-card">
        <div className="progress-copy">
          <h3>Profile completion</h3>
          <p>The more complete your profile is, the better your match suggestions become.</p>
        </div>
        <div className="progress-bar">
          <div style={{ width: `${completion}%` }} />
        </div>
        <strong>{completion}% complete</strong>
      </div>

      <div className="stats-grid small">
        <article className="stat-card">
          <h2>{stats.sent}</h2>
          <p>Interests Sent</p>
        </article>
        <article className="stat-card">
          <h2>{stats.received}</h2>
          <p>Interests Received</p>
        </article>
        <article className="stat-card">
          <h2>{stats.matches}</h2>
          <p>Matches</p>
        </article>
      </div>

      <div className="section-heading inline-heading">
        <div>
          <span>Suggested Profiles</span>
          <h2>Profiles selected for you</h2>
        </div>
        <Link to="/matches">See all</Link>
      </div>
      <div className="cards-grid">
        {suggestions.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} onInterest={handleInterest} />
        ))}
      </div>

      <div className="section-heading inline-heading">
        <div>
          <span>Recent Activity</span>
          <h2>Your connected matches</h2>
        </div>
      </div>
      <RecentMatches />
    </section>
  );
};

const RecentMatches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api
      .get("/matches/my-matches")
      .then(({ data }) => setMatches(data.users || []))
      .catch(() => null);
  }, []);

  if (!matches.length) {
    return <div className="empty-state">No mutual matches yet. Keep sending thoughtful interests.</div>;
  }

  return (
    <div className="match-list">
      {matches.slice(0, 4).map((profile) => (
        <MatchCard key={profile._id} profile={profile} />
      ))}
    </div>
  );
};

export default Dashboard;
