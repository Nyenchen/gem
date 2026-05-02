'use client';

import { Product } from '@/lib/types';
import { useLocale } from './LocaleProvider';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const gemColors: Record<string, string> = {
  blue: 'from-blue-400 to-blue-600',
  red: 'from-red-400 to-red-600',
  green: 'from-emerald-400 to-emerald-600',
  yellow: 'from-yellow-300 to-amber-500',
  purple: 'from-purple-400 to-purple-600',
  pink: 'from-pink-300 to-pink-500',
  bicolor: 'from-teal-400 via-purple-400 to-pink-400',
  white: 'from-gray-200 to-gray-400',
  orange: 'from-orange-300 to-orange-500',
};

export default function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLocale();

  const gradient = gemColors[product.color] || 'from-gray-300 to-gray-500';
  const hasImage = product.images && product.images.length > 0;

  return (
    <Link href={`/shop/${product.id}`} className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 block">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name[locale]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${gradient} shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`} />
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded">
              {t('shop.badge.new')}
            </span>
          )}
          {product.isRare && (
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded">
              {t('shop.badge.rare')}
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
              {t('shop.badge.sale')}
            </span>
          )}
        </div>

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-amber-50"
        >
          <ShoppingBag size={18} className="text-amber-700" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm text-gray-700 font-medium leading-snug mb-1 line-clamp-2">
          {product.name[locale]}
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          {product.weight} {t('shop.carat')}
        </p>
        <div className="flex items-baseline gap-2">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ¥{product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-lg font-semibold text-amber-700">
            ¥{product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
