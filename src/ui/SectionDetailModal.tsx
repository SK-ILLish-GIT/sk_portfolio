import { useEffect } from 'react';
import { stations } from '../data/portfolio';
import SectionPanel from './SectionPanel';

interface SectionDetailModalProps {
  open: boolean;
  stationIndex: number;
  onClose: () => void;
}

/** Island section details — slides down from the top of the screen. */
export default function SectionDetailModal({ open, stationIndex, onClose }: SectionDetailModalProps) {
  const station = stations[stationIndex];

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

  if (!open || !station) return null;

  return (
    <div className="section-detail-backdrop" role="presentation" onClick={onClose}>
      <div
        className="section-detail-panel panel is-open"
        role="dialog"
        aria-modal="true"
        aria-label={`${station.label} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="section-detail-close" onClick={onClose} aria-label="Close details">
          ✕
        </button>
        <SectionPanel id={station.id} accent={station.accent} />
      </div>
    </div>
  );
}
