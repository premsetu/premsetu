import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  gender: "female",
  dateOfBirth: ""
};

const registerHighlights = [
  {
    title: "Simple start",
    text: "Bas basic details se shuru kijiye. Full profile aap baad mein comfortably complete kar sakte ho."
  },
  {
    title: "Private by design",
    text: "Interests stay controlled and chat opens only after mutual interest, which keeps things respectful."
  },
  {
    title: "Made for serious intent",
    text: "This is built for meaningful introductions, not casual scrolling."
  }
];

const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      toast.error("Please fill every field.");
      return;
    }

    try {
      setSubmitting(true);
      await login(formData, "/auth/register");
      toast.success("Welcome to PremSetu!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-layout">
        <aside className="auth-showcase">
          <div>
            <span className="eyebrow">Start your journey</span>
            <h1>Create a profile that feels sincere, clear, and family ready.</h1>
          </div>

          <p className="support-copy">
            PremSetu keeps the first step simple. English rahegi, but the flow is soft, guided, and made for users who
            want clarity over clutter.
          </p>

          <div className="auth-point-grid">
            {registerHighlights.map((item) => (
              <article key={item.title} className="auth-point">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </aside>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">Create your account</span>
            <h1>Join PremSetu</h1>
            <p>Use your real details. Clear profiles usually lead to better trust and better responses.</p>
          </div>

          <div className="form-grid">
            <label className="field-stack">
              <span>Full Name</span>
              <input
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
              />
            </label>

            <label className="field-stack">
              <span>Email Address</span>
              <input
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
            </label>

            <label className="field-stack">
              <span>Password</span>
              <input
                placeholder="Choose a secure password"
                type="password"
                value={formData.password}
                onChange={(event) => handleChange("password", event.target.value)}
              />
            </label>

            <label className="field-stack">
              <span>Phone Number</span>
              <input
                placeholder="10 digit mobile number"
                value={formData.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
            </label>

            <label className="field-stack">
              <span>Gender</span>
              <select value={formData.gender} onChange={(event) => handleChange("gender", event.target.value)}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="field-stack">
              <span>Date of Birth</span>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) => handleChange("dateOfBirth", event.target.value)}
              />
            </label>
          </div>

          <div className="helper-ribbon">
            Tip: simple and accurate details are enough for now. Full cultural profile can be completed after signup.
          </div>

          <button className="primary-button full-width" disabled={submitting}>
            {submitting ? "Creating account..." : "Create My Profile"}
          </button>

          <p>
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
