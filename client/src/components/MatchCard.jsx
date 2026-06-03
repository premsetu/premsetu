import { Link } from "react-router-dom";

const MatchCard = ({ profile, type = "match" }) => (
  <article className="match-card">
    <div className="match-card-media">
      <img
        src={profile.profilePhoto || "https://placehold.co/400x400/F0EDE6/3B4A3A?text=PS"}
        alt={profile.fullName}
      />
    </div>

    <div>
      <div className="chip-row">
        <span className="status-pill">{type === "match" ? "Mutual match" : "Profile view"}</span>
      </div>
      <h4>{profile.fullName}</h4>
      <p className="match-subline">
        {profile.city || "India"} | {profile.profession || "Profession pending"}
      </p>
      <div className="chip-row">
        <span className="chip">{profile.religion || "Any religion"}</span>
        <span className="chip">{profile.education || "Profile building"}</span>
        <span className="chip">{profile.motherTongue || "Language pending"}</span>
      </div>
    </div>

    <Link className="secondary-button" to={type === "match" ? `/chat/${profile._id}` : `/profile/${profile._id}`}>
      {type === "match" ? "Open Chat" : "View"}
    </Link>
  </article>
);

export default MatchCard;
