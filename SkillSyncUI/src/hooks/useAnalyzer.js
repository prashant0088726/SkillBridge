import { useState, useCallback } from 'react';
import { API_BASE, extractJson, extractScore } from '../utils/resumeUtils';
import { getStoredToken } from '../services/api';

/**
 * useAnalyzer
 *
 * Owns all shared application state and the analyze / clear actions.
 * Injects JWT Bearer token when authenticated to associate analysis with user.
 */
export function useAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mode, setMode] = useState('resume');          // 'resume' | 'ats'
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState({ text: 'Ready', isError: false });
  const [result, setResult] = useState(null);          // { parsed, raw } | null
  const [score, setScore] = useState(null);            // number | string | null
  const [isLoading, setIsLoading] = useState(false);

  // ── file selection ──────────────────────────────────
  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    setSelectedFile(file);
  }, []);

  // ── mode switch ─────────────────────────────────────
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  // ── analyze ─────────────────────────────────────────
  const analyze = useCallback(async () => {
    if (!selectedFile) {
      setStatus({ text: 'Choose a resume first', isError: true });
      return;
    }
    if (mode === 'ats' && !jobDescription.trim()) {
      setStatus({ text: 'Paste a job description', isError: true });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    let endpoint = `${API_BASE}/analyze`;
    if (mode === 'ats') {
      endpoint = `${API_BASE}/ats-check`;
      formData.append('jd', jobDescription.trim());
    }

    setIsLoading(true);
    setStatus({ text: 'Analyzing with Gemini AI…', isError: false });
    setResult({ loading: true });
    setScore(null);

    const headers = {};
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        let errMsg = `Request failed (status ${response.status})`;
        try {
          const errObj = JSON.parse(errText);
          if (errObj.message) errMsg = errObj.message;
        } catch {
          if (errText) errMsg = errText;
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      const raw = mode === 'ats' ? data.atsReport : data.analysis;
      const text = raw ?? data;
      const normalized =
        text == null ? '' : typeof text === 'string' ? text : JSON.stringify(text, null, 2);

      const parsed = extractJson(normalized);
      const scoreValue = parsed ? extractScore(parsed) : null;

      setResult({ parsed, raw: normalized, loading: false });
      setScore(scoreValue);
      setStatus({ text: 'Complete', isError: false });
    } catch (error) {
      const errorMsg = `SkillBridge AI Analysis Error:\n\n${error.message}`;
      setResult({ parsed: null, raw: errorMsg, loading: false });
      setScore(null);
      setStatus({ text: 'Analysis error', isError: true });
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, mode, jobDescription]);

  // ── clear ────────────────────────────────────────────
  const clear = useCallback(() => {
    setSelectedFile(null);
    setJobDescription('');
    setResult(null);
    setScore(null);
    setStatus({ text: 'Ready', isError: false });
  }, []);

  return {
    selectedFile,
    mode,
    jobDescription,
    status,
    result,
    score,
    isLoading,
    handleFileSelect,
    handleModeChange,
    setJobDescription,
    analyze,
    clear,
  };
}
