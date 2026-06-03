import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import ProfileCard from "../components/ProfileCard";

const initialFilters = {
  religion: "",
  state: "",
  city: "",
  education: "",
  profession: "",
  minAge: "21",
  maxAge: "35"
};

const filterFields = [
  { key: "religion", label: "Religion", hint: "Leave blank for open search" },
  { key: "state", label: "State", hint: "Useful for location-first search" },
  { key: "city", label: "City", hint: "Optional but helpful" },
  { key: "education", label: "Education", hint: "Use broad terms first" },
  { key: "profession", label: "Profession", hint: "Short terms work best" },
  { key: "minAge", label: "Minimum Age", hint: "Start with a wider range" },
  { key: "maxAge", label: "Maximum Age", hint: "Then narrow slowly" }
];

const Matches = () => {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [interestingIds, setInterestingIds] = useState(new Set());

  const fetchProfiles = async (selectedPage = page, selectedFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...selectedFilters, page: selectedPage, limit: 10 });
      const { data } = await api.get(`/matches/suggestions?${params.toString()}`);
      setProfiles(data.users || []);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialProfiles = async () => {
      const params = new URLSearchParams({ ...initialFilters, page: 1, limit: 10 });
      const { data } = await api.get(`/matches/suggestions?${params.toString()}`);
      setProfiles(data.users || []);
      setPagination(data.pagination);
    };

    loadInitialProfiles().catch(() => null).finally(() => setLoading(false));
  }, []);

  const handleInterest = async (id) => {
    setInterestingIds((prev) => new Set([...prev, id]));
    try {
      const { data } = await api.post(`/matches/interest/${id}`);
      toast.success(data.message);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send interest.");
    } finally {
      setInterestingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleApply = async () => {
    setPage(1);
    await fetchProfiles(1, filters);
  };

  const handleReset = async () => {
    setFilters(initialFilters);
    setPage(1);
    await fetchProfiles(1, initialFilters);
  };

  return (
    <section className="page-shell">
      <div className="page-banner">
        <div className="section-heading inline-heading">
          <div>
            <span>Find Matches</span>
            <h1>Search for someone who genuinely fits your life and values.</h1>
            <p className="section-copy">
              Use filters thoughtfully. Bahut zyada narrow mat karo in the first try, let good profiles appear first.
            </p>
          </div>
          <span className="status-pill">{pagination.total} profiles found</span>
        </div>
      </div>

      <div className="filter-panel">
        <div className="section-heading">
          <span>Smart Filters</span>
          <h2>Refine your search slowly and clearly.</h2>
        </div>

        <div className="filter-grid">
          {filterFields.map((field) => (
            <label key={field.key} className="field-stack">
              <span>{field.label}</span>
              <small>{field.hint}</small>
              <input
                placeholder={field.label}
                value={filters[field.key]}
                onChange={(event) => setFilters({ ...filters, [field.key]: event.target.value })}
              />
            </label>
          ))}
        </div>

        <div className="helper-ribbon">
          Tip: start broad with age and state, then narrow by education or profession only if needed.
        </div>

        <div className="filter-actions">
          <button className="primary-button" onClick={handleApply}>
            Apply Filters
          </button>
          <button className="secondary-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading profiles...</div>
      ) : profiles.length ? (
        <div className="cards-grid">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile._id}
              profile={profile}
              onInterest={handleInterest}
              actionDisabled={interestingIds.has(profile._id)}
              actionLabel={interestingIds.has(profile._id) ? "Sending..." : "Send Interest"}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">No profiles matched your current filters. Try a broader search.</div>
      )}

      <div className="pagination-row">
        <button
          className="secondary-button"
          onClick={() => {
            const nextPage = Math.max(1, page - 1);
            setPage(nextPage);
            fetchProfiles(nextPage).catch(() => null);
          }}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="status-pill">
          Page {pagination.page} of {pagination.pages}
        </span>

        <button
          className="secondary-button"
          onClick={() => {
            const nextPage = Math.min(pagination.pages, page + 1);
            setPage(nextPage);
            fetchProfiles(nextPage).catch(() => null);
          }}
          disabled={page === pagination.pages}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Matches;
