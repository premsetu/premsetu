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

const ProfileCard = ({ profile, onInterest, actionLabel = "Send Interest", actionDisabled = false }) => {
  const age = calculateAge(profile.dateOfBirth);

  return (
    <article className="profile-card">
      <div className="profile-card-media">
        <img
          src={profile.profilePhoto || "https://placehold.co/700x880/F0EDE6/3B4A3A?text=PremSetu"}
          alt={profile.fullName}
        />
        <span className="profile-card-badge">{profile.isProfileComplete ? "Profile complete" : "New profile"}</span>
      </div>

      <div className="profile-card-content">
        <div className="profile-name-row">
          <div>
            <h3>{profile.fullName}</h3>
            <p className="profile-meta-line">
              {age} yrs | {profile.city || "India"}
            </p>
          </div>
          <span className="chip">{profile.motherTongue || "Family values"}</span>
        </div>

        <div className="profile-detail-grid">
          <span>{profile.religion || "Open minded profile"}</span>
          <span>{profile.education || "Education not added yet"}</span>
          <span>{profile.profession || "Profession not added yet"}</span>
        </div>

        <div className="chip-row">
          <span className="chip">{profile.state || "Across India"}</span>
          <span className="chip">{profile.maritalStatus || "Never married"}</span>
        </div>

        <div className="card-actions">
          <button className="primary-button" onClick={() => onInterest?.(profile._id)} disabled={actionDisabled}>
            {actionLabel}
          </button>
          <Link className="secondary-button" to={`/profile/${profile._id}`}>
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
