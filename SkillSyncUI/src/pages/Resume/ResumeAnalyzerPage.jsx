import React, { useState, useEffect } from 'react';
import { useAnalyzer } from '../../hooks/useAnalyzer';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { Header } from '../../components/Header/Header';
import { UploadCard } from '../../components/UploadCard/UploadCard';
import { ControlCard } from '../../components/ControlCard/ControlCard';
import { ResultsPanel } from '../../components/ResultsPanel/ResultsPanel';
import { resumeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { History, Clock, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export function ResumeAnalyzerPage() {
  const { isAuthenticated } = useAuth();
  const [aiStatus, setAiStatus] = useState(null);
  const {
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
  } = useAnalyzer();

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    resumeApi.checkAiStatus()
      .then(res => setAiStatus(res))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      resumeApi.getHistory()
        .then(res => {
          if (res?.data) setHistory(res.data);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, result]);

  return (
    <div className="resume-analyzer-page">
      <div className="app-layout">
        {/* ── Sidebar ── */}
        <Sidebar score={score} mode={mode} status={status} />

        {/* ── Main workspace ── */}
        <main className="workspace">
          <Header />

          {isAuthenticated && history.length > 0 && (
            <div className="history-toggle-row">
              <button 
                type="button" 
                className="btn-history-toggle"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History size={16} />
                <span>{showHistory ? 'Hide Previous Analyses' : `View Past Analyses (${history.length})`}</span>
              </button>
            </div>
          )}

          {showHistory && (
            <div className="analyses-history-panel">
              <h4>Saved Analysis History</h4>
              <div className="history-cards-scroll">
                {history.map((item) => (
                  <div key={item.id} className="history-mini-card">
                    <div className="history-card-top">
                      <span className="history-type-badge">{item.analysisType}</span>
                      <span className="history-score-val">{item.score != null ? `Score: ${item.score}` : ''}</span>
                    </div>
                    <p className="history-date">
                      <Clock size={12} />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </p>
                    {item.summary && <p className="history-summary">{item.summary.substring(0, 100)}...</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiStatus && !aiStatus.configured && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#fca5a5'
            }}>
              <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                <strong style={{ color: '#f87171' }}>Google Gemini API Key Needed:</strong> {aiStatus.message}
              </div>
            </div>
          )}

          <div className="work-grid">
            <UploadCard
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
            />

            <ControlCard
              mode={mode}
              onModeChange={handleModeChange}
              jobDescription={jobDescription}
              onJdChange={setJobDescription}
              isLoading={isLoading}
              onAnalyze={analyze}
              onClear={clear}
            />

            <ResultsPanel result={result} mode={mode} />
          </div>
        </main>
      </div>
    </div>
  );
}
