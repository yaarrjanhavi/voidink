import type { Metadata } from 'next';
import '@/styles/globals.css';
import { GrainOverlay } from '@/components/horror/GrainOverlay';
import { Nav } from '@/components/horror/Nav';

export const metadata: Metadata = {
  title: 'voidink — indie horror emotion map',
  description: 'Analyze indie horror game reviews and map the emotions beneath the words.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-body antialiased">
        <div
          className="fixed inset-0 -z-10 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(107, 45, 60, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(74, 93, 74, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #1a1614 0%, #2a2420 50%, #1a1614 100%)
            `,
          }}
        />
        <GrainOverlay />
        <div className="relative mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6">
          <Nav />
          <main>{children}</main>
          <footer className="mt-16 border-t border-[#3d3530] pt-6 text-center text-xs text-ink-ghost">
            <p className="typewriter-title">read the silence between the lines</p>
            <p className="mt-1 opacity-60">voidink · indie horror review emotion map</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
