'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import NewsletterSection from '@/components/sections/NewsletterSection';

const GALLERY_ITEMS = [
  { id: 1, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiVfzwSl3dQsEoy05Mpggcx41gvqQkXvWxEv8-ii573O6nX9K6lndSE06NOZ5163yDTmHhYJfZIzCUwcDBkgkxpSwpQIO3igNgiqeIKO_Cu0YboQhfhRGVkVbfN8VeKxcnMqv5X40zsQj75EonLjpwfuYpx0jR5A7-wBILN69J0bmhdoW0F5Hdqso1Rz0gVD3JqHtsifA5t5jH0IAu5GXVDvTHzePXff07pASzX0uuCzQDhU7PqIdRabYx70MTBZG5H8dxqsyOGcRm', alt: 'Diamond Cascade editorial', category: 'Campaign', span: 'col-span-2 row-span-2' },
  { id: 2, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSRLJA5zPSPaHVx0btaOzPXXFFW7meYKOAUOB3sbcYzMKVqD8wKya8b5SHoGuu1mt6mc5WkkFRBw1EkoPnmCBIIZcyRp7w7nS8u3sGfBoAOBz6uUxuEimWG35u3wzQa9Frhihu1w6mXdPaqKvw_VziYaMdvALNTGHPaiqSgtUBoDHycrrjRfHtCIEFnLxNGIQv-FmRch8VL9RjsyIv1y6TbR8S8e_ehCuxhIpGZKU29F6eGk6euWIlE9NA5vEyWsaoQnYrWIAihUWW', alt: 'Lumière collection', category: 'Collection', span: '' },
  { id: 3, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_Q93cuGxfblNSYTry8AijmrQzW28ZPHgsxDbhT_SxL2ta_7pMwEou--Bk-l4El7P6OI3mg8ZoF55U2JttCnQZD2Augie0jyNccXi3oF9MZKnQW50hufvX_NhsE6yJGrE-EmU2gWZ5FVr9_YjvQJbz6t3MXIopRWWY8xmjbh0bGMbh_arjmiNGJRIZ6gHnsgt2BSvlfIs5vttRe9b6Co7M-DZ1TIAOAba8g36JEPDIQa92GMcrEOJ5M3h5w9plW3XfWOmYTDKXoCx', alt: 'Solitaire ring', category: 'Product', span: '' },
  { id: 4, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxKnPnxbcU9GL3Kn0xf5G0BXI-Y8NnPH2D6LlwQl2PVoX-AJKEXJXsftlDYJ3G4ZBfzIJGZJOKoTrnMpf7xY1EUU5hfM3Y1ihwSjbm_8Lfrtp5ec93DYElgr_LNnas7P2E-Ve0PJlb6X3hW1D4cowsIkEX5E-hCagUXY3spMESwaSo0cmMZhGS9hZY1D0Pbd9AHxuqKAoie4B57ZDJP48rU9n5teNnBqW71NswuOSxQ1lEb_Rp_gerPkiW0GLm9NcMbF8LMuxiblQ', alt: 'Drop earrings lifestyle', category: 'Lifestyle', span: 'col-span-2' },
  { id: 5, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlpxlvj5Ns-LEBueYL19E3CJfWQr0pzCVcPFEMqi3aU8k1A12GB78Wc-8mZQUyqaI6cxGu8bUVAgQPvOrqhn5CQ8vM-OmbqVCxYDTFxEv9OGlIXGJrWL3N7Klg21Be8rAy7sf0jBUIUSBTXrvorB77YVWcfLmn406VRk7ShseIVay1UkpjkFubi7noU0On4thDqM7EN4WohM2pxbaFXbu-TVnDu7Ey3n_3uFRPQiQ0hU75hf4JLDlRTkND0a7s_YR__vVpe2HDT8Ug', alt: 'Celestial band', category: 'Product', span: '' },
  { id: 6, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiVfzwSl3dQsEoy05Mpggcx41gvqQkXvWxEv8-ii573O6nX9K6lndSE06NOZ5163yDTmHhYJfZIzCUwcDBkgkxpSwpQIO3igNgiqeIKO_Cu0YboQhfhRGVkVbfN8VeKxcnMqv5X40zsQj75EonLjpwfuYpx0jR5A7-wBILN69J0bmhdoW0F5Hdqso1Rz0gVD3JqHtsifA5t5jH0IAu5GXVDvTHzePXff07pASzX0uuCzQDhU7PqIdRabYx70MTBZG5H8dxqsyOGcRm', alt: 'Atelier detail', category: 'Atelier', span: '' },
  { id: 7, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSRLJA5zPSPaHVx0btaOzPXXFFW7meYKOAUOB3sbcYzMKVqD8wKya8b5SHoGuu1mt6mc5WkkFRBw1EkoPnmCBIIZcyRp7w7nS8u3sGfBoAOBz6uUxuEimWG35u3wzQa9Frhihu1w6mXdPaqKvw_VziYaMdvALNTGHPaiqSgtUBoDHycrrjRfHtCIEFnLxNGIQv-FmRch8VL9RjsyIv1y6TbR8S8e_ehCuxhIpGZKU29F6eGk6euWIlE9NA5vEyWsaoQnYrWIAihUWW', alt: 'Campaign editorial portrait', category: 'Campaign', span: '' },
  { id: 8, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxKnPnxbcU9GL3Kn0xf5G0BXI-Y8NnPH2D6LlwQl2PVoX-AJKEXJXsftlDYJ3G4ZBfzIJGZJOKoTrnMpf7xY1EUU5hfM3Y1ihwSjbm_8Lfrtp5ec93DYElgr_LNnas7P2E-Ve0PJlb6X3hW1D4cowsIkEX5E-hCagUXY3spMESwaSo0cmMZhGS9hZY1D0Pbd9AHxuqKAoie4B57ZDJP48rU9n5teNnBqW71NswuOSxQ1lEb_Rp_gerPkiW0GLm9NcMbF8LMuxiblQ', alt: 'Ring collection flatlay', category: 'Collection', span: 'col-span-2' },
];

const CATEGORIES = ['All', 'Campaign', 'Collection', 'Product', 'Lifestyle', 'Atelier'];

export default function GalleryPage() {
  const gridRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((i) => i.category === activeCategory);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!gridRef.current) return;

      gsap.fromTo(
        gridRef.current.querySelectorAll('.gallery-item'),
        { opacity: 0, scale: 1.04 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.07,
        }
      );
    }
    setup();
  }, [filtered]);

  return (
    <div className="min-h-screen bg-matte-black pt-28">
      {/* ── Header ── */}
      <header className="px-6 md:px-[80px] pt-16 pb-16 max-w-[1440px] mx-auto">
        <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-4">
          Visual Archive
        </p>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
          <h1 className="font-bodoni text-[clamp(44px,6vw,80px)] text-ivory-base leading-tight">
            The Gallery
          </h1>
          <p className="font-inter text-[15px] leading-7 text-ivory-base/50 max-w-xs">
            Campaign imagery, product photography, and moments from our Geneva atelier.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-5 flex-wrap border-b border-champagne-gold/10 pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-inter text-[11px] uppercase tracking-[0.1em] pb-4 border-b-2 transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-champagne-gold border-champagne-gold'
                  : 'text-ivory-base/40 border-transparent hover:text-ivory-base/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── Gallery Grid ── */}
      <section
        ref={gridRef}
        className="px-6 md:px-[80px] pb-32 max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[220px]"
      >
        {filtered.map((item) => (
          <button
            key={item.id}
            className={`gallery-item relative overflow-hidden bg-surface-container group ${item.span}`}
            onClick={() => setLightbox(item)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-matte-black/0 group-hover:bg-matte-black/25 transition-all duration-500 flex items-end p-4">
              <span className="font-inter text-[10px] uppercase tracking-[0.1em] text-ivory-base/0 group-hover:text-ivory-base/80 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                {item.category}
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[80] bg-matte-black/95 flex items-center justify-center p-6 md:p-12"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-ivory-base/60 hover:text-ivory-base transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[85vh] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="absolute bottom-8 font-inter text-[11px] uppercase tracking-[0.12em] text-ivory-base/40">
            {lightbox.alt} · {lightbox.category}
          </p>
        </div>
      )}

      <div className="bg-ivory-base">
        <NewsletterSection />
      </div>
    </div>
  );
}
