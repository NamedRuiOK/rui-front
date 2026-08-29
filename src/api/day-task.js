import {
  DAY_TASK_COMPLETE_URL,
  DAY_TASK_DEFAULT_PAGE_NUM,
  DAY_TASK_DEFAULT_PAGE_SIZE,
  DAY_TASK_LIST_URL
} from '@/constants/day-task'
import { getAccessToken } from '@/utils/auth-storage'

function getAuthorizationHeaders () {
  const accessToken = getAccessToken()

  if (!accessToken) {
    throw new Error('登录状态已失效，请重新登录')
  }

  return {
    Accept: '*/*',
    Authorization: accessToken,
    'Content-Type': 'application/json'
  }
}

async function readApiResponse (response, fallbackMessage) {
  let result

  try {
    result = await response.json()
  } catch (error) {
    throw new Error(`每日任务服务返回了无效数据（HTTP ${response.status}）`)
  }

  if (!response.ok || !result || result.code !== 200) {
    throw new Error((result && result.message) || fallbackMessage)
  }

  return result
}

export async function fetchDayTaskList ({
  pageSize = DAY_TASK_DEFAULT_PAGE_SIZE,
  pageNum = DAY_TASK_DEFAULT_PAGE_NUM
} = {}) {
  const headers = getAuthorizationHeaders()
  let response

  try {
    response = await fetch(DAY_TASK_LIST_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ pageSize, pageNum })
    })
  } catch (error) {
    throw new Error('无法连接每日任务服务，请确认后端服务正常')
  }

  const result = await readApiResponse(response, '每日任务查询失败')

  if (!result.data || !Array.isArray(result.data.records)) {
    throw new Error('每日任务服务返回的数据格式不正确')
  }

  return result.data
}

export async function completeDayTask (id) {
  if (id === undefined || id === null) {
    throw new Error('任务 ID 不存在，无法完成任务')
  }

  const headers = getAuthorizationHeaders()
  let response

  try {
    response = await fetch(DAY_TASK_COMPLETE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id })
    })
  } catch (error) {
    throw new Error('无法连接每日任务服务，请确认后端服务正常')
  }

  await readApiResponse(response, '任务完成失败')
}
