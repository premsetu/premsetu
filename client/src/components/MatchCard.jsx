import { Link } from "react-router-dom";

const MatchCard = ({ profile, type = "match" }) => (
  <article className="match-card">
    <img
      src={profile.profilePhoto || "https://placehold.co/400x400/F1FAEE/E63946?text=PS"}
      alt={profile.fullName}
    />
    <div>
      <h4>{profile.fullName}</h4>
      <p>
        {profile.city || "India"} • {profile.profession || "Profession pending"}
      </p>
      <div className="chip-row">
        <span className="chip">{profile.religion || "Any religion"}</span>
        <span className="chip">{profile.education || "Profile building"}</span>
      </div>
    </div>
    <Link className="secondary-button" to={type === "match" ? `/chat/${profile._id}` : `/profile/${profile._id}`}>
      {type === "match" ? "Open Chat" : "View"}
    </Link>
  </article>
);

export default MatchCard;
