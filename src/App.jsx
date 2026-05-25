import React, { useState, useEffect } from 'react';
import './App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SAMPLE_DESTINATIONS } from './data/destinations.js';

import DestinationsPage from './pages/DestinationsPage';
import DetailPage from './pages/DetailPage';
import MapPage from './pages/MapPage';
import TimelinePage from './pages/TimelinePage';
import GoalsPage from './pages/GoalsPage';

const NAV_ITEMS = [
  { id: 'destinations', label: 'Destinations', icon: MapPinIcon },
  { id: 'map', label: 'Map View', icon: GlobeIcon },
  { id: 'timeline', label: 'Timeline', icon: CalendarIcon },
  { id: 'goals', label: 'Goals', icon: TargetIcon },
];

function MapPinIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

export default function App() {
  const [destinations, setDestinations] = useLocalStorage('triptrail-destinations', SAMPLE_DESTINATIONS);
  const [currentPage, setCurrentPage] = useState('destinations');
  const [detailDest, setDetailDest] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => { setCurrentPage('map'); setSidebarOpen(false); };
    window.addEventListener('navigate-map', handler);
    return () => window.removeEventListener('navigate-map', handler);
  }, []);

  const handleSaveDestination = (dest) => {
    setDestinations(prev => {
      const exists = prev.find(d => d.id === dest.id);
      if (exists) return prev.map(d => d.id === dest.id ? dest : d);
      return [dest, ...prev];
    });
  };

  const handleToggle = (id) => {
    setDestinations(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: d.status === 'Visited' ? 'Not Yet' : 'Visited', visitDate: d.status !== 'Visited' ? new Date().toISOString().split('T')[0] : null }
        : d
    ));
    if (detailDest?.id === id) {
      setDetailDest(prev => prev ? {
        ...prev,
        status: prev.status === 'Visited' ? 'Not Yet' : 'Visited',
        visitDate: prev.status !== 'Visited' ? new Date().toISOString().split('T')[0] : null,
      } : null);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this destination?')) return;
    setDestinations(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdate = (dest) => {
    setDestinations(prev => prev.map(d => d.id === dest.id ? dest : d));
    setDetailDest(dest);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setDetailDest(null);
    setSidebarOpen(false);
  };

  const visitedCount = destinations.filter(d => d.status === 'Visited').length;
  const totalCount = destinations.length;

  return (
    <div className="app-container">
      <button className="mobile-nav-toggle" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
        <HamburgerIcon />
      </button>

      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>Trip Trail</h1>
          <span>Your Travel Bucket List</span>
        </div>

        <div className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id && !detailDest ? 'active' : ''}`}
                onClick={() => handleNavigate(item.id)}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-stats">
            <div className="stat-pill">
              <span>Total Destinations</span>
              <strong>{totalCount}</strong>
            </div>
            <div className="stat-pill">
              <span>Visited</span>
              <strong style={{ color: '#5DCAA5' }}>{visitedCount}</strong>
            </div>
            <div className="stat-pill">
              <span>Bucket List</span>
              <strong style={{ color: '#F0997B' }}>{totalCount - visitedCount}</strong>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${totalCount ? Math.round((visitedCount / totalCount) * 100) : 0}%`,
                  background: '#5DCAA5',
                  borderRadius: 2,
                  transition: 'width 0.4s ease',
                }}></div>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                {totalCount ? Math.round((visitedCount / totalCount) * 100) : 0}% explored
              </p>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {detailDest ? (
          <DetailPage
            dest={detailDest}
            onBack={() => setDetailDest(null)}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
          />
        ) : currentPage === 'destinations' ? (
          <DestinationsPage
            destinations={destinations}
            onSave={handleSaveDestination}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onDetail={setDetailDest}
          />
        ) : currentPage === 'map' ? (
          <MapPage destinations={destinations} />
        ) : currentPage === 'timeline' ? (
          <TimelinePage destinations={destinations} />
        ) : currentPage === 'goals' ? (
          <GoalsPage destinations={destinations} />
        ) : null}
      </main>
    </div>
  );
}