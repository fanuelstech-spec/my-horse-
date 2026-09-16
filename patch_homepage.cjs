const fs = require('fs');
const content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const newHero = `    <div className="pt-24 pb-20 space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-[4/5] lg:aspect-square w-full overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/35 shadow-sm">
              <img
                src={settings.about_image_1 || "/images/hero.jpg"}
                alt="Sterling Horse Sale Houston Texas"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
              {settings.business_name}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#20201E] font-normal leading-[1.1] tracking-tight">
              Find the Horse That Fits Your Life.
            </h1>
            
            <div className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light space-y-4 pt-4">
              <p>
                Based in Houston, Texas, {settings.business_name} is dedicated to connecting buyers with quality horses while providing a professional, transparent, and straightforward purchasing experience.
              </p>
              <p>
                We believe finding the right horse starts with understanding both the horse and the buyer. Our approach is centered on responsible horse handling, accurate information, and helping each buyer find a horse that fits their experience, goals, and lifestyle.
              </p>
            </div>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={() => onNavigate('/horses')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#24362D] text-white text-xs uppercase tracking-[0.18em] hover:bg-[#1b2a22] transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>View Available Horses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/about')}
                className="w-full sm:w-auto px-8 py-3.5 border border-[#20201E] text-[#20201E] text-xs uppercase tracking-[0.18em] hover:bg-[#FAF9F6] transition-colors font-medium text-center"
              >
                About Us
              </button>
            </div>
          </div>
          
        </div>
      </section>`;

const updated = content.replace(/<div className="pb-20 space-y-24 sm:space-y-32">[\s\S]*?\{\/\* 2\. FEATURED HORSES FOR SALE \*\/\}/, newHero + '\n\n      {/* 2. FEATURED HORSES FOR SALE */}');
fs.writeFileSync('src/pages/HomePage.tsx', updated);
