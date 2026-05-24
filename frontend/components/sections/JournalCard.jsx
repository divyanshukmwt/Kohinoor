import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/helpers';

/**
 * JournalCard
 * Reusable editorial journal post card.
 * Used on Journal listing page and Homepage.
 */
export default function JournalCard({ post, featured = false }) {
  if (featured) {
    return (
      <article className="journal-card group">
        <Link href={`/journal/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden bg-soft-beige mb-6">
            <Image
              src={post.heroImage.url}
              alt={post.heroImage.alt}
              fill
              className="journal-card-image object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute top-5 left-5">
              <span className="font-inter text-[10px] uppercase tracking-[0.12em] bg-ivory-base/90 text-primary px-3 py-1.5">
                {post.category}
              </span>
            </div>
          </div>
          <div>
            <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-3">
              {formatDate(post.publishedAt)} · {post.readTime}
            </p>
            <h2 className="font-bodoni text-[clamp(22px,3vw,38px)] text-on-background leading-tight mb-3 group-hover:text-primary transition-colors duration-500">
              {post.title}
            </h2>
            <p className="font-bodoni italic text-[18px] text-tertiary mb-5">
              {post.subtitle}
            </p>
            <p className="font-inter text-[15px] leading-7 text-on-surface-variant max-w-xl">
              {post.excerpt}
            </p>
            <div className="mt-6 btn-ghost text-sm">
              Read More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="journal-card group">
      <Link href={`/journal/${post.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-soft-beige mb-5">
          <Image
            src={post.heroImage.url}
            alt={post.heroImage.alt}
            fill
            className="journal-card-image object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span className="font-inter text-[10px] uppercase tracking-[0.12em] bg-ivory-base/90 text-primary px-3 py-1.5">
              {post.category}
            </span>
          </div>
        </div>
        <div>
          <p className="font-inter text-[11px] uppercase tracking-[0.1em] text-outline mb-3">
            {formatDate(post.publishedAt)} · {post.readTime}
          </p>
          <h3 className="font-bodoni text-[22px] text-on-background leading-tight mb-2 group-hover:text-primary transition-colors duration-500">
            {post.title}
          </h3>
          <p className="font-inter text-[14px] leading-6 text-on-surface-variant line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
