const apiBaseUrl = (process.env.VUE_APP_API_BASE_URL || '/api').replace(/\/+$/, '')

export const LOGIN_URL = `${apiBaseUrl}/sys/user/login`
export const REGISTER_URL = `${apiBaseUrl}/sys/user/register`
export const ACCESS_TOKEN_KEY = 'accessToken'
export const CURRENT_USER_KEY = 'currentUser'
export const CURRENT_VIEW_KEY = 'currentView'
