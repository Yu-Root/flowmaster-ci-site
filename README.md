# FlowMaster CI/CD Platform

## 🚀 流水线大师持续交付平台

一款面向开发者的自动化运维平台，集成代码管理、自动化构建、测试与容器化部署（Kubernetes），实现从代码提交到生产环境的全链路自动化。

## ✨ 核心功能

- **代码管理**: 支持 Git 仓库集成，自动检测代码变更，触发自动化流程
- **自动化构建**: 多语言支持，并行构建，缓存优化，快速反馈构建结果
- **自动化测试**: 单元测试、集成测试、性能测试全覆盖，确保代码质量
- **容器化部署**: Docker 镜像构建，Kubernetes 编排，蓝绿部署，滚动更新
- **实时监控**: 构建状态实时推送，日志在线查看，性能指标监控
- **灵活配置**: 可视化流水线编辑，YAML 配置支持，插件生态扩展

## 🛠️ 技术栈

- **前端框架**: Vue 3.5+
- **构建工具**: Vite 8.0+
- **UI 组件库**: Element Plus 2.14+
- **状态管理**: Pinia 3.0+
- **路由管理**: Vue Router 4.6+
- **HTTP 客户端**: Axios 1.16+

## 📦 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产构建

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
flowmaster-ci-site/
├── src/
│   ├── views/              # 页面视图
│   │   ├── HomeView.vue    # 首页
│   │   ├── ProjectsView.vue    # 项目管理
│   │   ├── PipelinesView.vue   # 流水线管理
│   │   ├── BuildsView.vue      # 构建历史
│   │   └── KubernetesView.vue  # K8s 部署管理
│   ├── stores/             # Pinia 状态管理
│   │   └── index.js
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── components/         # 公共组件
│   ├── App.vue             # 根组件
│   ├── main.js             # 入口文件
│   └── style.css           # 全局样式
├── public/                 # 静态资源
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 功能模块

### 1. 首页 (Home)
- 平台概览和统计数据
- 核心功能展示
- 最近活动动态

### 2. 项目管理 (Projects)
- 项目列表展示
- 新建/删除项目
- 触发项目构建
- Git 仓库集成

### 3. 流水线管理 (Pipelines)
- 流水线可视化
- 阶段状态展示
- 触发流水线执行
- 流水线配置

### 4. 构建历史 (Builds)
- 构建记录查询
- 构建日志查看
- 过滤和搜索
- 重新构建功能

### 5. Kubernetes 部署 (K8s)
- 集群状态监控
- 应用部署管理
- 扩缩容操作
- 日志查看和重启

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 创建新的 Vue 组件
2. 在 `src/router/index.js` 添加路由配置
3. 在 `src/App.vue` 添加菜单项（如需要）

### 状态管理

使用 Pinia 进行状态管理，所有 store 定义在 `src/stores/index.js` 中。

### API 调用

使用 Axios 进行 HTTP 请求，可以在 `src/utils/request.js` 中封装统一的请求方法。

## 📝 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- Email: support@flowmaster.com

---

**FlowMaster CI/CD Platform** - 让持续交付更简单！🚀
