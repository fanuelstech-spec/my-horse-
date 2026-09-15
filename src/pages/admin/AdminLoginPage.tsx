import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useEstate } from '../../lib/estateContext';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { loginAsAdmin, isConfiguredWithSupabase } = useEstate();
  const [email, setEmail] = useState('admin@montrose-equestrian.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await loginAsAdmin(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onNavigate('/admin');
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    await loginAsAdmin('director@montrose-equestrian.com');
    setIsSubmitting(false);
    onNavigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-16 bg-[#FAF9F6]">
      <div className="w-full max-w-md space-y-8">
        {/* Back to public */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#20201E] text-[#FAF9F6] mx-auto flex items-center justify-center rounded-none shadow-sm">
            <Shield className="w-5 h-5 text-[#A89472]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold block">
            Private Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal">
            Estate Office Sign In
          </h1>
          <p className="text-xs text-[#73716B]">
            Authorized personnel management for Montrose Equestrian Estate
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#B7B0A4]/40 p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#73716B] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#73716B] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isConfiguredWithSupabase ? 'Supabase password...' : 'Demo mode password (optional)'}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1a2820] transition-colors disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Authenticating...' : 'Enter Estate Office'}
            </button>
          </form>

          {/* Instant Demo Access Button */}
          {!isConfiguredWithSupabase && (
            <div className="pt-4 border-t border-[#B7B0A4]/25 text-center">
              <p className="text-[11px] text-[#73716B] mb-3">
                Previewing the estate administration?
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-[#FAF9F6] border border-[#B7B0A4]/50 text-xs uppercase tracking-wider text-[#20201E] hover:bg-white transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>Instant Estate Director Demo Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
