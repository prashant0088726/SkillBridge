import { titleize, renderValueHtml } from '../../utils/resumeUtils';

/**
 * ResultCard
 *
 * Renders one key-value pair from the parsed JSON as a styled card.
 * Uses dangerouslySetInnerHTML for the value because renderValueHtml
 * produces safe escaped markup (see resumeUtils.js).
 *
 * Props:
 *   label – string (JSON key)
 *   value – any   (JSON value)
 *   delay – number (ms, for staggered animation)
 */
export function ResultCard({ label, value, delay = 0 }) {
  return (
    <article className="result-card" style={{ animationDelay: `${delay}ms` }}>
      <h3>{titleize(label)}</h3>
      <div dangerouslySetInnerHTML={{ __html: renderValueHtml(value) }} />
    </article>
  );
}
