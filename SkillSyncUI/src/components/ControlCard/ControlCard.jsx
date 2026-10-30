/**
 * ControlCard  (Step 02)
 *
 * Props:
 *   mode           – 'resume' | 'ats'
 *   onModeChange   – (mode: string) => void
 *   jobDescription – string
 *   onJdChange     – (value: string) => void
 *   isLoading      – boolean
 *   onAnalyze      – () => void
 *   onClear        – () => void
 */
export function ControlCard({
  mode,
  onModeChange,
  jobDescription,
  onJdChange,
  isLoading,
  onAnalyze,
  onClear,
}) {
  const isAts = mode === 'ats';

  return (
    <section className="panel control-card" aria-label="Analysis controls">
      <div className="panel-header">
        <span className="step-num">02</span>
        <h2>Analysis Mode</h2>
      </div>

      {/* ── Mode buttons ── */}
      <div className="mode-group" role="tablist" aria-label="Analysis modes">
        <ModeButton
          mode="resume"
          icon="✦"
          label="Resume Review"
          desc="Skills, quality score &amp; improvement advice"
          isActive={mode === 'resume'}
          onSelect={onModeChange}
        />
        <ModeButton
          mode="ats"
          icon="⊕"
          label="ATS Match"
          desc="Keyword match against a target job description"
          isActive={mode === 'ats'}
          onSelect={onModeChange}
        />
      </div>

      {/* ── Job description textarea ── */}
      <div className={`field-group${isAts ? '' : ' hidden'}`}>
        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          rows={8}
          placeholder="Paste the target job description here…"
          value={jobDescription}
          onChange={(e) => onJdChange(e.target.value)}
        />
      </div>

      {/* ── Actions ── */}
      <div className="action-row">
        <button
          className="btn-primary"
          type="button"
          disabled={isLoading}
          onClick={onAnalyze}
        >
          <span className="btn-label">{isAts ? 'Run ATS Check' : 'Analyze Resume'}</span>
          <svg className="btn-arrow" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10h12M12 5l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="btn-ghost" type="button" onClick={onClear}>
          Clear
        </button>
      </div>
    </section>
  );
}

/* ── ModeButton sub-component ────────────────────────── */
function ModeButton({ mode, icon, label, desc, isActive, onSelect }) {
  return (
    <button
      className={`mode-button${isActive ? ' active' : ''}`}
      type="button"
      data-mode={mode}
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(mode)}
    >
      <span className="mode-icon" aria-hidden="true">{icon}</span>
      <div className="mode-copy">
        <strong>{label}</strong>
        {/* desc may contain &amp; so we use dangerouslySetInnerHTML for the one
            static string; in production, just split into two spans. */}
        <span dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
      <span className="mode-check" aria-hidden="true">
        <svg viewBox="0 0 14 14" fill="none">
          <path
            d="M2.5 7l3.5 3.5 5.5-6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
