import { LOGIN_URL } from '@/constants/auth'
import {
  printLoginNetworkError,
  printLoginRequest,
  printLoginResponse
} from '@/utils/request-debug'

export async function login (credentials) {
  let response

  printLoginRequest(LOGIN_URL, credentials)

  try {
    response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
  } catch (error) {
    printLoginNetworkError(error)
    throw new Error(
      '无法连接登录服务，请确认后端服务和前端接口代理配置正常'
    )
  }

  let result

  try {
    result = await response.json()
  } catch (error) {
    printLoginNetworkError(error)
    throw new Error(`登录服务返回了无效数据（HTTP ${response.status}）`)
  }

  printLoginResponse(response, result)

  const user = result && result.data
  const accessToken = user && user.accessToken

  if (!response.ok || !result || result.code !== 200 || !accessToken) {
    throw new Error((result && result.message) || '登录失败，请检查用户名和密码')
  }

  return user
}
