import React from 'react'

interface ControlPanelProps {
  newUrl: string
  newMessage: string
  newUrlError: string
  savedUrls: string[]
  isLoading: boolean
  onNewUrlChange: (value: string) => void
  onNewMessageChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  newUrl,
  newMessage,
  newUrlError,
  savedUrls,
  isLoading,
  onNewUrlChange,
  onNewMessageChange,
  onClose,
  onSubmit,
  onKeyPress
}) => {
  return (
    <div className="control-panel-overlay">
      <div className="control-panel">
        <div className="control-panel-header">
          <h3>Monitor New URL</h3>
          <button onClick={onClose} className="btn-close">x</button>
        </div>
        <div className="control-panel-content">
          <div className="form-group">
            <label className="form-label">URL to Monitor</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => onNewUrlChange(e.target.value)}
              onKeyDown={onKeyPress}
              placeholder="https://example.com/booking"
              className={`form-input ${newUrlError ? 'error' : ''}`}
              list="new-url-history"
              autoComplete="on"
              autoFocus
            />
            <datalist id="new-url-history">
              {savedUrls.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            {newUrlError && <div className="error-message">{newUrlError}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Action Type</label>
            <select
              value={newMessage}
              onChange={(e) => onNewMessageChange(e.target.value)}
              onKeyDown={onKeyPress}
              className="form-select"
            >
              <option value="notify">Notify</option>
              <option value="buy">Buy</option>
              <option value="reserve">Reserve</option>
            </select>
          </div>
          
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className={`btn ${isLoading ? 'btn-loading' : 'btn-success'}`}
          >
            {isLoading ? 'Starting Monitor...' : 'Start Monitoring'}
          </button>
          
          <div className="form-hint">
            Press <kbd>Enter</kbd> to submit
          </div>
        </div>
      </div>
    </div>
  )
}
