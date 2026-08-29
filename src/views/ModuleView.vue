<template>
  <main class="module-content">
        <section class="module-heading">
          <span class="module-icon" aria-hidden="true">{{ moduleInfo.icon }}</span>
          <div>
            <h1>{{ moduleTitle }}</h1>
            <p>{{ moduleInfo.description }}</p>
          </div>
        </section>

        <section class="module-panel">
          <h2>{{ moduleTitle }}</h2>
          <p>当前模块导航已接通，后续业务内容将在此区域继续完善。</p>
        </section>
  </main>
</template>

<script>
import { dashboardData } from '@/data/dashboard'

const moduleDescriptions = {
  'knowledge-base': '沉淀技术知识，统一管理学习笔记与文档',
  'learning-center': '规划学习内容，持续跟踪个人成长进度',
  'project-management': '集中管理项目计划、进度和交付内容',
  'interview-bank': '整理面试题目，建立个人复习题库',
  'ai-question': '使用 AI 生成练习题和面试题',
  'system-monitor': '查看系统运行状态与关键指标',
  settings: '管理个人偏好和工作台配置'
}

export default {
  name: 'ModuleView',
  props: {
    activeModule: {
      type: String,
      required: true
    }
  },
  computed: {
    moduleInfo () {
      if (this.activeModule === 'settings') {
        return {
          icon: '⚙',
          label: '设置',
          description: moduleDescriptions.settings
        }
      }

      const navigationItem = dashboardData.navigation.find(item => item.key === this.activeModule)

      return {
        icon: navigationItem ? navigationItem.icon : '□',
        label: navigationItem ? navigationItem.label : '功能模块',
        description: moduleDescriptions[this.activeModule] || '管理当前模块的相关内容'
      }
    },
    moduleTitle () {
      return this.moduleInfo.label
    }
  }
}
</script>

<style scoped>
.module-page {
  display: flex;
  min-height: 100vh;
  background: #071321;
  color: #d9e4ef;
}

.module-workspace {
  flex: 1;
  min-width: 0;
}

.module-topbar,
.topbar-user,
.topbar-actions,
.module-search,
.logout-button,
.module-heading {
  display: flex;
  align-items: center;
}

.module-topbar {
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

.module-search {
  width: min(255px, 30vw);
  height: 33px;
  padding: 0 11px 0 13px;
  border-radius: 7px;
  background: #162b43;
  color: #6d879f;
}

.module-search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #dbe8f4;
  font-size: 11px;
}

.module-search input::placeholder {
  color: #70869b;
}

.logout-button {
  gap: 6px;
  padding: 6px 0 6px 2px;
  background: transparent;
  color: #8ca4ba;
  cursor: pointer;
  font-size: 12px;
}

.module-content {
  max-width: 1480px;
  margin: 0 auto;
  padding: 24px 28px;
}

.module-heading {
  gap: 14px;
}

.module-heading h1,
.module-heading p,
.module-panel h2,
.module-panel p {
  margin: 0;
}

.module-heading h1 {
  color: #edf6ff;
  font-size: 22px;
}

.module-heading p {
  margin-top: 5px;
  color: #7f98ae;
  font-size: 13px;
}

.module-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 7px;
  background: #1d70db;
  color: #ffffff;
  font-size: 20px;
}

.module-panel {
  min-height: 190px;
  margin-top: 22px;
  padding: 24px;
  border: 1px solid rgba(107, 143, 177, 0.1);
  border-radius: 7px;
  background: #0e1c2c;
}

.module-panel h2 {
  color: #eaf3fb;
  font-size: 16px;
}

.module-panel p {
  margin-top: 10px;
  color: #8299ad;
  font-size: 13px;
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
  .module-topbar {
    min-height: 50px;
    padding: 0 12px;
  }

  .topbar-caption,
  .topbar-avatar,
  .logout-button span:last-child {
    display: none;
  }

  .module-search {
    width: min(170px, 45vw);
  }

  .module-content {
    padding: 18px 14px;
  }
}
</style>
