import { main } from '../components/test'
import { buildGboxHandler } from '../components/gbox'
import { addToHistory } from '../utils/storage'
import type { Config } from '../components/types'
import type { MonitoringSession } from '../types/app'

export interface MonitoringResult {
  success: boolean
  conversation?: any
  error?: string
}

export const createMonitoringSession = async (
  url: string,
  message: string,
  email: string,
  username: string,
  savedUrls: string[],
  setSavedUrls: (urls: string[]) => void
): Promise<{ result: MonitoringResult; session: MonitoringSession }> => {
  const storedUuid = localStorage.getItem('user_uuid') || crypto.randomUUID()
  const config: Config = {
    gboxApiKey: import.meta.env.VITE_GBOX_API_KEY || 'undefined',
    gruBaseUrl: import.meta.env.VITE_GRU_BASE_URL || 'undefined',
    gruUserId: storedUuid,
    gruUserName: username || 'undefined',
  }
  
  const apiBaseUrl = `${window.location.protocol}//${window.location.host}/api/v1`
  const gbox = buildGboxHandler(import.meta.env.VITE_GBOX_API_KEY, apiBaseUrl)
  const androidBox = await gbox.create({ type: "android", config: { deviceType: "virtual" } })
  const updatedConfig = { ...config, gboxInstanceId: androidBox.data.id, gboxBaseUrl: apiBaseUrl }
  const updatedMessage = JSON.stringify({ "url": url, "ai": message, "email": email })

  const result = await main(updatedConfig, updatedMessage)
  
  // Save URL to history
  const newSavedUrls = addToHistory('savedUrls', url, savedUrls)
  setSavedUrls(newSavedUrls)
  
  if (result.success) {
    const liveView = await androidBox.liveView()
    console.log(`View URL: ${liveView.url}`)
    
    const sessionId = crypto.randomUUID()
    const session: MonitoringSession = {
      id: sessionId,
      url: url,
      message: message,
      liveViewUrl: liveView.url,
      androidBox: androidBox,
      conversationId: result.conversation?.id
    }
    
    return { result, session }
  } else {
    await androidBox.terminate()
    return { result, session: null as any }
  }
}
