import '../styles/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NotificationProvider } from '../contexts/NotificationContext';

const font = localFont({
  src: '../fonts/kanit-ExtraLight.ttf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WORKDER',
  description: 'Future of Work Platform',
  icons: {
    icon: '/favicon/favicon-96x96.png',
    shortcut: '/favicon/favicon-96x96.png',
    apple: '/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={font.className}>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
