import { ACCESS_TOKEN_KEY } from '@/constants/auth'

export function saveAccessToken (accessToken) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}
