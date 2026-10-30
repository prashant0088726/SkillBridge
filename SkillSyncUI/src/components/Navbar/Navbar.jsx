import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  FileText, 
  GitBranch, 
  Map, 
  Briefcase, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <Sparkles size={20} className="brand-icon" />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">SkillBridge<span className="ai-badge">AI</span></span>
            <span className="brand-tagline">Bridge Your Skills. Build Your Future.</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navItemClass}>
              <Compass size={17} />
              <span>Dashboard</span>
            </NavLink>
          )}

          <NavLink to="/resume" className={navItemClass}>
            <FileText size={17} />
            <span>Resume Studio</span>
          </NavLink>

          <NavLink to="/skills" className={navItemClass}>
            <GitBranch size={17} />
            <span>Skill Gap</span>
          </NavLink>

          <NavLink to="/roadmap" className={navItemClass}>
            <Map size={17} />
            <span>AI Roadmap</span>
          </NavLink>

          <NavLink to="/jobs" className={navItemClass}>
            <Briefcase size={17} />
            <span>Jobs</span>
          </NavLink>
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="profile-pill" title="My Career Profile">
                <div className="avatar-circle">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-text">{user?.fullName || 'My Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="btn-ghost-nav">Log In</Link>
              <Link to="/register" className="btn-primary-nav">Get Started</Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <Compass size={18} />
              <span>Dashboard</span>
            </NavLink>
          )}
          <NavLink to="/resume" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
            <FileText size={18} />
            <span>Resume Studio</span>
          </NavLink>
          <NavLink to="/skills" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
            <GitBranch size={18} />
            <span>Skill Gap</span>
          </NavLink>
          <NavLink to="/roadmap" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
            <Map size={18} />
            <span>AI Roadmap</span>
          </NavLink>
          <NavLink to="/jobs" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
            <Briefcase size={18} />
            <span>Jobs</span>
          </NavLink>
          
          <div className="mobile-drawer-footer">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="mobile-profile-link" onClick={() => setMobileMenuOpen(false)}>
                  <User size={18} />
                  <span>{user?.fullName} (Profile)</span>
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn-logout-mobile">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="mobile-auth-row">
                <Link to="/login" className="btn-ghost-nav" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="btn-primary-nav" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
