import React, { useState } from 'react';

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

export default function DetailPage({ dest, onBack, onToggle, onUpdate }) {
  const [notes, setNotes] = useState(dest.notes || '');
  const [saved, setSaved] = useState(false);
  const isVisited = dest.status === 'Visited';

  const handleSaveNotes = () => {
    onUpdate({ ...dest, notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="detail-view">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '1.5rem', padding: '0.5rem 0' }}>
        <BackIcon /> Back to list
      </button>

      <div className="detail-hero">
        {dest.image ? (
          <img src={dest.image} alt={dest.name} onError={e => e.target.style.display = 'none'} />
        ) : (
          <div className="detail-hero-placeholder">🌍</div>
        )}
        <div className="detail-hero-overlay">
          <h1>{dest.name}</h1>
          <p>{dest.country}</p>
        </div>
      </div>

      <div className="detail-meta">
        <span className={`meta-chip ${isVisited ? 'chip-status-visited' : 'chip-status-notyet'}`}>
          {isVisited ? '✓ Visited' : '○ On the bucket list'}
        </span>
        <span className="meta-chip chip-continent">{dest.continent}</span>
        {isVisited && dest.visitDate && (
          <span className="meta-chip chip-date">
            📅 Visited {new Date(dest.visitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
        <span className="meta-chip chip-date">
          Added {new Date(dest.dateAdded).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
        </span>
      </div>

      {dest.description && (
        <p className="detail-desc">{dest.description}</p>
      )}

      {dest.lat && dest.lng && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--ink)' }}>
            Location
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', padding: '0.75rem 1rem', background: 'var(--sand)', borderRadius: 'var(--radius-md)' }}>
            📍 {dest.lat.toFixed(4)}°, {dest.lng.toFixed(4)}° — View on the <button className="btn btn-ghost btn-sm" style={{display:'inline', padding:'0', textDecoration:'underline', color:'var(--sky)'}} onClick={() => window.dispatchEvent(new CustomEvent('navigate-map'))}>Map View</button>
          </p>
        </div>
      )}

      <div className="detail-notes">
        <h3>Notes & Tips</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add your notes, tips, memories, or things to do here..."
        />
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={handleSaveNotes}>
            {saved ? '✓ Saved!' : 'Save Notes'}
          </button>
        </div>
      </div>

      <div className="detail-actions">
        <button
          className={`btn ${isVisited ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => { onToggle(dest.id); onBack(); }}
        >
          {isVisited ? '○ Mark as Not Yet Visited' : '✓ Mark as Visited'}
        </button>
        <button className="btn btn-secondary" onClick={onBack}>Back to List</button>
      </div>
    </div>
  );
}
