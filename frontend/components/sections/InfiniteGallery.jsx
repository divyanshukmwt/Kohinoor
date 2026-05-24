'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const GALLERY_IMAGES = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiVfzwSl3dQsEoy05Mpggcx41gvqQkXvWxEv8-ii573O6nX9K6lndSE06NOZ5163yDTmHhYJfZIzCUwcDBkgkxpSwpQIO3igNgiqeIKO_Cu0YboQhfhRGVkVbfN8VeKxcnMqv5X40zsQj75EonLjpwfuYpx0jR5A7-wBILN69J0bmhdoW0F5Hdqso1Rz0gVD3JqHtsifA5t5jH0IAu5GXVDvTHzePXff07pASzX0uuCzQDhU7PqIdRabYx70MTBZG5H8dxqsyOGcRm',
    alt: 'Diamond cascade editorial',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSRLJA5zPSPaHVx0btaOzPXXFFW7meYKOAUOB3sbcYzMKVqD8wKya8b5SHoGuu1mt6mc5WkkFRBw1EkoPnmCBIIZcyRp7w7nS8u3sGfBoAOBz6uUxuEimWG35u3wzQa9Frhihu1w6mXdPaqKvw_VziYaMdvALNTGHPaiqSgtUBoDHycrrjRfHtCIEFnLxNGIQv-FmRch8VL9RjsyIv1y6TbR8S8e_ehCuxhIpGZKU29F6eGk6euWIlE9NA5vEyWsaoQnYrWIAihUWW',
    alt: 'Ethical jewellery lifestyle',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_Q93cuGxfblNSYTry8AijmrQzW28ZPHgsxDbhT_SxL2ta_7pMwEou--Bk-l4El7P6OI3mg8ZoF55U2JttCnQZD2Augie0jyNccXi3oF9MZKnQW50hufvX_NhsE6yJGrE-EmU2gWZ5FVr9_YjvQJbz6t3MXIopRWWY8xmjbh0bGMbh_arjmiNGJRIZ6gHnsgt2BSvlfIs5vttRe9b6Co7M-DZ1TIAOAba8g36JEPDIQa92GMcrEOJ5M3h5w9plW3XfWOmYTDKXoCx',
    alt: 'Solitaire ring detail',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxKnPnxbcU9GL3Kn0xf5G0BXI-Y8NnPH2D6LlwQl2PVoX-AJKEXJXsftlDYJ3G4ZBfzIJGZJOKoTrnMpf7xY1EUU5hfM3Y1ihwSjbm_8Lfrtp5ec93DYElgr_LNnas7P2E-Ve0PJlb6X3hW1D4cowsIkEX5E-hCagUXY3spMESwaSo0cmMZhGS9hZY1D0Pbd9AHxuqKAoie4B57ZDJP48rU9n5teNnBqW71NswuOSxQ1lEb_Rp_gerPkiW0GLm9NcMbF8LMuxiblQ',
    alt: 'Drop earrings editorial',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlpxlvj5Ns-LEBueYL19E3CJfWQr0pzCVcPFEMqi3aU8k1A12GB78Wc-8mZQUyqaI6cxGu8bUVAgQPvOrqhn5CQ8vM-OmbqVCxYDTFxEv9OGlIXGJrWL3N7Klg21Be8rAy7sf0jBUIUSBTXrvorB77YLWcfLmn406VRk7ShseIVay1UkpjkFubi7noU0On4thDqM7EN4WohM2pxbaFXbu-TVnDu7Ey3n_3uFRPQiQ0hU75hf4JLDlRTkND0a7s_YR__vVpe2HDT8Ug',
    alt: 'Celestial band close-up',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiVfzwSl3dQsEoy05Mpggcx41gvqQkXvWxEv8-ii573O6nX9K6lndSE06NOZ5163yDTmHhYJfZIzCUwcDBkgkxpSwpQIO3igNgiqeIKO_Cu0YboQhfhRGVkVbfN8VeKxcnMqv5X40zsQj75EonLjpwfuYpx0jR5A7-wBILN69J0bmhdoW0F5Hdqso1Rz0gVD3JqHtsifA5t5jH0IAu5GXVDvTHzePXff07pASzX0uuCzQDhU7PqIdRabYx70MTBZG5H8dxqsyOGcRm',
    alt: 'Necklace atelier',
  },
];

export default function InfiniteGallery() {
  const trackRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { gsap } = await import('gsap');

      if (!trackRef.current) return;

      const track = trackRef.current;
      const totalWidth = track.scrollWidth / 2;

      gsap.to(track, {
        x: `-${totalWidth}px`,
        duration: 28,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x);
            return `${((val % totalWidth) - totalWidth) % totalWidth + (val < 0 ? totalWidth : 0)}px`;
          },
        },
      });
    }

    setup();
  }, []);

  // Duplicate images for seamless loop
  const allImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

  return (
    <section className="py-24 bg-surface-container-low/30 overflow-hidden">
      <div className="mb-12 px-6 md:px-[80px] max-w-[1440px] mx-auto flex justify-between items-end">
        <div>
          <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-3">
            The Gallery
          </p>
          <h2 className="font-bodoni text-[clamp(28px,4vw,48px)] text-on-background">
            Moments of Light
          </h2>
        </div>
        <a
          href="/gallery"
          className="hidden md:block font-inter text-[11px] uppercase tracking-[0.1em] text-outline hover:text-on-background transition-colors duration-300"
        >
          View All →
        </a>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-3 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {allImages.map((img, i) => (
            <div
              key={i}
              className={`flex-shrink-0 relative overflow-hidden bg-soft-beige ${
                i % 3 === 0 ? 'w-64 h-80' : i % 3 === 1 ? 'w-48 h-80' : 'w-72 h-80'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="300px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
