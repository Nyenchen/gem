'use client';

import { useLocale } from '@/components/LocaleProvider';
import ProductCard from '@/components/ProductCard';
import { Product, FilterState } from '@/lib/types';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import GemCutIcon from '@/components/GemCutIcon';

const categories = [
  'all', 'alexandrite', 'amethyst', 'aquamarine', 'beryl', 'sapphire',
  'garnet', 'emerald', 'opal', 'ruby', 'tanzanite', 'topaz', 'tourmaline', 'spinel',
];

const cuts = [
  'cushion', 'oval', 'radiant', 'pear', 'asscher', 'heart', 'round', 'emerald', 'cabochon', 'trillion', 'fancy',
];


export default function Shop() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-8 text-gray-400">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const initialCategory = searchParams.get('category') || 'all';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    cut: '',
    color: '',
    minPrice: 0,
    maxPrice: 10000000,
    minWeight: 0,
    maxWeight: 100,
    sortBy: 'popular',
  });

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const filtered = products
    .filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.cut && p.cut !== filters.cut) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (p.weight < filters.minWeight || p.weight > filters.maxWeight) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest': return b.createdAt.localeCompare(a.createdAt);
        case 'priceAsc': return a.price - b.price;
        case 'priceDesc': return b.price - a.price;
        case 'weight': return b.weight - a.weight;
        default: return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">{t('shop.title')}</h1>
        <p className="text-sm text-gray-400 max-w-2xl">{t('shop.subtitle')}</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`
          ${showFilters ? 'fixed inset-0 z-40 bg-white p-6 overflow-auto' : 'hidden'}
          md:block md:static md:w-64 md:shrink-0
        `}>
          <div className="flex items-center justify-between md:hidden mb-4">
            <h3 className="font-medium">{t('shop.filters.stoneType')}</h3>
            <button onClick={() => setShowFilters(false)}><X size={24} /></button>
          </div>

          {/* Stone Type */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-800">{t('shop.filters.stoneType')}</h3>
              <button
                onClick={() => setFilters((f) => ({ ...f, category: 'all' }))}
                className="text-xs text-gray-400 hover:text-amber-700"
              >
                {t('shop.filters.reset')}
              </button>
            </div>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => setFilters((f) => ({ ...f, category: cat }))}
                    className="accent-amber-700"
                  />
                  <span className={`${filters.category === cat ? 'text-amber-700 font-medium' : 'text-gray-600'} group-hover:text-amber-700 transition-colors`}>
                    {t(`shop.categories.${cat}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Cut */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 mb-3">{t('shop.filters.cut')}</h3>
            <div className="grid grid-cols-4 gap-2">
              {cuts.map((cut) => (
                <button
                  key={cut}
                  onClick={() => setFilters((f) => ({ ...f, cut: f.cut === cut ? '' : cut }))}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                    filters.cut === cut
                      ? 'border-amber-600 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-500 hover:border-amber-300'
                  }`}
                >
                  <GemCutIcon cut={cut} size={28} />
                  <span className="truncate w-full text-center">{t(`shop.cuts.${cut}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 mb-3">{t('shop.filters.price')}</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t('shop.filters.from')}
                value={filters.minPrice || ''}
                onChange={(e) => setFilters((f) => ({ ...f, minPrice: Number(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder={t('shop.filters.to')}
                value={filters.maxPrice === 10000000 ? '' : filters.maxPrice}
                onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) || 10000000 }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Weight */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-800">{t('shop.filters.mass')}</h3>
              <button
                onClick={() => setFilters((f) => ({ ...f, minWeight: 0, maxWeight: 100 }))}
                className="text-xs text-gray-400 hover:text-amber-700"
              >
                {t('shop.filters.reset')}
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                placeholder={t('shop.filters.from')}
                value={filters.minWeight || ''}
                onChange={(e) => setFilters((f) => ({ ...f, minWeight: Number(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder={t('shop.filters.to')}
                value={filters.maxWeight === 100 ? '' : filters.maxWeight}
                onChange={(e) => setFilters((f) => ({ ...f, maxWeight: Number(e.target.value) || 100 }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(false)}
            className="w-full border border-amber-600 text-amber-700 py-2.5 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors md:hidden"
          >
            {t('shop.filters.apply')}
          </button>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {t('shop.sortBy')}:
              </span>
              {(['popular', 'newest', 'priceAsc', 'priceDesc', 'weight'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setFilters((f) => ({ ...f, sortBy: sort }))}
                  className={`text-sm transition-colors ${
                    filters.sortBy === sort ? 'text-amber-700 font-medium' : 'text-gray-500 hover:text-amber-700'
                  }`}
                >
                  {t(`shop.${sort}`)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {t('shop.totalItems', { count: filtered.length })}
              </span>
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden p-2 border border-gray-200 rounded-lg"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">{t('shop.noProducts')}</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
