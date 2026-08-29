<template>
  <div class="workspace-shell">
    <WorkspaceSidebar :active-view="activeView" @navigate="$emit('navigate', $event)" />

    <section class="workspace-main">
      <header class="workspace-topbar">
        <div class="topbar-user">
          <div class="avatar avatar-large" aria-hidden="true">{{ userInitial }}</div>
          <div>
            <p class="topbar-greeting">你好，{{ userName }}</p>
            <p class="topbar-caption">专注技术，持续成长</p>
          </div>
        </div>

        <div class="topbar-actions">
          <label class="workspace-search">
            <span class="sr-only">搜索功能、文档或内容</span>
            <input v-model.trim="searchText" type="search" placeholder="搜索功能、文档、内容...">
            <span aria-hidden="true">⌕</span>
          </label>
          <button class="icon-button notification-button" type="button" title="通知" aria-label="通知">
            <span aria-hidden="true">♧</span>
            <span class="notification-dot">3</span>
          </button>
          <div class="topbar-avatar avatar" aria-hidden="true">{{ userInitial }}</div>
          <button class="logout-button" type="button" @click="$emit('logout')">
            <span aria-hidden="true">↪</span>
            <span>退出</span>
          </button>
        </div>
      </header>

      <div class="workspace-view">
        <slot />
      </div>
    </section>
  </div>
</template>

<script>
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar.vue'

export default {
  name: 'WorkspaceShell',
  components: {
    WorkspaceSidebar
  },
  emits: ['logout', 'navigate'],
  props: {
    activeView: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      searchText: ''
    }
  },
  computed: {
    userName () {
      return this.user.nickname || this.user.username || 'Rui'
    },
    userInitial () {
      return this.userName.slice(0, 1).toUpperCase()
    }
  }
}
</script>

<style scoped>
.workspace-shell {
  display: flex;
  min-height: 100vh;
  background: #071321;
  color: #d9e4ef;
}

.workspace-main {
  flex: 1;
  min-width: 0;
}

.workspace-topbar,
.topbar-user,
.topbar-actions,
.workspace-search,
.logout-button {
  display: flex;
  align-items: center;
}

.workspace-topbar {
  justify-content: space-between;
  min-height: 64px;
  padding: 0 29px 0 18px;
  background: #0c1b2c;
  border-bottom: 1px solid rgba(132, 163, 193, 0.08);
}

.topbar-user {
  gap: 12px;
}

.topbar-actions {
  gap: 18px;
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

.topbar-avatar {
  width: 29px;
  height: 29px;
  font-size: 11px;
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

.workspace-search {
  width: min(255px, 30vw);
  height: 33px;
  padding: 0 11px 0 13px;
  border-radius: 7px;
  background: #162b43;
  color: #6d879f;
}

.workspace-search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #dbe8f4;
  font-size: 11px;
}

.workspace-search input::placeholder {
  color: #70869b;
}

.icon-button {
  position: relative;
  width: 27px;
  height: 33px;
  padding: 0;
  background: transparent;
  color: #8ca4ba;
  cursor: pointer;
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

.logout-button {
  gap: 6px;
  padding: 6px 0 6px 2px;
  background: transparent;
  color: #8ca4ba;
  cursor: pointer;
  font-size: 12px;
}

.logout-button:hover {
  color: #ffffff;
}

.workspace-view {
  min-width: 0;
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

@media (max-width: 560px) {
  .workspace-topbar {
    min-height: 50px;
    padding: 0 12px;
  }

  .topbar-caption,
  .topbar-avatar,
  .logout-button span:last-child {
    display: none;
  }

  .topbar-actions {
    gap: 9px;
  }

  .workspace-search {
    width: min(170px, 45vw);
  }
}
</style>
