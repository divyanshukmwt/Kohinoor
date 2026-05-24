import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-base flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="font-bodoni text-[120px] md:text-[180px] text-champagne-gold/20 leading-none select-none">
          404
        </p>
        <h1 className="font-bodoni text-[32px] text-on-background -mt-6 mb-4">
          Page Not Found
        </h1>
        <p className="font-inter text-[15px] leading-7 text-on-surface-variant mb-10">
          The piece you are looking for may have moved or no longer exists.
          Perhaps it was destined for another collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-flex justify-center">
            <span>Return Home</span>
          </Link>
          <Link href="/shop" className="btn-ghost inline-flex items-center gap-2">
            <span>Explore Collection</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
