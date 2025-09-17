import React from 'react'

interface CredentialsFormProps {
  username: string
  email: string
  emailError: string
  savedUsernames: string[]
  savedEmails: string[]
  onUsernameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSubmit: () => void
}

export const CredentialsForm: React.FC<CredentialsFormProps> = ({
  username,
  email,
  emailError,
  savedUsernames,
  savedEmails,
  onUsernameChange,
  onEmailChange,
  onSubmit
}) => {
  return (
    <div className="form-step">
      <div className="step-indicator">
        <div className="step active">1</div>
        <div className="step-line"></div>
        <div className="step">2</div>
      </div>
      <h2 className="step-title">Setup Your Account</h2>
      <p className="step-description">Enter your credentials to get started</p>
      
      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Enter your username"
          className="form-input"
          list="username-history"
          autoComplete="on"
        />
        <datalist id="username-history">
          {savedUsernames.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </div>
      
      <div className="form-group">
        <label className="form-label">Email to notify</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          className={`form-input ${emailError ? 'error' : ''}`}
          list="email-history"
          autoComplete="on"
        />
        <datalist id="email-history">
          {savedEmails.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
        {emailError && <div className="error-message">{emailError}</div>}
      </div>
      
      <button
        onClick={onSubmit}
        className="btn btn-primary"
      >
        Continue to Monitoring
      </button>
    </div>
  )
}
