import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import ProfileCard from "../components/ProfileCard";
import MatchCard from "../components/MatchCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({ sent: 0, received: 0, matches: 0 });
  const [interestingIds, setInterestingIds] = useState(new Set());

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
      const matchUsers = matchRes.data.users || [];
      setMatches(matchUsers);
      setStats({
        sent: sentRes.data.users.length,
        received: receivedRes.data.users.length,
        matches: matchUsers.length
      });
    };

    loadDashboard().catch(() => null).finally(() => setLoading(false));
  }, []);

  const handleInterest = async (id) => {
    setInterestingIds((prev) => new Set([...prev, id]));
    try {
      const { data } = await api.post(`/matches/interest/${id}`);
      toast.success(data.message);
      setSuggestions((prev) => prev.filter((p) => p._id !== id));
      if (data.matched) {
        setStats((prev) => ({ ...prev, sent: prev.sent + 1, matches: prev.matches + 1 }));
      } else {
        setStats((prev) => ({ ...prev, sent: prev.sent + 1 }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send interest.");
    } finally {
      setInterestingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const firstName = user?.fullName?.split(" ")?.[0] || "there";

  const dashboardTip = useMemo(() => {
    if (completion < 50) {
      return "Acha first step: profile details complete karo. Better profile usually means better replies.";
    }
    if (!user?.profilePhoto) {
      return "Add a profile photo next. Trusted profiles usually get more serious interest.";
    }
    if (!stats.sent) {
      return "Start with one or two thoughtful interests. Quality over quantity works better here.";
    }
    return "You are in a good place now. Keep your profile updated and reply with warmth when a promising match appears.";
  }, [completion, stats.sent, user?.profilePhoto]);

  return (
    <section className="page-shell">
      <div className="dashboard-hero">
        <div className="dashboard-hero-card">
          <span className="eyebrow">Your dashboard</span>
          <h1>Namaste, {firstName}</h1>
          <p className="support-copy">
            Track your profile, review incoming interest, and keep your search calm and intentional. Clear profile,
            clear conversations.
          </p>
          <div className="dashboard-actions">
            <Link className="primary-button" to="/edit-profile">
              Improve Profile
            </Link>
            <Link className="secondary-button" to="/matches">
              See Matches
            </Link>
          </div>
          <div className="dashboard-tags">
            <span className="badge">Private match-based chat</span>
            <span className="badge">Made for serious intent</span>
          </div>
        </div>

        <aside className="dashboard-side-panel">
          <div>
            <span className="eyebrow">Profile health</span>
            <h3>{completion}% complete</h3>
            <p className="muted-copy">The more complete your profile, the easier it becomes for families to trust it.</p>
          </div>
          <div className="progress-bar">
            <div style={{ width: `${completion}%` }} />
          </div>
          <div className="helper-ribbon">{dashboardTip}</div>
        </aside>
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
          <p>Mutual Matches</p>
        </article>
        <article className="stat-card">
          <h2>{completion}%</h2>
          <p>Profile Strength</p>
        </article>
      </div>

      <div className="section-heading inline-heading">
        <div>
          <span>Suggested Profiles</span>
          <h2>Profiles selected for you</h2>
        </div>
        <Link to="/matches">See all</Link>
      </div>

      {loading ? (
        <div className="empty-state">Loading suggestions...</div>
      ) : suggestions.length ? (
        <div className="cards-grid">
          {suggestions.map((profile) => (
            <ProfileCard
              key={profile._id}
              profile={profile}
              onInterest={handleInterest}
              actionDisabled={interestingIds.has(profile._id)}
              actionLabel={interestingIds.has(profile._id) ? "Sending..." : "Send Interest"}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">No new suggestions right now. Check back after completing your profile.</div>
      )}

      <div className="section-heading inline-heading">
        <div>
          <span>Recent Activity</span>
          <h2>Your connected matches</h2>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading matches...</div>
      ) : matches.length ? (
        <div className="match-list">
          {matches.slice(0, 4).map((profile) => (
            <MatchCard key={profile._id} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No mutual matches yet. Keep your profile honest, warm, and detailed. The right people usually respond to that.
        </div>
      )}
    </section>
  );
};

export default Dashboard;
