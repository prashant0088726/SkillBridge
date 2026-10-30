import { useRef, useState, useCallback } from 'react';
import { formatSize } from '../../utils/resumeUtils';

const FORMATS = ['PDF', 'DOCX', 'TXT', 'RTF'];

/**
 * UploadCard  (Step 01)
 *
 * Props:
 *   selectedFile   – File | null
 *   onFileSelect   – (file: File) => void
 */
export function UploadCard({ selectedFile, onFileSelect }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── handlers ─────────────────────────────────────────
  const openPicker = useCallback((e) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback(() => {
    const file = fileInputRef.current?.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  // ── derived display ───────────────────────────────────
  const hintText = selectedFile
    ? `${selectedFile.name}  ·  ${formatSize(selectedFile.size)}`
    : 'or click to browse — PDF, DOCX, TXT, RTF';

  const hintStyle = selectedFile ? { color: '#d4983a' } : undefined;

  return (
    <section className="panel upload-card" aria-label="Resume upload">
      <div className="panel-header">
        <span className="step-num">01</span>
        <h2>Candidate Resume</h2>
      </div>

      <div
        className={`upload-zone${isDragging ? ' dragging' : ''}`}
        onClick={openPicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Drop resume file or click to browse"
        onKeyDown={(e) => e.key === 'Enter' && openPicker()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.rtf"
          hidden
          onChange={handleChange}
        />
        <div className="upload-ring" aria-hidden="true" />

        <button
          className="upload-btn"
          type="button"
          aria-label="Choose resume file"
          onClick={openPicker}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4.5v11M12 4.5L8 9M12 4.5l4 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.5 18.5h15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="upload-title">Drop your resume here</p>
        <p className="upload-hint" style={hintStyle}>
          {hintText}
        </p>
      </div>

      <div className="format-badges">
        {FORMATS.map((fmt) => (
          <span key={fmt}>{fmt}</span>
        ))}
      </div>
    </section>
  );
}
