const KPIS = [
  { val: 'JSON', key: 'Structured output' },
  { val: 'ATS',  key: 'Match scoring' },
  { val: '∞',    key: 'Insights' },
];

/**
 * Header
 *
 * Static page-level header with eyebrow, display headline, description,
 * and three KPI tiles.  No props required.
 */
export function Header() {
  return (
    <header className="page-header">
      <div className="header-copy">
        <p className="eyebrow">AI Hiring Assistant</p>
        <h1>
          Analyse a resume
          <br />
          <em>like a senior recruiter.</em>
        </h1>
        <p className="header-desc">
          Upload a candidate profile, run a quality review, or compare it against a job
          description for instant ATS alignment scoring.
        </p>
      </div>

      <div className="header-kpis" aria-hidden="true">
        {KPIS.map(({ val, key }) => (
          <div className="kpi" key={key}>
            <span className="kpi-val">{val}</span>
            <span className="kpi-key">{key}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
