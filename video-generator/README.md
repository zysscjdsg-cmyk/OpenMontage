# OpenMontage Video Generator

一个由 Codex 创建的视频生成网站项目。当前版本包含：

- Next.js 前端页面
- `/api/video` 后端接口
- OpenAI 文案/分镜生成能力
- mock 视频模式，默认不消耗额度
- 真实视频模型接入预留位

## 本地运行

```bash
cd video-generator
npm install
cp .env.example .env.local
npm run dev
```

然后打开：

```text
http://localhost:3000
```

## 环境变量

```bash
OPENAI_API_KEY=你的 OpenAI API Key
VIDEO_PROVIDER=mock
VIDEO_MODEL=your-video-model-name
```

默认 `VIDEO_PROVIDER=mock`，只生成视频方案和分镜，不调用真实视频模型。

如需启用 OpenAI 文案/分镜生成，可设置：

```bash
VIDEO_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

## 后续接入真实视频生成

在 `app/api/video/route.ts` 中继续扩展：

1. 调用目标视频模型 API
2. 返回 `jobId` 或 `videoUrl`
3. 增加轮询接口 `/api/video/status`
4. 前端展示生成进度和最终视频

## 安全提醒

不要把 `.env.local` 或真实 API Key 提交到 GitHub。
