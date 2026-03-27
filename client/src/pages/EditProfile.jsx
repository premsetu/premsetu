import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";

const stepDefinitions = [
  ["Basic Info", ["fullName", "dateOfBirth", "gender", "phone"]],
  ["Religious Info", ["religion", "caste", "gotra", "motherTongue"]],
  ["Location", ["city", "state"]],
  ["Education & Career", ["education", "profession", "annualIncome"]],
  ["About Me", ["bio", "height", "maritalStatus"]],
  ["Photos", []]
];

const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [photoSubmitting, setPhotoSubmitting] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
    gender: user?.gender || "female",
    phone: user?.phone || "",
    religion: user?.religion || "",
    caste: user?.caste || "",
    gotra: user?.gotra || "",
    motherTongue: user?.motherTongue || "",
    city: user?.city || "",
    state: user?.state || "",
    education: user?.education || "",
    profession: user?.profession || "",
    annualIncome: user?.annualIncome || "",
    bio: user?.bio || "",
    height: user?.height || "",
    maritalStatus: user?.maritalStatus || "never married"
  });

  const currentTitle = useMemo(() => stepDefinitions[step][0], [step]);

  const handleSaveDetails = async () => {
    try {
      setSubmitting(true);
      await api.put("/profile/update", formData);
      await refreshUser();
      toast.success("Profile details saved.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save profile details.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadPhotos = async () => {
    if (!profilePhoto && !galleryPhotos.length) {
      return true;
    }

    try {
      setPhotoSubmitting(true);
      const data = new FormData();
      if (profilePhoto) data.append("profilePhoto", profilePhoto);
      Array.from(galleryPhotos).forEach((file) => data.append("photos", file));
      await api.post("/profile/upload-photo", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      await refreshUser();
      toast.success("Photos uploaded.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Photo upload failed.");
      return false;
    } finally {
      setPhotoSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (step < stepDefinitions.length - 1) {
      const saved = await handleSaveDetails();
      if (saved) setStep((value) => value + 1);
      return;
    }

    const saved = await handleSaveDetails();
    if (!saved) return;
    const uploaded = await handleUploadPhotos();
    if (uploaded) navigate("/profile");
  };

  return (
    <section className="page-shell">
      <div className="section-heading inline-heading">
        <div>
          <span>Profile Builder</span>
          <h1>{currentTitle}</h1>
        </div>
        <strong>
          Step {step + 1} / {stepDefinitions.length}
        </strong>
      </div>

      <div className="stepper">
        {stepDefinitions.map(([title], index) => (
          <button key={title} className={`step-pill ${index === step ? "active" : ""}`} onClick={() => setStep(index)}>
            {title}
          </button>
        ))}
      </div>

      <div className="auth-card wide">
        {step === 0 && (
          <FormSection formData={formData} setFormData={setFormData} fields={["fullName", "dateOfBirth", "gender", "phone"]} />
        )}
        {step === 1 && (
          <FormSection
            formData={formData}
            setFormData={setFormData}
            fields={["religion", "caste", "gotra", "motherTongue"]}
          />
        )}
        {step === 2 && <FormSection formData={formData} setFormData={setFormData} fields={["city", "state"]} />}
        {step === 3 && (
          <FormSection
            formData={formData}
            setFormData={setFormData}
            fields={["education", "profession", "annualIncome"]}
          />
        )}
        {step === 4 && (
          <FormSection formData={formData} setFormData={setFormData} fields={["bio", "height", "maritalStatus"]} />
        )}
        {step === 5 && (
          <div className="form-grid single-column">
            <label>
              Profile Photo
              <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} />
            </label>
            <label>
              Gallery Photos
              <input type="file" accept="image/*" multiple onChange={(e) => setGalleryPhotos(e.target.files)} />
            </label>
            <button type="button" className="secondary-button" onClick={handleUploadPhotos} disabled={photoSubmitting}>
              {photoSubmitting ? "Uploading..." : "Upload Photos"}
            </button>
          </div>
        )}

        <div className="wizard-actions">
          <button type="button" className="ghost-button" onClick={() => setStep((value) => Math.max(0, value - 1))}>
            Back
          </button>
          <button type="button" className="primary-button" onClick={handleContinue} disabled={submitting || photoSubmitting}>
            {step === stepDefinitions.length - 1 ? "Finish Profile" : "Save & Continue"}
          </button>
        </div>
      </div>
    </section>
  );
};

const FormSection = ({ formData, setFormData, fields }) => (
  <div className="form-grid">
    {fields.map((field) => {
      if (field === "gender") {
        return (
          <select key={field} value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        );
      }

      if (field === "maritalStatus") {
        return (
          <select key={field} value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}>
            <option value="never married">Never Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        );
      }

      if (field === "bio") {
        return (
          <textarea
            key={field}
            rows="5"
            placeholder="Tell people about yourself, your family values, and what you are looking for."
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        );
      }

      return (
        <input
          key={field}
          type={field === "dateOfBirth" ? "date" : "text"}
          placeholder={field.replace(/([A-Z])/g, " $1")}
          value={formData[field]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        />
      );
    })}
  </div>
);

export default EditProfile;
