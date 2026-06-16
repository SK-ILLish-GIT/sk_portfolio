import { useEffect } from 'react';
import { profile, resumeUrl, resumeViewUrl } from '../data/portfolio';

interface ResumeViewerProps {
  open: boolean;
  onClose: () => void;
}

/** Full-screen modal embedding the latest resume PDF from Google Drive. */
export default function ResumeViewer({ open, onClose }: ResumeViewerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="resume-viewer-backdrop" role="presentation" onClick={onClose}>
      <div
        className="resume-viewer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Resume"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="resume-viewer-header">
          <div>
            <h1 className="resume-viewer-title">{profile.name}</h1>
            <p className="resume-viewer-sub">Latest resume</p>
          </div>
          <div className="resume-viewer-actions">
            <a className="resume-viewer-open" href={resumeViewUrl} target="_blank" rel="noreferrer">
              Open in Drive ↗
            </a>
            <button type="button" className="resume-viewer-close" onClick={onClose} aria-label="Close resume">
              ✕
            </button>
          </div>
        </header>
        <iframe className="resume-viewer-frame" src={resumeUrl} title={`${profile.name} resume`} allow="autoplay" />
      </div>
    </div>
  );
}
