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
          <img
            src={user?.profilePhoto || "https://placehold.co/240x240/F1FAEE/E63946?text=PremSetu"}
            alt={user?.fullName}
          />
          <div>
            <span className="eyebrow">My Profile</span>
            <h1>{user?.fullName}</h1>
            <p>
              {user?.city || "City pending"}, {user?.state || "State pending"}
            </p>
            <p>{user?.bio || "Add your bio to introduce yourself better."}</p>
          </div>
        </div>
        <Link className="primary-button" to="/edit-profile">
          Edit Profile
        </Link>
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
          <h2>How your profile appears to others</h2>
        </div>
      </div>
      <div className="gallery-grid">
        {allPhotos.length ? (
          allPhotos.map((photo) => <img key={photo} src={photo} alt="Profile gallery" className="gallery-image" />)
        ) : (
          <div className="empty-state">Upload a profile photo to make your profile more trusted.</div>
        )}
      </div>
    </section>
  );
};

export default Profile;
