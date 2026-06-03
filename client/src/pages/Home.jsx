import { Link } from "react-router-dom";

const stats = [
  { label: "Verified Members", value: "25,000+" },
  { label: "Families Connected", value: "8,400+" },
  { label: "Cities Covered", value: "320+" },
  { label: "Private Match Chats", value: "1.2M+" }
];

const steps = [
  {
    title: "Register with ease",
    text: "Begin with the basics. Straightforward fields, simple English, and no pressure to finish everything at once."
  },
  {
    title: "Build a trusted profile",
    text: "Add family values, education, city, mother tongue, and the details Indian families usually care about."
  },
  {
    title: "Review meaningful matches",
    text: "Use filters thoughtfully and focus on the profiles that genuinely feel right for your life stage."
  },
  {
    title: "Connect privately",
    text: "Interests stay intentional, and chat opens only after mutual interest, keeping the process calm and respectful."
  }
];

const featureCards = [
  {
    title: "Designed for serious intent",
    text: "PremSetu is not built for endless swiping. It is built for clear profiles, family context, and confident next steps."
  },
  {
    title: "Helpful without being overwhelming",
    text: "The flow stays in English, but the tone is easier, warmer, and more natural for first-time matrimonial users."
  },
  {
    title: "Ready for deeper Indian matchmaking",
    text: "The product already supports culture-aware profile fields, and the next phase can grow into kundli and guna-based guidance."
  }
];

const cultureCards = [
  {
    title: "Family-aware profile details",
    text: "Religion, caste, gotra, mother tongue, city, education, and profession are all part of the matching picture."
  },
  {
    title: "Warm helper copy",
    text: "Little hints like 'simple rakho' and 'clear details help' make onboarding easier for users with basic English."
  },
  {
    title: "Trust-first communication",
    text: "Mutual interest opens chat, which keeps conversations more intentional and more comfortable for both families."
  },
  {
    title: "Built for future astrology modules",
    text: "The new UI direction leaves clear room for kundli upload, guna milan scorecards, and astro compatibility sections later."
  }
];

const stories = [
  "Aditi and Rohan shortlisted each other because both wanted a profile that was simple, sincere, and family friendly from day one.",
  "Sneha and Harsh used mutual interest plus private chat to build comfort slowly before involving parents in the conversation.",
  "Priya and Karan found confidence in the detailed profile format because it helped them speak clearly about values, lifestyle, and future plans."
];

const homePreview = [
  { name: "Aditi S.", meta: "Pune | Architect", score: "Shared values" },
  { name: "Rohan M.", meta: "Bengaluru | Product Lead", score: "Family fit" },
  { name: "Naina R.", meta: "Jaipur | Doctor", score: "Good profile depth" }
];

const Home = () => (
  <main>
    <section className="hero-section">
      <div className="hero-copy">
        <div className="hero-badges">
          <span className="badge">Premium Indian matrimony</span>
          <span className="badge">Private, respectful, family-aware</span>
        </div>

        <div>
          <span className="eyebrow">Rooted in trust, designed for today</span>
          <h1 className="display-title">Find your life partner with warmth, clarity, and confidence.</h1>
        </div>

        <p>
          PremSetu brings together thoughtful matchmaking, rich cultural profile details, and private conversations in a
          space that feels premium but still easy to use. English rahegi, but the experience stays simple and warm.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="primary-button">
            Create Free Profile
          </Link>
          <Link to="/login" className="secondary-button">
            Login
          </Link>
        </div>

        <div className="hero-insight-row">
          <div className="hero-insight">
            <strong>Thoughtful, not rushed</strong>
            <p>Simple profile building, clearer trust signals, and a better pace for serious matrimonial decisions.</p>
          </div>
          <div className="hero-insight">
            <strong>Indian context built in</strong>
            <p>Made for the details families often discuss, with room for even deeper cultural matching in the next phase.</p>
          </div>
        </div>
      </div>

      <div className="hero-panel">
        <div className="hero-showcase">
          <div className="showcase-header">
            <div>
              <span className="eyebrow">Inside PremSetu</span>
              <h3>Calm matchmaking, better first impressions</h3>
            </div>
            <span className="preview-score">Curated look</span>
          </div>

          <div className="preview-stack">
            {homePreview.map((profile) => (
              <article key={profile.name} className="preview-card">
                <div className="preview-photo" />
                <div className="preview-meta">
                  <strong>{profile.name}</strong>
                  <span>{profile.meta}</span>
                </div>
                <span className="preview-score">{profile.score}</span>
              </article>
            ))}
          </div>

          <div className="trust-panel">
            <div className="trust-item">
              <strong>Why this design direction works</strong>
              <p>Premium enough for trust, soft enough for family users, and clear enough for people with basic English.</p>
            </div>
            <div className="trust-item">
              <strong>Future ready</strong>
              <p>Kundli and guna sections can fit naturally into this calmer, editorial-style interface later.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="stats" className="section-block">
      <div className="stats-strip">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </article>
        ))}
      </div>
    </section>

    <section id="how-it-works" className="section-block">
      <div className="section-heading">
        <span>How It Works</span>
        <h2>A guided path from signup to serious conversation.</h2>
        <p className="section-copy">
          The process stays clear at every step. No noisy clutter, no confusion, just the journey that matters.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((step, index) => (
          <article key={step.title} className="step-card">
            <span className="step-number">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section-block">
      <div className="section-heading">
        <span>Why PremSetu</span>
        <h2>A stronger fit for the way Indian matchmaking actually works.</h2>
      </div>

      <div className="feature-grid">
        {featureCards.map((feature) => (
          <article key={feature.title} className="feature-card">
            <strong>{feature.title}</strong>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section id="culture-fit" className="section-block">
      <div className="culture-layout">
        <div className="culture-copy">
          <div className="section-heading">
            <span>Indian Family Fit</span>
            <h2>Built for real profile conversations, not just surface attraction.</h2>
          </div>

          <p className="section-copy">
            This next version of PremSetu is being shaped for Indian families who care about values, clarity, and
            compatibility. The UI is being polished now, and the deeper culture-driven features can grow cleanly on top
            of it.
          </p>

          <ul className="culture-list">
            <li>Warm guidance helps users who are new to digital matchmaking or not fully comfortable with English.</li>
            <li>Current profile structure already supports meaningful family and background details beyond basic dating-app fields.</li>
            <li>Future astrology and guna milan modules can plug into this system without making the product feel cluttered.</li>
          </ul>
        </div>

        <div className="culture-card-grid">
          {cultureCards.map((card) => (
            <article key={card.title} className="culture-card">
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="success-stories" className="section-block">
      <div className="section-heading">
        <span>Success Stories</span>
        <h2>Good conversations begin with clarity and comfort.</h2>
      </div>

      <div className="stories-grid">
        {stories.map((story) => (
          <article key={story} className="story-card">
            <p>{story}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section-block">
      <div className="cta-banner">
        <div>
          <span className="eyebrow">Start your profile</span>
          <h2>Join PremSetu and begin with a profile families can trust.</h2>
          <p>
            The current platform already handles registration, profile building, matching, and private chat. The next
            polish is all about making that experience feel truly premium.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/register" className="primary-button">
            Create Profile
          </Link>
          <Link to="/matches" className="secondary-button">
            Explore Matches
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default Home;
