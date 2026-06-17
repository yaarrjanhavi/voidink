'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Write' },
  { href: '/batch', label: 'Batch' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#3d3530] pb-4">
      <Link href="/" className="group flex items-baseline gap-2">
        <span className="typewriter-title text-2xl text-ink-faded animate-flicker group-hover:text-white">
          voidink
        </span>
        <span className="text-xs text-ink-ghost">emotion map</span>
      </Link>
      <ul className="flex flex-wrap gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`ink-button inline-block px-3 py-1.5 text-xs ${active ? 'border-ink-rust text-white' : ''}`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
