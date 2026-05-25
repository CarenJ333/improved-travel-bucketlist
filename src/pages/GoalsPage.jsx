import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const X_ICON = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

function AddGoalModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', type: 'weekly', target: 1, current: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      completed: false,
      target: parseInt(form.target) || 1,
      current: parseInt(form.current) || 0,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>New Travel Goal</h3>
          <button className="modal-close" onClick={onClose}><X_ICON /></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Goal Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Visit 3 new countries this year" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target (number)</label>
                <input className="form-input" type="number" min="1" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Current Progress</label>
              <input className="form-input" type="number" min="0" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Goal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage({ destinations }) {
  const [goals, setGoals] = useLocalStorage('triptrail-goals', []);
  const [showModal, setShowModal] = useState(false);

  const visitedCount = destinations.filter(d => d.status === 'Visited').length;
  const continentsCount = new Set(destinations.filter(d => d.status === 'Visited').map(d => d.continent)).size;
  const countriesCount = new Set(destinations.filter(d => d.status === 'Visited').map(d => d.country)).size;

  const addGoal = (goal) => setGoals(g => [...g, goal]);
  const deleteGoal = (id) => setGoals(g => g.filter(goal => goal.id !== id));
  const toggleComplete = (id) => {
    setGoals(g => g.map(goal => goal.id === id
      ? { ...goal, completed: !goal.completed, current: goal.completed ? goal.current : goal.target }
      : goal
    ));
  };
  const updateProgress = (id, delta) => {
    setGoals(g => g.map(goal => goal.id === id
      ? { ...goal, current: Math.min(goal.target, Math.max(0, goal.current + delta)) }
      : goal
    ));
  };

  const weekly = goals.filter(g => g.type === 'weekly');
  const yearly = goals.filter(g => g.type === 'yearly');

  const completedGoals = goals.filter(g => g.completed || g.current >= g.target).length;
  const progressPct = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h2>Travel Goals</h2>
        <p>Set weekly and yearly targets to keep your wanderlust on track</p>
      </div>

      <div className="stats-bar" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Goals Set</div>
          <div className="stat-value terracotta">{goals.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value forest">{completedGoals}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Countries Visited</div>
          <div className="stat-value sky">{countriesCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Continents</div>
          <div className="stat-value">{continentsCount}</div>
        </div>
      </div>

      {goals.length > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1.25rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)' }}>Overall Goal Progress</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{completedGoals}/{goals.length} goals</span>
          </div>
          <div className="progress-bar-track" style={{ height: 10 }}>
            <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: 'var(--terracotta)' }}></div>
          </div>
          <div style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{progressPct}% complete</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Goal</button>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No goals yet</h3>
          <p>Set weekly and yearly travel goals to stay inspired and on track.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Your First Goal</button>
        </div>
      ) : (
        <>
          {weekly.length > 0 && (
            <div className="goals-section">
              <h3>Weekly Goals</h3>
              <div className="goals-grid">
                {weekly.map(goal => {
                  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
                  const isDone = goal.completed || goal.current >= goal.target;
                  return (
                    <div key={goal.id} className="goal-card" style={{ opacity: isDone ? 0.75 : 1 }}>
                      <div className="goal-card-header">
                        <span className="goal-title">{goal.title}</span>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <span className="goal-type goal-weekly">Weekly</span>
                          <button className="btn btn-ghost btn-sm" style={{ padding: '2px 4px' }} onClick={() => deleteGoal(goal.id)}><X_ICON /></button>
                        </div>
                      </div>
                      <div className="goal-progress">
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: isDone ? 'var(--forest)' : 'var(--sky)' }}></div>
                        </div>
                        <div className="goal-progress-text">
                          <span>{goal.current} / {goal.target}</span>
                          <span>{pct}%</span>
                        </div>
                      </div>
                      {!isDone ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => updateProgress(goal.id, -1)}>− Less</button>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => updateProgress(goal.id, 1)}>+ Progress</button>
                        </div>
                      ) : (
                        <button className="goal-complete-btn completed">✓ Completed!</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {yearly.length > 0 && (
            <div className="goals-section">
              <h3>Yearly Goals</h3>
              <div className="goals-grid">
                {yearly.map(goal => {
                  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
                  const isDone = goal.completed || goal.current >= goal.target;
                  return (
                    <div key={goal.id} className="goal-card" style={{ opacity: isDone ? 0.75 : 1 }}>
                      <div className="goal-card-header">
                        <span className="goal-title">{goal.title}</span>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <span className="goal-type goal-yearly">Yearly</span>
                          <button className="btn btn-ghost btn-sm" style={{ padding: '2px 4px' }} onClick={() => deleteGoal(goal.id)}><X_ICON /></button>
                        </div>
                      </div>
                      <div className="goal-progress">
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: isDone ? 'var(--forest)' : 'var(--gold)' }}></div>
                        </div>
                        <div className="goal-progress-text">
                          <span>{goal.current} / {goal.target}</span>
                          <span>{pct}%</span>
                        </div>
                      </div>
                      {!isDone ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => updateProgress(goal.id, -1)}>− Less</button>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => updateProgress(goal.id, 1)}>+ Progress</button>
                        </div>
                      ) : (
                        <button className="goal-complete-btn completed">✓ Completed!</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && <AddGoalModal onClose={() => setShowModal(false)} onSave={addGoal} />}
    </div>
  );
}
