'use client';

import { useLocale } from '@/components/LocaleProvider';
import { Shield, Leaf, BookOpen, Palette, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SiteSettings {
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

const defaultStoryZh = [
  '我们是一家专注于稀有宝石的精品商店，致力于为收藏家和珠宝爱好者提供世界上最美丽、最珍贵的天然宝石。',
  '我们的团队由资深宝石学家和珠宝专家组成，每一颗宝石都经过严格的筛选和鉴定，确保品质卓越。',
  '从非洲的坦桑石矿到斯里兰卡的蓝宝石产地，我们直接从源头采购，为客户提供最优质、最具性价比的选择。',
];
const defaultStoryEn = [
  'We are a boutique gemstone shop specializing in rare gems, dedicated to providing collectors and jewelry enthusiasts with the most beautiful and precious natural gemstones in the world.',
  'Our team consists of senior gemologists and jewelry experts. Every gemstone undergoes rigorous selection and certification to ensure exceptional quality.',
  'From tanzanite mines in Africa to sapphire sources in Sri Lanka, we source directly from the origin to offer our clients the finest gems at the best value.',
];
const defaultStats = [
  { num: '500+', labelZh: '精选宝石', labelEn: 'Curated Gems' },
  { num: '15+', labelZh: '年行业经验', labelEn: 'Years Experience' },
  { num: '30+', labelZh: '国家和地区', labelEn: 'Countries & Regions' },
];

export default function About() {
  const { locale, t } = useLocale();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings);
  }, []);

  const values = [
    { icon: Shield, title: t('about.values.authenticity'), desc: t('about.values.authenticityDesc'), color: 'bg-blue-50 text-blue-600' },
    { icon: Leaf, title: t('about.values.ethics'), desc: t('about.values.ethicsDesc'), color: 'bg-green-50 text-green-600' },
    { icon: BookOpen, title: t('about.values.expertise'), desc: t('about.values.expertiseDesc'), color: 'bg-purple-50 text-purple-600' },
    { icon: Palette, title: t('about.values.customization'), desc: t('about.values.customizationDesc'), color: 'bg-amber-50 text-amber-600' },
  ];

  const story = locale === 'zh'
    ? (settings?.about?.storyZh?.filter(Boolean).length ? settings.about.storyZh : defaultStoryZh)
    : (settings?.about?.storyEn?.filter(Boolean).length ? settings.about.storyEn : defaultStoryEn);

  const stats = settings?.about?.stats?.filter((s) => s.num) ?? defaultStats;

  const contact = settings?.contact;
  const email = contact?.email || 'contact@gemlovers.com';
  const phone = contact?.phone || '+86 21 6888 8888';
  const address = locale === 'zh'
    ? (contact?.addressZh || t('about.contact.addressValue'))
    : (contact?.addressEn || t('about.contact.addressValue'));

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-100 to-amber-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {settings?.about?.profileImage && (
            <img
              src={settings.about.profileImage}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-lg"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">{t('about.title')}</h1>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto" />
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light text-gray-800 mb-8">{t('about.story.title')}</h2>
        <div className="space-y-5 text-gray-600 leading-relaxed">
          {story.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-8 mt-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-light text-amber-700 mb-1">{stat.num}</div>
                <div className="text-sm text-gray-400">
                  {locale === 'zh' ? stat.labelZh : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Values */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-light text-gray-800 mb-10 text-center">{t('about.values.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${v.color} flex items-center justify-center shrink-0`}>
                  <v.icon size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light text-gray-800 mb-8 text-center">{t('about.contact.title')}</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Mail, label: t('about.contact.email'), value: email },
            { icon: Phone, label: t('about.contact.phone'), value: phone },
            { icon: MapPin, label: t('about.contact.address'), value: address },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-stone-50">
              <item.icon className="mx-auto mb-3 text-amber-600" size={28} strokeWidth={1.5} />
              <div className="text-xs text-gray-400 mb-1">{item.label}</div>
              <div className="text-sm text-gray-700">{item.value}</div>
            </div>
          ))}
        </div>

        {/* WeChat block */}
        {(contact?.wechat || contact?.wechatQR) && (
          <div className="bg-green-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-green-600" size={28} strokeWidth={1.5} />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">WeChat</div>
                {contact.wechat && <div className="text-sm font-medium text-gray-700">{contact.wechat}</div>}
              </div>
            </div>
            {contact.wechatQR && (
              <div className="flex flex-col items-center gap-2">
                <img src={contact.wechatQR} alt="WeChat QR" className="w-28 h-28 object-contain rounded-lg bg-white p-1 shadow-sm" />
                <span className="text-xs text-gray-400">{locale === 'zh' ? '扫码添加微信' : 'Scan to add WeChat'}</span>
              </div>
            )}
          </div>
        )}

        {/* Social links */}
        {(contact?.instagram || contact?.weibo) && (
          <div className="flex justify-center gap-6 mt-6">
            {contact.instagram && (
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Instagram</div>
                <div className="text-sm text-gray-700">{contact.instagram}</div>
              </div>
            )}
            {contact.weibo && (
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">{locale === 'zh' ? '微博' : 'Weibo'}</div>
                <div className="text-sm text-gray-700">{contact.weibo}</div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
