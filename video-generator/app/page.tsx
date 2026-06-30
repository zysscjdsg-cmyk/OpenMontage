'use client';

import { useState } from 'react';

type VideoResult = {
  status: string;
  title: string;
  storyboard: string;
  provider: string;
  videoUrl?: string;
  note?: string;
};

export default function Page() {
  const [prompt, setPrompt] = useState('一台黄色装载机在秘鲁矿山清晨作业，电影感，10秒宣传片');
  const [duration, setDuration] = useState('10');
  const [ratio, setRatio] = useState('16:9');
  const [style, setStyle] = useState('cinematic commercial');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState('');

  async function generateVideo() {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, ratio, style }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '生成失败');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <span className="badge">Codex 视频生成项目</span>
          <h1>OpenMontage Video Generator</h1>
          <p>输入中文或英文提示词，系统会生成视频标题、镜头脚本和可接入真实视频模型的任务结构。默认 mock 模式不消耗额度。</p>
        </section>

        <section className="panel">
          <label>视频提示词</label>
          <textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} />

          <div className="grid">
            <div>
              <label>时长</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="5">5 秒</option>
                <option value="10">10 秒</option>
                <option value="15">15 秒</option>
                <option value="30">30 秒</option>
              </select>
            </div>
            <div>
              <label>画幅</label>
              <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
                <option value="16:9">16:9 横屏</option>
                <option value="9:16">9:16 竖屏</option>
                <option value="1:1">1:1 方形</option>
              </select>
            </div>
          </div>

          <label>风格</label>
          <input value={style} onChange={(e) => setStyle(e.target.value)} />

          <button disabled={loading || !prompt.trim()} onClick={generateVideo}>
            {loading ? '生成中...' : '生成视频方案'}
          </button>

          {error && <div className="result">错误：{error}</div>}

          {result && (
            <div className="video-card">
              <h2>{result.title}</h2>
              <p>状态：{result.status}</p>
              <p>Provider：{result.provider}</p>
              {result.videoUrl && <p>视频链接：{result.videoUrl}</p>}
              {result.note && <p>{result.note}</p>}
              <div className="result">{result.storyboard}</div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
