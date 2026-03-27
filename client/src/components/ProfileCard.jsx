import { Link } from "react-router-dom";

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "--";
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
};

const ProfileCard = ({ profile, onInterest, actionLabel = "Send Interest", actionDisabled = false }) => (
  <article className="profile-card">
    <img
      src={profile.profilePhoto || "https://placehold.co/600x600/F1FAEE/E63946?text=PremSetu"}
      alt={profile.fullName}
    />
    <div className="profile-card-content">
      <h3>{profile.fullName}</h3>
      <p>
        {calculateAge(profile.dateOfBirth)} yrs • {profile.city || "India"}
      </p>
      <span>{profile.religion || "Open minded"}</span>
      <span>{profile.education || "Education not added yet"}</span>
      <span>{profile.profession || "Profession not added yet"}</span>
      <div className="card-actions">
        <button
          className="primary-button"
          onClick={() => onInterest?.(profile._id)}
          disabled={actionDisabled}
        >
          {actionLabel}
        </button>
        <Link className="secondary-button" to={`/profile/${profile._id}`}>
          View Profile
        </Link>
      </div>
    </div>
  </article>
);

export default ProfileCard;
