import { useState, useCallback } from 'react';
import { escapeHtml } from '../../utils/resumeUtils';
import { ResultCard } from './ResultCard';

/**
 * ResultsPanel  (Step 03)
 *
 * Props:
 *   result – null | { loading: true } | { parsed: object|null, raw: string, loading: false }
 *   mode   – 'resume' | 'ats'
 */
export function ResultsPanel({ result, mode }) {
  const [copyLabel, setCopyLabel] = useState('Copy');

  const showEmpty   = !result;
  const showLoading = result?.loading === true;
  const showContent = result && !result.loading;

  const title = mode === 'ats' ? 'ATS Match Report' : 'Resume Review';

  const handleCopy = useCallback(async () => {
    if (!result?.raw) return;
    await navigator.clipboard.writeText(result.raw);
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy'), 1400);
  }, [result?.raw]);

  return (
    <section className="panel results-panel" aria-label="Analysis results">

      {/* ── Empty state ── */}
      {showEmpty && (
        <div className="result-empty">
          <div className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" fill="none">
              <circle
                cx="28" cy="28" r="24"
                stroke="currentColor" strokeWidth="1.25" strokeDasharray="5 4"
              />
              <path
                d="M20 28h16M28 20v16"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
          </div>
          <h3>Report Canvas</h3>
          <p>
            Your structured resume intelligence report will render here after
            analysis is complete.
          </p>
        </div>
      )}

      {/* ── Loading shimmer ── */}
      {showLoading && (
        <div className="result-content">
          <div className="result-topbar">
            <div className="result-topbar-left">
              <span className="step-num">03</span>
              <h2>{title}</h2>
            </div>
          </div>
          <div className="result-body">
            <div className="json-grid">
              <article className="result-card loading-card">
                <div className="loading-line" />
                <div className="loading-line" />
                <div className="loading-line" />
              </article>
              <article className="result-card loading-card">
                <div className="loading-line" />
                <div className="loading-line" />
                <div className="loading-line" />
              </article>
            </div>
          </div>
        </div>
      )}

      {/* ── Result content ── */}
      {showContent && (
        <div className="result-content">
          <div className="result-topbar">
            <div className="result-topbar-left">
              <span className="step-num">03</span>
              <h2>{title}</h2>
            </div>
            <button className="btn-copy" type="button" onClick={handleCopy}>
              {copyLabel === 'Copy' && (
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="5.5" y="5.5" width="9" height="9" rx="2"
                    stroke="currentColor" strokeWidth="1.25" />
                  <path d="M3 10.5V3h7.5"
                    stroke="currentColor" strokeWidth="1.25"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {copyLabel}
            </button>
          </div>

          <div className="result-body">
            {result.parsed ? (
              <div className="json-grid">
                {Object.entries(result.parsed).map(([key, value], i) => (
                  <ResultCard
                    key={key}
                    label={key}
                    value={value}
                    delay={i * 60}
                  />
                ))}
              </div>
            ) : (
              <pre
                className="raw-result"
                dangerouslySetInnerHTML={{
                  __html: escapeHtml(result.raw || 'No analysis was returned.'),
                }}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
