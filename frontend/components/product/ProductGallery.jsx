'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * ProductGallery
 * PDP image gallery with thumbnail navigation.
 */
export default function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-soft-beige overflow-hidden">
        <Image
          src={images[activeIndex]?.url}
          alt={images[activeIndex]?.alt || productName}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-16 h-20 overflow-hidden transition-all duration-300 ${
                activeIndex === i
                  ? 'border border-primary opacity-100'
                  : 'opacity-50 hover:opacity-80'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
