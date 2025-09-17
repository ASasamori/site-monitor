import React from 'react'
import type { MonitoringSession } from '../types/app'

interface LiveViewProps {
  liveViewUrl: string | null
  sidebarExpanded: boolean
  username: string
  monitoringSessions: MonitoringSession[]
  activeSessionId: string | null
  onToggleSidebar: () => void
  onSwitchSession: (sessionId: string) => void
  onTerminateSession: (sessionId: string) => void
  onNewMonitoring: () => void
  onClearAllData: () => void
  onCloseLiveView: () => void
}

export const LiveView: React.FC<LiveViewProps> = ({
  liveViewUrl,
  sidebarExpanded,
  username,
  monitoringSessions,
  activeSessionId,
  onToggleSidebar,
  onSwitchSession,
  onTerminateSession,
  onNewMonitoring,
  onClearAllData,
  onCloseLiveView
}) => {
  return (
    <div className="live-view-overlay">
      {/* Collapsible Sidebar */}
      <div className={`live-view-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-toggle" onClick={onToggleSidebar}>
          <div className="toggle-icon">
            {sidebarExpanded ? '◀' : '▶'}
          </div>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3>Live Monitoring</h3>
            <div className="user-info">
              <span className="user-name">{username || 'No username'}</span>
            </div>
          </div>
          
          {/* Session Tabs */}
          {monitoringSessions.length > 0 && (
            <div className="session-tabs">
              <h4>Active Sessions</h4>
              {monitoringSessions.map((session) => (
                <div 
                  key={session.id} 
                  className={`session-tab ${activeSessionId === session.id ? 'active' : ''}`}
                >
                  <button 
                    onClick={() => onSwitchSession(session.id)}
                    className="session-tab-button"
                    title={`Switch to ${session.url}`}
                  >
                    <span className="session-url">{session.url}</span>
                    <span className="session-action">{session.message}</span>
                  </button>
                  <button 
                    onClick={() => onTerminateSession(session.id)}
                    className="session-close"
                    title="Terminate this session"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="sidebar-actions">
            <button 
              onClick={onNewMonitoring} 
              className="sidebar-btn primary"
              title="Monitor New URL"
            >
              <span className="btn-icon">+</span>
              <span className="btn-text">New Monitor</span>
            </button>
            
            <button 
              onClick={onClearAllData} 
              className="sidebar-btn secondary"
              title="Clear All Data (Dev)"
            >
              <span className="btn-icon">🗑️</span>
              <span className="btn-text">Clear All</span>
            </button>
            
            <button 
              onClick={onCloseLiveView} 
              className="sidebar-btn danger"
              title="Close Live View"
            >
              <span className="btn-icon">x</span>
              <span className="btn-text">Close</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Live View Area */}
      <div className="live-view-main">
        {liveViewUrl && (
          <iframe 
            src={liveViewUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 'none', borderRadius: '12px' }} 
          />
        )}
      </div>
    </div>
  )
}
