<template>
  <LoginView v-if="!isLoggedIn" @login-success="showWorkspace" />
  <WorkspaceShell
    v-else
    :active-view="currentView"
    :user="currentUser"
    @logout="logout"
    @navigate="navigate"
  >
    <DashboardView v-if="currentView === 'dashboard'" />
    <TaskManagementView
      v-else-if="currentView === 'task-management'"
      :user="currentUser"
    />
    <ModuleView v-else :active-module="currentView" />
  </WorkspaceShell>
</template>

<script>
import LoginView from './views/LoginView.vue'
import DashboardView from './views/DashboardView.vue'
import TaskManagementView from './views/TaskManagementView.vue'
import ModuleView from './views/ModuleView.vue'
import WorkspaceShell from '@/components/workspace/WorkspaceShell.vue'
import { dashboardData } from '@/data/dashboard'
import {
  getAccessToken,
  getCurrentUser,
  getCurrentView,
  removeLoginSession,
  saveCurrentUser,
  saveCurrentView
} from '@/utils/auth-storage'

const DEFAULT_VIEW = 'dashboard'
const AVAILABLE_VIEWS = new Set([
  ...dashboardData.navigation.map(item => item.key),
  'settings'
])

function getRestoredView () {
  const savedView = getCurrentView()
  return AVAILABLE_VIEWS.has(savedView) ? savedView : DEFAULT_VIEW
}

export default {
  name: 'App',
  components: {
    LoginView,
    DashboardView,
    TaskManagementView,
    ModuleView,
    WorkspaceShell
  },
  data () {
    const isLoggedIn = Boolean(getAccessToken())

    return {
      isLoggedIn,
      currentUser: isLoggedIn ? getCurrentUser() : {},
      currentView: isLoggedIn ? getRestoredView() : DEFAULT_VIEW
    }
  },
  methods: {
    showWorkspace (user) {
      this.currentUser = user || {}
      this.isLoggedIn = true
      this.currentView = DEFAULT_VIEW
      saveCurrentUser(this.currentUser)
      saveCurrentView(this.currentView)
    },
    navigate (view) {
      if (AVAILABLE_VIEWS.has(view)) {
        this.currentView = view
        saveCurrentView(view)
      }
    },
    logout () {
      removeLoginSession()
      this.currentUser = {}
      this.isLoggedIn = false
      this.currentView = DEFAULT_VIEW
    }
  }
}
</script>
