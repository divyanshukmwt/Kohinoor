import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { products, toggleConcierge, showToast } = useContext(AppContext);

  const featuredPieces = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = (featuredPieces.length >= 4 ? featuredPieces : products).slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    showToast('Welcome to the Kohinoor Inner Circle');
    e.target.reset();
  };

  return (
    <div className="bg-surface">
      {/* Hero Section */}
      <section className="relative h-[680px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBs0i3lAQlUX4ruWKtUm-qVCJjViyfAMc1oHD-tZCkta8SI-JamssmQQSbB8qBeWCYvSecbNiwUZbwVyCsrTPLLqoQXMmxB7IUnfPaypJQrT7rZEeCJhB3DWFp8_wQhZxiu9FnHy0DbX-jB7MwiaLRjujZddRhAUdPCu7nImGP7RMf34e1NV-EYVNh74EO1cCUJO_DxTXIN8NOqLalF7wBrD_E11vPPbjKr6PoYShniQjvochTjsE-E-miq4PtZ5viuDdYZOnVL3EI_')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />
        <div className="relative h-full max-w-max-width mx-auto flex flex-col justify-center items-start px-margin-mobile md:px-gutter-desktop">
          <span className="text-secondary-fixed font-label-md text-xs tracking-[0.3em] mb-4 uppercase">
            THE KOHINOOR EDIT
          </span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-white mb-5 max-w-2xl">
            Jewellery that tells your story
          </h1>
          <p className="text-white/85 font-body-lg text-base md:text-lg mb-8 max-w-lg leading-relaxed">
            Experience the harmony of Indian royal heritage and modern anti-tarnish craftsmanship.
            Curated for everyday elegance and heirloom occasions.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/collections"
              className="bg-primary text-white px-9 py-3.5 rounded font-button text-xs font-bold tracking-widest hover:bg-primary/90 transition-colors duration-200 uppercase"
            >
              SHOP COLLECTIONS
            </Link>
            <button
              type="button"
              onClick={toggleConcierge}
              className="bg-white/15 backdrop-blur-sm text-white border border-white/40 px-7 py-3.5 rounded font-button text-xs font-bold tracking-widest hover:bg-white/25 transition-colors duration-200 uppercase flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                auto_awesome
              </span>
              ASK AI STYLIST
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-surface-container py-10 px-margin-mobile border-b border-outline-variant/30">
        <div className="max-w-max-width mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
            <p className="font-label-md text-xs uppercase font-bold text-on-surface">
              Free Insured Shipping
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">history</span>
            <p className="font-label-md text-xs uppercase font-bold text-on-surface">
              15-Day Easy Returns
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">water_drop</span>
            <p className="font-label-md text-xs uppercase font-bold text-on-surface">
              Anti-Tarnish Finish
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">verified</span>
            <p className="font-label-md text-xs uppercase font-bold text-on-surface">
              Hallmarked Purity
            </p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-section-v px-margin-mobile">
        <div className="max-w-max-width mx-auto text-center">
          <h2 className="font-display text-headline-lg mb-10 text-primary">
            Explore by Category
          </h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-14">
            {[
              {
                label: 'Necklaces',
                href: '/collections?category=NECKLACES',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl8eIz52nJ_G3qprZUebpXGUAoM7fYc_twxHSHezTaUcBitglNBNWc7Tktx8zgGVuDqX131LSH1WOZScLAmKPje4JbdtWgDC98u5nKfWzf2HJpsPwdWd_nuXX8mlB7DF6n-St9OV4enz1KhrSdMKT6VM0XGbmsd7OeQnKH51yJlzTIVOIz9cw44nprU4ahDSBPIbxQjkzVh5Vf-Vkbq5nh4L7NvQDD-WJPjNKTQ1CztzaMFNnQZ65e_a1WffsAeUp5fdKHxHyZHk0X',
              },
              {
                label: 'Earrings',
                href: '/collections?category=EARRINGS',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARja4YiQXbfWVegU7uL6w3ytrtxgsBDer-dOWHaVY8pEG5lroBmq3Mx9bO0RIL8ap6eJlestjLIugGiIKOFWrNaCAwgUQmCFYWOxHalH-yvB8s8si8l43Wd9CHs2X9QnYK4asBWxd1-0Aeo-9r-J9swSS47fCmzr5pcTX-IZvkpQrldEGYxobtHdLBwW-KpHIoUQohq71Ab990yROvi4zimel19N6SP5Z8wz0-DmS6PzDkXMHG0z5uUdCN_sakQ1g8FA_V_a8xdk9s',
              },
              {
                label: 'Rings',
                href: '/collections?category=RINGS',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-NH5FUB7UfYjtWe-cyDG3UPDJYLqhZ9Vt4H-56R3MN1T01X8vPTiBB1Frlz4PRQY9fnNP3jqpeNh6tPMmeF32CNQwATynS0C-1FhtSXaPTHnnEYHVpRlNb30xX4DOS5FuJBjYDrZIR2DYUqvC-lVfwYFEBivTv-pJKTR1QGV3t9niqt5zI5L4Uudg8I5E5pkH5oLWljGLBZA4onLmHeI_IBh1W3o-zFCgasaGo44JPuim6MDu-cy7n8ZkOGJbeLpby9kSRfk9KpTH',
              },
              {
                label: 'Bracelets',
                href: '/collections?category=BRACELETS',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQ67hsoz1DYgdNh3Ex1l-2HUyVXWK3ywpTCRKF19e-JVHWBIhKWjiR6dbGuzPkDUp0ieRwAbc9diXy1D35jxxt8WjVYzP44jyyhjl3jVYRNcyzwe4JV7VRHpfGsiZDjaJdYcxpKwpBLLLX5tyGqM8VLybonJKPBCWJ9euZjl0Kww7PBpf-q4UMUnovmrAJUieEzLC5Vb4X1rw6Poz5LTO-IrcBEDmF5QIqn5pzPuijQpMkpZNj9JAhhnVI40vMpnw7Qw1W_lz1nor',
              },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={cat.href}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border border-outline-variant/60 bg-surface-container">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={cat.img}
                    alt={cat.label}
                  />
                </div>
                <p className="font-label-md text-xs uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                  {cat.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-section-v px-margin-mobile bg-surface-container-low">
        <div className="max-w-max-width mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
          <div className="relative h-[440px] overflow-hidden group rounded-lg border border-outline-variant/30">
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0wUUByRp6rS5Tn4AJGTIT2vxyk3K8YSTv8TQiFdvG4Tdqka0PeSP53UwUdLPE_ytNXPibqN7qxuFIKFigY5MK80th-O18zwJMPG55jr_Kag7Dhl7m3fQYffzA17Bgn32ibsS_tjR8XD_NQPsHxkd4vNhpompbFk2ZbPFJ6trG5VAGdwLr4e4JMO4C7RrUVnhA3yWb09w9yUr3JqTVbETWVm59ThoAdqP-ApXfjK7Yzxp9_nXDLuyxbBylmBl9KSDfu8ZyRcpcu4g2"
              alt="Heritage & Bridal Collection"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Heritage &amp; Bridal Edit
              </h3>
              <p className="mb-5 font-body text-sm opacity-90 max-w-md">
                Handcrafted Kundan, Polki, and oxidized silver treasures inspired by royal Indian
                ateliers.
              </p>
              <Link
                to="/collections?search=Heritage"
                className="inline-block border-b border-white font-button w-fit pb-1 hover:border-secondary-fixed transition-colors uppercase tracking-widest text-xs font-bold"
              >
                EXPLORE HERITAGE
              </Link>
            </div>
          </div>

          <div className="relative h-[440px] overflow-hidden group rounded-lg border border-outline-variant/30">
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK8nd2coY1isJqRzvXto4Lu2N0iKWKYfZnZAXvo54vEjVKh44ECmZSQIyB6vLWKgLmJzQRHucYyxnEfqUDFEhEmDW3fn1ESKe3pswSUx65wZeEbZtvRunlB6HT31ZnazG6I2une2IXMHXDlr8x0Nqkh8iFKkk3t3H7ciga4_w0TWKWbrwvLr4bJbpxzaSwp1BjEZnLjiKYkfM9rs7GMHTjp9qOltONfiVA0e7FCx1UwfqPck1HWLN3ICGNl1f5mNYy0ffgJmwyyEp2"
              alt="Anti-Tarnish Daily Wear"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 text-white">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Everyday Fine &amp; Anti-Tarnish
              </h3>
              <p className="mb-5 font-body text-sm opacity-90 max-w-md">
                Waterproof 18K gold vermeil, solitaire diamonds, and rose gold pieces crafted for
                daily brilliance.
              </p>
              <Link
                to="/collections?search=Daily"
                className="inline-block border-b border-white font-button w-fit pb-1 hover:border-secondary-fixed transition-colors uppercase tracking-widest text-xs font-bold"
              >
                SHOP DAILY WEAR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Curated Pieces Grid */}
      <section className="py-section-v">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-gutter-desktop">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-headline-lg text-primary">Signature Pieces</h2>
              <p className="text-on-surface-variant font-body text-sm mt-1">
                Curated from our seeded Jewellery Knowledge Base.
              </p>
            </div>
            <Link
              to="/collections"
              className="hidden md:block text-primary font-bold border-b border-primary pb-0.5 text-xs tracking-wider uppercase"
            >
              View All ({products.length})
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Strip */}
      <section className="py-16 bg-surface-container-low border-t border-outline-variant/40 px-margin-mobile">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-primary">
            Join the Kohinoor Inner Circle
          </h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Receive early access to seasonal launches, private atelier previews, and styling notes.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
            <input
              className="flex-1 px-5 py-3.5 bg-surface border border-outline-variant rounded focus:border-primary transition-colors outline-none text-sm"
              placeholder="Your email address"
              type="email"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3.5 rounded font-button text-xs hover:bg-primary/90 transition-colors uppercase tracking-widest font-bold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
