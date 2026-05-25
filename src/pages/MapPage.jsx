import React, { useEffect, useRef } from 'react';

export default function MapPage({ destinations }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const visited = destinations.filter(d => d.status === 'Visited' && d.lat && d.lng);
  const notYet = destinations.filter(d => d.status === 'Not Yet' && d.lat && d.lng);
  const withCoords = destinations.filter(d => d.lat && d.lng);
  const withoutCoords = destinations.filter(d => !d.lat || !d.lng);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import leaflet
    import('leaflet').then(L => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current, {
        center: [20, 10],
        zoom: 2,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const visitedIcon = L.divIcon({
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#2D5A3D;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const notYetIcon = L.divIcon({
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#C4512A;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      withCoords.forEach(dest => {
        const icon = dest.status === 'Visited' ? visitedIcon : notYetIcon;
        const marker = L.marker([dest.lat, dest.lng], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family:'DM Sans',sans-serif; min-width: 180px;">
            ${dest.image ? `<img src="${dest.image}" alt="${dest.name}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px;" onerror="this.style.display='none'"/>` : ''}
            <strong style="font-size:1rem;display:block;margin-bottom:2px;">${dest.name}</strong>
            <span style="font-size:0.8rem;color:#5A5650;">${dest.country} · ${dest.continent}</span>
            <div style="margin-top:8px;">
              <span style="font-size:0.75rem;padding:3px 8px;border-radius:12px;background:${dest.status === 'Visited' ? '#C8DDD0' : '#F0D4C4'};color:${dest.status === 'Visited' ? '#2D5A3D' : '#C4512A'};">
                ${dest.status === 'Visited' ? '✓ Visited' : '○ Bucket List'}
              </span>
            </div>
            ${dest.notes ? `<p style="font-size:0.78rem;color:#5A5650;margin-top:8px;line-height:1.5;">${dest.notes.slice(0, 100)}${dest.notes.length > 100 ? '…' : ''}</p>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 220 });
      });

      if (withCoords.length > 0) {
        const bounds = L.latLngBounds(withCoords.map(d => [d.lat, d.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destinations]);

  return (
    <div>
      <div className="page-header">
        <h2>My Travel Map</h2>
        <p>A visual view of your journeys and dreams — powered by OpenStreetMap</p>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--forest)' }}></div>
          <span>Visited ({visited.length})</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--terracotta)' }}></div>
          <span>Bucket list ({notYet.length})</span>
        </div>
        {withoutCoords.length > 0 && (
          <div className="legend-item" style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>
            {withoutCoords.length} destination{withoutCoords.length > 1 ? 's' : ''} without coordinates — edit them to add map pins
          </div>
        )}
      </div>

      {withCoords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>No destinations on the map yet</h3>
          <p>Add latitude & longitude when adding destinations to see them here.</p>
        </div>
      ) : (
        <div className="map-container" ref={mapRef}></div>
      )}

      {withoutCoords.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--ink-muted)' }}>
            Destinations missing map pins
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {withoutCoords.map(d => (
              <span key={d.id} style={{
                padding: '4px 12px',
                background: 'var(--sand-dark)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.8rem',
                color: 'var(--ink-muted)',
              }}>
                {d.name}, {d.country}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
