import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OpenMontage Video Generator',
  description: 'Create video concepts, scripts, and provider-ready video jobs from text prompts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
