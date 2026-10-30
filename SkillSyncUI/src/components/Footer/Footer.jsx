import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <Sparkles size={20} className="brand-icon" />
            <span className="brand-title">SkillBridge<span className="ai-badge">AI</span></span>
          </div>
          <p className="footer-tagline">Bridge Your Skills. Build Your Future.</p>
          <p className="footer-desc">
            Empowering tech talent to analyze resumes, discover critical skill gaps, and accelerate career growth through personalized AI learning roadmaps.
          </p>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul className="footer-links">
            <li><Link to="/resume">Resume Analyzer</Link></li>
            <li><Link to="/resume">ATS Job Match</Link></li>
            <li><Link to="/skills">Skill-Gap Analyzer</Link></li>
            <li><Link to="/roadmap">Career Roadmaps</Link></li>
            <li><Link to="/jobs">Job Discovery</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Candidate Hub</h4>
          <ul className="footer-links">
            <li><Link to="/dashboard">Career Dashboard</Link></li>
            <li><Link to="/profile">Profile &amp; Goals</Link></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Architecture</h4>
          <p className="footer-tech-stack">
            Powered by <strong>Java 21</strong>, <strong>Spring Boot</strong>, <strong>Spring AI</strong>, <strong>Google Gemini</strong>, <strong>Apache Tika</strong>, and <strong>React + Vite</strong>.
          </p>
          <div className="system-health-indicator">
            <span className="online-dot"></span>
            <span>All AI systems operational</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SkillBridge AI. All rights reserved.</p>
        <p className="made-with">Crafted with precision for modern tech professionals.</p>
      </div>
    </footer>
  );
}
