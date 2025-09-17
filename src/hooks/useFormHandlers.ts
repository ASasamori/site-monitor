import { useState, useCallback } from 'react'
import { isValidUrl, isValidEmail } from '../utils/validation'
import { saveCredentials, addToHistory, getCredentials } from '../utils/storage'
import type { FormStep } from '../types/app'

export const useFormHandlers = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('credentials')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('notify')
  const [newUrl, setNewUrl] = useState('')
  const [newMessage, setNewMessage] = useState('notify')
  const [savedUrls, setSavedUrls] = useState<string[]>([])
  const [savedUsernames, setSavedUsernames] = useState<string[]>([])
  const [savedEmails, setSavedEmails] = useState<string[]>([])
  const [urlError, setUrlError] = useState<string>('')
  const [newUrlError, setNewUrlError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value)
    // Clear any existing error when user starts typing (like email field)
    if (urlError) setUrlError('')
  }, [urlError])

  const handleNewUrlChange = useCallback((value: string) => {
    setNewUrl(value)
    // Clear any existing error when user starts typing (like email field)
    if (newUrlError) setNewUrlError('')
  }, [newUrlError])

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    if (emailError) setEmailError('') // Clear error when typing
  }, [emailError])

  const handleSubmit = useCallback(() => {
    if (!username.trim() || !email.trim()) {
      alert('Please fill in both username and email')
      return
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setEmailError('')
    
    // Generate new UUID for new username
    const user_uuid = crypto.randomUUID()
    saveCredentials(username, email, user_uuid)
    
    // Save to autocomplete history
    const newSavedUsernames = addToHistory('savedUsernames', username, savedUsernames)
    const newSavedEmails = addToHistory('savedEmails', email, savedEmails)
    
    setSavedUsernames(newSavedUsernames)
    setSavedEmails(newSavedEmails)
    
    console.log(`Saving to localStorage - username: ${username}, email: ${email}, uuid: ${user_uuid}`)
    
    setCurrentStep('monitoring')
  }, [username, email, savedUsernames, savedEmails])

  const handleBack = useCallback(() => {
    setCurrentStep('credentials')
    setEmailError('') // Clear email error when going back
  }, [])

  const handleKeyPress = useCallback((e: React.KeyboardEvent, onEnter: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onEnter()
    }
  }, [])

  const loadCredentials = useCallback(() => {
    const { username: savedUsername, email: savedEmail } = getCredentials()
    setUsername(savedUsername)
    setEmail(savedEmail)
    
    // If we have saved credentials, go to monitoring step
    if (savedUsername && savedEmail) {
      setCurrentStep('monitoring')
    }
  }, [])

  const validateUrl = useCallback((urlValue: string): boolean => {
    if (!urlValue.trim()) {
      setUrlError('Please enter a URL to monitor')
      return false
    }
    if (!isValidUrl(urlValue)) {
      setUrlError('Please enter a valid URL (must start with http:// or https://)')
      return false
    }
    setUrlError('')
    return true
  }, [])

  const validateNewUrl = useCallback((urlValue: string): boolean => {
    if (!urlValue.trim()) {
      setNewUrlError('Please enter a URL to monitor')
      return false
    }
    if (!isValidUrl(urlValue)) {
      setNewUrlError('Please enter a valid URL (must start with http:// or https://)')
      return false
    }
    setNewUrlError('')
    return true
  }, [])

  const clearFormData = useCallback(() => {
    setUsername('')
    setEmail('')
    setUrl('')
    setMessage('notify')
    setNewUrl('')
    setNewMessage('notify')
    setUrlError('')
    setNewUrlError('')
    setEmailError('')
    setCurrentStep('credentials')
  }, [])

  return {
    // State
    currentStep,
    username,
    email,
    url,
    message,
    newUrl,
    newMessage,
    savedUrls,
    savedUsernames,
    savedEmails,
    urlError,
    newUrlError,
    emailError,
    
    // Setters
    setUsername,
    setEmail,
    setUrl,
    setMessage,
    setNewUrl,
    setNewMessage,
    setSavedUrls,
    setSavedUsernames,
    setSavedEmails,
    setUrlError,
    setNewUrlError,
    setEmailError,
    
    // Handlers
    handleUrlChange,
    handleNewUrlChange,
    handleEmailChange,
    handleSubmit,
    handleBack,
    handleKeyPress,
    loadCredentials,
    clearFormData,
    
    // Validation functions
    validateUrl,
    validateNewUrl
  }
}
