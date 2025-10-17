# 作业提交 PDF（模板）

请将本文件导出为 PDF（或复制内容到任意文档工具后导出 PDF）。

## 项目信息
- 项目名称：AI Travel Planner (Web)
- GitHub 仓库地址：<在此粘贴你的仓库 URL>
- Docker 镜像地址（阿里云镜像仓库）：<在此粘贴镜像地址>

## 运行说明（摘要）
1. 克隆仓库并安装依赖：`npm install`
2. 本地开发：`npm run dev`
3. 构建与预览：`npm run build`，然后 `npm run preview`
4. Docker 构建：`docker build -t ai-travel-planner:latest .`
5. Docker 运行：`docker run -p 4173:4173 ai-travel-planner:latest`

## Key 配置说明（重要）
- 所有 API Key 均不可提交到仓库。
- 运行时在应用“设置”页面填写以下项：
  - LLM Endpoint（OpenAI 兼容 /v1/chat/completions）
  - LLM API Key
  - 高德 AMap Key
  - Supabase URL / anon key（可选，用于登录与云同步拓展）

## 功能确认清单
- [ ] 语音输入（浏览器 Web Speech，或可拓展第三方语音 API）
- [ ] 智能行程规划（LLM 生成）
- [ ] 地图展示（高德）
- [ ] 费用记录（支持语音辅助）
- [ ] 设置页面（本地存储密钥与配置）
- [ ] Docker 镜像可运行
- [ ] GitHub Actions 推送镜像到阿里云（可选）

## 评测辅助信息
- 如果你使用阿里云百炼，请提供可用 3 个月以上的 Key（若学校要求）。
- 若不方便提供 Key，请在 README 中注明如何在本地填写自有 Key 以复现。

## 备注
- 严禁在代码库中提交任何 Key 或敏感信息。
