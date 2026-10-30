import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillGapApi, profileApi } from '../../services/api';
import { 
  GitBranch, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Map, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export function SkillGapPage() {
  const navigate = useNavigate();

  const [targetRole, setTargetRole] = useState('Senior Java Backend Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [skillGaps, setSkillGaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingGaps, setIsFetchingGaps] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Load target role from candidate profile if available
        const profileRes = await profileApi.getProfile().catch(() => null);
        if (profileRes?.data?.targetJobRole) {
          setTargetRole(profileRes.data.targetJobRole);
        }

        // Load existing gaps
        const gapsRes = await skillGapApi.getGaps().catch(() => null);
        if (gapsRes?.data && gapsRes.data.length > 0) {
          setSkillGaps(gapsRes.data);
        }
      } finally {
        setIsFetchingGaps(false);
      }
    }
    loadInitialData();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      setError('Please provide a target job role.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await skillGapApi.analyze({
        targetJobRole: targetRole.trim(),
        jobDescription: jobDescription.trim(),
      });

      if (res?.data) {
        setSkillGaps(res.data);
        setSuccessMessage(`Skill-gap analysis complete! Identified ${res.data.length} competency factors.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete skill gap analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProficiencyChange = async (gapId, newProficiency) => {
    try {
      const res = await skillGapApi.updateProficiency(gapId, newProficiency);
      if (res?.data) {
        setSkillGaps(prev => prev.map(gap => gap.id === gapId ? res.data : gap));
      }
    } catch (err) {
      setError('Could not update proficiency: ' + err.message);
    }
  };

  const handleGoToRoadmap = () => {
    navigate('/roadmap', { 
      state: { 
        targetJobRole: targetRole,
        skillGaps 
      } 
    });
  };

  return (
    <div className="skill-gap-page-container">
      <div className="skill-gap-header">
        <div className="header-copy">
          <span className="eyebrow">Competency Evaluation</span>
          <h1>AI Skill-Gap Analyzer</h1>
          <p className="page-desc">
            Identify exact competency discrepancies between your current technical resume and expectations for your target role.
          </p>
        </div>

        {skillGaps.length > 0 && (
          <button onClick={handleGoToRoadmap} className="btn-primary-action">
            <Map size={18} />
            <span>Generate Roadmap from Gaps</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="auth-alert error mb-4">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Input Form Panel */}
      <div className="card-panel mb-6">
        <form onSubmit={handleAnalyze} className="gap-input-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="targetRole">Target Job Role</label>
              <div className="input-with-icon">
                <Target size={18} className="field-icon" />
                <input
                  id="targetRole"
                  type="text"
                  placeholder="e.g. Java Backend Developer, Full-Stack Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Target Job Description (Optional for deep matching)</label>
            <textarea
              id="jobDescription"
              rows={4}
              placeholder="Paste specific job requirements or tech stack details from a target job listing to customize the analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              <Sparkles size={18} />
              <span>{isLoading ? 'Analyzing Competency Gaps with Gemini...' : 'Analyze Skill Gaps'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {isFetchingGaps ? (
        <div className="page-loading-wrapper">
          <div className="spinner"></div>
          <p>Loading your skill gaps...</p>
        </div>
      ) : skillGaps.length > 0 ? (
        <div className="skill-gaps-results-panel">
          <div className="gaps-summary-bar">
            <h3>Identified Skill Gaps for <em>{targetRole}</em></h3>
            <span className="gaps-count-badge">{skillGaps.length} Skills Evaluated</span>
          </div>

          <div className="skill-gaps-table-wrapper">
            <table className="skill-gaps-table">
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Category</th>
                  <th>Importance</th>
                  <th>Priority</th>
                  <th>Your Level (Editable)</th>
                  <th>Target Level</th>
                  <th>Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {skillGaps.map((gap) => (
                  <tr key={gap.id} className={`gap-row ${gap.priority?.toLowerCase()}`}>
                    <td className="skill-name-cell">
                      <strong>{gap.skillName}</strong>
                      {gap.prerequisites && (
                        <span className="prereq-text">Prereq: {gap.prerequisites}</span>
                      )}
                    </td>
                    <td>
                      <span className={`category-badge ${gap.category?.toLowerCase()}`}>
                        {gap.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`importance-badge ${gap.importance?.toLowerCase()}`}>
                        {gap.importance}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${gap.priority?.toLowerCase()}`}>
                        {gap.priority}
                      </span>
                    </td>
                    <td>
                      <select
                        className="proficiency-select"
                        value={gap.currentProficiency}
                        onChange={(e) => handleProficiencyChange(gap.id, e.target.value)}
                        title="Self-correct your proficiency level"
                      >
                        <option value="None">None</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </td>
                    <td>
                      <span className="desired-prof-pill">{gap.desiredProficiency}</span>
                    </td>
                    <td className="action-cell">
                      <p>{gap.recommendedAction}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Roadmap Transition CTA */}
          <div className="roadmap-cta-card mt-6">
            <div className="roadmap-cta-content">
              <Map size={32} className="text-gold" />
              <div>
                <h4>Ready to master these skills?</h4>
                <p>Generate a week-by-week personalized learning roadmap with verified exercises and portfolio projects.</p>
              </div>
            </div>
            <button onClick={handleGoToRoadmap} className="btn-primary">
              <span>Generate Personalized Roadmap</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state-panel card-panel">
          <GitBranch size={48} className="empty-state-icon" />
          <h3>No Skill Gap Analysis Performed Yet</h3>
          <p>Enter your target job role above and click "Analyze Skill Gaps" to generate a prioritized gap report.</p>
        </div>
      )}
    </div>
  );
}
