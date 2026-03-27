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

const Matches = () => {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchProfiles = async (selectedPage = page, selectedFilters = filters) => {
    const params = new URLSearchParams({ ...selectedFilters, page: selectedPage, limit: 10 });
    const { data } = await api.get(`/matches/suggestions?${params.toString()}`);
    setProfiles(data.users || []);
    setPagination(data.pagination);
  };

  useEffect(() => {
    const loadInitialProfiles = async () => {
      const params = new URLSearchParams({ ...initialFilters, page: 1, limit: 10 });
      const { data } = await api.get(`/matches/suggestions?${params.toString()}`);
      setProfiles(data.users || []);
      setPagination(data.pagination);
    };

    loadInitialProfiles().catch(() => null);
  }, []);

  const handleInterest = async (id) => {
    try {
      const { data } = await api.post(`/matches/interest/${id}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send interest.");
    }
  };

  const handleApply = async () => {
    setPage(1);
    await fetchProfiles(1, filters);
  };

  return (
    <section className="page-shell">
      <div className="section-heading inline-heading">
        <div>
          <span>Find Matches</span>
          <h1>Search for your ideal partner</h1>
        </div>
      </div>

      <div className="filter-panel">
        {Object.entries(filters).map(([key, value]) => (
          <input
            key={key}
            placeholder={key.replace(/([A-Z])/g, " $1")}
            value={value}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
          />
        ))}
        <button className="primary-button" onClick={handleApply}>
          Apply Filters
        </button>
      </div>

      <div className="cards-grid">
        {profiles.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} onInterest={handleInterest} />
        ))}
      </div>

      {!profiles.length && <div className="empty-state">No profiles matched your current filters.</div>}

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
        <span>
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
