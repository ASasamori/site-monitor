/**
 * Local storage utilities for managing app data
 */

export interface SavedData {
  urls: string[]
  usernames: string[]
  emails: string[]
}

export const loadFromStorage = (): SavedData => {
  const savedUrlsData = localStorage.getItem('savedUrls')
  const savedUsernamesData = localStorage.getItem('savedUsernames')
  const savedEmailsData = localStorage.getItem('savedEmails')
  
  return {
    urls: savedUrlsData ? JSON.parse(savedUrlsData) : [],
    usernames: savedUsernamesData ? JSON.parse(savedUsernamesData) : [],
    emails: savedEmailsData ? JSON.parse(savedEmailsData) : []
  }
}

export const saveToStorage = (key: string, data: string[]): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const saveCredentials = (username: string, email: string, userUuid: string): void => {
  localStorage.setItem('username', username)
  localStorage.setItem('email', email)
  localStorage.setItem('user_uuid', userUuid)
}

export const getCredentials = (): { username: string; email: string; userUuid: string | null } => {
  return {
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    userUuid: localStorage.getItem('user_uuid')
  }
}

export const clearAllData = (): void => {
  localStorage.clear()
}

export const addToHistory = (key: string, value: string, currentHistory: string[]): string[] => {
  if (value && !currentHistory.includes(value)) {
    const newHistory = [...currentHistory, value]
    saveToStorage(key, newHistory)
    return newHistory
  }
  return currentHistory
}
