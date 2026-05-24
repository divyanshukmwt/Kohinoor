import JournalCard from '@/components/sections/JournalCard';
import NewsletterSection from '@/components/sections/NewsletterSection';
import { JOURNAL_POSTS, JOURNAL_CATEGORIES } from '@/data/journal';

export const metadata = {
  title: 'Journal',
  description: 'Stories from the atelier. Craft, heritage, and the philosophy of enduring objects.',
};

export default function JournalPage() {
  const featured = JOURNAL_POSTS.find((p) => p.isFeatured);
  const rest = JOURNAL_POSTS.filter((p) => !p.isFeatured || p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-ivory-base pt-28">
      {/* ── Header ── */}
      <header className="px-6 md:px-[80px] pt-16 pb-16 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-4">
              From the Atelier
            </p>
            <h1 className="font-bodoni text-[clamp(44px,6vw,80px)] text-on-background leading-tight">
              The Journal
            </h1>
          </div>
          <p className="font-inter text-[15px] leading-7 text-on-surface-variant max-w-xs">
            Craft, heritage, and the philosophy of enduring objects. Published when we have
            something worth saying.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-6 flex-wrap border-b border-champagne-gold/15 pb-0">
          {JOURNAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background pb-4 border-b-2 border-transparent hover:border-primary transition-all duration-300"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Featured Post ── */}
      {featured && (
        <section className="px-6 md:px-[80px] pb-20 max-w-[1440px] mx-auto">
          <JournalCard post={featured} featured />
        </section>
      )}

      {/* ── Gold Divider ── */}
      <div className="px-6 md:px-[80px] max-w-[1440px] mx-auto">
        <div className="gold-line mb-20" />
      </div>

      {/* ── Post Grid ── */}
      <section className="px-6 md:px-[80px] pb-32 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {rest.map((post) => (
            <JournalCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
