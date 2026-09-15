import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useEstate } from '../lib/estateContext';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useEstate();

  const values = [
    {
      title: 'Biomechanical Integrity',
      desc: 'We prioritize skeletal structure, clear joint angles, and natural elasticity over fashion trends.',
    },
    {
      title: 'Unhurried Maturation',
      desc: 'No horse leaves the pasture for rigorous under-saddle training before physical readiness.',
    },
    {
      title: 'Lifelong Stewardship',
      desc: 'Every horse bearing the Sterling brand retains a perpetual open door to our sanctuary if life circumstances change.',
    },
    {
      title: 'Sovereign Temperament',
      desc: 'Generous heart and tranquil stable disposition are non-negotiable criteria for our broodmare herd.',
    },
  ];

  const team = [
    {
      name: 'Henri Sterling',
      role: 'Master Breeder & Estate Founder',
      bio: 'Fourth-generation horseman raised in the Calvados equine tradition, dedicating forty years to classical Warmblood genetics and ethical stewardship.',
      image: '/images/staff.jpg',
    },
    {
      name: 'Claire Laurent',
      role: 'Director of Classical Training',
      bio: 'Former national dressage competitor educated at Saumur, emphasizing balance, contact without tension, and customized progression.',
      image: '/images/staff.jpg',
    },
    {
      name: 'Dr. Édouard Valois',
      role: 'Resident Equine Veterinary Surgeon',
      bio: 'Specialist in equine sports physiology and preventative orthopedics, supervising daily herd health, radiographs, and our rehab center.',
      image: '/images/staff.jpg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-28 lg:space-y-36">
      {/* 1. HERO / TITLE */}
      <section className="max-w-4xl space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
          Heritage & Horizon
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#20201E] font-normal leading-[1.12]">
          Four decades devoted to the harmony of temperament, beauty, and noble sport.
        </h1>
        <p className="font-sans text-base sm:text-lg text-[#73716B] leading-relaxed font-light">
          Located in the heart of Normandy’s Pays d'Auge, Sterling represents a rare continuity between old-world French equestrian craftsmanship and the modern science of equine welfare.
        </p>
      </section>

      {/* 2. OUR STORY & FOUNDATION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-medium">
            Our Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal">
            Rooted in the limestone soil of the Pays d'Auge.
          </h2>
          <div className="space-y-4 text-sm text-[#73716B] leading-relaxed font-light">
            <p>
              {settings.about_text}
            </p>
            <p>
              When Henri Sterling acquired the historic domaine in 1984, the vision was singular: to resist the prevailing industrialization of sport horse production and create an unhurried sanctuary where horses could mature according to their natural cadence.
            </p>
            <p>
              Today, the estate encompasses 180 hectares of chemical-free, mineral-rich pastures bordered by centuries-old oak hedgerows that provide natural shelter and biodiversity for our mares and growing youngsters.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 aspect-[4/3] overflow-hidden bg-white border border-[#B7B0A4]/35 shadow-sm">
          <img
            src="/images/hero.jpg"
            alt="Estate pasture in Normandy"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. BREEDING PHILOSOPHY & WELFARE */}
      <section className="bg-white border border-[#B7B0A4]/35 p-8 sm:p-14 lg:p-20">
        <div className="max-w-3xl space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-medium">
            Philosophy & Welfare
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal">
            The Sterling Standard: Welfare before commerce.
          </h2>
          <p className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
            We do not measure our success by the quantity of foals registered each spring, but by the physical and psychological condition of our horses in their teens and twenties.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {values.map((v, i) => (
              <div key={i} className="p-5 bg-[#FAF9F6] border border-[#B7B0A4]/30 space-y-2">
                <div className="flex items-center space-x-2 text-[#24362D]">
                  <Check className="w-4 h-4 text-[#A89472]" />
                  <h3 className="font-serif text-lg text-[#20201E]">{v.title}</h3>
                </div>
                <p className="text-xs text-[#73716B] leading-relaxed font-light">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ESTATE FACILITIES */}
      <section className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-medium">
            Estate Infrastructure
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal">
            Designed for equine health and classical excellence.
          </h2>
          <p className="text-sm text-[#73716B] font-light">
            Every building, paddock, and arena at Sterling is engineered around equine respiratory health, orthopedic safety, and natural social interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/30">
              <img
                src="/images/about.jpg"
                alt="Indoor arena"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-xl text-[#20201E]">Grand Indoor Arena</h3>
            <p className="text-xs text-[#73716B] leading-relaxed font-light">
              65m x 25m Olympic-specification footing with micro-wax silicate sand, dust-suppression watering systems, and natural clerestory lighting.
            </p>
          </div>

          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/30">
              <img
                src="/images/journal.jpg"
                alt="Estate Paddocks"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-xl text-[#20201E]">Herd Pastures & Shelter</h3>
            <p className="text-xs text-[#73716B] leading-relaxed font-light">
              Undulating 180 hectares partitioned into seasonal rotational paddocks with constant freshwater artesian wells and heavy timber loafing sheds.
            </p>
          </div>

          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/30">
              <img
                src="/images/dressage.jpg"
                alt="Veterinary and rehabilitation wing"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-xl text-[#20201E]">Rehabilitation & Hydrotherapy</h3>
            <p className="text-xs text-[#73716B] leading-relaxed font-light">
              Controlled-temperature aquatic treadmill, solarium therapy stalls, and rubberized rehabilitation paddocks for tender ligament recovery.
            </p>
          </div>
        </div>
      </section>

      {/* 5. TEAM */}
      <section className="space-y-10 border-t border-[#B7B0A4]/30 pt-16">
        <div className="max-w-2xl space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-medium">
            The Custodians
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal">
            People dedicated to the life of the horse.
          </h2>
          <p className="text-sm text-[#73716B] font-light">
            Our team brings together decades of horsemanship, veterinary science, and international competitive insight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((person, idx) => (
            <div key={idx} className="bg-white border border-[#B7B0A4]/30 p-6 space-y-4">
              <div className="aspect-[1/1] overflow-hidden bg-[#FAF9F6]">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#20201E]">{person.name}</h3>
                <p className="text-[11px] text-[#A89472] uppercase tracking-wider mt-0.5">
                  {person.role}
                </p>
              </div>
              <p className="text-xs text-[#73716B] leading-relaxed font-light">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="text-center bg-[#FAF9F6] border border-[#B7B0A4]/40 p-12 space-y-6">
        <h2 className="font-serif text-3xl text-[#20201E] font-normal">
          Experience the estate in person.
        </h2>
        <p className="text-xs sm:text-sm text-[#73716B] max-w-md mx-auto font-light">
          We welcome prospective owners, breeders, and equine enthusiasts for private appointments and unhurried discussions.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="px-8 py-3 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#1b2a22] transition-colors font-medium"
        >
          Arrange a Private Visit
        </button>
      </section>
    </div>
  );
};
