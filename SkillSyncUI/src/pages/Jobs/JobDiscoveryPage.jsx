import React, { useState, useEffect } from 'react';
import { jobApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  CheckCircle, 
  Clock, 
  Send, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Tag
} from 'lucide-react';

export function JobDiscoveryPage() {
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'applications'
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  const loadJobs = async (query = '') => {
    setIsLoading(true);
    try {
      const res = await jobApi.getJobs(query);
      if (res?.data) {
        setJobs(res.data);
      }
    } catch (err) {
      setError('Failed to load jobs: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const res = await jobApi.getApplications();
      if (res?.data) {
        setApplications(res.data);
      }
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadJobs(searchQuery);
  };

  const handleApply = async (jobId, status = 'APPLIED') => {
    if (!isAuthenticated) {
      setError('Please sign in to track or apply for jobs.');
      return;
    }

    try {
      const res = await jobApi.applyJob(jobId, { status });
      if (res?.data) {
        setMessage(status === 'APPLIED' ? 'Application recorded in your career pipeline!' : 'Job saved to your bookmarks!');
        loadApplications();
        setTimeout(() => setMessage(''), 3500);
      }
    } catch (err) {
      setError('Action failed: ' + err.message);
    }
  };

  const isJobApplied = (jobId) => {
    const app = applications.find(a => a.job?.id === jobId);
    return app?.status;
  };

  return (
    <div className="jobs-page-container">
      {/* Header */}
      <div className="jobs-header">
        <div>
          <span className="eyebrow">Opportunity Hub</span>
          <h1>Job Discovery &amp; Career Tracking</h1>
          <p className="page-desc">
            Explore verified engineering roles matched to technical competencies and track your application pipeline.
          </p>
        </div>

        {isAuthenticated && (
          <div className="jobs-tab-toggle">
            <button 
              className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              <Briefcase size={16} />
              <span>Browse Roles ({jobs.length})</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <Clock size={16} />
              <span>Tracked Pipeline ({applications.length})</span>
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="auth-alert error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'browse' ? (
        <>
          {/* Search Bar */}
          <div className="card-panel search-panel mb-6">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or skills (e.g., Java, Spring Boot, React)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">Search</button>
            </form>
          </div>

          {/* Job Listings Grid */}
          {isLoading ? (
            <div className="page-loading-wrapper">
              <div className="spinner"></div>
              <p>Searching verified opportunities...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="job-listings-grid">
              {jobs.map((job) => {
                const appliedStatus = isJobApplied(job.id);
                return (
                  <div key={job.id} className="job-card">
                    <div className="job-card-top">
                      <div>
                        <span className="job-company">{job.company}</span>
                        <h3 className="job-title">{job.title}</h3>
                      </div>
                      {appliedStatus && (
                        <span className={`application-pill ${appliedStatus.toLowerCase()}`}>
                          {appliedStatus}
                        </span>
                      )}
                    </div>

                    <div className="job-meta-row">
                      <span><MapPin size={15} /> {job.location}</span>
                      <span><Briefcase size={15} /> {job.employmentType} ({job.experienceLevel})</span>
                      {job.salaryRange && <span><DollarSign size={15} /> {job.salaryRange}</span>}
                    </div>

                    <p className="job-desc-snippet">{job.description}</p>

                    {job.requiredSkills && (
                      <div className="job-skills-tags">
                        {job.requiredSkills.split(',').map((skill, idx) => (
                          <span key={idx} className="skill-tag">
                            <Tag size={11} />
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="job-card-actions">
                      <button 
                        type="button" 
                        onClick={() => handleApply(job.id, 'APPLIED')}
                        className={`btn-apply ${appliedStatus === 'APPLIED' ? 'applied' : ''}`}
                      >
                        <Send size={15} />
                        <span>{appliedStatus === 'APPLIED' ? 'Applied' : 'Mark Applied'}</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleApply(job.id, 'SAVED')}
                        className="btn-save-job"
                        title="Save to bookmarks"
                      >
                        <Bookmark size={15} />
                        <span>{appliedStatus === 'SAVED' ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-panel card-panel">
              <Briefcase size={48} className="empty-state-icon" />
              <h3>No Jobs Matched Your Query</h3>
              <p>Try searching for broader keywords like "Java", "React", or "Engineer".</p>
            </div>
          )}
        </>
      ) : (
        /* Applications Pipeline Tab */
        <div className="applications-pipeline-panel">
          <h3>Your Tracked Applications &amp; Saved Jobs</h3>
          {applications.length > 0 ? (
            <div className="applications-table-wrapper">
              <table className="skill-gaps-table">
                <thead>
                  <tr>
                    <th>Job Title &amp; Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date Tracked</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.job?.title}</strong>
                        <div className="text-muted text-sm">{app.job?.company}</div>
                      </td>
                      <td>{app.job?.location}</td>
                      <td>
                        <span className={`application-pill ${app.status?.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="proficiency-select"
                          value={app.status}
                          onChange={(e) => handleApply(app.job?.id, e.target.value)}
                        >
                          <option value="SAVED">SAVED</option>
                          <option value="APPLIED">APPLIED</option>
                          <option value="INTERVIEWING">INTERVIEWING</option>
                          <option value="OFFERED">OFFERED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-panel card-panel">
              <Bookmark size={40} className="empty-state-icon" />
              <p>No jobs tracked yet. Switch to the browse tab and save or mark jobs as applied.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
