'use client';

import { useLocale } from '@/components/LocaleProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Globe, Gem, Sparkles } from 'lucide-react';

const categoryList: { key: string; gradient: string }[] = [
  { key: 'sapphire', gradient: 'from-blue-400 to-blue-600' },
  { key: 'ruby', gradient: 'from-red-400 to-red-600' },
  { key: 'emerald', gradient: 'from-emerald-400 to-emerald-600' },
  { key: 'tanzanite', gradient: 'from-purple-400 to-purple-600' },
  { key: 'tourmaline', gradient: 'from-teal-400 to-pink-400' },
  { key: 'spinel', gradient: 'from-rose-400 to-rose-600' },
  { key: 'garnet', gradient: 'from-orange-400 to-red-500' },
  { key: 'topaz', gradient: 'from-yellow-300 to-amber-500' },
];

interface HeroSettings {
  bannerImage: string;
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
}

export default function Home() {
  const { locale, t } = useLocale();
  const [hero, setHero] = useState<HeroSettings | null>(null);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.hero) setHero(data.hero);
        if (data.categoryImages) setCategoryImages(data.categoryImages);
      });
  }, []);

  const heroTitle = hero
    ? (locale === 'zh' ? hero.titleZh || t('home.hero.title') : hero.titleEn || t('home.hero.title'))
    : t('home.hero.title');

  const heroSubtitle = hero
    ? (locale === 'zh' ? hero.subtitleZh || t('home.hero.subtitle') : hero.subtitleEn || t('home.hero.subtitle'))
    : t('home.hero.subtitle');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {hero?.bannerImage ? (
          <div className="relative min-h-[420px] md:min-h-[520px] flex items-center">
            <img
              src={hero.bannerImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight mb-6">
                  {heroTitle}
                </h1>
                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
                  {heroSubtitle}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white text-amber-800 px-8 py-3 rounded-full text-sm tracking-wide hover:bg-amber-50 transition-colors"
                >
                  {t('home.hero.cta')}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-50 via-white to-stone-50">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-amber-400 blur-3xl" />
              <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-rose-300 blur-3xl" />
            </div>
            <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight tracking-tight mb-6">
                  {heroTitle}
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                  {heroSubtitle}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-amber-700 text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-amber-800 transition-colors"
                >
                  {t('home.hero.cta')}
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex gap-6">
                {[
                  { color: 'from-blue-400 to-indigo-500', size: 'w-28 h-28', delay: '0s' },
                  { color: 'from-emerald-400 to-emerald-600', size: 'w-20 h-20', delay: '1s' },
                  { color: 'from-rose-400 to-rose-600', size: 'w-24 h-24', delay: '0.5s' },
                ].map((gem, i) => (
                  <div
                    key={i}
                    className={`${gem.size} rounded-2xl bg-gradient-to-br ${gem.color} shadow-2xl opacity-80 rotate-12 animate-pulse`}
                    style={{ animationDelay: gem.delay, animationDuration: '3s' }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-2 text-center">
            {t('home.categories.title')}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-10">{t('home.categories.subtitle')}</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categoryList.map((cat) => (
              <Link
                key={cat.key}
                href={`/shop?category=${cat.key}`}
                className="flex flex-col items-center gap-2 group"
              >
                {categoryImages[cat.key] ? (
                  <img
                    src={categoryImages[cat.key]}
                    alt={cat.key}
                    className="w-16 h-16 rounded-full object-cover shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.gradient} shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`} />
                )}
                <span className="text-xs text-gray-500 group-hover:text-amber-700 transition-colors">
                  {t(`shop.categories.${cat.key}`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-12 text-center">
          {t('home.about.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: t('home.about.quality'), desc: t('home.about.qualityDesc') },
            { icon: Globe, title: t('home.about.global'), desc: t('home.about.globalDesc') },
            { icon: Gem, title: t('home.about.service'), desc: t('home.about.serviceDesc') },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 rounded-2xl hover:bg-amber-50/50 transition-colors">
              <item.icon className="mx-auto mb-4 text-amber-600" size={36} strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Design CTA */}
      <section className="bg-gradient-to-r from-amber-700 to-amber-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Sparkles size={40} strokeWidth={1} className="opacity-80" />
            <div>
              <h2 className="text-2xl font-light mb-1">{t('home.customize.title')}</h2>
              <p className="text-amber-100 text-sm max-w-md">{t('home.customize.description')}</p>
            </div>
          </div>
          <Link
            href="/about"
            className="bg-white text-amber-800 px-8 py-3 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors whitespace-nowrap"
          >
            {t('home.customize.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
