import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Sleeping Ox Studio — EchoFrame Archive',
  description: 'Michael Senkow portfolio — exploratory, WebGL-driven.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
