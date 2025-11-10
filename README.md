# AI Travel Planner (Web)

一个基于 React + Vite 的 Web 版 AI 旅行规划师示例。

## 功能概览
- 智能行程规划：输入或语音输入偏好，调用 OpenAI 兼容 API 生成行程。
- 费用记录：简单的语音/文字输入记账。
- 设置页：本地存储 LLM、AMap、Supabase 的配置；不提交任何 Key 到仓库。
- 地图：基于高德 JS SDK 动态加载，按目的地定位。

## 本地开发
```bash
npm install
npm run dev
```

## 必要配置（运行前在“设置”页面填写，供测试使用）
- **LLM Endpoint（OpenAI 兼容）**：https://dashscope.aliyuncs.com/compatible-mode
- **LLM API Key**：sk-9e96c2a5a4ad44fe837dac778e15c9d1
- **科大讯飞 APPID**：41064e47
- **科大讯飞 APIKey**：YjA3ZTcxNmQyYjM5ZWYwYzc4MmUxOGM3
- **科大讯飞 APISecret**：59372a761e9184e633c7f1e09958f072
- **科大讯飞 Chat Completions 接口**：https://spark-api-open.xf-yun.com/v2/chat/completions
- **高德 AMap Key（JS SDK）**：a1f5cd971bc3367fbdd6816e7a5be076
- **高德 Web 服务 Key（REST）**：a1f5cd971bc3367fbdd6816e7a5be076
- **Supabase URL**（可选）：https://eozfimltbuzpmspsdioi.supabase.co
- **Supabase anon key**（可选）：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvemZpbWx0YnV6cG1zcHNkaW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjM3NjAsImV4cCI6MjA3ODMzOTc2MH0.jU7-TZeTho2UQ7WALaSKtCdymVnxWntws-xzk-_Is5Y

## 构建与预览
```bash
npm run build
npm run preview
```

## Docker
提供三种运行方式：本地构建、下载 CI 产物 tar.gz、本地/远端拉取镜像。

### 方式 A：本地构建并运行
```bash
docker build -t ai-travel-planner:latest .
docker run -p 4173:4173 ai-travel-planner:latest
# 打开 http://localhost:4173 并在 Settings 页面填写 Key
```

### 方式 B：下载 GitHub Actions Artifact（tar.gz）并运行
1. 进入仓库 → Actions → 选择最近一次构建 → 下载 `ai-travel-planner-<commit_sha>.tar.gz`
2. 在本地导入并运行：
```bash
docker load -i ai-travel-planner-<commit_sha>.tar.gz
docker images  # 查找导入的标签，例如 ai-travel-planner:github-<sha>
docker run -p 4173:4173 ai-travel-planner:github-<sha>
```

### 运行后配置
- 访问 `http://localhost:4173`，进入 Settings 页面，填写以下项目：
  - LLM Endpoint
  - LLM API Key
  - 科大讯飞 APPID / APIKey / APISecret（仅占位）
  - 高德 AMap Key（JS）
  - 高德 Web 服务 Key（REST）
  - Supabase URL / anon key（可选）

### 注意事项
- Docker 镜像仅包含前端应用，所有 Key 在浏览器本地输入并存储于 `localStorage`，不会进入容器。
- 高德 JS Key 需配置正确的 Referer 白名单；Web 服务 Key 建议最终通过后端代理调用。
