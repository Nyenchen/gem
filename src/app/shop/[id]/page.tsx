'use client';

import { useLocale } from '@/components/LocaleProvider';
import { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Heart, Shield, Gem, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import { getEmbedUrl, getVideoPlatform } from '@/lib/video';

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

export default function ProductDetail() {
  const { locale, t } = useLocale();
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((products: Product[]) => {
        const found = products.find((p) => p.id === params.id);
        if (found) setProduct(found);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400 mb-4">商品不存在</p>
        <Link href="/shop" className="text-amber-700 hover:underline">返回商城</Link>
      </div>
    );
  }

  const gradient = gemColors[product.color] || 'from-gray-300 to-gray-500';
  const images = product.images.length > 0 ? product.images : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-amber-700 transition-colors">{locale === 'zh' ? '首页' : 'Home'}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-amber-700 transition-colors">{t('nav.shop')}</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{product.name[locale]}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
            {images ? (
              <>
                <img
                  src={images[activeImage]}
                  alt={product.name[locale]}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className={`w-56 h-56 rounded-full bg-gradient-to-br ${gradient} shadow-2xl opacity-90`} />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isNew && (
                <span className="bg-amber-600 text-white text-xs px-2.5 py-1 rounded-full">
                  {t('shop.badge.new')}
                </span>
              )}
              {product.isRare && (
                <span className="bg-rose-500 text-white text-xs px-2.5 py-1 rounded-full">
                  {t('shop.badge.rare')}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images && images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-amber-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-light text-gray-800 leading-snug mb-3">
            {product.name[locale]}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {t(`shop.categories.${product.category}`)}
            </span>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {t(`shop.cuts.${product.cut}`)}
            </span>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {product.weight} {t('shop.carat')}
            </span>
          </div>

          {/* Price */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-baseline gap-3">
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ¥{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-4xl font-light text-amber-700">
                ¥{product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description[locale]}
          </p>

          {/* Specs Table */}
          <div className="bg-stone-50 rounded-xl p-5 mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              {locale === 'zh' ? '宝石参数' : 'Gem Specifications'}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: locale === 'zh' ? '类型' : 'Type', value: t(`shop.categories.${product.category}`) },
                { label: locale === 'zh' ? '切割' : 'Cut', value: t(`shop.cuts.${product.cut}`) },
                { label: locale === 'zh' ? '重量' : 'Weight', value: `${product.weight} ct` },
                { label: locale === 'zh' ? '颜色' : 'Color', value: product.color },
              ].map((spec) => (
                <div key={spec.label} className="flex justify-between">
                  <span className="text-gray-400">{spec.label}</span>
                  <span className="text-gray-700 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button className="flex-1 flex items-center justify-center gap-2 bg-amber-700 text-white py-3.5 rounded-full text-sm font-medium hover:bg-amber-800 transition-colors">
              <ShoppingBag size={18} />
              {t('shop.addToCart')}
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full hover:border-amber-400 hover:text-amber-700 transition-colors">
              <Heart size={18} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            {[
              { icon: Shield, text: locale === 'zh' ? '附带鉴定证书' : 'Certified Authentic' },
              { icon: Gem, text: locale === 'zh' ? '天然未处理' : 'Natural & Untreated' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                <item.icon size={14} className="text-amber-600 shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player */}
      {product.videoUrl && getEmbedUrl(product.videoUrl) && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Play size={16} className="text-amber-700" />
            <h2 className="text-base font-medium text-gray-700">
              {locale === 'zh' ? '商品视频' : 'Product Video'}
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {getVideoPlatform(product.videoUrl) === 'youtube' ? 'YouTube' : 'Bilibili'}
            </span>
          </div>
          <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getEmbedUrl(product.videoUrl)!}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft size={16} />
          {locale === 'zh' ? '返回商城' : 'Back to Shop'}
        </button>
      </div>
    </div>
  );
}
