<template>
  <div class="task-view">
      <main class="task-content">
        <section class="task-page-heading">
          <div>
            <h1>任务列表</h1>
            <p>管理你的任务，高效规划与跟踪工作进度</p>
          </div>
          <button class="create-task-button" type="button" @click="openCreateDialog">
            <span aria-hidden="true">+</span>
            新建任务
          </button>
        </section>

        <section class="statistics-grid" aria-label="任务统计">
          <article v-for="card in statisticsCards" :key="card.key" class="stat-card">
            <span class="stat-card-icon" :class="`tone-${card.tone}`" aria-hidden="true">{{ card.icon }}</span>
            <span>
              <small>{{ card.label }}</small>
              <strong>{{ card.value }}</strong>
            </span>
          </article>
        </section>

        <section class="filter-panel" aria-label="任务筛选">
          <label class="filter-control">
            <span class="sr-only">任务状态</span>
            <select v-model="filters.status" @change="applyFilters">
              <option value="">全部状态</option>
              <option value="1">进行中</option>
              <option value="2">已完成</option>
              <option value="3">待处理</option>
              <option value="4">已关闭</option>
            </select>
          </label>
          <label class="filter-control">
            <span class="sr-only">任务优先级</span>
            <select v-model="filters.priority" @change="applyFilters">
              <option value="">全部优先级</option>
              <option value="1">最高优先级</option>
              <option value="2">高优先级</option>
              <option value="3">普通优先级</option>
              <option value="4">低优先级</option>
              <option value="5">最低优先级</option>
            </select>
          </label>
          <label class="filter-control">
            <span class="sr-only">所属项目</span>
            <input v-model.trim="filters.projectName" type="search" placeholder="全部项目" @keyup.enter="applyFilters">
          </label>
          <label class="date-filter">
            <span class="sr-only">开始日期</span>
            <input v-model="filters.startDate" type="date" @change="applyFilters">
            <span aria-hidden="true">至</span>
            <span class="sr-only">结束日期</span>
            <input v-model="filters.endDate" type="date" @change="applyFilters">
          </label>
          <label class="task-search">
            <span class="sr-only">按关键词查询任务</span>
            <input v-model.trim="filters.keyword" type="search" placeholder="搜索任务标题、描述、标签..." @keyup.enter="applyFilters">
            <span aria-hidden="true">&#8981;</span>
          </label>
          <button class="reset-button" type="button" @click="resetFilters">重置</button>
        </section>

        <section class="task-table-panel">
          <div v-if="isLoading" class="table-feedback">正在加载任务列表...</div>
          <div v-else-if="loadError" class="table-feedback table-feedback-error" role="alert">
            <p>{{ loadError }}</p>
            <button class="retry-button" type="button" @click="loadTasks">重新加载</button>
          </div>
          <div v-else class="task-table-wrap">
            <table class="task-table">
              <thead>
                <tr>
                  <th class="check-column"><input v-model="isCurrentPageSelected" type="checkbox" aria-label="选择当前页全部任务"></th>
                  <th>任务标题</th>
                  <th>所属项目</th>
                  <th>优先级</th>
                  <th>状态</th>
                  <th>负责人</th>
                  <th>截止日期</th>
                  <th>标签</th>
                  <th>创建时间</th>
                  <th class="actions-column">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td class="check-column"><input v-model="selectedIds" :value="task.id" type="checkbox" :aria-label="`选择任务：${task.title}`"></td>
                  <td class="task-title-cell">
                    <strong>{{ task.title }}</strong>
                    <small>{{ task.description || '暂无任务描述' }}</small>
                  </td>
                  <td>{{ task.projectName || '-' }}</td>
                  <td><span class="priority-badge" :class="`tone-${priorityTone(task.priority)}`">{{ priorityLabel(task.priority) }}</span></td>
                  <td><span class="status-badge" :class="`status-${statusTone(task.status)}`">{{ statusLabel(task.status) }}</span></td>
                  <td>
                    <span class="assignee">
                      <span class="avatar avatar-small" aria-hidden="true">{{ task.assigneeInitial }}</span>
                      {{ task.assigneeName }}
                    </span>
                  </td>
                  <td :class="{ 'is-overdue': isOverdue(task) }">{{ formatDate(task.endTime) }}</td>
                  <td>
                    <div class="tag-list">
                      <span v-for="tag in task.tags.slice(0, 2)" :key="tag" class="task-label">{{ tag }}</span>
                    </div>
                  </td>
                  <td>{{ formatDateTime(task.createTime || task.createdTime) }}</td>
                  <td class="actions-column">
                    <button class="row-action" type="button" title="编辑任务" aria-label="编辑任务" @click="openEditDialog(task)">&#9998;</button>
                    <button class="row-action row-action-danger" type="button" title="删除任务" aria-label="删除任务" @click="removeTask(task)">&#128465;</button>
                  </td>
                </tr>
                <tr v-if="tasks.length === 0">
                  <td class="empty-cell" colspan="10">没有符合当前筛选条件的任务</td>
                </tr>
              </tbody>
            </table>
          </div>

          <footer v-if="!isLoading && !loadError" class="table-footer">
            <span>共 {{ page.total }} 条</span>
            <span class="page-size-control">20 条/页</span>
            <div class="pagination" aria-label="分页">
              <button type="button" :disabled="page.pageNum <= 1" aria-label="上一页" @click="goToPage(page.pageNum - 1)">&#8249;</button>
              <button
                v-for="pageNumber in visiblePages"
                :key="pageNumber"
                type="button"
                :class="{ 'is-active': pageNumber === page.pageNum }"
                @click="goToPage(pageNumber)"
              >
                {{ pageNumber }}
              </button>
              <button type="button" :disabled="page.pageNum >= page.pages" aria-label="下一页" @click="goToPage(page.pageNum + 1)">&#8250;</button>
            </div>
            <label class="jump-control">
              跳至
              <input v-model.number="jumpPage" type="number" min="1" :max="page.pages" @keyup.enter="jumpToPage">
              页
            </label>
          </footer>
        </section>
      </main>

    <div v-if="isDialogOpen" class="dialog-backdrop" @click.self="closeDialog">
      <section class="task-dialog" role="dialog" aria-modal="true" :aria-labelledby="dialogTitleId">
        <header class="dialog-header">
          <h2 :id="dialogTitleId">{{ editingTaskId ? '编辑任务' : '新建任务' }}</h2>
          <button class="dialog-close" type="button" aria-label="关闭" title="关闭" @click="closeDialog">&times;</button>
        </header>
        <form class="task-form" @submit.prevent="saveTask">
          <label class="form-field form-field-full">
            <span>任务标题</span>
            <input v-model.trim="taskForm.name" required maxlength="100" placeholder="请输入任务标题">
          </label>
          <label class="form-field">
            <span>所属项目</span>
            <input v-model.trim="taskForm.projectName" maxlength="100" placeholder="请输入所属项目">
          </label>
          <label class="form-field">
            <span>优先级</span>
            <select v-model.number="taskForm.priority">
              <option :value="1">最高优先级</option>
              <option :value="2">高优先级</option>
              <option :value="3">普通优先级</option>
              <option :value="4">低优先级</option>
              <option :value="5">最低优先级</option>
            </select>
          </label>
          <label class="form-field">
            <span>状态</span>
            <select v-model.number="taskForm.status">
              <option :value="1">进行中</option>
              <option :value="2">已完成</option>
              <option :value="3">待处理</option>
              <option :value="4">已关闭</option>
            </select>
          </label>
          <label class="form-field">
            <span>截止日期</span>
            <input v-model="taskForm.endTime" type="datetime-local">
          </label>
          <label class="form-field form-field-full">
            <span>标签</span>
            <input v-model.trim="taskForm.tagsText" maxlength="200" placeholder="多个标签用逗号分隔">
          </label>
          <label class="form-field form-field-full">
            <span>任务描述</span>
            <textarea v-model.trim="taskForm.description" rows="4" maxlength="500" placeholder="请输入任务描述"></textarea>
          </label>
          <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
          <footer class="dialog-actions">
            <button class="cancel-button" type="button" :disabled="isSaving" @click="closeDialog">取消</button>
            <button class="submit-button" type="submit" :disabled="isSaving">{{ isSaving ? '保存中...' : '保存' }}</button>
          </footer>
        </form>
      </section>
    </div>

    <div v-if="deleteTaskTarget" class="dialog-backdrop" @click.self="closeDeleteDialog">
      <section class="task-dialog confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
        <header class="dialog-header">
          <h2 id="delete-dialog-title">确认删除任务</h2>
          <button class="dialog-close" type="button" aria-label="关闭" title="关闭" :disabled="isDeleting" @click="closeDeleteDialog">&times;</button>
        </header>
        <div class="confirm-dialog-content">
          <p class="confirm-dialog-message">确认删除任务“{{ deleteTaskTarget.title }}”吗？删除后无法恢复。</p>
          <p v-if="deleteError" class="form-error" role="alert">{{ deleteError }}</p>
          <footer class="dialog-actions">
            <button class="cancel-button" type="button" :disabled="isDeleting" @click="closeDeleteDialog">取消</button>
            <button class="delete-confirm-button" type="button" :disabled="isDeleting" @click="confirmDeleteTask">
              {{ isDeleting ? '删除中...' : '确认删除' }}
            </button>
          </footer>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { fetchDayTaskList } from '@/api/day-task'
import { createTask, deleteTask, updateTask } from '@/api/task-management'

const defaultTaskForm = () => ({
  name: '',
  description: '',
  projectName: '',
  priority: 3,
  status: 1,
  endTime: '',
  tagsText: ''
})

export default {
  name: 'TaskManagementView',
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      filters: {
        status: '',
        priority: '',
        projectName: '',
        startDate: '',
        endDate: '',
        keyword: ''
      },
      sourceTasks: [],
      tasks: [],
      page: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pages: 1
      },
      jumpPage: 1,
      selectedIds: [],
      isLoading: true,
      loadError: '',
      isDialogOpen: false,
      editingTaskId: null,
      taskForm: defaultTaskForm(),
      isSaving: false,
      formError: '',
      deleteTaskTarget: null,
      isDeleting: false,
      deleteError: ''
    }
  },
  computed: {
    userName () {
      return this.user.nickname || this.user.username || 'Rui'
    },
    userInitial () {
      return this.userName.slice(0, 1).toUpperCase()
    },
    dialogTitleId () {
      return this.editingTaskId ? 'edit-task-title' : 'create-task-title'
    },
    isCurrentPageSelected: {
      get () {
        return this.tasks.length > 0 && this.tasks.every(task => this.selectedIds.includes(task.id))
      },
      set (checked) {
        this.selectedIds = checked ? this.tasks.map(task => task.id) : []
      }
    },
    statisticsCards () {
      const fallback = this.calculateFallbackStatistics()

      return [
        { key: 'total', label: '全部任务', value: fallback.total, icon: '▦', tone: 'blue' },
        { key: 'inProgress', label: '进行中', value: fallback.inProgress, icon: '◫', tone: 'green' },
        { key: 'pending', label: '待处理', value: fallback.pending, icon: '★', tone: 'orange' },
        { key: 'completed', label: '已完成', value: fallback.completed, icon: '◌', tone: 'purple' },
        { key: 'overdue', label: '已超期', value: fallback.overdue, icon: '□', tone: 'red' }
      ]
    },
    visiblePages () {
      const pages = []
      const start = Math.max(1, this.page.pageNum - 2)
      const end = Math.min(this.page.pages, start + 4)

      for (let number = start; number <= end; number += 1) {
        pages.push(number)
      }

      return pages
    }
  },
  mounted () {
    this.loadTasks()
  },
  methods: {
    async loadTasks () {
      this.isLoading = true
      this.loadError = ''

      try {
        const result = await fetchDayTaskList({
          pageNum: this.page.pageNum,
          pageSize: 20
        })
        const mappedTasks = result.records.map(task => this.mapTask(task))

        this.sourceTasks = mappedTasks
        this.tasks = this.filterTasks(mappedTasks)
        this.page.total = Number(result.total) || 0
        this.page.pageNum = Number(result.pageNum) || this.page.pageNum
        this.page.pageSize = 20
        this.page.pages = Math.max(1, Number(result.pages) || Math.ceil(this.page.total / this.page.pageSize) || 1)
        this.jumpPage = this.page.pageNum
        this.selectedIds = []
      } catch (error) {
        this.sourceTasks = []
        this.tasks = []
        this.page.total = 0
        this.page.pages = 1
        this.loadError = error.message || '任务列表查询失败，请稍后重试'
      } finally {
        this.isLoading = false
      }
    },
    mapTask (task) {
      const tags = task.tags || task.tagNames || task.labels || task.labelNames || task.labelIds || []
      const normalizedTags = Array.isArray(tags)
        ? tags.map(tag => {
          if (typeof tag === 'string' || typeof tag === 'number') return String(tag)
          return tag && (tag.name || tag.labelName)
        }).filter(Boolean)
        : String(tags).split(/[,，]/).map(tag => tag.trim()).filter(Boolean)
      const assigneeName = task.assigneeName || task.ownerName || task.userName || this.userName
      const project = task.projectName || task.project || task.projectTitle || ''
      const projectName = typeof project === 'string'
        ? project
        : (project.name || project.title || '')

      return {
        ...task,
        id: task.id,
        title: task.name || task.title || '未命名任务',
        description: task.description || task.remark || '',
        projectName,
        priority: Number(task.priority) || 3,
        status: Number(task.status) || 1,
        assigneeName,
        assigneeInitial: String(assigneeName).slice(0, 1).toUpperCase(),
        endTime: task.endTime || task.deadline || task.dueDate || '',
        createTime: task.createTime || task.createdTime || '',
        tags: normalizedTags
      }
    },
    filterTasks (tasks) {
      const keyword = this.filters.keyword.toLowerCase()
      const projectName = this.filters.projectName.toLowerCase()
      const startTime = this.filters.startDate ? new Date(`${this.filters.startDate}T00:00:00`).getTime() : null
      const endTime = this.filters.endDate ? new Date(`${this.filters.endDate}T23:59:59`).getTime() : null

      return tasks.filter(task => {
        if (this.filters.status && task.status !== Number(this.filters.status)) return false
        if (this.filters.priority && task.priority !== Number(this.filters.priority)) return false
        if (projectName && !task.projectName.toLowerCase().includes(projectName)) return false

        if (keyword) {
          const searchableText = [
            task.title,
            task.description,
            task.projectName,
            ...task.tags
          ].join(' ').toLowerCase()

          if (!searchableText.includes(keyword)) return false
        }

        if (startTime !== null || endTime !== null) {
          const taskEndTime = new Date(task.endTime).getTime()
          if (Number.isNaN(taskEndTime)) return false
          if (startTime !== null && taskEndTime < startTime) return false
          if (endTime !== null && taskEndTime > endTime) return false
        }

        return true
      })
    },
    calculateFallbackStatistics () {
      return {
        total: this.page.total || this.tasks.length,
        inProgress: this.tasks.filter(task => task.status === 1).length,
        pending: this.tasks.filter(task => task.status === 3).length,
        completed: this.tasks.filter(task => task.status === 2).length,
        overdue: this.tasks.filter(task => this.isOverdue(task)).length
      }
    },
    priorityLabel (priority) {
      return ({ 1: '最高', 2: '高', 3: '中', 4: '低', 5: '最低' })[Number(priority)] || '中'
    },
    priorityTone (priority) {
      return ({ 1: 'red', 2: 'orange', 3: 'blue', 4: 'green', 5: 'slate' })[Number(priority)] || 'blue'
    },
    statusLabel (status) {
      return ({ 1: '进行中', 2: '已完成', 3: '待处理', 4: '已关闭' })[Number(status)] || '待处理'
    },
    statusTone (status) {
      return ({ 1: 'progress', 2: 'completed', 3: 'pending', 4: 'closed' })[Number(status)] || 'pending'
    },
    formatDate (value) {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value)
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
    },
    formatDateTime (value) {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value)
      return `${this.formatDate(date)} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}`
    },
    isOverdue (task) {
      if (Number(task.status) === 2 || !task.endTime) return false
      const endTime = new Date(task.endTime)
      return !Number.isNaN(endTime.getTime()) && endTime.getTime() < Date.now()
    },
    applyFilters () {
      this.tasks = this.filterTasks(this.sourceTasks)
      this.selectedIds = []
    },
    resetFilters () {
      this.filters = {
        status: '',
        priority: '',
        projectName: '',
        startDate: '',
        endDate: '',
        keyword: ''
      }
      this.tasks = [...this.sourceTasks]
      this.selectedIds = []
    },
    goToPage (pageNumber) {
      if (pageNumber < 1 || pageNumber > this.page.pages || pageNumber === this.page.pageNum) return
      this.page.pageNum = pageNumber
      this.loadTasks()
    },
    jumpToPage () {
      const target = Math.min(Math.max(Number(this.jumpPage) || 1, 1), this.page.pages)
      this.goToPage(target)
    },
    openCreateDialog () {
      this.editingTaskId = null
      this.taskForm = defaultTaskForm()
      this.formError = ''
      this.isDialogOpen = true
    },
    openEditDialog (task) {
      this.editingTaskId = task.id
      this.taskForm = {
        name: task.title,
        description: task.description,
        projectName: task.projectName,
        priority: task.priority,
        status: task.status,
        endTime: this.toDateTimeLocal(task.endTime),
        tagsText: task.tags.join(', ')
      }
      this.formError = ''
      this.isDialogOpen = true
    },
    closeDialog () {
      if (this.isSaving) return
      this.isDialogOpen = false
      this.formError = ''
    },
    toDateTimeLocal (value) {
      if (!value) return ''
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return ''
      const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      return offsetDate.toISOString().slice(0, 16)
    },
    async saveTask () {
      this.isSaving = true
      this.formError = ''
      const payload = {
        name: this.taskForm.name,
        description: this.taskForm.description,
        projectName: this.taskForm.projectName,
        priority: Number(this.taskForm.priority),
        status: Number(this.taskForm.status),
        endTime: this.taskForm.endTime ? new Date(this.taskForm.endTime).toISOString() : null,
        tags: this.taskForm.tagsText.split(/[,，]/).map(tag => tag.trim()).filter(Boolean)
      }

      if (this.editingTaskId !== null) {
        payload.id = this.editingTaskId
      }

      try {
        if (this.editingTaskId !== null) {
          await updateTask(payload)
        } else {
          await createTask(payload)
        }
        this.isDialogOpen = false
        await this.loadTasks()
      } catch (error) {
        this.formError = error.message || '保存任务失败，请稍后重试'
      } finally {
        this.isSaving = false
      }
    },
    removeTask (task) {
      this.deleteTaskTarget = task
      this.deleteError = ''
    },
    closeDeleteDialog () {
      if (this.isDeleting) return
      this.deleteTaskTarget = null
      this.deleteError = ''
    },
    async confirmDeleteTask () {
      if (!this.deleteTaskTarget || this.isDeleting) return

      this.isDeleting = true
      this.deleteError = ''

      try {
        await deleteTask(this.deleteTaskTarget.id)
        this.deleteTaskTarget = null
        if (this.tasks.length === 1 && this.page.pageNum > 1) {
          this.page.pageNum -= 1
        }
        await this.loadTasks()
      } catch (error) {
        this.deleteError = error.message || '删除任务失败，请稍后重试'
      } finally {
        this.isDeleting = false
      }
    }
  }
}
</script>

<style scoped>
.task-management-page {
  display: flex;
  min-height: 100vh;
  background: #071321;
  color: #d9e4ef;
  font-size: 13px;
}

.task-sidebar {
  display: flex;
  flex: 0 0 190px;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px 16px 20px;
  background: #091523;
  border-right: 1px solid rgba(132, 163, 193, 0.1);
}

.sidebar-brand,
.sidebar-nav-item,
.sidebar-settings,
.topbar-user,
.topbar-actions,
.global-search,
.logout-button,
.task-page-heading,
.create-task-button,
.statistics-grid,
.stat-card,
.filter-panel,
.date-filter,
.task-search,
.assignee,
.tag-list,
.table-footer,
.pagination,
.jump-control,
.dialog-header,
.dialog-actions {
  display: flex;
  align-items: center;
}

.sidebar-brand {
  gap: 10px;
  margin: 0 9px 30px;
  color: #edf6ff;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
}

.sidebar-brand-mark {
  display: grid;
  width: 21px;
  height: 21px;
  place-items: center;
  border-radius: 3px;
  background: #1f79e6;
  color: #ffffff;
  font-size: 14px;
}

.sidebar-nav {
  display: grid;
  gap: 8px;
}

.sidebar-nav-item,
.sidebar-settings {
  gap: 11px;
  width: 100%;
  min-height: 37px;
  padding: 0 12px;
  border-radius: 5px;
  background: transparent;
  color: #88a3bb;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
}

.sidebar-nav-item:hover,
.sidebar-settings:hover {
  background: rgba(58, 108, 164, 0.2);
  color: #ffffff;
}

.sidebar-nav-item.is-active {
  background: #1a66d4;
  color: #ffffff;
  box-shadow: 0 7px 17px rgba(26, 102, 212, 0.2);
}

.sidebar-nav-icon {
  display: inline-grid;
  width: 16px;
  place-items: center;
  font-size: 16px;
}

.sidebar-settings {
  margin-top: auto;
}

.task-workspace {
  flex: 1;
  min-width: 0;
}

.task-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 0 29px 0 18px;
  background: #0b1c2d;
  border-bottom: 1px solid rgba(132, 163, 193, 0.09);
}

.topbar-user { gap: 12px; }
.topbar-actions { gap: 18px; }

.avatar {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(145deg, #8fd7f8, #3270aa);
  color: #06213a;
  font-weight: 800;
}

.avatar-large { width: 36px; height: 36px; font-size: 15px; }
.topbar-avatar { width: 29px; height: 29px; font-size: 11px; }
.avatar-small { width: 22px; height: 22px; font-size: 9px; }

.topbar-greeting,
.topbar-caption { margin: 0; }
.topbar-greeting { color: #e9f2fb; font-size: 16px; font-weight: 700; }
.topbar-caption { margin-top: 3px; color: #7e95aa; font-size: 11px; }

.global-search,
.task-search {
  height: 33px;
  padding: 0 11px 0 13px;
  border: 1px solid rgba(117, 149, 178, 0.12);
  border-radius: 4px;
  background: #132b44;
  color: #7190aa;
}

.global-search { width: min(255px, 30vw); }
.task-search { flex: 1 1 180px; min-width: 150px; background: #0d2237; }

.global-search input,
.task-search input,
.filter-control input,
.date-filter input,
.form-field input,
.form-field select,
.form-field textarea,
.filter-control select,
.page-size-control select,
.jump-control input {
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #cdddea;
  font-size: 12px;
}

input::placeholder,
textarea::placeholder { color: #69829a; }
.global-search input,
.task-search input { flex: 1; }

.icon-button {
  position: relative;
  width: 27px;
  height: 33px;
  padding: 0;
  background: transparent;
  color: #8ba5bb;
  cursor: pointer;
  font-size: 21px;
}

.notification-dot {
  position: absolute;
  top: -1px;
  right: -3px;
  display: grid;
  width: 14px;
  height: 14px;
  place-items: center;
  border: 1px solid #0b1c2d;
  border-radius: 50%;
  background: #ec5366;
  color: #ffffff;
  font-size: 8px;
}

.logout-button {
  gap: 6px;
  padding: 6px 0 6px 2px;
  background: transparent;
  color: #91a7b9;
  cursor: pointer;
  font-size: 13px;
}

.task-content {
  max-width: 1480px;
  margin: 0 auto;
  padding: 17px 19px 26px;
}

.task-page-heading { justify-content: space-between; }
.task-page-heading h1 { margin: 0; color: #edf6ff; font-size: 22px; line-height: 1.35; }
.task-page-heading p { margin: 4px 0 0; color: #7791a8; font-size: 13px; }

.create-task-button {
  gap: 6px;
  min-height: 33px;
  padding: 0 14px;
  border-radius: 5px;
  background: #1c72df;
  box-shadow: 0 6px 14px rgba(26, 103, 211, 0.23);
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.create-task-button:hover,
.submit-button:hover { background: #2781ef; }

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 15px;
  margin-top: 17px;
}

.stat-card {
  gap: 12px;
  min-height: 56px;
  padding: 10px 14px;
  border: 1px solid rgba(107, 143, 177, 0.1);
  border-radius: 5px;
  background: #0d1e30;
}

.stat-card-icon {
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: 4px;
  color: #ffffff;
  font-size: 16px;
}

.stat-card small,
.stat-card strong { display: block; }
.stat-card small { color: #7d95aa; font-size: 12px; }
.stat-card strong { margin-top: 4px; color: #f0f7ff; font-size: 19px; line-height: 1; }

.filter-panel {
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  padding: 11px 12px;
  border: 1px solid rgba(107, 143, 177, 0.1);
  border-radius: 5px;
  background: #0d1e30;
}

.filter-control,
.date-filter {
  height: 33px;
  border: 1px solid rgba(117, 149, 178, 0.14);
  border-radius: 3px;
  background: #0c2136;
}

.filter-control { display: flex; width: 145px; padding: 0 10px; }
.filter-control select,
.filter-control input { width: 100%; }
.date-filter { gap: 8px; padding: 0 9px; color: #6f889e; font-size: 12px; }
.date-filter input { width: 110px; color-scheme: dark; }

.reset-button,
.retry-button,
.cancel-button,
.submit-button {
  min-height: 33px;
  padding: 0 13px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.reset-button,
.cancel-button {
  border: 1px solid rgba(117, 149, 178, 0.16);
  background: #102840;
  color: #9fb4c5;
}

.reset-button:hover,
.cancel-button:hover { color: #ffffff; }

.task-table-panel {
  overflow: hidden;
  margin-top: 15px;
  border: 1px solid rgba(107, 143, 177, 0.1);
  border-radius: 5px;
  background: #0d1e30;
}

.task-table-wrap { overflow-x: auto; }
.task-table { width: 100%; min-width: 980px; border-spacing: 0; table-layout: fixed; }
.task-table th,
.task-table td { padding: 0 9px; border-bottom: 1px solid rgba(117, 149, 178, 0.09); text-align: left; }
.task-table th { height: 42px; background: #11263b; color: #a4b9ca; font-size: 12px; font-weight: 600; }
.task-table td { height: 56px; color: #aebfd0; font-size: 12px; }
.task-table tbody tr:hover { background: rgba(45, 93, 139, 0.12); }
.task-table tbody tr:last-child td { border-bottom: 0; }
.task-table th:nth-child(2) { width: 25%; }
.task-table th:nth-child(3) { width: 11%; }
.task-table th:nth-child(4), .task-table th:nth-child(5) { width: 7%; }
.task-table th:nth-child(6) { width: 11%; }
.task-table th:nth-child(7) { width: 9%; }
.task-table th:nth-child(8) { width: 11%; }
.task-table th:nth-child(9) { width: 10%; }
.check-column { width: 31px; text-align: center !important; }
.actions-column { width: 59px; text-align: center !important; }

.task-table input[type="checkbox"] { width: 11px; height: 11px; accent-color: #267be5; }
.task-title-cell strong,
.task-title-cell small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.task-title-cell strong { color: #d9e7f3; font-size: 13px; font-weight: 600; }
.task-title-cell small { margin-top: 5px; color: #718aa0; font-size: 11px; }

.priority-badge,
.status-badge,
.task-label {
  display: inline-block;
  padding: 3px 6px;
  border-radius: 2px;
  font-size: 10px;
  line-height: 1.3;
  white-space: nowrap;
}

.assignee { gap: 7px; color: #d0dfea; white-space: nowrap; }
.tag-list { flex-wrap: wrap; gap: 3px; }
.task-label { background: #183653; color: #90b0cb; }
.is-overdue { color: #ff6675 !important; }
.row-action { padding: 3px 5px; background: transparent; color: #6eaddf; cursor: pointer; font-size: 14px; }
.row-action:hover { color: #ffffff; }
.row-action-danger { color: #c97b88; }
.row-action-danger:hover { color: #ff7180; }

.empty-cell { height: 180px !important; color: #788fa4 !important; text-align: center !important; }
.table-feedback { padding: 64px 20px; color: #8096aa; font-size: 14px; text-align: center; }
.table-feedback p { margin: 0 0 10px; }
.table-feedback-error { color: #ff7885; }
.retry-button { background: #1d6fda; color: #ffffff; }

.table-footer {
  justify-content: flex-end;
  gap: 12px;
  min-height: 48px;
  padding: 0 11px;
  border-top: 1px solid rgba(117, 149, 178, 0.09);
  color: #7e95aa;
  font-size: 12px;
}

.page-size-control { height: 27px; padding: 0 8px; border: 1px solid rgba(117, 149, 178, 0.14); border-radius: 3px; background: #10273d; line-height: 27px; }
.pagination { gap: 4px; }
.pagination button { display: grid; width: 27px; height: 27px; place-items: center; border: 1px solid rgba(117, 149, 178, 0.13); border-radius: 3px; background: #10273d; color: #8da5ba; cursor: pointer; font-size: 12px; }
.pagination button.is-active { border-color: #257be6; background: #1d70db; color: #ffffff; }
.pagination button:disabled { cursor: not-allowed; opacity: 0.38; }
.jump-control { gap: 4px; }
.jump-control input { width: 34px; height: 25px; padding: 0 3px; border: 1px solid rgba(117, 149, 178, 0.14); border-radius: 3px; background: #10273d; text-align: center; }

.dialog-backdrop { position: fixed; z-index: 10; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(2, 10, 18, 0.72); }
.task-dialog { width: min(100%, 580px); max-height: calc(100vh - 40px); overflow: auto; border: 1px solid rgba(117, 149, 178, 0.2); border-radius: 6px; background: #0d2033; box-shadow: 0 20px 55px rgba(0, 0, 0, 0.42); }
.dialog-header { justify-content: space-between; min-height: 47px; padding: 0 17px; border-bottom: 1px solid rgba(117, 149, 178, 0.12); }
.dialog-header h2 { margin: 0; color: #edf6ff; font-size: 17px; }
.dialog-close { padding: 0; background: transparent; color: #8ca7bc; cursor: pointer; font-size: 22px; line-height: 1; }
.dialog-close:disabled { cursor: not-allowed; opacity: 0.55; }
.dialog-close:hover { color: #ffffff; }
.task-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; padding: 17px; }
.form-field { display: grid; gap: 6px; }
.form-field-full { grid-column: 1 / -1; }
.form-field > span { color: #9eb3c6; font-size: 13px; }
.form-field input,
.form-field select,
.form-field textarea { width: 100%; min-height: 30px; padding: 0 9px; border: 1px solid rgba(117, 149, 178, 0.16); border-radius: 3px; background: #0a1a2a; color: #d8e5f0; }
.form-field textarea { padding-top: 8px; resize: vertical; }
.form-field input[type="datetime-local"] { color-scheme: dark; }
.form-error { grid-column: 1 / -1; margin: -3px 0 0; color: #ff7885; font-size: 12px; }
.dialog-actions { grid-column: 1 / -1; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.confirm-dialog { width: min(100%, 430px); }
.confirm-dialog-content { padding: 17px; }
.confirm-dialog-message { margin: 0; color: #c8d8e5; font-size: 14px; line-height: 1.7; }
.delete-confirm-button { min-width: 82px; border: 1px solid #c34e5d; background: #b94352; color: #ffffff; }
.delete-confirm-button:disabled { cursor: not-allowed; opacity: 0.55; }
.submit-button { min-width: 62px; border: 1px solid #1e74df; background: #1d70db; color: #ffffff; }
.submit-button:disabled,
.cancel-button:disabled { cursor: not-allowed; opacity: 0.55; }

.tone-blue { background: #2077df; }
.tone-green { background: #1ba98d; }
.tone-orange { background: #e8863d; }
.tone-purple { background: #7a4fe2; }
.tone-red { background: #e75567; }
.tone-slate { background: #647b90; }
.priority-badge.tone-red { background: rgba(226, 77, 94, 0.2); color: #ff7987; }
.priority-badge.tone-orange { background: rgba(234, 132, 55, 0.18); color: #ffad62; }
.priority-badge.tone-blue { background: rgba(48, 129, 222, 0.18); color: #63aef7; }
.priority-badge.tone-green { background: rgba(33, 169, 139, 0.18); color: #46cfad; }
.priority-badge.tone-slate { background: rgba(105, 128, 149, 0.2); color: #a9bdcc; }
.status-badge.status-progress { background: rgba(27, 173, 145, 0.18); color: #35c8a6; }
.status-badge.status-completed { background: rgba(116, 75, 220, 0.2); color: #ad87f5; }
.status-badge.status-pending { background: rgba(230, 139, 52, 0.18); color: #f8aa5c; }
.status-badge.status-closed { background: rgba(112, 133, 152, 0.18); color: #adc1cf; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@media (max-width: 900px) {
  .statistics-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .filter-panel { align-items: stretch; }
  .task-search { flex-basis: 100%; }
}

@media (max-width: 680px) {
  .task-sidebar { flex-basis: 54px; padding-right: 7px; padding-left: 7px; }
  .sidebar-brand { justify-content: center; margin-right: 0; margin-left: 0; }
  .sidebar-brand > span:last-child,
  .sidebar-nav-item > span:last-child,
  .sidebar-settings > span:last-child { display: none; }
  .sidebar-nav-item,
  .sidebar-settings { justify-content: center; padding: 0; }
  .task-topbar { padding: 0 12px; }
  .topbar-caption,
  .topbar-avatar,
  .logout-button span:last-child { display: none; }
  .global-search { width: min(160px, 42vw); }
  .task-content { padding: 13px 10px 20px; }
  .statistics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stat-card:last-child { grid-column: 1 / -1; }
  .date-filter { flex: 1 1 100%; }
  .date-filter input { flex: 1; width: auto; }
  .table-footer { justify-content: flex-start; flex-wrap: wrap; padding: 8px 10px; }
  .task-form { grid-template-columns: 1fr; }
  .form-field-full { grid-column: auto; }
}
</style>
