'use client';

import Link from 'next/link';
import { useLocale } from './LocaleProvider';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { locale, setLocale, t } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Admin routes have their own layout — don't show public nav there
  const isAdminRoute = pathname.startsWith('/admin');

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/about', label: t('nav.about') },
  ];

  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white text-center text-xs py-1.5 tracking-wide">
        {locale === 'zh' ? '全球稀有宝石 · 专业鉴定 · 品质保证' : 'Rare Gems Worldwide · Professional Certification · Quality Guaranteed'}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="text-2xl tracking-widest text-gray-800 font-light italic">
            gemlovers
          </Link>

          <nav className="hidden sm:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  pathname === link.href
                    ? 'text-amber-700 font-medium'
                    : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-amber-700 transition-colors"
            >
              <Globe size={16} />
              <span>{t('nav.language')}</span>
            </button>
            <Heart size={20} className="text-gray-400 hover:text-amber-700 cursor-pointer transition-colors hidden sm:block" />
            <ShoppingBag size={20} className="text-gray-400 hover:text-amber-700 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="sm:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm ${
                pathname === link.href ? 'text-amber-700 font-medium' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
