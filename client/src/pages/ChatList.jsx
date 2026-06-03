import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/matches/my-matches")
      .then(({ data }) => setMatches(data.users || []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-shell">
      <div className="page-banner">
        <div className="section-heading">
          <span>Messages</span>
          <h1>Your private conversations</h1>
          <p className="section-copy">
            Chat opens only with mutual matches. Keep the tone warm, honest, and respectful.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading your conversations...</div>
      ) : matches.length ? (
        <div className="match-list">
          {matches.map((profile) => (
            <Link key={profile._id} to={`/chat/${profile._id}`} style={{ textDecoration: "none" }}>
              <article className="match-card" style={{ cursor: "pointer" }}>
                <div className="match-card-media">
                  <img
                    src={profile.profilePhoto || "https://placehold.co/400x400/F0EDE6/3B4A3A?text=PS"}
                    alt={profile.fullName}
                  />
                </div>
                <div>
                  <h4>{profile.fullName}</h4>
                  <p className="match-subline">
                    {profile.city || "India"} | {profile.profession || "Profession pending"}
                  </p>
                  <div className="chip-row">
                    <span className="chip">{profile.religion || "Any religion"}</span>
                    <span className="chip">{profile.education || "Profile building"}</span>
                  </div>
                </div>
                <span className="primary-button small">Open Chat</span>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No matches yet. Send interest to profiles you like on the{" "}
          <Link to="/matches" style={{ color: "var(--forest-deep)", fontWeight: 700 }}>Matches</Link>{" "}
          page and wait for mutual interest to unlock chat.
        </div>
      )}
    </section>
  );
};

export default ChatList;
