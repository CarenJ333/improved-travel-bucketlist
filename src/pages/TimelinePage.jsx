import React from 'react';

export default function TimelinePage({ destinations }) {
  const withDates = destinations
    .filter(d => d.visitDate || d.dateAdded)
    .sort((a, b) => {
      const aDate = a.visitDate || a.dateAdded;
      const bDate = b.visitDate || b.dateAdded;
      return new Date(bDate) - new Date(aDate);
    });

  const grouped = withDates.reduce((acc, dest) => {
    const dateStr = dest.visitDate || dest.dateAdded;
    const year = new Date(dateStr).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(dest);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => b - a);

  if (withDates.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2>Travel Timeline</h2>
          <p>Your journey through time</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No timeline entries yet</h3>
          <p>Add destinations with visit dates to build your travel timeline.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Travel Timeline</h2>
        <p>A chronological journey through your adventures and dreams</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        {years.map(year => (
          <div key={year} style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: '1.25rem',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--terracotta)',
                letterSpacing: '-0.03em',
              }}>{year}</h3>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--ink-faint)',
                background: 'var(--sand-dark)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-xl)',
              }}>
                {grouped[year].length} destination{grouped[year].length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="timeline-list">
              {grouped[year].map(dest => {
                const isVisited = dest.status === 'Visited';
                const dateStr = dest.visitDate || dest.dateAdded;
                const date = new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

                return (
                  <div key={dest.id} className="timeline-item">
                    <div className={`timeline-dot ${isVisited ? 'visited' : 'not-yet'}`}></div>
                    <div className="timeline-card">
                      <div style={{ display: 'flex', gap: 12 }}>
                        {dest.image && (
                          <img
                            src={dest.image}
                            alt={dest.name}
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                            onError={e => e.target.style.display = 'none'}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div className="timeline-card-header">
                            <span className="timeline-title">{dest.name}</span>
                            <span className="timeline-date">{date}</span>
                          </div>
                          <div className="timeline-sub" style={{ marginBottom: 6 }}>
                            {dest.country} · {dest.continent}
                          </div>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-xl)',
                            background: isVisited ? 'var(--forest-light)' : 'var(--sand-dark)',
                            color: isVisited ? 'var(--forest)' : 'var(--ink-muted)',
                          }}>
                            {isVisited ? '✓ Visited' : '○ Bucket list'}
                          </span>
                          {dest.notes && (
                            <p style={{
                              marginTop: 8,
                              fontSize: '0.8rem',
                              color: 'var(--ink-muted)',
                              lineHeight: 1.5,
                              fontStyle: 'italic',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}>
                              "{dest.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
