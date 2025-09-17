import { useState, useEffect } from 'react'
import './App.css'
import { CredentialsForm } from './components/CredentialsForm'
import { MonitoringForm } from './components/MonitoringForm'
import { LiveView } from './components/LiveView'
import { ControlPanel } from './components/ControlPanel'
import { useFormHandlers } from './hooks/useFormHandlers'
import { useMonitoring } from './hooks/useMonitoring'
import { loadFromStorage, clearAllData } from './utils/storage'
import { createMonitoringSession } from './services/monitoringService'
import { isValidUrl } from './utils/validation'

function App() {
  // Form handling hook
  const formHandlers = useFormHandlers()
  
  // Monitoring hook
  const monitoring = useMonitoring()
  
  // Additional state for UI
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; conversation?: any; error?: string } | null>(null)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  useEffect(() => {
    localStorage.removeItem('jobRequest')
    localStorage.removeItem('message')
    
    // Load saved data
    const savedData = loadFromStorage()
    formHandlers.setSavedUrls(savedData.urls)
    formHandlers.setSavedUsernames(savedData.usernames)
    formHandlers.setSavedEmails(savedData.emails)
    
    // Load credentials and set step
    formHandlers.loadCredentials()
    
    console.log('Loaded from localStorage:', savedData)
  }, [])

  // Debug username changes
  useEffect(() => {
    console.log('Username changed:', formHandlers.username)
  }, [formHandlers.username])

  const handleClearAllData = async () => {
    await monitoring.terminateAllSessions()
    clearAllData()
    formHandlers.clearFormData()
    monitoring.setShowLiveView(false)
    setResult(null)
    console.log('All data cleared!')
  }

  const handleNewMonitoring = () => {
    setShowControlPanel(true)
  }

  const handleCloseControlPanel = () => {
    setShowControlPanel(false)
  }


  const handleNewMonitoringSubmit = async () => {
    if (!formHandlers.validateNewUrl(formHandlers.newUrl)) {
      return
    }

    setIsLoading(true)
    setResult(null)
    setShowControlPanel(false)

    try {
      const { result, session } = await createMonitoringSession(
        formHandlers.newUrl,
        formHandlers.newMessage,
        formHandlers.email,
        formHandlers.username,
        formHandlers.savedUrls,
        formHandlers.setSavedUrls
      )
      
      setResult(result)
      
      if (result.success && session) {
        alert(`Job submitted successfully! Conversation ID: ${result.conversation?.id}`)
        monitoring.addSession(session)
      } else {
        alert(`Job failed: ${result.error}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResult({ success: false, error: errorMessage })
      alert(`Job failed: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGo = async () => {
    if (!formHandlers.validateUrl(formHandlers.url)) {
      return
    }

    setIsLoading(true)
    setResult(null)
    setShowControlPanel(false)

    try {
      const { result, session } = await createMonitoringSession(
        formHandlers.url,
        formHandlers.message,
        formHandlers.email,
        formHandlers.username,
        formHandlers.savedUrls,
        formHandlers.setSavedUrls
      )
      
      setResult(result)
      
      if (result.success && session) {
        alert(`Job submitted successfully! Conversation ID: ${result.conversation?.id}`)
        monitoring.addSession(session)
      } else {
        alert(`Job failed: ${result.error}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResult({ success: false, error: errorMessage })
      alert(`Job failed: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      {monitoring.showLiveView ? (
        <LiveView
          liveViewUrl={monitoring.liveViewUrl}
          sidebarExpanded={sidebarExpanded}
          username={formHandlers.username}
          monitoringSessions={monitoring.monitoringSessions}
          activeSessionId={monitoring.activeSessionId}
          onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
          onSwitchSession={monitoring.switchSession}
          onTerminateSession={monitoring.terminateSession}
          onNewMonitoring={handleNewMonitoring}
          onClearAllData={handleClearAllData}
          onCloseLiveView={monitoring.closeLiveView}
        />
      ) : (
        <div className="app-card">
          <h1 className="app-title">Resource Monitor</h1>
          
          {formHandlers.currentStep === 'credentials' ? (
            <CredentialsForm
              username={formHandlers.username}
              email={formHandlers.email}
              emailError={formHandlers.emailError}
              savedUsernames={formHandlers.savedUsernames}
              savedEmails={formHandlers.savedEmails}
              onUsernameChange={formHandlers.setUsername}
              onEmailChange={formHandlers.handleEmailChange}
              onSubmit={formHandlers.handleSubmit}
            />
          ) : (
            <MonitoringForm
              username={formHandlers.username}
              url={formHandlers.url}
              message={formHandlers.message}
              urlError={formHandlers.urlError}
              savedUrls={formHandlers.savedUrls}
              isLoading={isLoading}
              onUrlChange={formHandlers.handleUrlChange}
              onMessageChange={formHandlers.setMessage}
              onBack={formHandlers.handleBack}
              onGo={handleGo}
              onKeyPress={(e) => formHandlers.handleKeyPress(e, handleGo)}
            />
          )}
          
          {result && (
            <div className={`result-message ${result.success ? 'success' : 'error'}`}>
              <div className="result-icon">
                {result.success ? '✓' : '✗'}
              </div>
              <div className="result-content">
                <strong>{result.success ? 'Success!' : 'Error:'}</strong>
              </div>
            </div>
          )}
        </div>
      )}
      
      {showControlPanel && (
        <ControlPanel
          newUrl={formHandlers.newUrl}
          newMessage={formHandlers.newMessage}
          newUrlError={formHandlers.newUrlError}
          savedUrls={formHandlers.savedUrls}
          isLoading={isLoading}
          onNewUrlChange={formHandlers.handleNewUrlChange}
          onNewMessageChange={formHandlers.setNewMessage}
          onClose={handleCloseControlPanel}
          onSubmit={handleNewMonitoringSubmit}
          onKeyPress={(e) => formHandlers.handleKeyPress(e, handleNewMonitoringSubmit)}
        />
      )}
    </div>
  )
}

export default App
