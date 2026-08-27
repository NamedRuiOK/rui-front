import { LOGIN_URL } from '@/constants/auth'

export async function login (credentials) {
  let response

  try {
    response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
  } catch (error) {
    throw new Error(
      `登录请求被浏览器拦截，请确认后端 CORS 已允许当前页面来源：${window.location.origin}`
    )
  }

  let result

  try {
    result = await response.json()
  } catch (error) {
    throw new Error(`登录服务返回了无效数据（HTTP ${response.status}）`)
  }

  const user = result && result.data
  const accessToken = user && user.accessToken

  if (!response.ok || !result || result.code !== 200 || !accessToken) {
    throw new Error((result && result.message) || '登录失败，请检查用户名和密码')
  }

  return user
}
