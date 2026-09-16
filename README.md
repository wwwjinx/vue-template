# Vue Template

基于 Vue 3 的前端项目模板，使用 TypeScript、Vite、Pinia 和文件-based 路由。

## 技术栈

- **框架**: Vue 3.5
- **构建工具**: Vite 8 (Rolldown)
- **语言**: TypeScript 6（暂不升级 TypeScript 7：`vue-tsc` 仍依赖 TS 6 的编译器 API）
- **状态管理**: Pinia 4
- **路由**: Vue Router 5 文件-based 路由（`vue-router/vite`）
- **请求**: Alova 3 + Fetch
- **原子化 CSS**: UnoCSS
- **工具库**: @vueuse/core
- **包管理器**: pnpm 10
- **Node.js**: `^20.19.0 || >=22.12.0`（Vite 8 要求）

## 目录结构

```
vue-template/
├── public/               # 静态资源目录
├── src/                  # 源代码目录
│   ├── api/              # 接口封装
│   ├── assets/           # 资源文件目录
│   ├── components/       # 组件目录
│   ├── hooks/            # 组合式函数
│   ├── pages/            # 页面目录（文件-based 路由）
│   │   ├── index.vue     # 首页
│   │   ├── about.vue     # 关于页面
│   │   └── login.vue     # 登录示例
│   ├── stores/           # Pinia 状态管理目录
│   ├── styles/           # 全局样式与主题变量
│   ├── types/            # 自动生成的类型声明
│   ├── utils/            # 工具方法（含请求客户端）
│   ├── App.vue           # 应用根组件
│   └── main.ts           # 应用入口文件
├── index.html            # HTML 入口文件
├── package.json          # 项目配置和依赖管理
├── tsconfig.json         # TypeScript 配置
├── tsconfig.app.json     # 应用源码 TypeScript 配置
├── tsconfig.node.json    # Node.js 环境 TypeScript 配置
└── vite.config.ts        # Vite 配置
```

## 路由系统

本项目使用 **Vue Router** 内置的文件-based 路由，路由规则如下：

- 路由文件存放在 `src/pages` 目录下
- 文件路径自动映射为路由路径
- `index.vue` 文件对应根路径 `/`
- 例如：`src/pages/about.vue` 对应路由 `/about`

## 安装与使用

需要 Node.js 20.19+ 或 22.12+。

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
pnpm run dev
```

开发服务器默认运行在 `http://localhost:8080/`

### 构建生产版本

```bash
pnpm run build
```

构建产物会输出到 `dist` 目录

### 预览生产构建

```bash
pnpm run preview
```

## 脚本命令

| 命令 | 描述 |
|------|------|
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 类型检查并构建生产版本 |
| `pnpm run preview` | 预览生产构建 |
| `pnpm run type-check` | 运行 TypeScript 类型检查 |
| `pnpm run lint` | 运行 ESLint |
| `pnpm run lint:fix` | 运行 ESLint 并自动修复 |

## 代码规范

- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 最佳实践
- 使用 `<script setup>` 语法
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case 或 index.vue

## 扩展指南

### 添加新页面

在 `src/pages` 目录下创建新的 `.vue` 文件，路由会自动生成：

```bash
# 创建新页面
touch src/pages/new-page.vue
```

### 添加新的 Pinia Store

在 `src/stores` 目录下创建新的 store 文件：

```bash
# 创建新的 store
touch src/stores/new-store.ts
```

### 添加新组件

在 `src/components` 目录下创建新的组件文件：

```bash
# 创建新组件
touch src/components/MyComponent.vue
```

## 许可证

ISC
