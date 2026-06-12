'use client';

export default function ConfirmDeleteModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🗑️</div>
        <h3 className="modal-title">{title || 'Confirm Delete'}</h3>
        <p className="modal-message">{message || 'Are you sure you want to delete this? This action cannot be undone.'}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? '⏳ Deleting...' : '🗑 Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
