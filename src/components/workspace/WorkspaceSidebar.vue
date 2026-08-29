<template>
  <aside class="workspace-sidebar" aria-label="模块导航">
    <div class="sidebar-brand">
      <span class="sidebar-brand-mark" aria-hidden="true">R</span>
      <span>个人开发者工作台</span>
    </div>

    <nav class="sidebar-nav">
      <button
        v-for="item in navigation"
        :key="item.key"
        class="sidebar-nav-item"
        :class="{ 'is-active': activeView === item.key }"
        type="button"
        @click="$emit('navigate', item.key)"
      >
        <span class="sidebar-nav-icon" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <button
      class="sidebar-settings"
      :class="{ 'is-active': activeView === 'settings' }"
      type="button"
      @click="$emit('navigate', 'settings')"
    >
      <span class="sidebar-nav-icon" aria-hidden="true">⚙</span>
      <span>设置</span>
    </button>
  </aside>
</template>

<script>
import { dashboardData } from '@/data/dashboard'

export default {
  name: 'WorkspaceSidebar',
  emits: ['navigate'],
  props: {
    activeView: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      navigation: dashboardData.navigation
    }
  }
}
</script>

<style scoped>
.workspace-sidebar {
  display: flex;
  flex: 0 0 190px;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px 16px;
  background: #091523;
  border-right: 1px solid rgba(132, 163, 193, 0.08);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 9px 30px;
  color: #eef6ff;
  font-size: 15px;
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
  font-size: 14px;
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
  font-size: 14px;
  text-align: left;
  transition: background 160ms ease, color 160ms ease;
}

.sidebar-nav-item:hover,
.sidebar-settings:hover {
  background: rgba(70, 112, 158, 0.18);
  color: #ffffff;
}

.sidebar-nav-item.is-active,
.sidebar-settings.is-active {
  background: #1b61c9;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(12, 94, 209, 0.18);
}

.sidebar-nav-icon {
  display: inline-grid;
  width: 16px;
  place-items: center;
  color: currentColor;
  font-size: 16px;
  line-height: 1;
}

.sidebar-settings {
  margin-top: auto;
}

@media (max-width: 780px) {
  .workspace-sidebar {
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
}
</style>
