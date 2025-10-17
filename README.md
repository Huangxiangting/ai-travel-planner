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

## 必要配置（运行前在“设置”页面填写）
- LLM Endpoint（OpenAI 兼容，如阿里云百炼兼容模式）：`https://dashscope.aliyuncs.com/compatible-mode`
- LLM API Key：`sk-...`
- 高德 AMap Key
- Supabase URL / anon key（用于后续扩展登录与云端同步）

## 构建与预览
```bash
npm run build
npm run preview
```

## Docker
- 构建镜像：`docker build -t ai-travel-planner:latest .`
- 运行：`docker run -p 4173:4173 ai-travel-planner:latest`

## GitHub Actions（可选）
配置以下 Secrets：
- `ALIYUN_REGISTRY`: 如 `registry.cn-hangzhou.aliyuncs.com`
- `ALIYUN_NAMESPACE`: 你的命名空间
- `ALIYUN_USERNAME`, `ALIYUN_PASSWORD`

推送到 `main` 自动构建并推送镜像。

## 安全注意
- 切记不要在代码库提交任何 API Key。
- Key 仅存储在浏览器本地（`localStorage`）。请在 Settings 页面输入。

## 许可
MIT
