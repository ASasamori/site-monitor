import { useState, useCallback } from 'react'
import type { MonitoringSession } from '../types/app'

export const useMonitoring = () => {
  const [monitoringSessions, setMonitoringSessions] = useState<MonitoringSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [liveViewUrl, setLiveViewUrl] = useState<string | null>(null)
  const [showLiveView, setShowLiveView] = useState(false)

  const addSession = useCallback((session: MonitoringSession) => {
    setMonitoringSessions(prev => [...prev, session])
    setActiveSessionId(session.id)
    setLiveViewUrl(session.liveViewUrl)
    setShowLiveView(true)
  }, [])

  const switchSession = useCallback((sessionId: string) => {
    const session = monitoringSessions.find(s => s.id === sessionId)
    if (session) {
      setActiveSessionId(sessionId)
      setLiveViewUrl(session.liveViewUrl)
    }
  }, [monitoringSessions])

  const terminateSession = useCallback(async (sessionId: string) => {
    const session = monitoringSessions.find(s => s.id === sessionId)
    if (session) {
      try {
        await session.androidBox.terminate()
        console.log(`Terminated box for session: ${sessionId}`)
      } catch (error) {
        console.error(`Error terminating box for session ${sessionId}:`, error)
      }
      
      const updatedSessions = monitoringSessions.filter(s => s.id !== sessionId)
      setMonitoringSessions(updatedSessions)
      
      if (activeSessionId === sessionId) {
        if (updatedSessions.length > 0) {
          const newActiveSession = updatedSessions[0]
          setActiveSessionId(newActiveSession.id)
          setLiveViewUrl(newActiveSession.liveViewUrl)
        } else {
          setActiveSessionId(null)
          setLiveViewUrl(null)
          setShowLiveView(false)
        }
      }
    }
  }, [monitoringSessions, activeSessionId])

  const terminateAllSessions = useCallback(async () => {
    for (const session of monitoringSessions) {
      try {
        await session.androidBox.terminate()
        console.log(`Terminated box for session: ${session.id}`)
      } catch (error) {
        console.error(`Error terminating box for session ${session.id}:`, error)
      }
    }
    
    setMonitoringSessions([])
    setActiveSessionId(null)
    setLiveViewUrl(null)
    setShowLiveView(false)
  }, [monitoringSessions])

  const closeLiveView = useCallback(async () => {
    await terminateAllSessions()
  }, [terminateAllSessions])

  return {
    monitoringSessions,
    activeSessionId,
    liveViewUrl,
    showLiveView,
    addSession,
    switchSession,
    terminateSession,
    terminateAllSessions,
    closeLiveView,
    setShowLiveView
  }
}
