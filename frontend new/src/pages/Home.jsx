import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { addToCart } = useContext(AppContext);

  // Take first 4 products for the New Arrivals section
  const newArrivals = products.slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for joining the Inner Circle!");
    e.target.reset();
  };

  return (
    <div className="bg-surface">
      {/* Hero Section */}
      <section className="relative h-[751px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBs0i3lAQlUX4ruWKtUm-qVCJjViyfAMc1oHD-tZCkta8SI-JamssmQQSbB8qBeWCYvSecbNiwUZbwVyCsrTPLLqoQXMmxB7IUnfPaypJQrT7rZEeCJhB3DWFp8_wQhZxiu9FnHy0DbX-jB7MwiaLRjujZddRhAUdPCu7nImGP7RMf34e1NV-EYVNh74EO1cCUJO_DxTXIN8NOqLalF7wBrD_E11vPPbjKr6PoYShniQjvochTjsE-E-miq4PtZ5viuDdYZOnVL3EI_')" 
          }}
        ></div>
        <div className="absolute inset-0 jewelry-gradient-overlay"></div>
        <div className="relative h-full max-w-max-width mx-margin-desktop flex flex-col justify-center items-start px-margin-mobile">
          <span className="text-secondary-fixed font-label-md tracking-[0.3em] mb-4">
            THE KOHINOOR EDIT
          </span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-white mb-6 max-w-2xl">
            Jewellery that tells your story
          </h1>
          <p className="text-white/80 font-body-lg text-body-lg mb-8 max-w-lg">
            Experience the perfect blend of ancient Indian heritage and modern anti-tarnish technology. Crafted for the contemporary royalty in you.
          </p>
          <Link 
            to="/collections" 
            className="bg-primary text-white px-10 py-4 rounded-[4px] font-button text-button tracking-widest hover:bg-primary/90 transition-all active:scale-95 text-center uppercase"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-surface-container py-12 px-margin-mobile">
        <div className="max-w-max-width mx-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
            <p className="font-label-md text-label-md uppercase font-bold text-on-surface">Free Shipping</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">history</span>
            <p className="font-label-md text-label-md uppercase font-bold text-on-surface">7 Days Return</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
            <p className="font-label-md text-label-md uppercase font-bold text-on-surface">Waterproof</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">payments</span>
            <p className="font-label-md text-label-md uppercase font-bold text-on-surface">Cash On Delivery</p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-section-v px-margin-mobile">
        <div className="max-w-max-width mx-margin-desktop text-center">
          <h2 className="font-display text-headline-lg mb-12 text-primary">Find Your Perfect Piece</h2>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <Link to="/collections?category=NECKLACES" className="group flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl8eIz52nJ_G3qprZUebpXGUAoM7fYc_twxHSHezTaUcBitglNBNWc7Tktx8zgGVuDqX131LSH1WOZScLAmKPje4JbdtWgDC98u5nKfWzf2HJpsPwdWd_nuXX8mlB7DF6n-St9OV4enz1KhrSdMKT6VM0XGbmsd7OeQnKH51yJlzTIVOIz9cw44nprU4ahDSBPIbxQjkzVh5Vf-Vkbq5nh4L7NvQDD-WJPjNKTQ1CztzaMFNnQZ65e_a1WffsAeUp5fdKHxHyZHk0X" 
                  alt="Necklaces Category"
                />
              </div>
              <p className="font-label-md text-label-md uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                Necklaces
              </p>
            </Link>

            <Link to="/collections?category=EARRINGS" className="group flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuARja4YiQXbfWVegU7uL6w3ytrtxgsBDer-dOWHaVY8pEG5lroBmq3Mx9bO0RIL8ap6eJlestjLIugGiIKOFWrNaCAwgUQmCFYWOxHalH-yvB8s8si8l43Wd9CHs2X9QnYK4asBWxd1-0Aeo-9r-J9swSS47fCmzr5pcTX-IZvkpQrldEGYxobtHdLBwW-KpHIoUQohq71Ab990yROvi4zimel19N6SP5Z8wz0-DmS6PzDkXMHG0z5uUdCN_sakQ1g8FA_V_a8xdk9s" 
                  alt="Earrings Category"
                />
              </div>
              <p className="font-label-md text-label-md uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                Earrings
              </p>
            </Link>

            <Link to="/collections?category=RINGS" className="group flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-NH5FUB7UfYjtWe-cyDG3UPDJYLqhZ9Vt4H-56R3MN1T01X8vPTiBB1Frlz4PRQY9fnNP3jqpeNh6tPMmeF32CNQwATynS0C-1FhtSXaPTHnnEYHVpRlNb30xX4DOS5FuJBjYDrZIR2DYUqvC-lVfwYFEBivTv-pJKTR1QGV3t9niqt5zI5L4Uudg8I5E5pkH5oLWljGLBZA4onLmHeI_IBh1W3o-zFCgasaGo44JPuim6MDu-cy7n8ZkOGJbeLpby9kSRfk9KpTH" 
                  alt="Rings Category"
                />
              </div>
              <p className="font-label-md text-label-md uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                Rings
              </p>
            </Link>

            <Link to="/collections?category=BRACELETS" className="group flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMQ67hsoz1DYgdNh3Ex1l-2HUyVXWK3ywpTCRKF19e-JVHWBIhKWjiR6dbGuzPkDUp0ieRwAbc9diXy1D35jxxt8WjVYzP44jyyhjl3jVYRNcyzwe4JV7VRHpfGsiZDjaJdYcxpKwpBLLLX5tyGqM8VLybonJKPBCWJ9euZjl0Kww7PBpf-q4UMUnovmrAJUieEzLC5Vb4X1rw6Poz5LTO-IrcBEDmF5QIqn5pzPuijQpMkpZNj9JAhhnVI40vMpnw7Qw1W_lz1nor" 
                  alt="Bracelets Category"
                />
              </div>
              <p className="font-label-md text-label-md uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                Bracelets
              </p>
            </Link>

            <Link to="/collections?category=PENDANTS" className="group flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoNcVbUF8-RMz75EH4jaP7U34t5kUv9qFe-xNuloSd9TFCTcN4CFO-0oaxlqdIOLJDydq-dKb7hN2zwAgd3EzCY6YXPhkf8D1PQoQ1FGf1WypgD7DftdrwqWz3Wsxun3JX2qMx5sLXIv-e3k9YG7jvIV9K1FOTzVO8QCGPNk4KXBtv794Tdm_PpVcJ-od1W6xf6aQ_PW_2HHbk_6xZGgMCs58ilgysRqDN2g7pV6BkcSZxAuWj2fZzZCv3e_XIZ2buucAf-fS0IVCC" 
                  alt="Pendants Category"
                />
              </div>
              <p className="font-label-md text-label-md uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                Pendants
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-section-v px-margin-mobile bg-surface-container-low">
        <div className="max-w-max-width mx-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
          <div className="relative h-[500px] overflow-hidden group rounded-lg shadow-sm">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0wUUByRp6rS5Tn4AJGTIT2vxyk3K8YSTv8TQiFdvG4Tdqka0PeSP53UwUdLPE_ytNXPibqN7qxuFIKFigY5MK80th-O18zwJMPG55jr_Kag7Dhl7m3fQYffzA17Bgn32ibsS_tjR8XD_NQPsHxkd4vNhpompbFk2ZbPFJ6trG5VAGdwLr4e4JMO4C7RrUVnhA3yWb09w9yUr3JqTVbETWVm59ThoAdqP-ApXfjK7Yzxp9_nXDLuyxbBylmBl9KSDfu8ZyRcpcu4g2" 
              alt="Oxidized Collection"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
              <h3 className="font-display text-headline-lg mb-4">Oxidized Collection</h3>
              <p className="mb-6 font-body text-sm md:text-base opacity-90">
                Embrace the vintage charm of handcrafted silver-toned treasures.
              </p>
              <Link 
                to="/collections?search=Oxidized" 
                className="inline-block border-b-2 border-white font-button text-button w-fit pb-1 hover:border-secondary-fixed transition-colors uppercase tracking-widest text-xs font-bold"
              >
                EXPLORE COLLECTION
              </Link>
            </div>
          </div>

          <div className="relative h-[500px] overflow-hidden group rounded-lg shadow-sm">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK8nd2coY1isJqRzvXto4Lu2N0iKWKYfZnZAXvo54vEjVKh44ECmZSQIyB6vLWKgLmJzQRHucYyxnEfqUDFEhEmDW3fn1ESKe3pswSUx65wZeEbZtvRunlB6HT31ZnazG6I2une2IXMHXDlr8x0Nqkh8iFKkk3t3H7ciga4_w0TWKWbrwvLr4bJbpxzaSwp1BjEZnLjiKYkfM9rs7GMHTjp9qOltONfiVA0e7FCx1UwfqPck1HWLN3ICGNl1f5mNYy0ffgJmwyyEp2" 
              alt="Anti-Tarnish Daily Wear"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
              <h3 className="font-display text-headline-lg mb-4">Anti-Tarnish Daily Wear</h3>
              <p className="mb-6 font-body text-sm md:text-base opacity-90">
                Everyday luxury that stays bright, no matter what your day holds.
              </p>
              <Link 
                to="/collections?search=Daily" 
                className="inline-block border-b-2 border-white font-button text-button w-fit pb-1 hover:border-secondary-fixed transition-colors uppercase tracking-widest text-xs font-bold"
              >
                SHOP DAILY WEAR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Season Banner */}
      <section className="relative h-[530px] flex items-center justify-center text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHo6ubW2Cwy0rA6y7XGNIXAd30nZH2Wsa7MlQ7e4Fdeu-RXUuu9ik5FbSfK_S5L4o35yukXuuUYKsQKvAqKbtg66U-UeTnAeuFxkoUR5ZG_bMBa8HUNbEeR1k1d01mZoBmWVdK9PUkQPgyU6joPatsCBdF2VdwXbdbRnDYGi_SCqXmne6OB_XRqC_w0YgUDGlNuZxWLKi0dE39M2ogQx0h4HVw1XTfiRQ3agEAOAZL4CxnU6OMcyuWrMUgNu_Ho-MzqmYMLS-1uItG')" 
          }}
        ></div>
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
        <div className="relative p-6 max-w-2xl">
          <p className="text-secondary-fixed font-label-md tracking-[0.4em] mb-6 uppercase text-sm">
            FRESH FROM THE ATELIER
          </p>
          <h2 className="font-display text-display-lg-mobile md:text-display-lg text-white mb-10">
            Just Dropped!
          </h2>
          <Link 
            to="/collections" 
            className="bg-surface text-primary px-12 py-4 rounded-[4px] font-button text-button hover:bg-secondary-container hover:text-on-secondary-container transition-all uppercase tracking-widest text-xs font-bold inline-block"
          >
            SHOP ALL NEW
          </Link>
        </div>
      </section>

      {/* New Arrivals Product Row */}
      <section className="py-section-v">
        <div className="max-w-max-width mx-margin-desktop px-margin-mobile">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-headline-lg text-primary">New Arrivals</h2>
              <p className="text-on-surface-variant font-body-md mt-2">
                The latest masterpieces from our heritage collection.
              </p>
            </div>
            <Link 
              to="/collections" 
              className="hidden md:block text-primary font-bold border-b border-primary pb-1 text-sm tracking-wider uppercase"
            >
              View All
            </Link>
          </div>
          
          <div className="flex gap-gutter-desktop overflow-x-auto hide-scrollbar pb-8">
            {newArrivals.map((product) => (
              <div key={product.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="block md:hidden text-center mt-4">
            <Link 
              to="/collections" 
              className="inline-block text-primary font-bold border-b border-primary pb-1 text-sm tracking-wider uppercase"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Strip */}
      <section className="py-16 bg-surface border-y border-outline-variant px-margin-mobile">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-headline-lg mb-4 text-primary">Join the Inner Circle</h2>
          <p className="text-on-surface-variant mb-10">
            Subscribe to receive early access to new launches, exclusive offers, and styling tips.
          </p>
          <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSubscribe}>
            <input 
              className="flex-1 px-6 py-4 bg-surface-container border-none rounded-[4px] focus:ring-2 focus:ring-secondary transition-all outline-none" 
              placeholder="Your email address" 
              type="email"
              required
            />
            <button 
              type="submit"
              className="bg-primary text-white px-10 py-4 rounded-[4px] font-button text-button hover:bg-primary/90 transition-all uppercase tracking-widest font-bold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
