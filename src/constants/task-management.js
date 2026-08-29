const apiBaseUrl = (process.env.VUE_APP_API_BASE_URL || '/api').replace(/\/+$/, '')

export const TASK_MANAGEMENT_LIST_URL = `${apiBaseUrl}/user/dayTask/page`
export const TASK_MANAGEMENT_STATS_URL = `${apiBaseUrl}/user/dayTask/statistics`
export const TASK_MANAGEMENT_CREATE_URL = `${apiBaseUrl}/user/dayTask/create`
export const TASK_MANAGEMENT_UPDATE_URL = `${apiBaseUrl}/user/dayTask/update`
export const TASK_MANAGEMENT_COMPLETE_URL = `${apiBaseUrl}/user/dayTask/complete`
export const TASK_MANAGEMENT_DELETE_URL = `${apiBaseUrl}/user/dayTask/delete`
export const TASK_MANAGEMENT_DEFAULT_PAGE_SIZE = 20
export const TASK_MANAGEMENT_DEFAULT_PAGE_NUM = 1
