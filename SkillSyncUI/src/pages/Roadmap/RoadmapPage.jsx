import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { roadmapApi, profileApi } from '../../services/api';
import { 
  Map, 
  Sparkles, 
  CheckCircle, 
  Circle, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  Code, 
  Award, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  X, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  PlusCircle
} from 'lucide-react';

export function RoadmapPage() {
  const location = useLocation();

  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [allRoadmaps, setAllRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Generation Modal / Form State
  const [showGenModal, setShowGenModal] = useState(false);
  const [targetRole, setTargetRole] = useState(location.state?.targetJobRole || 'Senior Java Backend Developer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [learningStyle, setLearningStyle] = useState('Project-based');
  const [customNotes, setCustomNotes] = useState('');

  // AI Assistant Tutor Modal State
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorContextSkill, setTutorContextSkill] = useState('');
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorHistory, setTutorHistory] = useState([]);
  const [tutorLoading, setTutorLoading] = useState(false);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const profileRes = await profileApi.getProfile().catch(() => null);
        if (profileRes?.data) {
          if (!location.state?.targetJobRole && profileRes.data.targetJobRole) {
            setTargetRole(profileRes.data.targetJobRole);
          }
          if (profileRes.data.experienceLevel) setExperienceLevel(profileRes.data.experienceLevel);
          if (profileRes.data.weeklyHoursAvailable) setWeeklyHours(profileRes.data.weeklyHoursAvailable);
          if (profileRes.data.learningStyle) setLearningStyle(profileRes.data.learningStyle);
        }

        const activeRes = await roadmapApi.getActiveRoadmap().catch(() => null);
        if (activeRes?.data) {
          setActiveRoadmap(activeRes.data);
        }

        const listRes = await roadmapApi.getRoadmaps().catch(() => null);
        if (listRes?.data) {
          setAllRoadmaps(listRes.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load roadmaps.');
      } finally {
        setIsLoading(false);
      }
    }
    loadRoadmaps();
  }, [location.state]);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setIsGenerating(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await roadmapApi.generate({
        targetJobRole: targetRole,
        experienceLevel,
        weeklyHours: parseInt(weeklyHours) || 10,
        learningStyle,
        customNotes,
      });

      if (res?.data) {
        setActiveRoadmap(res.data);
        setAllRoadmaps(prev => [res.data, ...prev]);
        setShowGenModal(false);
        setSuccessMessage('Your personalized AI Career Roadmap has been created!');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap. Please verify your Gemini API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const nextStatus = !currentStatus;
      const res = await roadmapApi.toggleTask(taskId, nextStatus);

      if (res?.data) {
        // Update local task state
        setActiveRoadmap(prev => {
          if (!prev) return prev;
          let total = 0;
          let completed = 0;

          const updatedMilestones = prev.milestones.map(m => {
            const updatedTasks = m.tasks.map(t => {
              const isComp = t.id === taskId ? nextStatus : Boolean(t.isCompleted);
              total++;
              if (isComp) completed++;
              return t.id === taskId ? { ...t, isCompleted: nextStatus } : t;
            });
            return { ...m, tasks: updatedTasks };
          });

          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          return {
            ...prev,
            progressPercentage: pct,
            status: pct >= 100 ? 'COMPLETED' : 'ACTIVE',
            milestones: updatedMilestones,
          };
        });
      }
    } catch (err) {
      setError('Could not update task: ' + err.message);
    }
  };

  const handleOpenTutor = (skillName, taskTitle) => {
    setTutorContextSkill(skillName || taskTitle || 'Career Topic');
    setTutorOpen(true);
    if (taskTitle) {
      setTutorQuestion(`Could you explain the concepts behind "${taskTitle}" and guide me on how to complete it?`);
    }
  };

  const handleAskTutor = async (e) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;

    const query = tutorQuestion.trim();
    setTutorHistory(prev => [...prev, { sender: 'user', text: query }]);
    setTutorQuestion('');
    setTutorLoading(true);

    try {
      const res = await roadmapApi.askAssistant({
        contextSkill: tutorContextSkill,
        question: query,
        roadmapId: activeRoadmap?.id,
      });

      const answer = res?.data?.answer || 'No guidance returned.';
      setTutorHistory(prev => [...prev, { sender: 'ai', text: answer }]);
    } catch (err) {
      setTutorHistory(prev => [...prev, { sender: 'ai', text: 'Error reaching AI tutor: ' + err.message }]);
    } finally {
      setTutorLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loading-wrapper">
        <div className="spinner"></div>
        <p>Loading your AI Career Growth Roadmap...</p>
      </div>
    );
  }

  return (
    <div className="roadmap-page-container">
      {/* Header */}
      <div className="roadmap-page-header">
        <div>
          <span className="eyebrow">Personalized AI Curriculum</span>
          <h1>AI Career Growth Roadmap</h1>
          <p className="page-desc">
            Structured week-by-week milestones tailored to bridge your specific skill gaps and prepare you for target roles.
          </p>
        </div>

        <div className="roadmap-header-actions">
          <button onClick={() => setShowGenModal(true)} className="btn-primary">
            <PlusCircle size={18} />
            <span>Generate New Roadmap</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="auth-alert error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Active Roadmap View */}
      {activeRoadmap ? (
        <div className="active-roadmap-view">
          {/* Overview Bar */}
          <div className="roadmap-overview-banner">
            <div className="overview-left">
              <div className="roadmap-status-pill">{activeRoadmap.status}</div>
              <h2>{activeRoadmap.title}</h2>
              <div className="roadmap-tags-row">
                <span><Clock size={16} /> ~{activeRoadmap.totalEstimatedHours} Total Study Hours</span>
                <span><BookOpen size={16} /> {activeRoadmap.weeklyHours} Hours/Week</span>
                <span><Award size={16} /> Level: {activeRoadmap.experienceLevel}</span>
              </div>
            </div>

            <div className="overview-right">
              <div className="progress-donut-col">
                <span className="progress-number">{activeRoadmap.progressPercentage}%</span>
                <span className="progress-caption">Roadmap Completed</span>
              </div>
            </div>
          </div>

          {/* Milestones Accordion / List */}
          <div className="milestones-container">
            {activeRoadmap.milestones?.map((milestone) => (
              <div key={milestone.id} className="milestone-card">
                <div className="milestone-card-header">
                  <div className="milestone-week-badge">Week {milestone.weekNumber}</div>
                  <div className="milestone-title-col">
                    <h3>{milestone.title}</h3>
                    <p className="milestone-desc">{milestone.description}</p>
                  </div>
                  <div className="milestone-hours">
                    <Clock size={15} />
                    <span>~{milestone.estimatedHours} hrs</span>
                  </div>
                </div>

                {/* Tasks inside Milestone */}
                <div className="milestone-tasks-list">
                  {milestone.tasks?.map((task) => (
                    <div key={task.id} className={`task-row ${task.isCompleted ? 'completed' : ''}`}>
                      <button 
                        type="button"
                        className="task-checkbox-btn"
                        onClick={() => handleToggleTask(task.id, task.isCompleted)}
                        title={task.isCompleted ? 'Mark task as incomplete' : 'Mark task as completed'}
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 size={22} className="check-icon-done" />
                        ) : (
                          <Circle size={22} className="check-icon-todo" />
                        )}
                      </button>

                      <div className="task-content">
                        <div className="task-title-line">
                          <span className={`task-badge ${task.taskType?.toLowerCase()}`}>
                            {task.taskType}
                          </span>
                          <span className="task-title-text">{task.title}</span>
                        </div>
                        {task.description && (
                          <p className="task-desc-text">{task.description}</p>
                        )}
                        {task.resourceUrl && (
                          <a 
                            href={task.resourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="task-resource-link"
                          >
                            <ExternalLink size={13} />
                            <span>{task.resourceTitle || 'Learning Resource'}</span>
                          </a>
                        )}
                      </div>

                      <div className="task-actions">
                        <button 
                          type="button" 
                          className="btn-tutor-ask"
                          onClick={() => handleOpenTutor(milestone.title, task.title)}
                          title="Ask AI Tutor about this task"
                        >
                          <MessageSquare size={15} />
                          <span>Ask Tutor</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state-panel card-panel">
          <Map size={48} className="empty-state-icon" />
          <h3>No Active Learning Roadmap Found</h3>
          <p>
            Generate your personalized AI curriculum based on your target role, available hours, and learning style.
          </p>
          <button onClick={() => setShowGenModal(true)} className="btn-primary mt-4">
            <Sparkles size={18} />
            <span>Generate Personalized AI Roadmap</span>
          </button>
        </div>
      )}

      {/* Generate Roadmap Modal */}
      {showGenModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-row">
                <Sparkles size={20} className="text-gold" />
                <h3>Generate AI Career Roadmap</h3>
              </div>
              <button onClick={() => setShowGenModal(false)} className="btn-close-modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="modal-form">
              <div className="form-group">
                <label htmlFor="genTargetRole">Target Role</label>
                <input
                  id="genTargetRole"
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Java Backend Developer"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="genExp">Experience Level</label>
                  <select
                    id="genExp"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="Entry / Graduate">Entry (0-1 yrs)</option>
                    <option value="Junior">Junior (1-2 yrs)</option>
                    <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                    <option value="Senior">Senior (5+ yrs)</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="genHours">Available Hours / Week</label>
                  <input
                    id="genHours"
                    type="number"
                    min={4}
                    max={50}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="genStyle">Preferred Learning Style</label>
                <select
                  id="genStyle"
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                >
                  <option value="Project-based">Project-based (Building full applications)</option>
                  <option value="Hands-on">Hands-on (Code exercises &amp; drills)</option>
                  <option value="Documentation">Deep Dive &amp; Documentation</option>
                  <option value="Visual">Visual &amp; System Diagrams</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="genNotes">Focus Areas or Specific Skill Gaps (Optional)</label>
                <textarea
                  id="genNotes"
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Emphasize Spring Security, Microservices, and Kafka"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowGenModal(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isGenerating}>
                  <Sparkles size={18} />
                  <span>{isGenerating ? 'Synthesizing Roadmap with Gemini AI...' : 'Generate Roadmap'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Tutor Modal */}
      {tutorOpen && (
        <div className="modal-overlay">
          <div className="modal-content tutor-modal">
            <div className="modal-header">
              <div className="modal-title-row">
                <Sparkles size={20} className="text-gold" />
                <h3>SkillBridge AI Career Tutor</h3>
              </div>
              <button onClick={() => setTutorOpen(false)} className="btn-close-modal">
                <X size={20} />
              </button>
            </div>

            <div className="tutor-context-banner">
              <span>Topic: <strong>{tutorContextSkill}</strong></span>
            </div>

            <div className="tutor-chat-history">
              {tutorHistory.length === 0 && (
                <div className="tutor-empty-prompt">
                  <p>Ask anything about this milestone, code concepts, errors, or implementation tips. Your AI tutor will guide you step by step.</p>
                </div>
              )}
              {tutorHistory.map((item, idx) => (
                <div key={idx} className={`chat-message ${item.sender}`}>
                  <div className="message-bubble">
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{item.text}</pre>
                  </div>
                </div>
              ))}
              {tutorLoading && (
                <div className="chat-message ai">
                  <div className="message-bubble typing">AI Tutor is thinking...</div>
                </div>
              )}
            </div>

            <form onSubmit={handleAskTutor} className="tutor-input-row">
              <input
                type="text"
                placeholder="Ask your question or request a code example..."
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                disabled={tutorLoading}
              />
              <button type="submit" className="btn-tutor-send" disabled={tutorLoading || !tutorQuestion.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
