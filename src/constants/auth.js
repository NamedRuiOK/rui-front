const apiBaseUrl = (process.env.VUE_APP_API_BASE_URL || '/api').replace(/\/+$/, '')

export const LOGIN_URL = `${apiBaseUrl}/sys/user/login`
export const ACCESS_TOKEN_KEY = 'accessToken'
