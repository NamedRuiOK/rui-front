# rui-front

基于 Vue 3 和 Vue CLI 5 的登录页项目。当前页面使用 `img/all/全局背景图片.jpg` 作为全屏背景，登录表单调用本地用户服务完成认证。

## 项目结构

```text
rui-front/
├─ img/
│  └─ all/
│     └─ 全局背景图片.jpg       # 登录页背景素材
├─ public/
│  ├─ favicon.ico
│  └─ index.html                # HTML 模板和应用挂载节点
├─ src/
│  ├─ api/
│  │  └─ auth.js                # 登录接口
│  ├─ components/
│  │  ├─ login/
│  │  │  └─ LoginForm.vue       # 登录表单和交互状态
│  │  └─ HelloWorld.vue          # Vue CLI 默认示例，暂未使用
│  ├─ constants/
│  │  └─ auth.js                # 登录地址和 Token Key
│  ├─ styles/
│  │  └─ base.css               # 全局基础样式
│  ├─ utils/
│  │  └─ auth-storage.js        # Token 浏览器存储
│  ├─ views/
│  │  └─ LoginView.vue           # 登录页面布局和视觉样式
│  ├─ App.vue                   # 根组件
│  └─ main.js                   # 应用入口
├─ babel.config.js
├─ jsconfig.json
├─ package.json
├─ package-lock.json
└─ vue.config.js
```

## 登录流程

1. 用户在 `LoginForm.vue` 中填写用户名和密码。
2. `src/api/auth.js` 直接向后端发送 JSON POST 请求：

   ```text
   http://localhost:6000/sys/user/login
   ```

3. 接口返回 `code === 200` 且包含 `data.accessToken` 时，Token 通过 `localStorage` 保存为：

   ```text
   accessToken
   ```

4. 页面显示登录成功状态。切换账户时只清空当前密码和页面状态，不会自动删除已保存 Token。

## 视觉说明

- 背景图使用 `img/all/全局背景图片.jpg`。
- 背景图片使用 `filter: blur(20px)`。
- 登录面板使用 `backdrop-filter: blur(10px)`。
- 登录卡片、输入框和按钮均提供移动端适配。

CSS 的 `blur()` 使用像素值而不是百分比，项目将需求中的 20% 和 10% 分别映射为 `20px` 和 `10px`。

## 开发命令

安装依赖：

```powershell
npm install
```

启动开发服务器：

```powershell
npm run serve
```

生产构建：

```powershell
npm run build
```

代码检查：

```powershell
npm run lint
```

## 注意事项

- 登录接口需要运行在 `localhost:6000`。
- 前端会从 `localhost:8080` 跨域访问后端，后端需要允许该来源、请求方法和请求头。
- CORS 来源需要完整匹配协议、主机和端口。例如 `http://localhost:8080` 与 `http://127.0.0.1:8080` 是两个不同来源。
- `accessToken` 当前保存在浏览器 `localStorage` 中，后续接口请求可从该 Key 读取并放入请求头。
- 项目使用 `@/*` 路径别名指向 `src/*`。
- `node_modules/` 和 `dist/` 已通过 `.gitignore` 排除。
