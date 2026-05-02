'use client';

import { useLocale } from '@/components/LocaleProvider';
import { Product } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Upload, X, Image as ImageIcon, LogOut, Settings } from 'lucide-react';

const categories = [
  'sapphire', 'ruby', 'emerald', 'tanzanite', 'tourmaline',
  'spinel', 'garnet', 'topaz', 'alexandrite', 'amethyst',
  'aquamarine', 'beryl', 'opal',
];

const cutOptions = [
  'cushion', 'oval', 'radiant', 'pear', 'asscher', 'heart',
  'round', 'emerald', 'cabochon', 'trillion', 'fancy',
];

const colorOptions = [
  'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'bicolor', 'white', 'orange',
];

const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: { zh: '', en: '' },
  description: { zh: '', en: '' },
  price: 0,
  weight: 0,
  category: 'sapphire',
  cut: 'cushion',
  color: 'blue',
  images: [],
  videoUrl: '',
  featured: false,
  isNew: false,
  isRare: false,
};

interface SiteSettings {
  hero: {
    bannerImage: string;
    titleZh: string;
    titleEn: string;
    subtitleZh: string;
    subtitleEn: string;
  };
  about: {
    profileImage: string;
    storyZh: string[];
    storyEn: string[];
    stats: { num: string; labelZh: string; labelEn: string }[];
  };
  contact: {
    email: string;
    phone: string;
    addressZh: string;
    addressEn: string;
    wechat: string;
    wechatQR: string;
    instagram: string;
    weibo: string;
  };
}

const defaultSettings: SiteSettings = {
  hero: { bannerImage: '', titleZh: '', titleEn: '', subtitleZh: '', subtitleEn: '' },
  about: {
    profileImage: '',
    storyZh: ['', '', ''],
    storyEn: ['', '', ''],
    stats: [
      { num: '', labelZh: '', labelEn: '' },
      { num: '', labelZh: '', labelEn: '' },
      { num: '', labelZh: '', labelEn: '' },
    ],
  },
  contact: { email: '', phone: '', addressZh: '', addressEn: '', wechat: '', wechatQR: '', instagram: '', weibo: '' },
};

export default function Admin() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [tab, setTab] = useState<'products' | 'settings'>('products');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingWechatQR, setUploadingWechatQR] = useState(false);

  const loadProducts = () => {
    fetch('/api/products').then((r) => r.json()).then(setProducts);
  };

  const loadSettings = () => {
    fetch('/api/settings').then((r) => r.json()).then((data: SiteSettings) => {
      setSettings({
        hero: { ...defaultSettings.hero, ...data.hero },
        about: {
          profileImage: data.about?.profileImage ?? '',
          storyZh: data.about?.storyZh ?? ['', '', ''],
          storyEn: data.about?.storyEn ?? ['', '', ''],
          stats: data.about?.stats ?? defaultSettings.about.stats,
        },
        contact: { ...defaultSettings.contact, ...data.contact },
      });
    });
  };

  useEffect(() => { loadProducts(); loadSettings(); }, []);

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  // Product handlers
  const handleNew = () => {
    setEditing({ ...emptyProduct, id: '', createdAt: new Date().toISOString().split('T')[0] } as Product);
    setIsNew(true);
  };
  const handleEdit = (product: Product) => { setEditing({ ...product }); setIsNew(false); };
  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.form.confirmDelete'))) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    loadProducts();
  };
  const handleSave = async () => {
    if (!editing) return;
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    loadProducts();
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    setEditing({ ...editing, images: [...editing.images, url] });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };
  const removeImage = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, images: editing.images.filter((_, i) => i !== index) });
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSettingsSaving(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const uploadImage = async (
    file: File,
    setLoading: (v: boolean) => void,
    onUrl: (url: string) => void,
  ) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    onUrl(url);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg tracking-widest text-gray-700 font-light italic">gemlovers</span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-sm text-gray-500">{t('admin.title')}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-amber-700 transition-colors">
            {locale === 'zh' ? '查看网站' : 'View Site'} ↗
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
            {locale === 'zh' ? '退出登录' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex gap-0">
          <button
            onClick={() => setTab('products')}
            className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'products' ? 'border-amber-600 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {locale === 'zh' ? '商品管理' : 'Products'}
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'settings' ? 'border-amber-600 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Settings size={14} />
            {locale === 'zh' ? '网站设置' : 'Site Settings'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-light text-gray-800">{t('admin.productList')}</h1>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 bg-amber-700 text-white px-5 py-2.5 rounded-full text-sm hover:bg-amber-800 transition-colors"
              >
                <Plus size={16} />
                {t('admin.addProduct')}
              </button>
            </div>

            {/* Edit Modal */}
            {editing && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-800">
                      {isNew ? t('admin.addProduct') : t('admin.editProduct')}
                    </h2>
                    <button onClick={() => setEditing(null)}>
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.nameZh')}</label>
                        <input type="text" value={editing.name.zh}
                          onChange={(e) => setEditing({ ...editing, name: { ...editing.name, zh: e.target.value } })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.nameEn')}</label>
                        <input type="text" value={editing.name.en}
                          onChange={(e) => setEditing({ ...editing, name: { ...editing.name, en: e.target.value } })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">{t('admin.form.descZh')}</label>
                      <textarea value={editing.description.zh} rows={2}
                        onChange={(e) => setEditing({ ...editing, description: { ...editing.description, zh: e.target.value } })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">{t('admin.form.descEn')}</label>
                      <textarea value={editing.description.en} rows={2}
                        onChange={(e) => setEditing({ ...editing, description: { ...editing.description, en: e.target.value } })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.price')}</label>
                        <input type="number" value={editing.price}
                          onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.originalPrice')}</label>
                        <input type="number" value={editing.originalPrice || ''}
                          onChange={(e) => setEditing({ ...editing, originalPrice: Number(e.target.value) || undefined })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.weight')}</label>
                        <input type="number" step="0.01" value={editing.weight}
                          onChange={(e) => setEditing({ ...editing, weight: Number(e.target.value) })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.category')}</label>
                        <select value={editing.category}
                          onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                          {categories.map((c) => <option key={c} value={c}>{t(`shop.categories.${c}`)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.cut')}</label>
                        <select value={editing.cut}
                          onChange={(e) => setEditing({ ...editing, cut: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                          {cutOptions.map((c) => <option key={c} value={c}>{t(`shop.cuts.${c}`)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">{t('admin.form.color')}</label>
                        <select value={editing.color}
                          onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                          {colorOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-600">{t('admin.form.images')} <span className="text-gray-400">（最多5张）</span></label>
                        <span className="text-xs text-gray-400">{editing.images.length}/5</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const img = editing.images[i];
                          return img ? (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => removeImage(i)}
                                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                <X size={10} />
                              </button>
                              {i === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-black/40 py-0.5">封面</span>
                              )}
                            </div>
                          ) : (
                            <label key={i} className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                              editing.images.length >= 5 ? 'border-gray-100 cursor-not-allowed opacity-40' : 'border-gray-200 hover:border-amber-400'
                            }`}>
                              {uploading && i === editing.images.length ? (
                                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Upload size={16} className="text-gray-300" />
                                  <span className="text-xs text-gray-300 mt-1">上传</span>
                                </>
                              )}
                              <input ref={i === editing.images.length ? fileRef : undefined}
                                type="file" accept="image/*" className="hidden"
                                disabled={editing.images.length >= 5} onChange={handleUpload} />
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">第一张为商品封面图，建议上传正方形图片</p>
                    </div>

                    {/* Video URL */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        视频链接 <span className="text-gray-400 font-normal">（YouTube / Bilibili，选填）</span>
                      </label>
                      <input type="url" value={editing.videoUrl || ''}
                        onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... 或 https://www.bilibili.com/video/BV..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>

                    {/* Flags */}
                    <div className="flex gap-6">
                      {([['featured', t('admin.form.featured')], ['isNew', t('admin.form.isNew')], ['isRare', t('admin.form.isRare')]] as const).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={Boolean(editing[key as keyof Product])}
                            onChange={(e) => setEditing({ ...editing, [key]: e.target.checked })}
                            className="accent-amber-700" />
                          <span className="text-gray-600">{label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button onClick={handleSave}
                        className="flex-1 bg-amber-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors">
                        {t('admin.form.save')}
                      </button>
                      <button onClick={() => setEditing(null)}
                        className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        {t('admin.form.cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Table */}
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <ImageIcon className="mx-auto mb-4" size={48} strokeWidth={1} />
                <p>{t('admin.noProducts')}</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t('admin.form.images')}</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t('admin.form.nameZh')}</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t('admin.form.category')}</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t('admin.form.weight')}</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t('admin.form.price')}</th>
                      <th className="text-right text-xs font-medium text-gray-500 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          {product.images.length > 0 ? (
                            <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ImageIcon size={16} className="text-gray-300" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-800 font-medium">{product.name[locale]}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{product.name[locale === 'zh' ? 'en' : 'zh']}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{t(`shop.categories.${product.category}`)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.weight} ct</td>
                        <td className="px-4 py-3 text-sm font-medium text-amber-700">¥{product.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(product)}
                              className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(product.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div className="max-w-2xl space-y-10">

            {/* Hero Banner */}
            <section>
              <h2 className="text-base font-medium text-gray-700 mb-5 pb-2 border-b border-gray-100">
                🏠 {locale === 'zh' ? '首页 Banner' : 'Homepage Banner'}
              </h2>
              <div className="space-y-4">
                {/* Banner image */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {locale === 'zh' ? 'Banner 图片' : 'Banner Image'}
                  </label>
                  <div className="flex items-center gap-4">
                    {settings.hero.bannerImage ? (
                      <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-gray-200">
                        <img src={settings.hero.bannerImage} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setSettings({ ...settings, hero: { ...settings.hero, bannerImage: '' } })}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-48 h-28 rounded-lg border-2 border-dashed border-gray-200 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
                        {uploadingBanner ? (
                          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload size={20} className="text-gray-300" />
                            <span className="text-xs text-gray-300 mt-1">{locale === 'zh' ? '上传图片' : 'Upload'}</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file, setUploadingBanner, (url) =>
                            setSettings({ ...settings, hero: { ...settings.hero, bannerImage: url } }));
                        }} />
                      </label>
                    )}
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {locale === 'zh' ? '建议尺寸 1600×600px\n不上传则显示渐变背景' : 'Recommended 1600×600px\nLeave empty to show gradient'}
                    </p>
                  </div>
                </div>
                {/* Title */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '标题（中文）' : 'Title (Chinese)'}</label>
                    <input type="text" value={settings.hero.titleZh}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, titleZh: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '标题（英文）' : 'Title (English)'}</label>
                    <input type="text" value={settings.hero.titleEn}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, titleEn: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                </div>
                {/* Subtitle */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '副标题（中文）' : 'Subtitle (Chinese)'}</label>
                    <textarea rows={2} value={settings.hero.subtitleZh}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitleZh: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '副标题（英文）' : 'Subtitle (English)'}</label>
                    <textarea rows={2} value={settings.hero.subtitleEn}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitleEn: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-base font-medium text-gray-700 mb-5 pb-2 border-b border-gray-100">
                👤 {locale === 'zh' ? '关于我 页面' : 'About Page'}
              </h2>
              <div className="space-y-4">
                {/* Profile image */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {locale === 'zh' ? '个人/店铺头像' : 'Profile / Shop Photo'}
                  </label>
                  <div className="flex items-center gap-4">
                    {settings.about.profileImage ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                        <img src={settings.about.profileImage} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setSettings({ ...settings, about: { ...settings.about, profileImage: '' } })}
                          className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-24 h-24 rounded-full border-2 border-dashed border-gray-200 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
                        {uploadingProfile ? (
                          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload size={16} className="text-gray-300" />
                            <span className="text-xs text-gray-300 mt-1">{locale === 'zh' ? '上传' : 'Upload'}</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file, setUploadingProfile, (url) =>
                            setSettings({ ...settings, about: { ...settings.about, profileImage: url } }));
                        }} />
                      </label>
                    )}
                    <p className="text-xs text-gray-400">{locale === 'zh' ? '建议正方形图片' : 'Square image recommended'}</p>
                  </div>
                </div>

                {/* Story paragraphs */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {locale === 'zh' ? '故事/简介段落（中文）' : 'Story Paragraphs (Chinese)'}
                  </label>
                  {settings.about.storyZh.map((para, i) => (
                    <textarea key={i} rows={2} value={para}
                      onChange={(e) => {
                        const arr = [...settings.about.storyZh];
                        arr[i] = e.target.value;
                        setSettings({ ...settings, about: { ...settings.about, storyZh: arr } });
                      }}
                      placeholder={`第 ${i + 1} 段`}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 mb-2" />
                  ))}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {locale === 'zh' ? '故事/简介段落（英文）' : 'Story Paragraphs (English)'}
                  </label>
                  {settings.about.storyEn.map((para, i) => (
                    <textarea key={i} rows={2} value={para}
                      onChange={(e) => {
                        const arr = [...settings.about.storyEn];
                        arr[i] = e.target.value;
                        setSettings({ ...settings, about: { ...settings.about, storyEn: arr } });
                      }}
                      placeholder={`Paragraph ${i + 1}`}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 mb-2" />
                  ))}
                </div>

                {/* Stats */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {locale === 'zh' ? '数据展示（如 500+ 精选宝石）' : 'Stats (e.g. 500+ Curated Gems)'}
                  </label>
                  <div className="space-y-2">
                    {settings.about.stats.map((stat, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2">
                        <input type="text" value={stat.num} placeholder={locale === 'zh' ? '数值' : 'Number'}
                          onChange={(e) => {
                            const arr = [...settings.about.stats];
                            arr[i] = { ...arr[i], num: e.target.value };
                            setSettings({ ...settings, about: { ...settings.about, stats: arr } });
                          }}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                        <input type="text" value={stat.labelZh} placeholder={locale === 'zh' ? '标签（中）' : 'Label ZH'}
                          onChange={(e) => {
                            const arr = [...settings.about.stats];
                            arr[i] = { ...arr[i], labelZh: e.target.value };
                            setSettings({ ...settings, about: { ...settings.about, stats: arr } });
                          }}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                        <input type="text" value={stat.labelEn} placeholder="Label EN"
                          onChange={(e) => {
                            const arr = [...settings.about.stats];
                            arr[i] = { ...arr[i], labelEn: e.target.value };
                            setSettings({ ...settings, about: { ...settings.about, stats: arr } });
                          }}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-base font-medium text-gray-700 mb-5 pb-2 border-b border-gray-100">
                📬 {locale === 'zh' ? '联系方式' : 'Contact Info'}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '邮箱' : 'Email'}</label>
                    <input type="email" value={settings.contact.email}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '电话' : 'Phone'}</label>
                    <input type="text" value={settings.contact.phone}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '地址（中文）' : 'Address (Chinese)'}</label>
                    <input type="text" value={settings.contact.addressZh}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, addressZh: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '地址（英文）' : 'Address (English)'}</label>
                    <input type="text" value={settings.contact.addressEn}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, addressEn: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                </div>

                {/* WeChat */}
                <div className="bg-green-50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">💬 WeChat</h3>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '微信号' : 'WeChat ID'}</label>
                    <input type="text" value={settings.contact.wechat}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, wechat: e.target.value } })}
                      placeholder="your_wechat_id"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">{locale === 'zh' ? '微信二维码' : 'WeChat QR Code'}</label>
                    <div className="flex items-center gap-4">
                      {settings.contact.wechatQR ? (
                        <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-white">
                          <img src={settings.contact.wechatQR} alt="WeChat QR" className="w-full h-full object-contain p-1" />
                          <button
                            onClick={() => setSettings({ ...settings, contact: { ...settings.contact, wechatQR: '' } })}
                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-28 h-28 rounded-lg border-2 border-dashed border-green-200 hover:border-green-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                          {uploadingWechatQR ? (
                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Upload size={16} className="text-gray-300" />
                              <span className="text-xs text-gray-300 mt-1">{locale === 'zh' ? '上传二维码' : 'Upload QR'}</span>
                            </>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(file, setUploadingWechatQR, (url) =>
                              setSettings({ ...settings, contact: { ...settings.contact, wechatQR: url } }));
                          }} />
                        </label>
                      )}
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {locale === 'zh' ? '上传微信收款码或\n好友添加二维码' : 'Upload your WeChat\nQR code for contact'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Instagram</label>
                    <input type="text" value={settings.contact.instagram}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, instagram: e.target.value } })}
                      placeholder="@username"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{locale === 'zh' ? '微博' : 'Weibo'}</label>
                    <input type="text" value={settings.contact.weibo}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, weibo: e.target.value } })}
                      placeholder="@weibo_username"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* Save button */}
            <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6">
              <button
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                className="w-full bg-amber-700 text-white py-3 rounded-full text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-60"
              >
                {settingsSaving
                  ? (locale === 'zh' ? '保存中...' : 'Saving...')
                  : settingsSaved
                  ? (locale === 'zh' ? '✓ 已保存' : '✓ Saved')
                  : (locale === 'zh' ? '保存所有设置' : 'Save All Settings')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
