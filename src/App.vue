<template>
  <LoginView v-if="!isLoggedIn" @login-success="showWorkspace" />
  <DashboardView
    v-else
    :user="currentUser"
    @logout="logout"
  />
</template>

<script>
import LoginView from './views/LoginView.vue'
import DashboardView from './views/DashboardView.vue'
import { removeAccessToken } from '@/utils/auth-storage'

export default {
  name: 'App',
  components: {
    LoginView,
    DashboardView
  },
  data () {
    return {
      isLoggedIn: false,
      currentUser: {}
    }
  },
  methods: {
    showWorkspace (user) {
      this.currentUser = user || {}
      this.isLoggedIn = true
    },
    logout () {
      removeAccessToken()
      this.currentUser = {}
      this.isLoggedIn = false
    }
  }
}
</script>
