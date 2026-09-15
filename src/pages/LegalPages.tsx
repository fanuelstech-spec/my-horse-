import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useEstate } from '../lib/estateContext';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  const { settings } = useEstate();

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-10">
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </button>

      <div className="space-y-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-semibold">
          Estate Governance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#20201E] font-normal">
          Confidentiality & Privacy Policy
        </h1>
        <p className="text-xs text-[#73716B]">
          Last revised: January 2026 · {settings.business_name}
        </p>
      </div>

      <div className="prose prose-neutral text-xs sm:text-sm text-[#73716B] leading-relaxed space-y-6 font-light">
        <p>
          At {settings.business_name}, we treat all client correspondence, acquisition inquiries, and veterinary discussions with utmost discretion. As a private equestrian estate serving international clientele, privacy is paramount.
        </p>

        <h2 className="font-serif text-xl text-[#20201E] font-normal pt-4">
          1. Data Collection & Use
        </h2>
        <p>
          Information submitted via our contact forms (including names, contact numbers, email addresses, and equestrian preferences) is retained exclusively for the purpose of communicating regarding horse viewings, veterinary records, or sanctuary adoptions. We never sell, lease, or share personal data with third-party marketing entities.
        </p>

        <h2 className="font-serif text-xl text-[#20201E] font-normal pt-4">
          2. Acquisition Records
        </h2>
        <p>
          Ownership transfers and studbook passport updates comply strictly with the Fédération Française d'Équitation (FFE), IFCE (Institut Français du Cheval et de l'Équitation), and corresponding international breed registries (KWPN, Selle Français, Hannoveraner Verband).
        </p>

        <h2 className="font-serif text-xl text-[#20201E] font-normal pt-4">
          3. Contact for Inquiries
        </h2>
        <p>
          Questions regarding data retention may be addressed directly to our estate office at {settings.email}.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  const { settings } = useEstate();

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-10">
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </button>

      <div className="space-y-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-semibold">
          Estate Protocols
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#20201E] font-normal">
          Terms of Visitation & Acquisition
        </h1>
        <p className="text-xs text-[#73716B]">
          Last revised: January 2026 · {settings.business_name}
        </p>
      </div>

      <div className="prose prose-neutral text-xs sm:text-sm text-[#73716B] leading-relaxed space-y-6 font-light">
        <p>
          All visitors to {settings.business_name} agree to abide by established estate bio-security protocols and safety standards designed to protect our breeding stock and rehabilitation horses.
        </p>

        <h2 className="font-serif text-xl text-[#20201E] font-normal pt-4">
          1. Appointment Requirement
        </h2>
        <p>
          The estate is a private working facility. Unscheduled visits cannot be accommodated. Confirmed appointments must be arranged at least 48 hours in advance via our concierge.
        </p>

        <h2 className="font-serif text-xl text-[#20201E] font-normal pt-4">
          2. Trial Rides & Safety
        </h2>
        <p>
          Prospective buyers participating in under-saddle evaluations must possess suitable riding attire, certified protective headgear, and current personal equestrian liability insurance.
        </p>

        <h2 className="font-serif text-xl text-[#20201E] font-normal pt-4">
          3. Veterinary Examination
        </h2>
        <p>
          Pre-purchase examinations (PPE) may be conducted by any independent licensed veterinarian chosen by the prospective purchaser at our dedicated veterinary examination bay.
        </p>
      </div>
    </div>
  );
};
