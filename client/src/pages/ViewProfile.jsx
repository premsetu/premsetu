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
          <img
            src={profile.profilePhoto || "https://placehold.co/240x240/F1FAEE/E63946?text=PremSetu"}
            alt={profile.fullName}
          />
          <div>
            <span className="eyebrow">Member Profile</span>
            <h1>{profile.fullName}</h1>
            <p>
              {profile.city || "City not added"}, {profile.state || "State not added"}
            </p>
            <p>{profile.bio || "This member is still building their profile."}</p>
            <div className="card-actions">
              {matched ? (
                <Link className="primary-button" to={`/chat/${profile._id}`}>
                  Chat Now
                </Link>
              ) : (
                <button className="primary-button" onClick={handleInterest} disabled={alreadyInterested}>
                  {alreadyInterested ? "Already Interested" : "Send Interest"}
                </button>
              )}
            </div>
          </div>
        </div>
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

      <div className="gallery-grid">
        {[profile.profilePhoto, ...(profile.photos || [])]
          .filter(Boolean)
          .map((photo) => <img key={photo} src={photo} alt="Member gallery" className="gallery-image" />)}
      </div>
    </section>
  );
};

export default ViewProfile;
