import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Shield } from 'lucide-react';
import { useEstate } from '../../lib/estateContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, isAdmin } = useEstate();

  return (
    <footer className="bg-[#20201E] text-[#FAF9F6] pt-20 pb-12 border-t border-[#20201E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#73716B]/30">
          {/* Estate Brand & Philosophy */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="font-serif text-2xl lg:text-3xl tracking-[0.2em] uppercase block">
                {settings.business_name}
              </span>
              <span className="font-sans text-[10px] tracking-[0.25em] text-[#B7B0A4] uppercase block mt-1">
                Haras Privé & Sanctuaire d'Excellence · Normandie
              </span>
            </div>

            <p className="text-[#B7B0A4] font-serif italic text-lg leading-relaxed max-w-md">
              "{settings.footer_text}"
            </p>

            <p className="text-sm text-[#73716B] leading-relaxed max-w-md">
              A private stud farm in the heart of the Pays d'Auge dedicated to the disciplined breeding of high-performance Warmblood sport horses and equine rehabilitation.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-medium">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B7B0A4]">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  Our Heritage & Estate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/horses')}
                  className="hover:text-white transition-colors"
                >
                  Available Sport Horses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/rescue')}
                  className="hover:text-white transition-colors"
                >
                  Sanctuary & Rescue Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/journal')}
                  className="hover:text-white transition-colors"
                >
                  The Estate Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Private Enquiries & Viewings
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Visiting */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-medium">
              Private Viewings & Contact
            </h4>

            <div className="space-y-3 text-sm text-[#B7B0A4]">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#A89472] shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.country}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#A89472] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#A89472] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#73716B] leading-relaxed">
              <span className="block text-[#B7B0A4] font-medium mb-0.5">Visiting Protocol:</span>
              {settings.visiting_hours}
            </div>

            {/* Social icons */}
            <div className="pt-4 flex items-center space-x-4 text-[#B7B0A4]">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Montrose Instagram"
                  className="p-1.5 hover:text-[#FAF9F6] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Montrose Facebook"
                  className="p-1.5 hover:text-[#FAF9F6] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Montrose YouTube"
                  className="p-1.5 hover:text-[#FAF9F6] transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Estate Office */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#73716B] space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('/privacy')}
              className="hover:text-[#B7B0A4] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-[#B7B0A4] transition-colors"
            >
              Terms of Visitation
            </button>
            <button
              onClick={() => onNavigate(isAdmin ? '/admin' : '/admin/login')}
              className="inline-flex items-center gap-1 hover:text-[#B7B0A4] transition-colors"
            >
              <Shield className="w-3 h-3 text-[#A89472]" />
              <span>Estate Office</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
