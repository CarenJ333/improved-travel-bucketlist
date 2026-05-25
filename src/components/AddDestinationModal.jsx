import React, { useState, useEffect } from 'react';
import { CONTINENTS } from '../data/destinations.js';

const X_ICON = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

export default function AddDestinationModal({ onClose, onSave, editingDest }) {
  const [form, setForm] = useState({
    name: '', country: '', continent: 'Europe', description: '',
    image: '', status: 'Not Yet', notes: '', visitDate: '', lat: '', lng: '',
  });

  useEffect(() => {
    if (editingDest) setForm({ ...editingDest });
  }, [editingDest]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.country.trim()) return;
    onSave({
      ...form,
      id: editingDest?.id || Date.now().toString(),
      dateAdded: editingDest?.dateAdded || new Date().toISOString().split('T')[0],
      lat: parseFloat(form.lat) || null,
      lng: parseFloat(form.lng) || null,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{editingDest ? 'Edit Destination' : 'Add New Destination'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X_ICON /></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Destination Name *</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Kyoto" required />
              </div>
              <div className="form-group">
                <label className="form-label">Country *</label>
                <input className="form-input" name="country" value={form.country} onChange={handleChange} placeholder="e.g. Japan" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Continent</label>
                <select className="form-select" name="continent" value={form.continent} onChange={handleChange}>
                  {CONTINENTS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  <option>Not Yet</option>
                  <option>Visited</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="What makes this place special?" />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
            </div>

            {form.status === 'Visited' && (
              <div className="form-group">
                <label className="form-label">Visit Date</label>
                <input className="form-input" type="date" name="visitDate" value={form.visitDate || ''} onChange={handleChange} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="Tips, memories, things to do..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Latitude (for map)</label>
                <input className="form-input" name="lat" value={form.lat} onChange={handleChange} placeholder="e.g. 35.0116" />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude (for map)</label>
                <input className="form-input" name="lng" value={form.lng} onChange={handleChange} placeholder="e.g. 135.7681" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {editingDest ? 'Save Changes' : '+ Add Destination'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
