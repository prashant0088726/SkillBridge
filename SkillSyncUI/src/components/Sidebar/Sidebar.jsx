import { ScoreGauge } from './ScoreGauge';

const STATS = [
  { val: '10MB', key: 'Max size' },
  { val: '2',    key: 'Modes' },
  { val: 'AI',   key: 'Powered' },
];

/**
 * Sidebar
 *
 * Props:
 *   score   – number | string | null
 *   mode    – 'resume' | 'ats'
 *   status  – { text: string, isError: boolean }
 */
export function Sidebar({ score, mode, status }) {
  const caption =
    score !== null && score !== undefined && score !== ''
      ? mode === 'ats' ? 'ATS match score' : 'Resume quality score'
      : 'Upload a resume to begin';

  return (
    <aside className="sidebar" aria-label="SkillBridge AI sidebar">
      <div className="sidebar-inner">

        {/* ── Brand ── */}
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="url(#bGrad)" />
              <path
                d="M10 12h16M10 18h11M10 24h13"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="26" cy="24" r="4.5" fill="#fff" fillOpacity="0.9" />
              <defs>
                <linearGradient id="bGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#e6a832" />
                  <stop offset="100%" stopColor="#9e6218" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <p className="brand-name">SkillBridge <span style={{ color: '#d4983a', fontSize: '0.8rem' }}>AI</span></p>
            <p className="brand-sub">Bridge Your Skills. Build Your Future.</p>
          </div>
        </div>

        {/* ── Score gauge ── */}
        <ScoreGauge score={score} mode={mode} caption={caption} />

        {/* ── Status ── */}
        <div className="status-block">
          <p className="sidebar-label">AI Engine Status</p>
          <div className={`status-pill${status.isError ? ' error' : ''}`}>
            <span className="status-dot" />
            <span>{status.text}</span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="sidebar-stats">
          {STATS.map(({ val, key }) => (
            <div className="sstat" key={key}>
              <span className="sstat-val">{val}</span>
              <span className="sstat-key">{key}</span>
            </div>
          ))}
        </div>

        <p className="sidebar-version">SkillBridge AI &bull; Career Intelligence</p>
      </div>
    </aside>
  );
}
