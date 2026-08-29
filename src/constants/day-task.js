const apiBaseUrl = (process.env.VUE_APP_API_BASE_URL || '/api').replace(/\/+$/, '')

export const DAY_TASK_LIST_URL = `${apiBaseUrl}/user/dayTask/list`
export const DAY_TASK_COMPLETE_URL = `${apiBaseUrl}/user/dayTask/complete`
export const DAY_TASK_DEFAULT_PAGE_SIZE = 10
export const DAY_TASK_DEFAULT_PAGE_NUM = 1
