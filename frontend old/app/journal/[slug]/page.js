import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterSection from '@/components/sections/NewsletterSection';
import JournalCard from '@/components/sections/JournalCard';
import { JOURNAL_POSTS } from '@/data/journal';
import { formatDate } from '@/utils/helpers';

export async function generateStaticParams() {
  return JOURNAL_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = JOURNAL_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function JournalPostPage({ params }) {
  const post = JOURNAL_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = JOURNAL_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory-base pt-28">
      {/* ── Article Hero ── */}
      <header className="px-6 md:px-[80px] pt-12 pb-0 max-w-[1440px] mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-12">
          <Link href="/journal" className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors">
            Journal
          </Link>
          <span className="text-outline/30 text-[11px]">/</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.1em] text-champagne-gold">
            {post.category}
          </span>
        </nav>

        {/* Meta */}
        <p className="font-inter text-[11px] uppercase tracking-[0.12em] text-outline mb-4">
          {formatDate(post.publishedAt)} · {post.readTime}
        </p>

        {/* Headline */}
        <h1 className="font-bodoni text-[clamp(36px,5.5vw,80px)] text-on-background leading-tight max-w-4xl mb-6">
          {post.title}
        </h1>
        <p className="font-bodoni italic text-[clamp(18px,2.5vw,28px)] text-tertiary mb-12 max-w-2xl">
          {post.subtitle}
        </p>
      </header>

      {/* ── Hero Image ── */}
      <div className="relative aspect-[16/7] overflow-hidden mb-16">
        <Image
          src={post.heroImage.url}
          alt={post.heroImage.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* ── Article Body ── */}
      <article className="px-6 md:px-[80px] max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Pull Quote Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <div className="gold-line-v h-24 mb-8 ml-auto mr-0 w-px" />
              <p className="font-bodoni italic text-[18px] text-on-surface-variant leading-snug">
                &ldquo;{post.excerpt.split('.')[0]}.&rdquo;
              </p>
            </div>
          </aside>

          {/* Body Content */}
          <div className="lg:col-span-8 lg:col-start-5">
            {/* Excerpt lead */}
            <p className="font-inter text-[18px] leading-9 text-on-background font-medium mb-10 border-l-2 border-champagne-gold pl-6">
              {post.excerpt}
            </p>

            {post.body.map((paragraph, i) => (
              <p key={i} className="font-inter text-[16px] leading-9 text-on-surface-variant mb-8">
                {paragraph}
              </p>
            ))}

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-champagne-gold/15 flex justify-between items-center">
              <Link
                href="/journal"
                className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Journal
              </Link>
              <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline">
                {post.category}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* ── Related Posts ── */}
      <section className="px-6 md:px-[80px] py-28 max-w-[1440px] mx-auto">
        <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-4">Continue Reading</p>
        <h2 className="font-bodoni text-[32px] text-on-background mb-12">More from the Journal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {related.map((p) => (
            <JournalCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
