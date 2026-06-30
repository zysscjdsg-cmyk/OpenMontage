import OpenAI from 'openai';
import { NextResponse } from 'next/server';

type VideoRequest = {
  prompt?: string;
  duration?: string;
  ratio?: string;
  style?: string;
};

function fallbackStoryboard(input: Required<VideoRequest>) {
  return [
    `标题：${input.prompt.slice(0, 26)}...`,
    '',
    `规格：${input.duration} 秒，${input.ratio}，${input.style}`,
    '',
    '镜头 1：建立场景，展示主体和环境。',
    '镜头 2：推进到关键动作，增强速度感和商业质感。',
    '镜头 3：特写细节，突出机械力量、材质、光线和品牌感。',
    '镜头 4：收尾镜头，留下干净、有冲击力的结束画面。',
    '',
    '旁白建议：用一句简短、有力量的中文或西语口号结尾。',
  ].join('\n');
}

export async function POST(request: Request) {
  const body = (await request.json()) as VideoRequest;
  const input = {
    prompt: body.prompt?.trim() || '',
    duration: body.duration || '10',
    ratio: body.ratio || '16:9',
    style: body.style || 'cinematic commercial',
  };

  if (!input.prompt) {
    return NextResponse.json({ error: '请输入视频提示词。' }, { status: 400 });
  }

  const provider = process.env.VIDEO_PROVIDER || 'mock';

  if (provider === 'mock') {
    return NextResponse.json({
      status: 'storyboard_ready',
      provider,
      title: '视频方案已生成',
      storyboard: fallbackStoryboard(input),
      note: '当前为 mock 模式。配置真实视频模型后，可在这里返回 videoUrl 或 jobId。',
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: '缺少 OPENAI_API_KEY，请先配置环境变量。' }, { status: 500 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a bilingual Chinese-English video director. Produce practical short video production plans.',
      },
      {
        role: 'user',
        content: `Create a video generation brief. Prompt: ${input.prompt}. Duration: ${input.duration}s. Ratio: ${input.ratio}. Style: ${input.style}. Return Chinese output with title, scene list, camera motion, lighting, sound, and final generation prompt.`,
      },
    ],
  });

  return NextResponse.json({
    status: 'storyboard_ready',
    provider,
    title: 'AI 视频方案已生成',
    storyboard: completion.choices[0]?.message?.content || fallbackStoryboard(input),
    note: '这里已经接入 OpenAI 文案/分镜生成。真实视频生成模型可在本路由继续接入。',
  });
}
