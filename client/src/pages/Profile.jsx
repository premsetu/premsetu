import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const renderField = (label, value) => (
  <div className="detail-item" key={label}>
    <span>{label}</span>
    <strong>{value || "Not added yet"}</strong>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const allPhotos = [user?.profilePhoto, ...(user?.photos || [])].filter(Boolean);

  return (
    <section className="page-shell">
      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-photo-frame">
            <img
              src={user?.profilePhoto || "https://placehold.co/320x360/F0EDE6/3B4A3A?text=PremSetu"}
              alt={user?.fullName}
            />
          </div>

          <div className="profile-summary">
            <span className="eyebrow">My profile</span>
            <h1>{user?.fullName}</h1>
            <p className="detail-line">
              {user?.city || "City pending"}, {user?.state || "State pending"}
            </p>
            <p>{user?.bio || "Add your bio to introduce yourself clearly and warmly."}</p>

            <div className="profile-badges">
              <span className="chip">{user?.religion || "Religion pending"}</span>
              <span className="chip">{user?.motherTongue || "Mother tongue pending"}</span>
              <span className="chip">{user?.maritalStatus || "Never married"}</span>
            </div>
          </div>
        </div>

        <div className="profile-side-panel">
          <span className="eyebrow">Profile action</span>
          <h3>Polish your first impression</h3>
          <p className="muted-copy">
            Strong profiles usually combine clarity, sincerity, and enough cultural detail for families to understand
            the person properly.
          </p>
          <Link className="primary-button full-width" to="/edit-profile">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="section-heading">
        <span>Profile Details</span>
        <h2>How your profile appears to others</h2>
      </div>

      <div className="details-grid">
        {[
          ["Email", user?.email],
          ["Phone", user?.phone],
          ["Religion", user?.religion],
          ["Caste", user?.caste],
          ["Gotra", user?.gotra],
          ["Mother Tongue", user?.motherTongue],
          ["Education", user?.education],
          ["Profession", user?.profession],
          ["Annual Income", user?.annualIncome],
          ["Height", user?.height],
          ["Marital Status", user?.maritalStatus]
        ].map(([label, value]) => renderField(label, value))}
      </div>

      <div className="section-heading inline-heading">
        <div>
          <span>Photo Gallery</span>
          <h2>Your profile gallery</h2>
        </div>
      </div>

      <div className="gallery-grid">
        {allPhotos.length ? (
          allPhotos.map((photo) => <img key={photo} src={photo} alt="Profile gallery" className="gallery-image" />)
        ) : (
          <div className="empty-state">Upload a profile photo to make your profile feel more trusted and complete.</div>
        )}
      </div>
    </section>
  );
};

export default Profile;
