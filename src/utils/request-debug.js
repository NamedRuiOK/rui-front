function quotePowerShellArgument (value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

export function createLoginCurlCommand (url, credentials) {
  const requestUrl = new URL(url, window.location.origin).href
  const requestBody = JSON.stringify(credentials)

  return [
    'curl.exe',
    `--url ${quotePowerShellArgument(requestUrl)}`,
    '--request POST',
    `--header ${quotePowerShellArgument('Accept: */*')}`,
    `--header ${quotePowerShellArgument('Content-Type: application/json')}`,
    `--data-raw ${quotePowerShellArgument(requestBody)}`
  ].join(' ')
}

export function printLoginRequest (url, credentials) {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  console.groupCollapsed('[登录请求] cURL')
  console.info(createLoginCurlCommand(url, credentials))
  console.info('请求地址：', new URL(url, window.location.origin).href)
  console.info('页面来源：', window.location.origin)
  console.info('请求数据：', credentials)
  console.groupEnd()
}

export function printLoginResponse (response, result) {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  const safeResult = result && result.data
    ? {
        ...result,
        data: {
          ...result.data,
          accessToken: result.data.accessToken ? '[已隐藏]' : result.data.accessToken
        }
      }
    : result

  console.groupCollapsed(`[登录响应] HTTP ${response.status}`)
  console.info('响应状态：', response.status, response.statusText)
  console.info('响应数据：', safeResult)
  console.groupEnd()
}

export function printLoginNetworkError (error) {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  console.error('[登录请求失败]', error)
}
