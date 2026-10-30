import { useMemo } from 'react';
import { CIRCUMFERENCE } from '../../utils/resumeUtils';

/**
 * ScoreGauge
 *
 * Renders the animated SVG donut gauge in the sidebar.
 * Props:
 *   score   – number | string | null
 *   mode    – 'resume' | 'ats'
 *   caption – string shown below the gauge
 */
export function ScoreGauge({ score, mode, caption }) {
  const { displayNum, dashArray } = useMemo(() => {
    if (score === null || score === undefined || score === '') {
      return { displayNum: '--', dashArray: `0 ${CIRCUMFERENCE}` };
    }

    const numeric = Number(score);
    if (Number.isNaN(numeric)) {
      return { displayNum: String(score), dashArray: `0 ${CIRCUMFERENCE}` };
    }

    const display = mode === 'ats' ? Math.round(numeric) : numeric;
    const filled = (Math.min(100, Math.max(0, numeric)) / 100) * CIRCUMFERENCE;
    return {
      displayNum: display,
      dashArray: `${filled} ${CIRCUMFERENCE - filled}`,
    };
  }, [score, mode]);

  return (
    <div className="gauge-block">
      <div className="gauge-wrap">
        <svg className="gauge-svg" viewBox="0 0 140 140" aria-hidden="true">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5d78e" />
              <stop offset="100%" stopColor="#c9832a" />
            </linearGradient>
          </defs>
          <circle className="gauge-track" cx="70" cy="70" r="56" />
          <circle
            className="gauge-fill"
            cx="70"
            cy="70"
            r="56"
            style={{ strokeDasharray: dashArray }}
          />
          <text className="gauge-num" x="70" y="64" textAnchor="middle">
            {displayNum}
          </text>
          <text className="gauge-sub" x="70" y="84" textAnchor="middle">
            SCORE
          </text>
        </svg>
      </div>
      <p className="gauge-caption">{caption}</p>
      <span className="sr-only">{displayNum}</span>
    </div>
  );
}
