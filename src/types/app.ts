/**
 * App-specific types and interfaces
 */

export type FormStep = 'credentials' | 'monitoring'

export interface MonitoringSession {
  id: string
  url: string
  message: string
  liveViewUrl: string
  androidBox: any
  conversationId?: string
}

export interface AppState {
  currentStep: FormStep
  username: string
  email: string
  url: string
  message: string
  isLoading: boolean
  result: { success: boolean; conversation?: any; error?: string } | null
  liveViewUrl: string | null
  showLiveView: boolean
  showControlPanel: boolean
  sidebarExpanded: boolean
  newUrl: string
  newMessage: string
  savedUrls: string[]
  savedUsernames: string[]
  savedEmails: string[]
  monitoringSessions: MonitoringSession[]
  activeSessionId: string | null
  urlError: string
  newUrlError: string
  emailError: string
}

export interface FormData {
  username: string
  email: string
  url: string
  message: string
}

export interface NewMonitoringData {
  url: string
  message: string
}
