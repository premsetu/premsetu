import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const ViewProfile = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get(`/profile/${id}`)
      .then(({ data }) => setProfile(data.user))
      .catch(() => null);
  }, [id]);

  if (!profile) {
    return <div className="page-loader">Loading profile...</div>;
  }

  const alreadyInterested = user?.interestedIn?.includes(profile._id);
  const matched = user?.matches?.includes(profile._id);

  const handleInterest = async () => {
    try {
      const { data } = await api.post(`/matches/interest/${profile._id}`);
      toast.success(data.message);
      await refreshUser();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send interest.");
    }
  };

  return (
    <section className="page-shell">
      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-photo-frame">
            <img
              src={profile.profilePhoto || "https://placehold.co/320x360/F0EDE6/3B4A3A?text=PremSetu"}
              alt={profile.fullName}
            />
          </div>

          <div className="profile-summary">
            <span className="eyebrow">Member Profile</span>
            <h1>{profile.fullName}</h1>
            <p className="detail-line">
              {profile.city || "City not added"}, {profile.state || "State not added"}
            </p>
            <p>{profile.bio || "This member is still building their profile."}</p>

            <div className="profile-badges">
              <span className="chip">{profile.religion || "Religion pending"}</span>
              <span className="chip">{profile.motherTongue || "Language pending"}</span>
              <span className="chip">{profile.maritalStatus || "Never married"}</span>
            </div>
          </div>
        </div>

        <div className="profile-side-panel">
          <span className="eyebrow">Connection</span>
          <h3>{matched ? "You are matched" : "Interested in this profile?"}</h3>
          <p className="muted-copy">
            If the profile feels right, send interest. If both sides are interested, private chat opens automatically.
          </p>

          {matched ? (
            <Link className="primary-button full-width" to={`/chat/${profile._id}`}>
              Chat Now
            </Link>
          ) : (
            <button className="primary-button full-width" onClick={handleInterest} disabled={alreadyInterested}>
              {alreadyInterested ? "Already Interested" : "Send Interest"}
            </button>
          )}
        </div>
      </div>

      <div className="section-heading">
        <span>Profile Details</span>
        <h2>Key details for clarity and family fit</h2>
      </div>

      <div className="details-grid">
        {[
          ["Religion", profile.religion],
          ["Caste", profile.caste],
          ["Gotra", profile.gotra],
          ["Mother Tongue", profile.motherTongue],
          ["Education", profile.education],
          ["Profession", profile.profession],
          ["Income", profile.annualIncome],
          ["Height", profile.height],
          ["Marital Status", profile.maritalStatus]
        ].map(([label, value]) => (
          <div className="detail-item" key={label}>
            <span>{label}</span>
            <strong>{value || "Not added yet"}</strong>
          </div>
        ))}
      </div>

      <div className="section-heading inline-heading">
        <div>
          <span>Gallery</span>
          <h2>Member photos</h2>
        </div>
      </div>

      <div className="gallery-grid">
        {[profile.profilePhoto, ...(profile.photos || [])]
          .filter(Boolean)
          .map((photo) => <img key={photo} src={photo} alt="Member gallery" className="gallery-image" />)}
      </div>
    </section>
  );
};

export default ViewProfile;
