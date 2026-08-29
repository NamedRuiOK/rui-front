<template>
  <main class="dashboard-content">
        <div class="dashboard-layout">
          <div class="dashboard-main-column">
            <section class="welcome-banner dashboard-panel">
              <div class="welcome-copy">
                <p class="panel-kicker">RUI WORKSPACE</p>
                <h1>{{ dashboardData.summary.title }}</h1>
                <p>{{ dashboardData.summary.subtitle }}</p>
                <div class="welcome-metrics">
                  <div v-for="metric in dashboardData.summary.metrics" :key="metric.label" class="welcome-metric">
                    <span>{{ metric.label }}</span>
                    <strong>{{ metric.value }}<small>{{ metric.unit }}</small></strong>
                  </div>
                </div>
              </div>
            </section>

            <div class="dashboard-two-column">
              <section class="dashboard-panel task-panel">
                <div class="panel-heading">
                  <div>
                    <h2>今日任务</h2>
                    <div class="panel-tabs">
                      <button
                        v-for="tab in taskTabs"
                        :key="tab.key"
                        class="panel-tab"
                        :class="{ 'is-active': selectedTaskTab === tab.key }"
                        type="button"
                        @click="selectedTaskTab = tab.key"
                      >
                        {{ tab.label }} ({{ tab.count }})
                      </button>
                    </div>
                  </div>
                  <button class="text-button" type="button">查看全部 <span aria-hidden="true">›</span></button>
                </div>

                <div v-if="isLoadingTasks" class="task-feedback">正在加载每日任务...</div>
                <div v-else-if="taskError" class="task-feedback task-feedback-error" role="alert">
                  <p>{{ taskError }}</p>
                  <button class="text-button" type="button" @click="loadDayTasks">
                    重新加载 <span aria-hidden="true">↻</span>
                  </button>
                </div>
                <div v-else-if="filteredTasks.length === 0" class="task-feedback">
                  {{ selectedTaskTab === 'all' ? '今天还没有安排任务' : '当前筛选下暂无任务' }}
                </div>
                <div v-else class="task-list">
                  <p v-if="taskActionError" class="task-action-error" role="alert">{{ taskActionError }}</p>
                  <label
                    v-for="task in filteredTasks"
                    :key="task.id"
                    class="task-row"
                    :class="{
                      'is-done': task.state === 'done',
                      'is-completing': completingTaskIds.includes(task.id)
                    }"
                  >
                    <input
                      :checked="task.state === 'done'"
                      type="checkbox"
                      :aria-label="`标记任务：${task.title}`"
                      :disabled="task.state === 'done' || completingTaskIds.includes(task.id)"
                      @change="completeTask(task, $event)"
                    >
                    <span class="task-check" aria-hidden="true">{{ task.state === 'done' ? '✓' : '' }}</span>
                    <span class="task-title">{{ task.title }}</span>
                    <span class="task-tag" :class="`tone-${task.tone}`">{{ task.tag }}</span>
                    <time class="task-time">{{ task.time }}</time>
                  </label>
                </div>
              </section>

              <div class="dashboard-side-column">
                <section class="dashboard-panel personal-panel">
                  <div class="panel-heading">
                    <h2>个人数据</h2>
                    <button class="text-button" type="button">查看详情 <span aria-hidden="true">›</span></button>
                  </div>
                  <div class="personal-stats">
                    <div v-for="stat in dashboardData.personalStats" :key="stat.label" class="personal-stat">
                      <span class="stat-icon" :class="`tone-${stat.tone}`" aria-hidden="true">{{ stat.icon }}</span>
                      <span>
                        <small>{{ stat.label }}</small>
                        <strong>{{ stat.value }}</strong>
                      </span>
                    </div>
                  </div>
                </section>

                <section class="dashboard-panel progress-panel">
                  <div class="panel-heading">
                    <h2>学习进度</h2>
                    <button class="text-button" type="button">查看详情 <span aria-hidden="true">›</span></button>
                  </div>
                  <div class="progress-content">
                    <div class="progress-ring" :style="{ '--progress': `${dashboardData.learningProgress.total}%` }">
                      <strong>{{ dashboardData.learningProgress.total }}%</strong>
                      <span>本月学习完成度</span>
                    </div>
                    <div class="course-list">
                      <div v-for="course in dashboardData.learningProgress.courses" :key="course.name" class="course-row">
                        <div>
                          <span>{{ course.name }}</span>
                          <small>{{ course.count }}</small>
                        </div>
                        <div class="course-track">
                          <span :class="`tone-${course.tone}`" :style="{ width: `${course.value}%` }"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div class="dashboard-three-column">
              <section class="dashboard-panel list-panel">
                <div class="panel-heading">
                  <h2>最近学习笔记</h2>
                  <button class="text-button" type="button">查看全部 <span aria-hidden="true">›</span></button>
                </div>
                <div class="note-list">
                  <button v-for="note in dashboardData.notes" :key="note.title" class="note-row" type="button">
                    <span class="list-icon tone-blue" aria-hidden="true">▤</span>
                    <span class="note-title">{{ note.title }}</span>
                    <time>{{ note.date }}</time>
                  </button>
                </div>
              </section>

              <section class="dashboard-panel list-panel project-panel">
                <div class="panel-heading">
                  <h2>我的项目</h2>
                  <button class="text-button" type="button">查看全部 <span aria-hidden="true">›</span></button>
                </div>
                <div class="project-list">
                  <button v-for="project in dashboardData.projects" :key="project.title" class="project-row" type="button">
                    <span class="list-icon" :class="`tone-${project.tone}`" aria-hidden="true">{{ project.icon }}</span>
                    <span class="project-copy">
                      <strong>{{ project.title }}</strong>
                      <small>{{ project.description }}</small>
                    </span>
                    <span class="status-tag" :class="`tone-${project.tone}`">{{ project.status }}</span>
                  </button>
                </div>
              </section>

              <section class="dashboard-panel list-panel activity-panel">
                <div class="panel-heading">
                  <h2>最近动态</h2>
                  <button class="text-button" type="button">查看全部 <span aria-hidden="true">›</span></button>
                </div>
                <div class="activity-list">
                  <div v-for="activity in dashboardData.activities" :key="activity.text" class="activity-row">
                    <span class="activity-dot" :class="`tone-${activity.tone}`" aria-hidden="true"></span>
                    <span>{{ activity.text }}</span>
                    <time>{{ activity.time }}</time>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <aside class="dashboard-right-column">
            <section class="dashboard-panel shortcut-panel">
              <div class="panel-heading">
                <h2>快捷入口</h2>
              </div>
              <div class="shortcut-grid">
                <button v-for="shortcut in dashboardData.shortcuts" :key="shortcut.label" class="shortcut-item" type="button">
                  <span class="shortcut-icon" :class="`tone-${shortcut.tone}`" aria-hidden="true">{{ shortcut.icon }}</span>
                  <span>{{ shortcut.label }}</span>
                </button>
              </div>
            </section>

            <CalendarPanel />
          </aside>
        </div>
  </main>
</template>

<script>
import { completeDayTask, fetchDayTaskList } from '@/api/day-task'
import CalendarPanel from '@/components/dashboard/CalendarPanel.vue'
import { dashboardData } from '@/data/dashboard'

export default {
  name: 'DashboardView',
  components: {
    CalendarPanel
  },
  data () {
    return {
      dashboardData,
      selectedTaskTab: 'all',
      tasks: [],
      isLoadingTasks: true,
      taskError: '',
      taskActionError: '',
      completingTaskIds: []
    }
  },
  computed: {
    completedTasks () {
      return this.tasks.filter(task => task.status === 2)
    },
    pendingTasks () {
      return this.tasks.filter(task => task.status === 1)
    },
    taskTabs () {
      return [
        { key: 'all', label: '全部', count: this.tasks.length },
        { key: 'in-progress', label: '进行中', count: this.pendingTasks.length },
        { key: 'completed', label: '已完成', count: this.completedTasks.length }
      ]
    },
    filteredTasks () {
      if (this.selectedTaskTab === 'in-progress') {
        return this.tasks.filter(task => task.status === 1)
      }

      if (this.selectedTaskTab === 'completed') {
        return this.tasks.filter(task => task.status === 2)
      }

      return this.tasks
    }
  },
  mounted () {
    this.loadDayTasks()
  },
  methods: {
    async loadDayTasks () {
      this.isLoadingTasks = true
      this.taskError = ''
      this.taskActionError = ''

      try {
        const dayTaskPage = await fetchDayTaskList({ pageSize: 10, pageNum: 2 })
        this.tasks = dayTaskPage.records.map(task => this.mapDayTask(task))
      } catch (error) {
        this.tasks = []
        this.taskError = error.message || '每日任务查询失败，请稍后重试'
      } finally {
        this.isLoadingTasks = false
      }
    },
    async completeTask (task, event) {
      if (task.state === 'done' || !event.target.checked) {
        event.target.checked = task.state === 'done'
        return
      }

      this.taskActionError = ''
      this.completingTaskIds = [...this.completingTaskIds, task.id]

      try {
        await completeDayTask(task.id)
        task.status = 2
        task.state = 'done'
        task.completedTime = new Date().toISOString()
      } catch (error) {
        event.target.checked = false
        this.taskActionError = error.message || '任务完成失败，请稍后重试'
      } finally {
        this.completingTaskIds = this.completingTaskIds.filter(id => id !== task.id)
      }
    },
    mapDayTask (task) {
      const status = Number(task.status)

      return {
        id: task.id,
        title: task.name || '未命名任务',
        tag: this.getPriorityLabel(task.priority),
        tone: this.getPriorityTone(task.priority),
        time: this.formatTaskTime(task.endTime),
        state: status === 2 ? 'done' : 'pending',
        status,
        description: task.description || '',
        startTime: task.startTime,
        endTime: task.endTime,
        completedTime: task.completedTime,
        labelIds: task.labelIds
      }
    },
    getPriorityLabel (priority) {
      const priorityLabels = {
        1: '最高优先级',
        2: '高优先级',
        3: '普通',
        4: '低优先级',
        5: '最低优先级'
      }

      return priorityLabels[Number(priority)] || '普通'
    },
    getPriorityTone (priority) {
      const priorityTones = {
        1: 'red',
        2: 'orange',
        3: 'blue',
        4: 'green',
        5: 'slate'
      }

      return priorityTones[Number(priority)] || 'blue'
    },
    formatTaskTime (value) {
      if (!value) {
        return '未设置截止时间'
      }

      const taskDate = new Date(value)

      if (Number.isNaN(taskDate.getTime())) {
        return '时间格式错误'
      }

      const today = new Date()
      const dateText = taskDate.toLocaleDateString('zh-CN') === today.toLocaleDateString('zh-CN')
        ? '今天'
        : taskDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
      const timeText = taskDate.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      return `${dateText} ${timeText}`
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  min-height: 100vh;
  background: #071321;
  color: #d9e4ef;
}

.dashboard-sidebar {
  display: flex;
  flex: 0 0 190px;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px 16px 20px;
  background: #091523;
  border-right: 1px solid rgba(132, 163, 193, 0.08);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 9px 30px;
  color: #eef6ff;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.sidebar-brand-mark {
  display: grid;
  width: 21px;
  height: 21px;
  place-items: center;
  border-radius: 4px;
  background: #1d6bea;
  color: #ffffff;
  font-size: 13px;
}

.sidebar-nav {
  display: grid;
  gap: 8px;
}

.sidebar-nav-item,
.sidebar-settings {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 37px;
  padding: 0 12px;
  border-radius: 5px;
  background: transparent;
  color: #8ca3ba;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: background 160ms ease, color 160ms ease;
}

.sidebar-nav-item:hover,
.sidebar-settings:hover {
  background: rgba(70, 112, 158, 0.18);
  color: #ffffff;
}

.sidebar-nav-item.is-active {
  background: #1b61c9;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(12, 94, 209, 0.18);
}

.sidebar-nav-icon {
  display: inline-grid;
  width: 16px;
  place-items: center;
  color: currentColor;
  font-size: 15px;
  line-height: 1;
}

.sidebar-settings {
  margin-top: auto;
}

.dashboard-workspace {
  flex: 1;
  min-width: 0;
}

.dashboard-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 0 29px 0 18px;
  background: #0c1b2c;
  border-bottom: 1px solid rgba(132, 163, 193, 0.08);
}

.topbar-user,
.topbar-actions,
.dashboard-search,
.logout-button {
  display: flex;
  align-items: center;
}

.topbar-user {
  gap: 12px;
}

.avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(145deg, #89d2f7, #3570ac);
  color: #06213a;
  font-weight: 800;
}

.avatar-large {
  width: 36px;
  height: 36px;
  font-size: 15px;
}

.topbar-greeting,
.topbar-caption {
  margin: 0;
}

.topbar-greeting {
  color: #e7f0fa;
  font-size: 15px;
  font-weight: 700;
}

.topbar-caption {
  margin-top: 3px;
  color: #7d94aa;
  font-size: 10px;
}

.topbar-actions {
  gap: 18px;
}

.dashboard-search {
  width: min(255px, 30vw);
  height: 33px;
  padding: 0 11px 0 13px;
  border-radius: 7px;
  background: #162b43;
  color: #6d879f;
}

.dashboard-search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #dbe8f4;
  font-size: 11px;
}

.dashboard-search input::placeholder {
  color: #70869b;
}

.icon-button,
.logout-button,
.text-button,
.shortcut-item,
.note-row,
.project-row {
  cursor: pointer;
}

.icon-button {
  position: relative;
  width: 27px;
  height: 33px;
  padding: 0;
  background: transparent;
  color: #8ca4ba;
  font-size: 21px;
}

.notification-dot {
  position: absolute;
  top: 0;
  right: -4px;
  display: grid;
  width: 14px;
  height: 14px;
  place-items: center;
  border: 1px solid #0c1b2c;
  border-radius: 50%;
  background: #ef5264;
  color: #ffffff;
  font-size: 8px;
  line-height: 1;
}

.topbar-avatar {
  width: 29px;
  height: 29px;
  font-size: 11px;
}

.logout-button {
  gap: 6px;
  padding: 6px 0 6px 2px;
  background: transparent;
  color: #8ca4ba;
  font-size: 12px;
}

.logout-button:hover {
  color: #ffffff;
}

.dashboard-content {
  padding: 17px 19px 26px;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 17px;
  max-width: 1480px;
  margin: 0 auto;
}

.dashboard-main-column,
.dashboard-right-column,
.dashboard-side-column {
  display: grid;
  align-content: start;
  gap: 15px;
  min-width: 0;
}

.dashboard-panel {
  border: 1px solid rgba(107, 143, 177, 0.1);
  border-radius: 7px;
  background: #0e1c2c;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.welcome-banner {
  position: relative;
  min-height: 164px;
  overflow: hidden;
  background-color: #153151;
  background-image:
    linear-gradient(90deg, rgba(17, 55, 91, 0.96) 0%, rgba(20, 58, 94, 0.82) 47%, rgba(20, 58, 94, 0.17) 100%),
    url("../../img/all/全局背景图片.jpg");
  background-position: center, center;
  background-size: cover;
}

.welcome-copy {
  position: relative;
  z-index: 1;
  padding: 22px 26px;
}

.panel-kicker {
  margin: 0 0 10px;
  color: #82bbec;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.welcome-copy h1 {
  margin: 0;
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
}

.welcome-copy > p:not(.panel-kicker) {
  margin: 6px 0 20px;
  color: #b7d1e8;
  font-size: 12px;
}

.welcome-metrics {
  display: flex;
  gap: 37px;
}

.welcome-metric {
  display: grid;
  gap: 5px;
  min-width: 81px;
}

.welcome-metric + .welcome-metric {
  padding-left: 29px;
  border-left: 1px solid rgba(190, 220, 245, 0.18);
}

.welcome-metric span {
  color: #9cb8d0;
  font-size: 10px;
}

.welcome-metric strong {
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
}

.welcome-metric small {
  margin-left: 4px;
  color: #a9c4dc;
  font-size: 10px;
  font-weight: 400;
}

.dashboard-two-column {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(290px, 0.9fr);
  gap: 15px;
}

.task-panel,
.personal-panel,
.progress-panel,
.list-panel,
.shortcut-panel {
  padding: 17px 15px 13px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-height: 29px;
}

.panel-heading h2 {
  margin: 0;
  color: #ebf3fb;
  font-size: 14px;
  font-weight: 700;
}

.text-button {
  flex: 0 0 auto;
  padding: 0;
  background: transparent;
  color: #7d96ae;
  font-size: 10px;
}

.text-button:hover {
  color: #b6d6f4;
}

.panel-tabs {
  display: flex;
  gap: 17px;
  margin-top: 14px;
}

.panel-tab {
  padding: 0 0 8px;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: #7890a6;
  cursor: pointer;
  font-size: 10px;
}

.panel-tab.is-active {
  border-bottom-color: #2888ef;
  color: #51a7f7;
}

.task-list {
  margin-top: 10px;
}

.task-feedback {
  margin-top: 14px;
  padding: 20px 8px 16px;
  color: #8197aa;
  font-size: 11px;
  text-align: center;
}

.task-feedback-error {
  color: #ff7280;
}

.task-feedback p {
  margin: 0 0 8px;
}

.task-action-error {
  margin: 10px 0 0;
  color: #ff7280;
  font-size: 10px;
}

.task-row {
  display: grid;
  grid-template-columns: 17px minmax(0, 1fr) auto 84px;
  align-items: center;
  gap: 10px;
  min-height: 37px;
  border-top: 1px solid rgba(117, 149, 178, 0.1);
  color: #c5d4e2;
  cursor: pointer;
}

.task-row.is-completing {
  cursor: wait;
  opacity: 0.58;
}

.task-row input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.task-check {
  display: grid;
  width: 15px;
  height: 15px;
  place-items: center;
  border: 1px solid #7891a9;
  border-radius: 50%;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
}

.task-row:nth-child(2) .task-check {
  border-color: #dfae4e;
}

.task-row.is-done .task-check {
  border-color: #25c1a3;
  background: #25c1a3;
}

.task-title {
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-row.is-done .task-title {
  color: #8299ad;
  text-decoration: line-through;
}

.task-tag,
.status-tag {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 9px;
  line-height: 1.2;
  white-space: nowrap;
}

.task-time {
  color: #8197aa;
  font-size: 9px;
  text-align: right;
  white-space: nowrap;
}

.personal-panel {
  min-height: 166px;
}

.personal-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 12px;
  margin-top: 18px;
}

.personal-stat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon,
.list-icon,
.shortcut-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.stat-icon {
  width: 29px;
  height: 29px;
}

.personal-stat small,
.personal-stat strong {
  display: block;
}

.personal-stat small {
  color: #8299ad;
  font-size: 9px;
}

.personal-stat strong {
  margin-top: 3px;
  color: #e6f0fa;
  font-size: 16px;
}

.progress-panel {
  min-height: 170px;
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 17px;
  margin-top: 12px;
}

.progress-ring {
  display: grid;
  flex: 0 0 92px;
  width: 92px;
  height: 92px;
  place-items: center;
  align-content: center;
  border-radius: 50%;
  background: conic-gradient(#23b7e8 var(--progress), #2376d8 0 82%, #233c57 82% 100%);
  position: relative;
}

.progress-ring::after {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: #0e1c2c;
  content: "";
}

.progress-ring strong,
.progress-ring span {
  position: relative;
  z-index: 1;
}

.progress-ring strong {
  color: #edf6ff;
  font-size: 15px;
}

.progress-ring span {
  width: 60px;
  margin-top: 3px;
  color: #7891a9;
  font-size: 8px;
  line-height: 1.2;
  text-align: center;
}

.course-list {
  display: grid;
  flex: 1;
  gap: 9px;
  min-width: 0;
}

.course-row > div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  color: #bfd0df;
  font-size: 9px;
}

.course-row small {
  color: #8198ad;
  font-size: 8px;
}

.course-track {
  height: 4px;
  margin-top: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: #20364d;
}

.course-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.dashboard-three-column {
  display: grid;
  grid-template-columns: 0.95fr 1.2fr 1.05fr;
  gap: 15px;
}

.list-panel {
  min-width: 0;
}

.note-list,
.project-list,
.activity-list {
  margin-top: 10px;
}

.note-row,
.project-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 0;
  border-top: 1px solid rgba(117, 149, 178, 0.1);
  background: transparent;
  color: #bfd0df;
  text-align: left;
}

.list-icon {
  width: 19px;
  height: 19px;
  margin-right: 10px;
  border-radius: 4px;
  font-size: 8px;
}

.note-title,
.project-copy {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-title {
  flex: 1;
  font-size: 9px;
}

.note-row time,
.project-copy small,
.activity-row time {
  color: #738ba0;
  font-size: 8px;
}

.note-row time {
  margin-left: 8px;
  white-space: nowrap;
}

.project-row {
  gap: 0;
}

.project-copy {
  display: grid;
  flex: 1;
  gap: 2px;
}

.project-copy strong {
  overflow: hidden;
  color: #d5e1ec;
  font-size: 9px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-tag {
  margin-left: 7px;
}

.activity-row {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  border-top: 1px solid rgba(117, 149, 178, 0.1);
  color: #b8cbdc;
  font-size: 9px;
}

.activity-row span:not(.activity-dot) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.shortcut-panel {
  min-height: 194px;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px 8px;
  margin-top: 18px;
}

.shortcut-item {
  display: grid;
  justify-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0;
  background: transparent;
  color: #c4d3e1;
  font-size: 9px;
}

.shortcut-item:hover {
  color: #ffffff;
}

.shortcut-icon {
  width: 31px;
  height: 31px;
  border-radius: 8px;
  font-size: 15px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.12);
}

.tone-blue {
  background-color: #1f78e2;
  color: #ffffff;
}

.tone-green {
  background-color: #1eae91;
  color: #ffffff;
}

.tone-purple {
  background-color: #8051e8;
  color: #ffffff;
}

.tone-orange {
  background-color: #f18d48;
  color: #ffffff;
}

.tone-red {
  background-color: #e95268;
  color: #ffffff;
}

.tone-cyan {
  background-color: #1cb7c6;
  color: #ffffff;
}

.tone-indigo {
  background-color: #536fe4;
  color: #ffffff;
}

.tone-slate {
  background-color: #657b91;
  color: #ffffff;
}

.task-tag.tone-red,
.task-tag.tone-blue,
.task-tag.tone-green,
.task-tag.tone-orange,
.task-tag.tone-purple {
  background-color: color-mix(in srgb, currentColor 18%, transparent);
}

.task-tag.tone-red,
.status-tag.tone-red {
  color: #ff7280;
}

.task-tag.tone-blue,
.status-tag.tone-blue {
  color: #55a7f5;
}

.task-tag.tone-green,
.status-tag.tone-green {
  color: #35c6a8;
}

.task-tag.tone-orange,
.status-tag.tone-orange {
  color: #f3a45e;
}

.task-tag.tone-purple,
.status-tag.tone-purple {
  color: #ac82f4;
}

.status-tag {
  background-color: rgba(31, 174, 145, 0.16);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1100px) {
  .dashboard-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-right-column {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

}

@media (max-width: 780px) {
  .dashboard-sidebar {
    flex-basis: 58px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .sidebar-brand {
    justify-content: center;
    margin-right: 0;
    margin-left: 0;
  }

  .sidebar-brand > span:last-child,
  .sidebar-nav-item > span:last-child,
  .sidebar-settings > span:last-child {
    display: none;
  }

  .sidebar-nav-item,
  .sidebar-settings {
    justify-content: center;
    padding: 0;
  }

  .dashboard-two-column,
  .dashboard-three-column {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-right-column {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .dashboard-topbar {
    min-height: 50px;
    padding: 0 12px;
  }

  .topbar-caption,
  .logout-button span:last-child,
  .topbar-avatar {
    display: none;
  }

  .topbar-actions {
    gap: 9px;
  }

  .dashboard-search {
    width: min(170px, 45vw);
  }

  .dashboard-content {
    padding: 10px;
  }

  .welcome-copy h1 {
    font-size: 17px;
  }

  .welcome-metrics {
    gap: 11px;
  }

  .welcome-metric + .welcome-metric {
    padding-left: 11px;
  }

  .task-row {
    grid-template-columns: 15px minmax(0, 1fr) auto;
  }

  .task-time {
    display: none;
  }
}
</style>
