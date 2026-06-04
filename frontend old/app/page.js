import HeroSection from '@/components/sections/HeroSection';
import EditorialSection from '@/components/sections/EditorialSection';
import InfiniteGallery from '@/components/sections/InfiniteGallery';
import NewsletterSection from '@/components/sections/NewsletterSection';
import TypographyBlock from '@/components/ui/TypographyBlock';
import { FloatingCard, FloatingStat } from '@/components/ui/FloatingElements';
import ProductGrid from '@/components/product/ProductGrid';
import JournalCard from '@/components/sections/JournalCard';
import { getFeaturedProducts } from '@/services/products';
import { JOURNAL_POSTS } from '@/data/journal';
import Link from 'next/link';

export const metadata = {
  title: 'AURELIA LORE — Luxury Fine Jewellery',
  description:
    'Uncompromising artisanal excellence. We craft heirlooms that capture light and transcend generations.',
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(3);
  const featuredJournal = JOURNAL_POSTS.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Featured Products ── */}
      <section className="py-28 md:py-40 px-6 md:px-[80px] bg-ivory-base">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <TypographyBlock
              tag="New Collection"
              line1="The Lumière"
              line2="Collection"
              size="lg"
            />
            <Link
              href="/shop"
              className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors duration-300 flex-shrink-0 mb-2"
            >
              View All Pieces →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} columns={3} />
        </div>
      </section>

      {/* ── Editorial: Ethical Sourcing ── */}
      <EditorialSection
        tag="Ethical by Design"
        headline="Conscious Brilliance"
        subHeadline="Every stone has a story."
        body="Our commitment to provenance ensures every stone is ethically sourced from certified operations — marrying timeless design with a responsible future. No compromises, ever."
        ctaText="Our Philosophy"
        ctaHref="/philosophy"
        imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCSRLJA5zPSPaHVx0btaOzPXXFFW7meYKOAUOB3sbcYzMKVqD8wKya8b5SHoGuu1mt6mc5WkkFRBw1EkoPnmCBIIZcyRp7w7nS8u3sGfBoAOBz6uUxuEimWG35u3wzQa9Frhihu1w6mXdPaqKvw_VziYaMdvALNTGHPaiqSgtUBoDHycrrjRfHtCIEFnLxNGIQv-FmRch8VL9RjsyIv1y6TbR8S8e_ehCuxhIpGZKU29F6eGk6euWIlE9NA5vEyWsaoQnYrWIAihUWW"
        imageAlt="Model wearing ethical Aurelia Lore jewellery"
      />

      {/* ── Stats Strip ── */}
      <section className="py-20 px-6 md:px-[80px] bg-surface-container-low/30">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-champagne-gold/10">
          {[
            { number: '17+', label: 'Years of craft' },
            { number: '100%', label: 'Ethically sourced' },
            { number: '6–14', label: 'Weeks per piece' },
            { number: '3,200+', label: 'Heirlooms created' },
          ].map((stat) => (
            <div key={stat.label} className="bg-ivory-base py-14 px-10 text-center">
              <p className="font-bodoni text-[40px] md:text-[52px] text-on-background leading-none mb-3">
                {stat.number}
              </p>
              <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Editorial: Craftsmanship (Reversed) ── */}
      <EditorialSection
        tag="The Geneva Atelier"
        headline="Six weeks of"
        subHeadline="uninterrupted devotion."
        body="Each Aurelia Lore piece is individually crafted by a single master goldsmith from first sketch to final polish. No assembly lines. No shortcuts. Just fourteen hands and forty years of accumulated knowledge."
        ctaText="Inside the Atelier"
        ctaHref="/journal/inside-the-atelier"
        imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_Q93cuGxfblNSYTry8AijmrQzW28ZPHgsxDbhT_SxL2ta_7pMwEou--Bk-l4El7P6OI3mg8ZoF55U2JttCnQZD2Augie0jyNccXi3oF9MZKnQW50hufvX_NhsE6yJGrE-EmU2gWZ5FVr9_YjvQJbz6t3MXIopRWWY8xmjbh0bGMbh_arjmiNGJRIZ6gHnsgt2BSvlfIs5vttRe9b6Co7M-DZ1TIAOAba8g36JEPDIQa92GMcrEOJ5M3h5w9plW3XfWOmYTDKXoCx"
        imageAlt="Master goldsmith at work in Geneva atelier"
        reverse
      />

      {/* ── Infinite Gallery ── */}
      <InfiniteGallery />

      {/* ── Journal Previews ── */}
      <section className="py-28 md:py-40 px-6 md:px-[80px] bg-ivory-base">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <TypographyBlock
              tag="From the Journal"
              line1="Stories from"
              line2="the atelier."
              size="lg"
            />
            <Link
              href="/journal"
              className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors duration-300 flex-shrink-0 mb-2"
            >
              All Stories →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredJournal.map((post) => (
              <JournalCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-Width Quote ── */}
      <section className="py-36 px-6 md:px-[80px] bg-matte-black text-ivory-base relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-champagne-gold/5" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-champagne-gold/5" />
        </div>
        <div className="max-w-[900px] mx-auto text-center relative">
          <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold/60 mb-10">
            The Aurelia Lore Promise
          </p>
          <blockquote className="font-bodoni text-[clamp(26px,4vw,56px)] italic font-light text-ivory-base leading-tight mb-8">
            &ldquo;We do not make jewellery. We make the objects that people will reach for
            first when they want to remember who they are.&rdquo;
          </blockquote>
          <p className="font-inter text-[13px] uppercase tracking-[0.12em] text-ivory-base/40">
            — Isabelle Fontaine, Creative Director
          </p>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSection />
    </>
  );
}
