export const CIRCUMFERENCE = 2 * Math.PI * 56; // r=56 → ≈ 351.86
export const API_BASE = 'http://localhost:8080/api/resume';

export function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function extractJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export function titleize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders a JSON value into an HTML string.
 * Used by ResultCard to produce the inner markup.
 */
export function renderValueHtml(value) {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => {
        if (item && typeof item === 'object') {
          return `<li>${escapeHtml(Object.values(item).join(' '))}</li>`;
        }
        return `<li>${escapeHtml(String(item))}</li>`;
      })
      .join('');
    return `<ul>${items}</ul>`;
  }

  if (value && typeof value === 'object') {
    const items = Object.entries(value)
      .map(
        ([k, v]) =>
          `<li><strong>${escapeHtml(titleize(k))}:</strong> ${escapeHtml(String(v))}</li>`
      )
      .join('');
    return `<ul>${items}</ul>`;
  }

  return `<p>${escapeHtml(String(value))}</p>`;
}

/**
 * Extracts the numeric score from a parsed JSON result object.
 */
export function extractScore(parsed) {
  return (
    parsed.atsScore ??
    parsed.ats_score ??
    parsed.atsMatchScore ??
    parsed.ats_match_score ??
    parsed.matchScore ??
    parsed.match_score ??
    parsed.resumeQuality ??
    parsed.resume_quality ??
    parsed.overallResumeQualityRating ??
    parsed.overall_resume_quality_rating ??
    parsed.overall_resume_quality ??
    parsed.score ??
    parsed.rating ??
    null
  );
}
