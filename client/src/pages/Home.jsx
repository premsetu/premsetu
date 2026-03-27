import { Link } from "react-router-dom";

const stats = [
  { label: "Verified Members", value: "25,000+" },
  { label: "Success Stories", value: "4,800+" },
  { label: "Cities Covered", value: "320+" }
];

const steps = [
  { title: "Register", text: "Join in minutes with secure authentication and guided onboarding." },
  { title: "Create Profile", text: "Add your story, values, family background, and preferences." },
  { title: "Find Matches", text: "Use smart filters to discover people who align with your goals." },
  { title: "Connect", text: "Send interest, match mutually, and begin private conversations." }
];

const stories = [
  "Aditi & Rohan connected across Bengaluru and Pune after filtering by education and family values.",
  "Sneha & Harsh found each other through mutual interest and now mentor new PremSetu couples.",
  "Priya & Karan used their chat space to talk daily before meeting their families."
];

const Home = () => (
  <main>
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Premium Indian Matrimony Platform</span>
        <h1>Find Your Perfect Life Partner</h1>
        <p>
          PremSetu brings together thoughtful matchmaking, detailed profiles, and secure conversations in one
          elegant space designed for meaningful marriages.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="primary-button">
            Create Free Profile
          </Link>
          <Link to="/login" className="secondary-button">
            Login
          </Link>
        </div>
      </div>
      <div className="hero-panel">
        <div className="floating-card">
          <h3>Why families trust PremSetu</h3>
          <ul>
            <li>Detailed Indian profile fields including religion, caste, gotra, and mother tongue</li>
            <li>Private match-based chat</li>
            <li>Easy profile completion journey</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="stats" className="stats-grid">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <h2>{stat.value}</h2>
          <p>{stat.label}</p>
        </article>
      ))}
    </section>

    <section id="how-it-works" className="section-block">
      <div className="section-heading">
        <span>How It Works</span>
        <h2>A calm and guided path from signup to shaadi.</h2>
      </div>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <article key={step.title} className="step-card">
            <strong>0{index + 1}</strong>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section id="success-stories" className="section-block stories-block">
      <div className="section-heading">
        <span>Success Stories</span>
        <h2>Real journeys that started with one thoughtful message.</h2>
      </div>
      <div className="stories-grid">
        {stories.map((story) => (
          <article key={story} className="story-card">
            <p>{story}</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default Home;
