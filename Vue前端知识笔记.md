# 基于当前项目的 Vue 前端知识笔记

> 面向 Java 后端工程师，基于 `rui-front` 当前源码、依赖和配置整理。
> 本文只解释项目已经使用或直接涉及的前端知识，不把 Vue Router、Pinia、Vuex、Axios、TypeScript、UI 组件库等未引入技术当成当前项目能力。

## 1. 项目技术画像

当前项目是一个基于 Vue 3 的单页应用（SPA）。页面首次加载后，浏览器只保留一个 HTML 挂载节点，后续登录态切换、任务列表刷新和日历翻页主要由 Vue 更新内存中的状态并重新渲染相关 DOM。

| 类别 | 当前项目使用情况 | Java 对照 |
| --- | --- | --- |
| UI 框架 | Vue 3 | 类似负责视图层和组件生命周期的前端框架 |
| 组件写法 | Options API | 通过 `data`、`computed`、`methods`、`mounted` 分区组织组件 |
| 工程脚手架 | Vue CLI 5，基于 Webpack | 类似 Maven/Gradle 提供项目构建约定，但它还负责前端开发服务器和资源打包 |
| 语言 | JavaScript + HTML 模板 + CSS | JavaScript 是浏览器运行语言，不是 Java 的语法子集 |
| 网络请求 | 浏览器原生 `fetch` | 类似使用 HTTP Client，但返回 Promise，默认不会因为 HTTP 4xx/5xx 自动抛异常 |
| 身份凭证 | `localStorage` 保存 `accessToken` | 类似客户端本地 Key-Value 存储；它不是服务端 Session |
| 路由 | 当前未引入 Vue Router | 登录页和工作台由 `App.vue` 的 `v-if/v-else` 切换 |
| 全局状态 | 当前未引入 Pinia/Vuex | 主要状态在组件自身，用户对象通过 Props 向下传递 |
| UI 组件库 | 未引入 | 页面控件由原生 HTML 和项目 CSS 自己实现 |
| 代码规范 | ESLint 7 + `eslint-plugin-vue` | 类似静态代码检查，主要在 `npm run lint` 时执行 |

### 1.1 依赖版本如何理解

`package.json` 中的版本带有范围符号，例如：

```json
{
  "vue": "^3.2.13",
  "@vue/cli-service": "~5.0.0"
}
```

- `^3.2.13` 表示允许安装同一主版本 `3.x` 中满足规则的较新版本。
- `~5.0.0` 表示允许安装 `5.0.x` 范围内的版本。
- 实际安装版本由 `package-lock.json` 锁定。本项目当前锁文件中 Vue 为 `3.5.42`，Vue CLI Service 为 `5.0.9`，`core-js` 为 `3.50.0`，ESLint 为 `7.32.0`。
- 以后排查“我的机器和同事机器表现不一致”时，应同时查看 `package.json` 与 `package-lock.json`。前者描述允许范围，后者描述本次安装结果。

## 2. 从浏览器到 Vue 应用

### 2.1 `public/index.html` 是页面外壳

入口 HTML 位于 [`public/index.html`](C:\Users\andre\Desktop\txt\code\rui-front\public\index.html)。其中最重要的节点是：

```html
<div id="app"></div>
```

这个节点相当于前端应用的挂载容器。Vue 不会接管整个浏览器页面，而是把根组件渲染到 `#app` 中。

`<meta name="viewport">` 用于移动端视口适配，`lang="zh-CN"` 声明页面语言，`<%= BASE_URL %>` 是 Vue CLI 在构建时处理的模板变量。

### 2.2 `src/main.js` 是 JavaScript 入口

[`src/main.js`](C:\Users\andre\Desktop\txt\code\rui-front\src\main.js) 的核心代码：

```js
import { createApp } from 'vue'
import App from './App.vue'
import './styles/base.css'

createApp(App).mount('#app')
```

可按以下顺序理解：

1. 从 Vue 包中导入创建应用实例的函数。
2. 导入根组件 `App.vue`。
3. 导入全局样式，使样式在整个应用中生效。
4. 创建 Vue 应用并挂载到 HTML 的 `#app` 节点。

Java 后端可以把 `createApp(App)` 理解为创建应用上下文，把 `mount('#app')` 理解为将视图应用绑定到一个页面容器。但它不是 Spring 的 IOC 容器，也不会自动扫描 Java Bean。

## 3. Vue 单文件组件（SFC）

项目中的 `.vue` 文件是 Vue 单文件组件（Single-File Component，SFC），典型结构如下：

```vue
<template>
  <!-- 声明组件渲染结构 -->
</template>

<script>
export default {
  // 声明组件状态、属性、计算属性、方法和生命周期
}
</script>

<style scoped>
/* 声明组件样式 */
</style>
```

当前项目的组件分层如下：

```text
main.js
└─ App.vue
   ├─ LoginView.vue
   │  └─ LoginForm.vue
   └─ DashboardView.vue
      └─ CalendarPanel.vue
```

### 3.1 View 与 Component 的职责

- [`App.vue`](C:\Users\andre\Desktop\txt\code\rui-front\src\App.vue)：根组件，负责登录页和工作台的顶层切换，以及退出登录。
- `LoginView.vue`：登录页布局和页面视觉容器，向下组合 `LoginForm`。
- `LoginForm.vue`：表单字段、提交中状态、调用登录接口、保存 Token、向上发送登录成功事件。
- `DashboardView.vue`：登录后的工作台页面，负责用户展示、任务请求、任务筛选、完成任务和各面板布局。
- `CalendarPanel.vue`：独立的日历组件，维护当前显示月份并计算日期网格。

这里的 View 不是后端 MVC 中必须对应一个 URL 的 Controller。当前项目没有路由，View 只是一个较大粒度的页面组件。

### 3.2 `scoped` 样式

`LoginView.vue`、`LoginForm.vue`、`DashboardView.vue` 和 `CalendarPanel.vue` 都使用了 `<style scoped>`。Vue 编译后会为组件元素增加类似数据属性，并把 CSS 选择器改写为只命中该组件的元素，从而降低样式互相污染的风险。

`src/styles/base.css` 没有 `scoped`，因此是全局样式。项目在这里定义了全局盒模型、页面基础背景、按钮和输入框字体，以及键盘焦点样式。

注意：`scoped` 不是 CSS 模块，也不是权限隔离。它主要解决选择器作用范围问题；通过 Props、事件和接口完成的数据边界仍需要开发者自己维护。

## 4. Options API：当前项目的组件编程模型

当前项目没有使用 Composition API 的 `setup()`，所有主要组件都使用 Options API。它把组件能力按用途分组，适合从后端对象模型角度理解。

### 4.1 `data`：组件自己的响应式状态

例如 [`App.vue`](C:\Users\andre\Desktop\txt\code\rui-front\src\App.vue) 中：

```js
data () {
  return {
    isLoggedIn: false,
    currentUser: {}
  }
}
```

`data()` 必须返回对象。对象中的字段会被 Vue 纳入响应式系统：当字段被修改时，依赖它的模板会重新渲染。

当前项目中的典型状态：

- `isLoggedIn`：决定显示登录页还是工作台。
- `currentUser`：当前登录用户。
- `form.username`、`form.password`：登录表单值。
- `isSubmitting`：登录请求是否进行中。
- `tasks`：接口返回并转换后的任务列表。
- `selectedTaskTab`：当前任务筛选页签。
- `visibleDate`：日历当前显示的月份。

从 Java 角度看，`data()` 返回的对象有点像一个组件实例字段集合，但它会被 Vue 包装和追踪，不能简单当成普通 DTO。

### 4.2 `computed`：有依赖缓存的派生值

`DashboardView.vue` 中的 `completedTasks`、`pendingTasks`、`taskTabs`、`filteredTasks` 都是计算属性：

```js
computed: {
  pendingTasks () {
    return this.tasks.filter(task => task.status === 1)
  },
  filteredTasks () {
    if (this.selectedTaskTab === 'completed') {
      return this.tasks.filter(task => task.status === 2)
    }

    return this.tasks
  }
}
```

计算属性适合表达“由现有状态计算出来的值”，例如 Java 中的只读派生属性或查询结果。它的特点是：

- 不应在计算属性中执行副作用，例如发请求、修改其他状态。
- 依赖的响应式数据不变时，Vue 可以复用计算结果。
- 模板中直接使用 `filteredTasks`，不需要调用 `filteredTasks()`。

`userName` 和 `userInitial` 也属于派生值：用户对象变化后，它们会自动更新。

### 4.3 `methods`：事件处理和可复用动作

`methods` 中的方法通常由模板事件触发，或者由生命周期调用。例如：

```js
methods: {
  async loadDayTasks () {
    // 调用接口并更新加载、成功、失败状态
  },
  selectSettings () {
    this.selectedNavigation = this.dashboardData.navigation.length
  }
}
```

在 Options API 中通过 `this` 访问同一组件的 `data`、`computed` 和其他方法。这里的 `this` 是 Vue 组件实例上下文，不是 Java 的 `this` 语义的完全复制。

### 4.4 生命周期 `mounted`

`DashboardView.vue` 使用：

```js
mounted () {
  this.loadDayTasks()
}
```

`mounted` 表示组件已经完成首次挂载，相关 DOM 已经插入页面。当前项目在工作台挂载后加载日任务。

常见生命周期理解：

| 生命周期 | 当前项目中的理解 |
| --- | --- |
| 创建阶段 | Vue 创建组件实例并准备响应式数据 |
| `mounted` | 组件首次渲染并挂载到 DOM 后执行，当前用于加载任务 |
| 更新阶段 | 响应式数据变化后，Vue 更新依赖的 DOM |
| 卸载阶段 | 组件被 `v-if` 移除时清理组件实例 |

不要在模块顶层直接依赖组件 DOM。需要访问组件 DOM 时，应根据场景使用生命周期或模板引用；本项目当前没有使用模板引用。

## 5. 模板语法：HTML 中的动态渲染

Vue 模板看起来像 HTML，但会被编译为渲染函数。模板中的表达式会读取组件状态，状态变化后 Vue 只更新受影响的视图。

### 5.1 文本插值 `{{ }}`

```vue
<p>你好，{{ userName }}</p>
```

双大括号用于文本插值，适合展示字符串、数字和计算属性结果。默认会进行文本转义，不会把字符串当成 HTML 执行。

当前项目中 `{{ task.title }}`、`{{ task.time }}`、`{{ userName }}` 都是文本插值。

### 5.2 条件渲染 `v-if`、`v-else-if`、`v-else`

根组件：

```vue
<LoginView v-if="!isLoggedIn" />
<DashboardView v-else :user="currentUser" />
```

任务区域：

```vue
<div v-if="isLoadingTasks">正在加载每日任务...</div>
<div v-else-if="taskError">{{ taskError }}</div>
<div v-else-if="filteredTasks.length === 0">暂无任务</div>
<div v-else>任务列表</div>
```

`v-if` 是真正的条件挂载：条件不满足时，节点和对应组件会被移除。它不同于只修改 CSS 的隐藏，也不同于 Java 模板中的简单字符串替换。登录态切换时，登录组件树和工作台组件树会被交替挂载。

### 5.3 列表渲染 `v-for` 和 `:key`

```vue
<label v-for="task in filteredTasks" :key="task.id">
  {{ task.title }}
</label>
```

`v-for` 根据数组生成多个节点，`:key` 为每个节点提供稳定身份。Vue 会据此比较新旧列表并尽量复用正确的 DOM。

后端工程师可以把 `key` 理解为前端列表 diff 的业务主键。优先使用后端实体 ID；不要在列表可增删或排序时随意使用数组下标，因为下标不代表实体身份。

项目中任务使用 `task.id`，导航使用 `item.label`，课程使用 `course.name`。这些字段必须在对应列表内稳定且唯一。

### 5.4 属性绑定 `v-bind` 和缩写 `:`

```vue
<DashboardView :user="currentUser" />
<div :class="{ 'is-active': selectedNavigation === index }"></div>
<div :style="{ '--progress': `${progress}%` }"></div>
```

不带冒号的 `class="xxx"` 是静态字符串；带冒号的 `:class="..."` 是 JavaScript 表达式，值会随状态变化。

当前项目使用了三类绑定：

- Props 绑定：`:user="currentUser"`。
- 条件 class：根据选中状态添加 `is-active`、`is-done`、`is-completing`。
- 动态 style：把进度值写入 CSS 自定义属性，或设置课程进度条的 `width`。

### 5.5 事件绑定 `v-on` 和缩写 `@`

```vue
<button @click="selectSettings">设置</button>
<form @submit.prevent="submitLogin">...</form>
```

`@click` 是 `v-on:click` 的缩写。`.prevent` 是事件修饰符，相当于调用 `event.preventDefault()`，因此登录表单提交不会触发浏览器默认刷新。

当前项目还使用：

- `@change="completeTask(task, $event)"`：监听复选框变更。
- `@click="changeMonth(-1)"`：调用方法并传入参数。
- `@login-success="showWorkspace"`：监听子组件自定义事件。

`$event` 是 Vue 传入的原生事件对象，当前任务完成逻辑通过 `event.target.checked` 读取复选框是否被勾选。

### 5.6 双向绑定 `v-model`

登录表单：

```vue
<input v-model.trim="form.username" />
<input v-model="form.password" />
```

`v-model` 是“读取值 + 监听输入事件 + 回写状态”的语法糖。它使表单控件的值和组件状态保持同步。

- `v-model="form.password"`：输入变化时更新密码字段。
- `v-model.trim="form.username"`：更新前去掉用户名首尾空白。
- 搜索框上的 `v-model.trim="searchText"` 会维护搜索文本，但当前源码没有把 `searchText` 连接到实际筛选逻辑。

这和后端接收请求 DTO 不同：`v-model` 发生在浏览器内存中，只有执行 `fetch` 时，状态才会被序列化成 HTTP 请求体。

## 6. 组件通信：Props 向下，事件向上

Vue 组件之间最核心的通信方式是：父组件通过 Props 传数据，子组件通过自定义事件通知父组件。

### 6.1 Props：父传子

`App.vue`：

```vue
<DashboardView v-else :user="currentUser" />
```

`DashboardView.vue`：

```js
props: {
  user: {
    type: Object,
    default: () => ({})
  }
}
```

Props 是子组件接收的输入参数，类似方法参数或不可由被调用方直接改写的对象。子组件应通过事件请求父组件修改数据，而不是直接给 Props 重新赋值。

### 6.2 自定义事件：子传父

`LoginForm.vue` 登录成功后：

```js
this.$emit('login-success', user)
```

`LoginView.vue` 接收后继续向上转发：

```vue
<LoginForm @login-success="$emit('login-success', $event)" />
```

最终由 `App.vue` 处理：

```vue
<LoginView @login-success="showWorkspace" />
```

这类似一个子对象发布事件、父对象注册回调。事件名称是组件通信契约，应保持清晰稳定；`emits: ['login-success']` 用于声明组件允许发出的事件。

`DashboardView.vue` 的退出流程也是同样模式：工作台触发 `this.$emit('logout')`，根组件执行 `logout()` 并清除 Token。

### 6.3 当前项目没有使用的通信方式

当前项目没有跨多层组件共享的全局 Store，也没有 Provide/Inject。`dashboardData` 是从模块导入的静态对象，组件通过 `data()` 暴露给模板，并不是全局响应式状态管理方案。

## 7. 登录态和页面状态机

当前登录流程可抽象成以下状态机：

```text
未登录
  -> 提交表单
提交中
  -> 请求成功并拿到 accessToken
已登录工作台
  -> 点击退出
未登录
```

失败分支为：

```text
提交中 -> 网络异常 / JSON 解析失败 / 业务 code 非 200 -> 登录页显示错误
```

### 7.1 表单层 `LoginForm.vue`

1. `v-model` 收集用户名和密码。
2. `submitLogin()` 清空旧错误，将 `isSubmitting` 设为 `true`。
3. 调用 API 层的 `login()`。
4. 成功后保存 `user.accessToken`，发出 `login-success` 事件。
5. 失败后将 `error.message` 展示在 `role="alert"` 区域。
6. `finally` 中恢复提交状态，保证异常和成功都能解除 loading。

按钮和输入框在提交期间使用 `:disabled="isSubmitting"`，防止重复提交。

### 7.2 根组件 `App.vue`

`App.vue` 只关心页面级登录态，不关心登录请求的 HTTP 细节：

- 登录成功：保存用户对象并把 `isLoggedIn` 改为 `true`。
- 退出登录：调用 `removeAccessToken()`，清空用户对象，把 `isLoggedIn` 改为 `false`。

当前实现的一个重要事实是：应用初始化时 `isLoggedIn` 固定为 `false`，没有根据 `localStorage` 中已有的 Token 自动恢复登录态。因此刷新页面后仍会先显示登录页，这是当前代码行为，不应误认为 Vue 会自动持久化组件状态。

## 8. API 层：从 Java 后端视角看 HTTP 请求

项目把接口地址集中在 `src/constants`，把请求实现放在 `src/api`，把浏览器存储放在 `src/utils`。这种划分让组件主要处理 UI 和状态，不直接散落完整接口地址。

### 8.1 接口地址和环境变量

[`src/constants/auth.js`](C:\Users\andre\Desktop\txt\code\rui-front\src\constants\auth.js) 和 `src/constants/day-task.js` 都使用：

```js
const apiBaseUrl = (process.env.VUE_APP_API_BASE_URL || '/api').replace(/\/+$/, '')
```

当前接口：

| 常量 | 默认浏览器请求地址 | 方法 | 请求体 |
| --- | --- | --- | --- |
| `LOGIN_URL` | `/api/sys/user/login` | POST | `{ username, password }` |
| `DAY_TASK_LIST_URL` | `/api/user/dayTask/list` | POST | `{}` |
| `DAY_TASK_COMPLETE_URL` | `/api/user/dayTask/complete` | POST | `{ id }` |

`VUE_APP_*` 是 Vue CLI 暴露给前端代码的构建期环境变量。它们会被替换进前端静态资源，因此不能放数据库密码、私钥等真正的机密信息。浏览器中的前端代码和环境变量都可以被用户查看。

### 8.2 登录接口的响应契约

`src/api/auth.js` 期望后端返回：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "accessToken": "登录令牌"
  }
}
```

前端依次检查：

1. 网络请求是否成功执行。
2. 响应是否能解析为 JSON。
3. HTTP 状态是否为 2xx，即 `response.ok` 为真。
4. 业务码 `result.code` 是否等于 `200`。
5. `result.data.accessToken` 是否存在。

其中 `fetch()` 对 HTTP 404、500 通常不会自动进入 `catch`；只有网络层失败才会抛出异常。因此项目必须显式检查 `response.ok`，这点与很多 Java HTTP 客户端的异常策略不同。

### 8.3 日任务接口的 Token 和响应校验

日任务请求在 `getAuthorizationHeaders()` 中读取：

```js
return {
  Accept: '*/*',
  Authorization: accessToken,
  'Content-Type': 'application/json'
}
```

这里的 `Authorization` 值直接是 Token，没有自动拼接 `Bearer ` 前缀。后端如果要求标准 Bearer 形式，应由前后端契约明确约定；当前源码不能默认认为它发送的是 `Authorization: Bearer <token>`。

统一响应解析函数 `readApiResponse()` 检查 HTTP 状态和 `result.code === 200`。任务列表还额外检查 `result.data` 必须是数组，避免后续 `map()` 在错误数据结构上运行。

### 8.4 网络、解析、业务三类异常

项目将异常分为三层：

| 层次 | 示例 | 页面处理 |
| --- | --- | --- |
| 网络异常 | 后端未启动、代理目标不可达 | 显示“无法连接服务” |
| 响应解析异常 | 返回 HTML、空响应、非 JSON | 显示 HTTP 状态和无效数据提示 |
| 业务异常 | HTTP 成功但 `code` 非 200 | 优先显示后端 `message` |

这种分层对排查很有用：看到“接口失败”时，先判断请求是否发出，再判断响应是否是 JSON，最后才看业务码。

## 9. `localStorage` 与 Token 生命周期

[`src/utils/auth-storage.js`](C:\Users\andre\Desktop\txt\code\rui-front\src\utils\auth-storage.js) 封装了三个函数：

```js
saveAccessToken(accessToken)
getAccessToken()
removeAccessToken()
```

`localStorage` 是浏览器按当前源保存的字符串键值存储：

- 同一浏览器、同一协议、主机和端口下可复用。
- 刷新页面后仍然存在，除非被删除或清理。
- 不是 HttpOnly Cookie，JavaScript 可以读取。
- 当前项目没有在启动时读取它来恢复 `isLoggedIn`。

当前 Token 流程：

```text
登录接口返回 user.accessToken
  -> saveAccessToken()
  -> 后续日任务 API 通过 getAccessToken() 放入 Authorization
  -> 退出时 removeAccessToken()
```

前端保存 Token 只代表客户端保留了字符串，不代表后端认为 Token 一定有效。Token 过期、被撤销或接口返回未授权时，通常还需要统一处理并回到登录页；当前项目只在没有 Token 时提前抛出错误，尚未实现完整的 401 全局拦截。

## 10. 日任务页面：响应式状态的完整例子

`DashboardView.vue` 是当前项目最完整的 Vue 业务组件。

### 10.1 接口数据转换

后端任务对象通过 `mapDayTask()` 转为适合页面展示的对象：

```js
return {
  id: task.id,
  title: task.name || '未命名任务',
  tag: this.getPriorityLabel(task.priority),
  tone: this.getPriorityTone(task.priority),
  time: this.formatTaskTime(task.endTime),
  state: status === 2 ? 'done' : 'pending',
  status
}
```

这是一个典型的 View Model 转换：

- 后端字段 `name` 转为模板字段 `title`。
- 后端数字优先级转为标签文本和 CSS 色调。
- 后端时间转为用户可读文本。
- 后端 `status` 数字保留用于筛选，同时生成 `state` 用于视觉状态。

建议继续保持“接口 DTO”和“页面 View Model”边界。不要为了模板方便而直接到处修改后端原始对象，除非明确知道响应式和接口数据复用的影响。

### 10.2 加载状态和错误状态

任务加载涉及三个状态字段：

- `isLoadingTasks`：是否正在请求。
- `taskError`：列表加载失败信息。
- `taskActionError`：完成某一条任务失败信息。

页面通过 `v-if / v-else-if / v-else` 按优先级展示加载、错误、空数据和正常列表。这种写法可以理解为后端接口状态在前端的显式状态机，不要把空数组、加载中和请求失败混为同一种状态。

### 10.3 任务筛选

`taskTabs` 根据 `tasks` 生成计数，`filteredTasks` 根据 `selectedTaskTab` 返回要渲染的数组。切换页签只修改状态，不重新请求后端。

当前筛选值：

```text
all          -> 全部任务
in-progress  -> status === 1
completed    -> status === 2
```

### 10.4 完成任务的乐观更新边界

用户勾选任务后，代码先把任务 ID 放入 `completingTaskIds`，请求成功后才修改：

```js
task.status = 2
task.state = 'done'
task.completedTime = new Date().toISOString()
```

请求失败时，取消复选框勾选并显示错误。它不是完整的“先改界面再回滚”的乐观更新，而是“请求完成后再确认页面状态”的保守更新；`completingTaskIds` 用于防止同一任务重复操作。

## 11. `CalendarPanel.vue`：计算属性和日期计算

日历组件在 `data()` 中保存 `visibleDate` 和 `today`，在 `computed` 中生成显示结果：

- `monthLabel`：生成“2026年8月”这样的标题。
- `calendarDays`：生成上月补位日期、本月日期和下月补位日期。

翻页按钮调用：

```js
changeMonth (offset) {
  this.visibleDate = new Date(
    this.visibleDate.getFullYear(),
    this.visibleDate.getMonth() + offset,
    1
  )
}
```

修改 `visibleDate` 后，依赖它的 `monthLabel` 和 `calendarDays` 自动重新计算，模板中的月份和日期网格随之更新。这就是响应式数据驱动视图：代码修改状态，模板负责声明结果，不需要手动查找 DOM 并逐个修改文本。

`createDay()` 还负责生成稳定的 `key`、判断是否属于上月/下月、判断是否为今天。这里使用 `role="grid"`、`role="gridcell"`、`aria-current` 等属性增强可访问性，它们是 HTML/ARIA 能力，不是 Vue 专属语法。

## 12. 跨域、代理和生产部署

### 12.1 当前开发环境链路

[`vue.config.js`](C:\Users\andre\Desktop\txt\code\rui-front\vue.config.js) 配置了 Vue CLI 开发代理：

```js
const apiTarget = process.env.VUE_APP_DEV_API_TARGET || 'http://localhost:6000'

devServer: {
  proxy: {
    '/api': {
      target: apiTarget,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

浏览器请求：

```text
http://localhost:8080/api/sys/user/login
```

开发服务器转发到后端：

```text
http://localhost:6000/sys/user/login
```

`pathRewrite` 删除 `/api` 前缀，`changeOrigin` 修改代理请求的 Host/Origin 表现。代理只属于 Vue CLI 开发服务器配置，打包后的静态文件不会自带这个 Node.js 代理。

### 12.2 环境变量的两个用途

| 变量 | 默认值 | 作用范围 |
| --- | --- | --- |
| `VUE_APP_DEV_API_TARGET` | `http://localhost:6000` | 开发服务器代理的后端目标 |
| `VUE_APP_API_BASE_URL` | `/api` | 浏览器代码实际拼接的请求前缀 |

修改代理配置后需要重新启动开发服务器，因为它不是运行时热更新配置。生产环境应由 Nginx、网关或部署服务器将 `/api` 反向代理到后端；`devServer.proxy` 不会参与生产请求。

### 12.3 从 Java 后端排查请求

当页面调用失败时，按以下顺序看：

1. 浏览器 Network 中请求地址是否仍然是前端同源的 `/api/...`。
2. 前端代理目标是否与后端实际端口一致。
3. 后端日志收到的路径是否已经去掉 `/api`。
4. HTTP 状态是否为 2xx。
5. 响应是否为 JSON，且字段是否满足 `code`、`message`、`data` 契约。
6. 日任务请求的 `Authorization` 值是否存在，格式是否与后端过滤器约定一致。

项目已有 [`跨域问题解决方案.md`](C:\Users\andre\Desktop\txt\code\rui-front\跨域问题解决方案.md)，其中还记录了 JSON POST 预检、生产反向代理和浏览器与 Postman 行为差异。

## 13. 构建、转译和代码检查配置

### 13.1 `package.json` 脚本

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  }
}
```

- `serve`：启动 Vue CLI 开发服务器，并使用开发代理。
- `build`：将 Vue、JavaScript、CSS 和静态资源打包为浏览器可部署文件。
- `lint`：执行 ESLint 和 Vue 文件语法规则检查。

本次任务按要求不执行编译、启动或脚本命令；上面仅解释配置含义，实际编译由项目维护者手动执行。

### 13.2 Babel

`babel.config.js` 使用：

```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
```

Babel 负责把项目源码转换为目标浏览器更容易执行的 JavaScript。它不是 Java 编译器，也不负责把 JavaScript 变成 JVM 字节码。

### 13.3 `jsconfig.json` 与 `@` 路径别名

项目配置：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

因此：

```js
import { login } from '@/api/auth'
```

等价于从 `src/api/auth.js` 导入。`@` 只是构建工具和编辑器识别的路径别名，不是 npm 包，也不是 Java 注解。

`target: "es5"` 表示编辑器/工具链按较旧的 ECMAScript 目标理解代码；最终兼容范围还会受到 Babel 和 `browserslist` 的共同影响。项目明确排除了 IE 11：

```json
["> 1%", "last 2 versions", "not dead", "not ie 11"]
```

## 14. CSS 和资源组织

当前页面主要使用原生 CSS，不依赖 Sass、Tailwind 或组件库。

- 全局样式：`src/styles/base.css`。
- 页面/组件样式：写在各自 `.vue` 文件的 `<style scoped>` 中。
- 图片资源：登录和工作台背景使用 `img/all/全局背景图片.jpg`，Logo 位于 `src/assets/logo.png`。
- `public/index.html` 中的 `favicon.ico` 通过 `BASE_URL` 引用，属于静态公共资源。

样式中大量使用 CSS Grid、Flex、媒体查询、CSS 自定义属性和 `conic-gradient`。例如学习进度环通过：

```vue
:style="{ '--progress': `${dashboardData.learningProgress.total}%` }"
```

把业务数值传给 CSS，再由 `conic-gradient` 绘制进度。这是“JavaScript 提供状态，CSS 负责表现”的常见模式。

## 15. 从后端视角建立 Vue 心智模型

可以用下面这组映射快速阅读当前项目：

| Vue 概念 | 当前项目示例 | 近似的后端理解 |
| --- | --- | --- |
| 组件 | `LoginForm.vue` | 一个包含状态、输入和行为的 UI 模块 |
| `data` | `isSubmitting`、`tasks` | 组件实例状态字段 |
| `computed` | `filteredTasks` | 基于状态的只读派生查询 |
| `methods` | `loadDayTasks()` | 事件处理方法/应用服务动作 |
| Props | `DashboardView` 的 `user` | 调用方传入的只读参数 |
| `$emit` | `login-success`、`logout` | 发布给父组件的领域事件 |
| `v-if` | 登录页/工作台切换 | 条件创建或销毁视图分支 |
| `v-for` | 任务列表、课程列表 | 根据集合渲染重复节点 |
| `v-model` | 用户名、密码、搜索框 | 表单控件与内存状态双向同步 |
| `mounted` | 加载日任务 | 组件挂载后的初始化回调 |
| `fetch` | 登录、查询任务、完成任务 | 浏览器端 HTTP Client 调用 |
| `localStorage` | `accessToken` | 客户端持久化 Key-Value 存储 |
| Vue CLI proxy | `/api` 转发 | 开发环境网关/反向代理 |

最重要的区别是：后端通常由请求驱动 Controller，再返回一次响应；Vue 组件通常长期驻留在浏览器内，状态变化会多次触发局部渲染。因此前端代码不仅要处理接口成功和失败，还要明确 loading、空数据、重复点击、组件挂载和卸载等 UI 生命周期。

## 16. 当前项目阅读和修改建议

1. 修改页面结构时，先确认模板使用的状态是否在 `data` 或 `computed` 中声明。
2. 新增后端接口时，优先在 `src/constants` 定义地址，在 `src/api` 封装请求，再由组件调用。
3. 页面只关心展示和交互状态，接口解析、HTTP 校验和数据格式校验尽量保留在 API 层。
4. 列表渲染必须提供稳定的 `:key`，优先使用后端实体 ID。
5. 父子组件不要直接互相修改内部状态：父传 Props，子通过 `$emit` 通知。
6. 修改 `VUE_APP_*` 或 `vue.config.js` 后，注意环境变量属于构建/启动配置，不是浏览器运行时动态配置。
7. 涉及登录和 Token 时，区分“浏览器本地有 Token”和“后端确认 Token 有效”这两个事实。
8. 生产部署时不要依赖 `devServer.proxy`，应配置 Nginx、网关或同等反向代理。
9. 当前 `DashboardView` 中部分按钮和搜索框只有视觉交互，尚未连接实际业务接口；阅读代码时以是否绑定 `@click`、是否调用方法为准，不要只根据按钮文案推断功能已经实现。
10. 当前项目没有在启动阶段恢复 `localStorage` 登录态，也没有统一处理 401；这属于后续功能设计点，不是 Vue 默认行为。

## 17. 一句话总结

当前项目可以概括为：**Vue 3 + Options API 组件树，以响应式状态驱动登录页和工作台，通过 Props/事件完成组件通信，使用原生 `fetch` 对接 JSON API，使用 `localStorage` 保存 Token，并借助 Vue CLI 的 `/api` 代理解决开发环境跨域。**
