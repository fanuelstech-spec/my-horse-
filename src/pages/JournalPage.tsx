import React, { useState, useMemo } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useEstate } from '../lib/estateContext';

interface JournalPageProps {
  onNavigate: (path: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ onNavigate }) => {
  const { journal } = useEstate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const publishedArticles = useMemo(() => {
    return journal.filter((p) => p.published);
  }, [journal]);

  const categories = useMemo(() => {
    const set = new Set(publishedArticles.map((p) => p.category));
    return Array.from(set);
  }, [publishedArticles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return publishedArticles;
    return publishedArticles.filter((p) => p.category === selectedCategory);
  }, [publishedArticles, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-16">
      {/* Editorial Header */}
      <section className="max-w-3xl space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
          Notes & Reflections
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#20201E] font-normal leading-tight">
          The Estate Journal
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
          Dispatches from our Normandy pastures, reflections on equine biomechanics, classical training philosophy, and our ongoing welfare initiatives.
        </p>
      </section>

      {/* Category Pills */}
      <section className="flex flex-wrap items-center gap-2 border-b border-[#B7B0A4]/30 pb-4 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 uppercase tracking-wider rounded-none transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#24362D] text-white font-medium'
              : 'bg-white text-[#73716B] border border-[#B7B0A4]/40 hover:text-[#20201E]'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 uppercase tracking-wider rounded-none transition-colors ${
              selectedCategory === cat
                ? 'bg-[#24362D] text-white font-medium'
                : 'bg-white text-[#73716B] border border-[#B7B0A4]/40 hover:text-[#20201E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Articles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => onNavigate(`/journal/${article.slug}`)}
            className="group cursor-pointer space-y-5"
          >
            {/* Image */}
            <div className="aspect-[16/10] overflow-hidden bg-white border border-[#B7B0A4]/35">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-[11px] text-[#73716B] uppercase tracking-wider">
                <span className="text-[#A89472] font-semibold">{article.category}</span>
                <span>·</span>
                <span>{article.author}</span>
                <span>·</span>
                <span>{new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#20201E] group-hover:text-[#24362D] transition-colors font-normal leading-snug">
                {article.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#73716B] leading-relaxed line-clamp-3 font-light">
                {article.excerpt}
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center text-xs uppercase tracking-[0.16em] text-[#20201E] font-medium group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
