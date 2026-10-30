import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profileApi, roadmapApi } from '../../services/api';
import { 
  Compass, 
  Target, 
  Map, 
  FileText, 
  GitBranch, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Briefcase,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await profileApi.getDashboard();
        if (res?.data) {
          setDashboard(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="page-loading-wrapper">
        <div className="spinner"></div>
        <p>Loading your career dashboard...</p>
      </div>
    );
  }

  const profilePct = dashboard?.profileCompletionPercentage ?? 20;
  const targetRole = dashboard?.targetJobRole || 'Software Engineer';
  const recentScore = dashboard?.recentResumeScore;
  const activeRoadmap = dashboard?.activeRoadmap;
  const nextTask = dashboard?.nextRecommendedTask;
  const skillGaps = dashboard?.topSkillGaps || [];

  return (
    <div className="dashboard-page-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-col">
          <div className="welcome-badge">
            <Sparkles size={16} />
            <span>Candidate Hub</span>
          </div>
          <h1>Welcome, {user?.fullName || 'Candidate'}</h1>
          <p className="welcome-sub">
            Targeting: <strong>{targetRole}</strong> &bull; Track your readiness and execute your personalized roadmap.
          </p>
        </div>

        <div className="profile-completion-card">
          <div className="profile-completion-header">
            <span className="profile-completion-label">Profile Readiness</span>
            <span className="profile-completion-val">{profilePct}%</span>
          </div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${profilePct}%` }}
            />
          </div>
          <Link to="/profile" className="profile-completion-link">
            <span>{profilePct < 100 ? 'Complete profile details' : 'Edit profile'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {error && (
        <div className="dashboard-alert error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="dashboard-metrics-grid">
        {/* Score Card */}
        <div className="metric-box">
          <div className="metric-icon-wrap gold">
            <FileText size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Latest Resume Score</span>
            <div className="metric-num-row">
              <span className="metric-value">
                {recentScore != null ? recentScore : '--'}
              </span>
              <span className="metric-unit">
                {dashboard?.recentResumeScoreType === 'ATS Match' ? '/ 100' : (recentScore != null ? '/ 10' : '')}
              </span>
            </div>
            <p className="metric-hint">
              {recentScore != null 
                ? `${dashboard?.recentResumeScoreType || 'Review'} evaluated by Gemini AI` 
                : 'No resume analyzed yet'}
            </p>
          </div>
          <Link to="/resume" className="metric-card-link">
            <span>{recentScore != null ? 'New Analysis' : 'Upload Resume'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Roadmap Progress Card */}
        <div className="metric-box">
          <div className="metric-icon-wrap emerald">
            <Map size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Roadmap Progress</span>
            <div className="metric-num-row">
              <span className="metric-value">
                {activeRoadmap ? `${activeRoadmap.progressPercentage}%` : '0%'}
              </span>
            </div>
            <p className="metric-hint">
              {activeRoadmap 
                ? `${activeRoadmap.milestones?.length || 0} milestones planned` 
                : 'No active roadmap generated'}
            </p>
          </div>
          <Link to="/roadmap" className="metric-card-link">
            <span>{activeRoadmap ? 'View Roadmap' : 'Generate Roadmap'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Total Gaps Identified */}
        <div className="metric-box">
          <div className="metric-icon-wrap blue">
            <GitBranch size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Priority Skill Gaps</span>
            <div className="metric-num-row">
              <span className="metric-value">{skillGaps.length}</span>
              <span className="metric-unit">identified</span>
            </div>
            <p className="metric-hint">For {targetRole}</p>
          </div>
          <Link to="/skills" className="metric-card-link">
            <span>Analyze Gaps</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Total Applied Jobs */}
        <div className="metric-box">
          <div className="metric-icon-wrap violet">
            <Briefcase size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Tracked Opportunities</span>
            <div className="metric-num-row">
              <span className="metric-value">{dashboard?.totalAppliedJobsCount ?? 0}</span>
              <span className="metric-unit">saved/applied</span>
            </div>
            <p className="metric-hint">Career pipeline</p>
          </div>
          <Link to="/jobs" className="metric-card-link">
            <span>Browse Jobs</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Content Split: Active Learning & Priority Gaps */}
      <div className="dashboard-content-split">
        {/* Next Task & Active Roadmap Section */}
        <div className="dashboard-main-col">
          <div className="card-panel">
            <div className="card-panel-header">
              <div className="card-panel-title">
                <Map size={20} className="panel-title-icon emerald" />
                <h3>Active Learning Journey</h3>
              </div>
              {activeRoadmap && (
                <Link to="/roadmap" className="btn-ghost-sm">Open Full Roadmap</Link>
              )}
            </div>

            {activeRoadmap ? (
              <div className="active-roadmap-widget">
                <div className="roadmap-title-row">
                  <h4>{activeRoadmap.title}</h4>
                  <span className="status-badge active">{activeRoadmap.status}</span>
                </div>

                <div className="roadmap-meta-row">
                  <span><Clock size={15} /> ~{activeRoadmap.totalEstimatedHours} hours</span>
                  <span><TrendingUp size={15} /> {activeRoadmap.weeklyHours} hrs/week</span>
                </div>

                {nextTask ? (
                  <div className="next-task-highlight">
                    <span className="next-task-eyebrow">Recommended Next Action:</span>
                    <div className="next-task-box">
                      <div className="next-task-info">
                        <span className="task-type-badge">{nextTask.taskType}</span>
                        <h5>{nextTask.title}</h5>
                        <p>{nextTask.description}</p>
                      </div>
                      <Link to="/roadmap" className="btn-primary-sm">
                        <span>Work on Task</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="roadmap-completed-banner">
                    <CheckCircle2 size={24} className="text-success" />
                    <div>
                      <h5>Roadmap Complete!</h5>
                      <p>You have accomplished all milestones. Consider generating an advanced roadmap or exploring job opportunities.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state-panel">
                <Map size={36} className="empty-state-icon" />
                <h4>No Active Learning Roadmap</h4>
                <p>Generate an AI career roadmap based on your current resume and target job role.</p>
                <Link to="/roadmap" className="btn-primary-sm">Generate AI Roadmap</Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Skill Gaps Sidebar */}
        <div className="dashboard-side-col">
          <div className="card-panel">
            <div className="card-panel-header">
              <div className="card-panel-title">
                <GitBranch size={20} className="panel-title-icon blue" />
                <h3>Priority Skill Gaps</h3>
              </div>
              <Link to="/skills" className="btn-ghost-sm">View All</Link>
            </div>

            {skillGaps.length > 0 ? (
              <div className="skill-gaps-mini-list">
                {skillGaps.slice(0, 5).map((gap) => (
                  <div key={gap.id} className="gap-mini-item">
                    <div className="gap-mini-top">
                      <span className="gap-skill-name">{gap.skillName}</span>
                      <span className={`priority-pill ${gap.priority?.toLowerCase()}`}>
                        {gap.priority}
                      </span>
                    </div>
                    <div className="gap-proficiency-row">
                      <span>{gap.currentProficiency}</span>
                      <ArrowRight size={12} className="text-muted" />
                      <strong>{gap.desiredProficiency}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-panel">
                <GitBranch size={32} className="empty-state-icon" />
                <p>No skill gaps analyzed yet.</p>
                <Link to="/skills" className="btn-ghost-sm">Analyze Gaps</Link>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="card-panel mt-4">
            <h4>Quick Actions</h4>
            <div className="quick-action-buttons">
              <Link to="/resume" className="quick-action-btn">
                <FileText size={18} />
                <span>Upload &amp; Review Resume</span>
              </Link>
              <Link to="/skills" className="quick-action-btn">
                <GitBranch size={18} />
                <span>Run Skill Gap Check</span>
              </Link>
              <Link to="/jobs" className="quick-action-btn">
                <Briefcase size={18} />
                <span>Discover Tech Jobs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
