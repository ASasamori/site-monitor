import React from 'react'

interface MonitoringFormProps {
  username: string
  url: string
  message: string
  urlError: string
  savedUrls: string[]
  isLoading: boolean
  onUrlChange: (value: string) => void
  onMessageChange: (value: string) => void
  onBack: () => void
  onGo: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export const MonitoringForm: React.FC<MonitoringFormProps> = ({
  username,
  url,
  message,
  urlError,
  savedUrls,
  isLoading,
  onUrlChange,
  onMessageChange,
  onBack,
  onGo,
  onKeyPress
}) => {
  return (
    <div className="form-step">
      <div className="step-indicator">
        <div className="step completed">1</div>
        <div className="step-line completed"></div>
        <div className="step active">2</div>
      </div>
      <h2 className="step-title">Setup Monitoring</h2>
      <p className="step-description">Configure what you want to monitor</p>
      
      <div className="user-info">
        <span className="user-label">Logged in as:</span>
        <span className="user-name">{username}</span>
        <button onClick={onBack} className="btn-back">Change</button>
      </div>
      
      <div className="form-group">
        <label className="form-label">URL to Monitor</label>
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com/booking"
          className={`form-input ${urlError ? 'error' : ''}`}
          list="url-history"
          autoComplete="on"
        />
        <datalist id="url-history">
          {savedUrls.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
        {urlError && <div className="error-message">{urlError}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Action Type</label>
        <select
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyPress}
          className="form-select"
        >
          <option value="notify">Notify</option>
          <option value="buy">Buy</option>
          <option value="reserve">Reserve</option>
        </select>
      </div>
      
      <button
        onClick={onGo}
        disabled={isLoading}
        className={`btn ${isLoading ? 'btn-loading' : 'btn-success'}`}
      >
        {isLoading ? 'Starting Monitor...' : 'Start Monitoring'}
      </button>
    </div>
  )
}
