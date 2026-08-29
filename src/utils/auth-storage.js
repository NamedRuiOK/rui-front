import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_KEY,
  CURRENT_VIEW_KEY
} from '@/constants/auth'

export function saveAccessToken (accessToken) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function getAccessToken () {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

export function removeAccessToken () {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function saveCurrentUser (user) {
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user || {}))
}

export function getCurrentUser () {
  const savedUser = window.localStorage.getItem(CURRENT_USER_KEY)

  if (!savedUser) {
    return {}
  }

  try {
    const user = JSON.parse(savedUser)
    return user && typeof user === 'object' ? user : {}
  } catch (error) {
    window.localStorage.removeItem(CURRENT_USER_KEY)
    return {}
  }
}

export function saveCurrentView (view) {
  window.localStorage.setItem(CURRENT_VIEW_KEY, view)
}

export function getCurrentView () {
  return window.localStorage.getItem(CURRENT_VIEW_KEY) || ''
}

export function removeLoginSession () {
  removeAccessToken()
  window.localStorage.removeItem(CURRENT_USER_KEY)
  window.localStorage.removeItem(CURRENT_VIEW_KEY)
}
