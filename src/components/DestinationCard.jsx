import React from 'react';

const EDIT_ICON = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DELETE_ICON = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

export default function DestinationCard({ dest, onClick, onToggle, onEdit, onDelete }) {
  const isVisited = dest.status === 'Visited';

  return (
    <div className="dest-card" onClick={() => onClick(dest)}>
      <div className="card-image">
        {dest.image ? (
          <img src={dest.image} alt={dest.name} onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="card-image-placeholder">🌍</div>
        )}
        <span className={`card-status-badge ${isVisited ? 'badge-visited' : 'badge-not-yet'}`}>
          {isVisited ? '✓ Visited' : '○ Someday'}
        </span>
        <span className="card-continent-badge">{dest.continent}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{dest.name}</h3>
        <p className="card-country">{dest.country}</p>
        {dest.description && <p className="card-desc">{dest.description}</p>}

        <div className="card-footer">
          <span className="card-date">
            {isVisited && dest.visitDate
              ? `Visited ${new Date(dest.visitDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`
              : `Added ${new Date(dest.dateAdded).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`
            }
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 8px' }}
              onClick={e => { e.stopPropagation(); onEdit(dest); }}
              aria-label="Edit"
            >
              <EDIT_ICON />
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 8px', color: 'var(--terracotta)' }}
              onClick={e => { e.stopPropagation(); onDelete(dest.id); }}
              aria-label="Delete"
            >
              <DELETE_ICON />
            </button>
            <button
              className={`card-toggle-btn ${isVisited ? 'toggle-not-yet' : 'toggle-visited'}`}
              onClick={e => { e.stopPropagation(); onToggle(dest.id); }}
            >
              {isVisited ? 'Mark unvisited' : 'Mark visited'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
