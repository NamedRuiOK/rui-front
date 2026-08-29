import {
  TASK_MANAGEMENT_CREATE_URL,
  TASK_MANAGEMENT_DELETE_URL,
  TASK_MANAGEMENT_DEFAULT_PAGE_NUM,
  TASK_MANAGEMENT_DEFAULT_PAGE_SIZE,
  TASK_MANAGEMENT_LIST_URL,
  TASK_MANAGEMENT_STATS_URL,
  TASK_MANAGEMENT_UPDATE_URL
} from '@/constants/task-management'
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

async function request (url, body, fallbackMessage) {
  const headers = getAuthorizationHeaders()
  let response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body || {})
    })
  } catch (error) {
    throw new Error('无法连接任务服务，请确认后端服务正常')
  }

  let result

  try {
    result = await response.json()
  } catch (error) {
    throw new Error(`任务服务返回了无效数据（HTTP ${response.status}）`)
  }

  if (!response.ok || !result || result.code !== 200) {
    throw new Error((result && result.message) || fallbackMessage)
  }

  return result.data
}

export async function fetchTaskPage ({
  pageSize = TASK_MANAGEMENT_DEFAULT_PAGE_SIZE,
  pageNum = TASK_MANAGEMENT_DEFAULT_PAGE_NUM,
  ...filters
} = {}) {
  const taskPage = await request(TASK_MANAGEMENT_LIST_URL, {
    ...filters,
    pageSize,
    pageNum
  }, '任务列表查询失败')

  if (!taskPage || !Array.isArray(taskPage.records)) {
    throw new Error('任务服务返回的数据格式不正确')
  }

  return taskPage
}

export function fetchTaskStatistics (params) {
  return request(TASK_MANAGEMENT_STATS_URL, params, '任务统计查询失败')
}

export function createTask (payload) {
  return request(TASK_MANAGEMENT_CREATE_URL, payload, '任务创建失败')
}

export function updateTask (payload) {
  return request(TASK_MANAGEMENT_UPDATE_URL, payload, '任务更新失败')
}

export function deleteTask (id) {
  return request(TASK_MANAGEMENT_DELETE_URL, { id }, '任务删除失败')
}
