import React from 'react';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { JournalPost } from '../types/database';

interface JournalDetailPageProps {
  slug?: string;
  post?: JournalPost;
  onNavigate: (path: string) => void;
}

export const JournalDetailPage: React.FC<JournalDetailPageProps> = ({ slug, post: propPost, onNavigate }) => {
  const { getJournalPostBySlug, journal } = useEstate();
  const post =
    propPost ||
    (slug ? getJournalPostBySlug(slug) : undefined) ||
    (slug
      ? journal.find(
          (p) =>
            p.slug === slug ||
            p.id === slug ||
            p.slug?.toLowerCase() === slug.toLowerCase() ||
            p.title?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
        )
      : undefined);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#20201E]">Article Not Found</h1>
        <p className="text-sm text-[#73716B]">
          The journal entry you are looking for does not exist or has been withdrawn.
        </p>
        <button
          onClick={() => onNavigate('/journal')}
          className="mt-4 px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider"
        >
          Return to Journal
        </button>
      </div>
    );
  }

  // Find related or other articles
  const otherPosts = journal.filter((p) => p.published && p.id !== post.id).slice(0, 2);

  // Format content lines
  const renderFormattedContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl sm:text-3xl text-[#20201E] font-normal mt-10 mb-4">
            {block.replace('## ', '')}
          </h2>
        );
      }
      if (block.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl sm:text-2xl text-[#20201E] font-normal mt-8 mb-3">
            {block.replace('### ', '')}
          </h3>
        );
      }
      if (block.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-2 border-[#A89472] pl-6 my-8 py-1 font-serif italic text-lg sm:text-xl text-[#20201E] leading-relaxed"
          >
            {block.replace('> ', '')}
          </blockquote>
        );
      }
      return (
        <p key={idx} className="text-[#20201E]/90 text-base sm:text-lg leading-[1.8] font-light mb-6">
          {block}
        </p>
      );
    });
  };

  return (
    <article className="space-y-16 sm:space-y-20 pb-24">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-8">
        <button
          onClick={() => onNavigate('/journal')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.18em] text-[#73716B] hover:text-[#20201E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </button>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-6 sm:px-8 space-y-6">
        <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold">
          <span>{post.category}</span>
          <span>·</span>
          <span>{new Date(post.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#20201E] font-normal leading-[1.12]">
          {post.title}
        </h1>

        <p className="font-serif italic text-lg sm:text-xl text-[#73716B] leading-relaxed border-l-2 border-[#B7B0A4]/50 pl-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[#B7B0A4]/25 text-xs text-[#73716B]">
          <span className="font-medium text-[#20201E]">By {post.author}</span>
          <span className="uppercase tracking-widest text-[10px]">Pays d'Auge Archives</span>
        </div>
      </header>

      {/* Hero Photograph */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="aspect-[16/9] overflow-hidden bg-white border border-[#B7B0A4]/35 shadow-sm">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Long-form Article Body */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 prose prose-neutral">
        {renderFormattedContent(post.content)}
      </div>

      {/* Author Bio Box */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="p-8 bg-[#FAF9F6] border border-[#B7B0A4]/35 space-y-3">
          <span className="text-[10px] uppercase tracking-wider text-[#A89472] font-semibold">
            About the Author
          </span>
          <h3 className="font-serif text-xl text-[#20201E]">{post.author}</h3>
          <p className="text-xs sm:text-sm text-[#73716B] leading-relaxed font-light">
            Contributing to the Sterling Estate Journal on equine genetics, classical dressage biomechanics, and sanctuary rehabilitation protocols.
          </p>
        </div>
      </section>

      {/* Related Entries */}
      {otherPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 border-t border-[#B7B0A4]/30 space-y-8">
          <h3 className="font-serif text-2xl text-[#20201E]">Further Reflections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherPosts.map((other) => (
              <div
                key={other.id}
                onClick={() => onNavigate(`/journal/${other.slug}`)}
                className="group cursor-pointer space-y-3"
              >
                <div className="aspect-[16/10] overflow-hidden bg-white border border-[#B7B0A4]/30">
                  <img
                    src={other.featured_image}
                    alt={other.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#A89472] font-semibold">
                  {other.category}
                </span>
                <h4 className="font-serif text-xl text-[#20201E] group-hover:text-[#24362D] transition-colors">
                  {other.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
