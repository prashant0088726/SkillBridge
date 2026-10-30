import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../services/api';
import { 
  User, 
  Briefcase, 
  Clock, 
  BookOpen, 
  MapPin, 
  Code, 
  GraduationCap, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    targetJobRole: '',
    experienceLevel: 'Mid-Level',
    weeklyHoursAvailable: 10,
    learningStyle: 'Project-based',
    location: '',
    bio: '',
    technicalSkills: '',
    education: '',
    workExperience: '',
    careerInterests: '',
    profileCompletionPercentage: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await profileApi.getProfile();
        if (res?.data) {
          setProfile({
            fullName: res.data.fullName || user?.fullName || '',
            email: res.data.email || user?.email || '',
            targetJobRole: res.data.targetJobRole || 'Software Engineer',
            experienceLevel: res.data.experienceLevel || 'Mid-Level',
            weeklyHoursAvailable: res.data.weeklyHoursAvailable || 10,
            learningStyle: res.data.learningStyle || 'Project-based',
            location: res.data.location || '',
            bio: res.data.bio || '',
            technicalSkills: res.data.technicalSkills || '',
            education: res.data.education || '',
            workExperience: res.data.workExperience || '',
            careerInterests: res.data.careerInterests || '',
            profileCompletionPercentage: res.data.profileCompletionPercentage || 0,
          });
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await profileApi.updateProfile(profile);
      if (res?.data) {
        setProfile(prev => ({
          ...prev,
          ...res.data,
        }));
        setSuccessMessage('Profile saved successfully! Dashboard and roadmap inputs updated.');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loading-wrapper">
        <div className="spinner"></div>
        <p>Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <div>
          <span className="eyebrow">Personal Career Profile</span>
          <h1>Manage Your Candidate Profile</h1>
          <p className="page-desc">
            Your profile informs AI roadmap generation, skill-gap detection, and job recommendations.
          </p>
        </div>

        <div className="profile-completion-meter">
          <span>Readiness: {profile.profileCompletionPercentage}%</span>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${profile.profileCompletionPercentage}%` }} />
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="auth-alert success">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="auth-alert error">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form-grid">
        {/* Section 1: Personal Details */}
        <div className="form-card">
          <div className="form-card-title">
            <User size={18} className="text-gold" />
            <h3>Personal Information</h3>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={profile.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Alex Morgan"
                required
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                title="Email is bound to your account"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="location">Location / Remote Preference</label>
              <input
                id="location"
                type="text"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="San Francisco, CA / Remote"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Professional Summary / Bio</label>
            <textarea
              id="bio"
              rows={3}
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Backend engineer passionate about scalable cloud architectures, Spring Boot, and AI integrations..."
            />
          </div>
        </div>

        {/* Section 2: Career Targets & Learning Style */}
        <div className="form-card">
          <div className="form-card-title">
            <Briefcase size={18} className="text-blue" />
            <h3>Target Role &amp; Learning Preferences</h3>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="targetJobRole">Target Job Role</label>
              <input
                id="targetJobRole"
                type="text"
                value={profile.targetJobRole}
                onChange={(e) => handleChange('targetJobRole', e.target.value)}
                placeholder="e.g. Senior Java Backend Developer"
                required
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="experienceLevel">Current Experience Level</label>
              <select
                id="experienceLevel"
                value={profile.experienceLevel}
                onChange={(e) => handleChange('experienceLevel', e.target.value)}
              >
                <option value="Entry / Graduate">Entry / Graduate (0-1 yrs)</option>
                <option value="Junior">Junior (1-2 yrs)</option>
                <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                <option value="Senior">Senior (5+ yrs)</option>
                <option value="Lead / Principal">Lead / Principal (8+ yrs)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="weeklyHours">Available Study Hours / Week</label>
              <input
                id="weeklyHours"
                type="number"
                min={2}
                max={50}
                value={profile.weeklyHoursAvailable}
                onChange={(e) => handleChange('weeklyHoursAvailable', parseInt(e.target.value) || 10)}
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="learningStyle">Preferred Learning Style</label>
              <select
                id="learningStyle"
                value={profile.learningStyle}
                onChange={(e) => handleChange('learningStyle', e.target.value)}
              >
                <option value="Project-based">Project-based (Building full apps)</option>
                <option value="Hands-on">Hands-on (Coding exercises &amp; drills)</option>
                <option value="Documentation">Documentation &amp; Deep Theory</option>
                <option value="Visual">Visual (Architecture diagrams &amp; walkthroughs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills & Background */}
        <div className="form-card">
          <div className="form-card-title">
            <Code size={18} className="text-emerald" />
            <h3>Technical Skills &amp; Experience</h3>
          </div>

          <div className="form-group">
            <label htmlFor="technicalSkills">Known Technical Skills (comma separated)</label>
            <textarea
              id="technicalSkills"
              rows={3}
              value={profile.technicalSkills}
              onChange={(e) => handleChange('technicalSkills', e.target.value)}
              placeholder="Java, Spring Boot, REST APIs, PostgreSQL, Docker, Git, React, TypeScript..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="education">Education &amp; Credentials</label>
            <textarea
              id="education"
              rows={2}
              value={profile.education}
              onChange={(e) => handleChange('education', e.target.value)}
              placeholder="B.S. in Computer Science, University of Technology (2024); AWS Certified Cloud Practitioner"
            />
          </div>

          <div className="form-group">
            <label htmlFor="workExperience">Work Experience &amp; Highlights</label>
            <textarea
              id="workExperience"
              rows={3}
              value={profile.workExperience}
              onChange={(e) => handleChange('workExperience', e.target.value)}
              placeholder="2 years as Software Engineer at TechCorp. Developed REST microservices and reduced query latency by 40%..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="careerInterests">Career Interests &amp; Industry Focus</label>
            <input
              id="careerInterests"
              type="text"
              value={profile.careerInterests}
              onChange={(e) => handleChange('careerInterests', e.target.value)}
              placeholder="Cloud native architecture, generative AI systems, high-throughput microservices"
            />
          </div>
        </div>

        <div className="form-actions-row">
          <button type="submit" className="btn-primary" disabled={isSaving}>
            <Save size={18} />
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
