import { ACCESS_TOKEN_KEY } from '@/constants/auth'

export function saveAccessToken (accessToken) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function getAccessToken () {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

export function removeAccessToken () {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}
