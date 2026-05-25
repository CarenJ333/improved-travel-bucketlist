import React, { useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import AddDestinationModal from '../components/AddDestinationModal';
import { CONTINENTS } from '../data/destinations.js';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

export default function DestinationsPage({ destinations, onSave, onToggle, onDelete, onDetail }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [continentFilter, setContinentFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingDest, setEditingDest] = useState(null);

  const filtered = destinations.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchContinent = continentFilter === 'All' || d.continent === continentFilter;
    return matchSearch && matchStatus && matchContinent;
  });

  const handleEdit = (dest) => {
    setEditingDest(dest);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingDest(null);
  };

  const visitedCount = destinations.filter(d => d.status === 'Visited').length;
  const continentsCount = new Set(destinations.filter(d => d.status === 'Visited').map(d => d.continent)).size;

  return (
    <div>
      <div className="page-header">
        <h2>My Travel Bucket List</h2>
        <p>Track your dream destinations — from "someday" to "I was there"</p>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">Total Destinations</div>
          <div className="stat-value terracotta">{destinations.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Visited</div>
          <div className="stat-value forest">{visitedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Still to Go</div>
          <div className="stat-value sky">{destinations.length - visitedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Continents Explored</div>
          <div className="stat-value">{continentsCount}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search destinations or countries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Visited">Visited</option>
          <option value="Not Yet">Not Yet</option>
        </select>
        <select className="filter-select" value={continentFilter} onChange={e => setContinentFilter(e.target.value)}>
          <option value="All">All Continents</option>
          {CONTINENTS.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Destination
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>{search || statusFilter !== 'All' || continentFilter !== 'All' ? 'No matches found' : 'No destinations yet'}</h3>
          <p>{search ? `No results for "${search}"` : 'Start building your dream travel list!'}</p>
          {!search && statusFilter === 'All' && continentFilter === 'All' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Your First Destination</button>
          )}
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(dest => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              onClick={onDetail}
              onToggle={onToggle}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddDestinationModal
          onClose={handleClose}
          onSave={onSave}
          editingDest={editingDest}
        />
      )}
    </div>
  );
}
