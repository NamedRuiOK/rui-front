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
import { removeAccessToken } from '@/utils/auth-storage'

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
    return {
      isLoggedIn: false,
      currentUser: {},
      currentView: 'dashboard'
    }
  },
  methods: {
    showWorkspace (user) {
      this.currentUser = user || {}
      this.isLoggedIn = true
      this.currentView = 'dashboard'
    },
    navigate (view) {
      const moduleKeys = dashboardData.navigation.map(item => item.key)

      if (moduleKeys.includes(view) || view === 'settings') {
        this.currentView = view
      }
    },
    logout () {
      removeAccessToken()
      this.currentUser = {}
      this.isLoggedIn = false
      this.currentView = 'dashboard'
    }
  }
}
</script>
