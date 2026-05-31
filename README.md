# 🏃 Campus Runner

Open-source full-stack campus errands app template built with Expo React Native, Node.js, Express, Prisma and PostgreSQL.

## 项目简介

Campus Runner 是一个校园跑腿互助平台，帮助大学生发布和接取校园内的各种代办任务，如取快递、买饭、送文件等。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Expo SDK 56 + React Native 0.85 |
| 导航 | React Navigation 7 (Stack + Bottom Tabs) |
| 状态管理 | Zustand 5 |
| 语言 | TypeScript 6 |
| 地图 | react-native-maps |
| 动画 | react-native-reanimated |
| 图标 | @expo/vector-icons (Feather) |

## 功能列表

- 🏠 **首页** — 任务列表浏览、搜索筛选
- 📝 **发布任务** — 填写任务信息、取送地点、报酬
- 📋 **订单管理** — 已发布 / 已接取订单列表
- 💬 **消息** — 任务相关的聊天通讯
- 👤 **个人中心** — 用户信息、历史订单、评价
- ⭐ **评价系统** — 完成任务后互评
- 🔍 **搜索** — 按关键词搜索任务
- 🗺️ **地图** — 查看任务位置

## 本地运行

### 前置条件

- Node.js >= 18
- npm 或 yarn
- Expo CLI: `npm install -g expo-cli`
- 手机安装 Expo Go App（或使用 Android Studio / Xcode 模拟器）

### 启动步骤

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/campus-runner-template.git
cd campus-runner-template

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm start

# 4. 用 Expo Go 扫码，或按 a 启动 Android 模拟器
```

### 构建 APK

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 构建 Android APK（内测用）
eas build --platform android --profile preview
```

## 环境变量

本项目第一版使用本地 mock 数据，无需配置环境变量。

如需接入后端 API，创建 `.env` 文件：

```env
EXPO_PUBLIC_API_BASE_URL=http://your-server:3001
```

> ⚠️ `.env` 文件已被 `.gitignore` 排除，不会提交到仓库。

## 项目结构

```
campus-runner/
├── App.tsx                    # 应用入口
├── index.ts                   # 注册入口
├── app.json                   # Expo 配置
├── eas.json                   # EAS Build 配置
├── tsconfig.json              # TypeScript 配置
├── package.json               # 依赖和脚本
├── assets/                    # 图标、启动图资源
│   ├── icon.png
│   ├── splash-icon.png
│   ├── favicon.png
│   └── android-icon-*.png
└── src/
    ├── data/
    │   └── mockData.ts        # Mock 数据
    ├── navigation/
    │   └── AppNavigator.tsx   # 路由导航配置
    ├── pages/
    │   ├── HomePage.tsx       # 首页
    │   ├── OrdersPage.tsx     # 订单列表
    │   ├── PublishPage.tsx    # 发布任务
    │   ├── MessagesPage.tsx   # 消息列表
    │   ├── ProfilePage.tsx    # 个人中心
    │   ├── OrderDetailPage.tsx# 订单详情
    │   ├── ChatPage.tsx       # 聊天页面
    │   ├── RunnerPage.tsx     # 跑腿员页面
    │   ├── SearchPage.tsx     # 搜索页面
    │   └── RatingPage.tsx     # 评价页面
    ├── stores/
    │   └── useStore.ts        # Zustand 全局状态
    ├── types/
    │   └── index.ts           # TypeScript 类型定义
    └── utils/
        └── index.ts           # 工具函数
```

## License

[MIT](LICENSE)
