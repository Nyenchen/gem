'use client';

import { useLocale } from './LocaleProvider';
import { usePathname, useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, Settings, X, Eye, EyeOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Footer() {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setPassword('');
      setError('');
      setShowPw(false);
    }
  }, [showModal]);

  if (pathname.startsWith('/admin')) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setShowModal(false);
      router.push('/admin');
    } else {
      setError('密码错误');
      setPassword('');
      inputRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl tracking-widest text-gray-800 font-light italic mb-4">gemlovers</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-4 tracking-wide">{t('footer.contact')}</h4>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Mail size={14} />
                  <span>contact@gemlovers.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} />
                  <span>+86 21 6888 8888</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={14} />
                  <span>{t('about.contact.addressValue')}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-4 tracking-wide">{t('footer.followUs')}</h4>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span className="hover:text-amber-700 cursor-pointer">WeChat</span>
                <span className="hover:text-amber-700 cursor-pointer">Instagram</span>
                <span className="hover:text-amber-700 cursor-pointer">Facebook</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-400">{t('footer.rights')}</span>
            {/* Hidden admin entry — tiny gear icon */}
            <button
              onClick={() => setShowModal(true)}
              className="ml-3 text-gray-200 hover:text-gray-300 transition-colors"
              aria-label=""
            >
              <Settings size={12} />
            </button>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="密码"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-amber-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    验证中
                  </span>
                ) : '进入'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
