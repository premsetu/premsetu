import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const loginHighlights = [
  {
    title: "Your profile, your pace",
    text: "Pick up where you left off, finish your profile, and continue with the matches that matter."
  },
  {
    title: "Mutual interest first",
    text: "PremSetu keeps conversations more intentional by opening chat only after both sides show interest."
  },
  {
    title: "Built for trust",
    text: "Detailed profiles and cleaner design help users and families make decisions with more comfort."
  }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      await login({ email, password });
      toast.success("Logged in successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-layout">
        <aside className="auth-showcase">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h1>Return to your matches, profile progress, and conversations.</h1>
          </div>

          <p className="support-copy">
            Login is simple and secure. If your English is basic, that is okay, the product is being shaped to stay
            cleaner and easier with every update.
          </p>

          <div className="auth-point-grid">
            {loginHighlights.map((item) => (
              <article key={item.title} className="auth-point">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </aside>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">Login to continue</span>
            <h1>Sign in to PremSetu</h1>
            <p>Continue your search, review incoming interests, and pick up your private conversations.</p>
          </div>

          <div className="form-grid single-column">
            <label className="field-stack">
              <span>Email Address</span>
              <input placeholder="name@example.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>

            <label className="field-stack">
              <span>Password</span>
              <input
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>

          <div className="helper-ribbon">Simple note: clear profiles and recent activity usually get better attention.</div>

          <button className="primary-button full-width" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
