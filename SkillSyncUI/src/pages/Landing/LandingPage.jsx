import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  GitBranch, 
  Map, 
  Briefcase, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Target 
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Career Intelligence</span>
          </div>

          <h1 className="hero-title">
            Bridge Your Skills.<br />
            <span className="gradient-text">Build Your Future.</span>
          </h1>

          <p className="hero-subtitle">
            Transform your resume into a personalized career growth engine. 
            Evaluate ATS readiness, discover critical skill gaps for target jobs, 
            and follow AI-tailored roadmaps to land your next technical role.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-hero-primary">
              <span>Start Free Career Analysis</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/resume" className="btn-hero-secondary">
              <FileText size={18} />
              <span>Try Resume Analyzer</span>
            </Link>
          </div>

          <div className="hero-proof-row">
            <div className="proof-item">
              <CheckCircle size={16} className="proof-icon" />
              <span>Deep Apache Tika Text Extraction</span>
            </div>
            <div className="proof-item">
              <CheckCircle size={16} className="proof-icon" />
              <span>Google Gemini AI Reasoning</span>
            </div>
            <div className="proof-item">
              <CheckCircle size={16} className="proof-icon" />
              <span>Personalized Interactive Roadmaps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="features-section">
        <div className="section-header text-center">
          <p className="eyebrow">Comprehensive Career Tech</p>
          <h2>Everything You Need to Advance Your Engineering Career</h2>
          <p className="section-desc">
            A cohesive platform integrating resume intelligence, skill gap discovery, actionable learning, and application tracking.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap gold">
              <FileText size={24} />
            </div>
            <h3>AI Resume &amp; ATS Scoring</h3>
            <p>
              Upload PDF, DOCX, or TXT documents. Apache Tika extracts structured text, and Google Gemini provides section-by-section scoring, strengths, and ATS keyword matching against target job descriptions.
            </p>
            <Link to="/resume" className="feature-link">
              <span>Analyze Resume</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feature-card highlighted">
            <div className="feature-badge">Core Engine</div>
            <div className="feature-icon-wrap blue">
              <GitBranch size={24} />
            </div>
            <h3>Role-Based Skill Gap Analysis</h3>
            <p>
              Select your dream role or paste a job listing. Our AI identifies demonstrated competencies vs. missing requirements, assesses current vs. target proficiency, and ranks learning priorities.
            </p>
            <Link to="/skills" className="feature-link">
              <span>Detect Skill Gaps</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feature-card highlighted">
            <div className="feature-badge">Core Engine</div>
            <div className="feature-icon-wrap emerald">
              <Map size={24} />
            </div>
            <h3>Personalized Learning Roadmaps</h3>
            <p>
              Move beyond generic tutorials. Receive a tailored, week-by-week curriculum with verified resources, practical mini-projects, capstone portfolio tasks, and an interactive progress tracker.
            </p>
            <Link to="/roadmap" className="feature-link">
              <span>Generate Roadmap</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap violet">
              <Sparkles size={24} />
            </div>
            <h3>Contextual AI Study Tutor</h3>
            <p>
              Stuck on a tricky framework or concept? Ask our in-roadmap AI tutor for clear explanations, practical code examples, and debugging assistance tailored directly to your current learning milestone.
            </p>
            <Link to="/roadmap" className="feature-link">
              <span>Learn With AI</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap gold">
              <Briefcase size={24} />
            </div>
            <h3>Curated Job Discovery</h3>
            <p>
              Explore verified tech opportunities filtered by required technical skills. Save roles of interest and track your applications from initial submission to interview and offer stages.
            </p>
            <Link to="/jobs" className="feature-link">
              <span>Explore Jobs</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap blue">
              <Target size={24} />
            </div>
            <h3>Candidate Career Dashboard</h3>
            <p>
              Your personal command center displaying real-time profile completion, target job role readiness, recent ATS analysis results, active roadmap milestones, and next recommended tasks.
            </p>
            <Link to="/dashboard" className="feature-link">
              <span>View Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="workflow-section">
        <div className="section-header text-center">
          <p className="eyebrow">The 4-Step Process</p>
          <h2>How SkillBridge AI Accelerates Your Journey</h2>
        </div>

        <div className="workflow-steps">
          <div className="step-item">
            <div className="step-number">01</div>
            <h4>Upload &amp; Analyze</h4>
            <p>Drop your resume in any format. Get instant quality ratings and ATS keyword alignment scores.</p>
          </div>
          <div className="step-item">
            <div className="step-number">02</div>
            <h4>Identify Gaps</h4>
            <p>Compare against target job expectations to discover high-priority missing technical skills.</p>
          </div>
          <div className="step-item">
            <div className="step-number">03</div>
            <h4>Follow AI Roadmap</h4>
            <p>Study personalized weekly milestones, build hands-on projects, and track real task completion.</p>
          </div>
          <div className="step-item">
            <div className="step-number">04</div>
            <h4>Apply with Confidence</h4>
            <p>Browse matched jobs, showcase your verified portfolio, and land your ideal role.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <h2>Ready to bridge your skill gaps?</h2>
          <p>Join SkillBridge AI today and take command of your technical career progression.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-hero-primary">Create Your Free Account</Link>
            <Link to="/login" className="btn-ghost">Sign In</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
