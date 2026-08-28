export const dashboardData = {
  navigation: [
    { icon: '⌂', label: '工作台', active: true },
    { icon: '✓', label: '任务管理' },
    { icon: '▮', label: '知识库' },
    { icon: '◆', label: '学习中心' },
    { icon: '□', label: '项目管理' },
    { icon: '▤', label: '面试题库' },
    { icon: '✦', label: 'AI 出题' },
    { icon: '▣', label: '系统监控' }
  ],
  summary: {
    title: '每一次坚持，都是更好的自己',
    subtitle: '今天也要加油，向着目标前进！',
    metrics: [
      { label: '学习时长', value: '2.5', unit: '小时' },
      { label: '完成任务', value: '3 / 5', unit: '' },
      { label: '本周学习', value: '15', unit: '小时' }
    ]
  },
  shortcuts: [
    { icon: '+', label: '新建任务', tone: 'blue' },
    { icon: '▤', label: '学习笔记', tone: 'green' },
    { icon: '▣', label: '添加知识', tone: 'purple' },
    { icon: '□', label: '创建项目', tone: 'orange' },
    { icon: '▧', label: '面试题库', tone: 'red' },
    { icon: '◈', label: 'AI 出题', tone: 'cyan' },
    { icon: '▣', label: '系统监控', tone: 'indigo' },
    { icon: '⚙', label: '设置', tone: 'slate' }
  ],
  tasks: [
    { title: '完成任务管理模块的接口开发', tag: '高优先级', tone: 'red', time: '今天 18:00', state: 'pending' },
    { title: '阅读《Spring 源码深度解析》第一章', tag: '学习', tone: 'blue', time: '今天 22:00', state: 'pending' },
    { title: '整理 MySQL 索引相关笔记', tag: '学习', tone: 'green', time: '明天 12:00', state: 'done' },
    { title: '项目需求讨论会', tag: '工作', tone: 'orange', time: '明天 15:00', state: 'pending' },
    { title: '健身运动 30 分钟', tag: '生活', tone: 'purple', time: '今天 20:00', state: 'done' }
  ],
  personalStats: [
    { icon: '▤', label: '任务总数', value: '12', tone: 'blue' },
    { icon: '✓', label: '已完成', value: '8', tone: 'green' },
    { icon: '◫', label: '学习笔记', value: '23', tone: 'purple' },
    { icon: '★', label: '项目数量', value: '3', tone: 'orange' }
  ],
  learningProgress: {
    total: 68,
    courses: [
      { name: 'Java 基础', value: 66, count: '4/6', tone: 'blue' },
      { name: 'Spring Boot', value: 60, count: '3/5', tone: 'cyan' },
      { name: 'MySQL', value: 75, count: '3/4', tone: 'orange' },
      { name: 'Redis', value: 50, count: '2/4', tone: 'purple' }
    ]
  },
  notes: [
    { title: 'Spring Boot 自动配置原理', date: '2025-08-26' },
    { title: 'MySQL 索引优化总结', date: '2025-08-25' },
    { title: 'Redis 常用命令整理', date: '2025-08-24' },
    { title: 'Java 8 Stream API 实战', date: '2025-08-22' },
    { title: '设计模式六大原则', date: '2025-08-20' }
  ],
  projects: [
    { icon: '◆', title: '个人学习平台', description: '基于 Spring Boot + Vue 的个人学习管理系统', status: '进行中', tone: 'green' },
    { icon: '▤', title: '任务管理系统', description: '个人任务管理，提高工作效率', status: '进行中', tone: 'green' },
    { icon: '◈', title: '知识库系统', description: '记录学习笔记，整理技术文档', status: '开发中', tone: 'blue' }
  ],
  activities: [
    { text: '你完成了任务：整理 MySQL 索引相关笔记', time: '2小时前', tone: 'cyan' },
    { text: '你创建了新的学习笔记：Spring Boot 自动配置原理', time: '4小时前', tone: 'purple' },
    { text: '你更新了项目：任务管理系统', time: '昨天 20:15', tone: 'slate' },
    { text: '你登录了系统', time: '昨天 08:32', tone: 'cyan' }
  ],
  calendar: {
    month: '2025年8月',
    weekdays: ['一', '二', '三', '四', '五', '六', '日']
  }
}
