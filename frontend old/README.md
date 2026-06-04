# AURELIA LORE — Luxury Fine Jewellery Frontend

A production-ready Next.js 15 frontend for Aurelia Lore, a luxury jewellery ecommerce brand.
Built with editorial aesthetics, GSAP cinematic animations, and a fully scalable architecture.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## 🗂 Project Structure

```
aurelia-lore/
├── app/                        # Next.js 15 App Router pages
│   ├── page.js                 # Homepage
│   ├── layout.js               # Root layout (Navbar, Footer, Providers)
│   ├── globals.css             # Global styles + Tailwind
│   ├── shop/
│   │   ├── page.js             # Shop listing page
│   │   └── [slug]/page.js      # Product detail page
│   ├── journal/
│   │   ├── page.js             # Journal listing
│   │   └── [slug]/page.js      # Journal post
│   ├── gallery/page.js         # Photo gallery
│   ├── philosophy/page.js      # Brand philosophy
│   ├── cart/page.js            # Cart page (standalone)
│   └── not-found.js            # 404 page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Fixed header with mobile menu
│   │   └── Footer.jsx          # Full footer with newsletter
│   ├── sections/
│   │   ├── HeroSection.jsx     # Cinematic homepage hero
│   │   ├── EditorialSection.jsx# Asymmetric editorial layouts
│   │   ├── InfiniteGallery.jsx # GSAP horizontal ticker
│   │   ├── JournalCard.jsx     # Journal post card
│   │   └── NewsletterSection.jsx
│   ├── product/
│   │   ├── ProductCard.jsx     # Product card with quick-add
│   │   ├── ProductGrid.jsx     # Responsive product grid
│   │   ├── ProductGallery.jsx  # PDP image gallery
│   │   ├── ProductTabs.jsx     # Description/Materials/Delivery
│   │   ├── AddToCartButton.jsx # Client-side cart CTA
│   │   └── FilterSidebar.jsx   # Shop filter controls
│   ├── cart/
│   │   └── CartDrawer.jsx      # Slide-out GSAP cart drawer
│   └── ui/
│       ├── SVGCurves.jsx       # Decorative SVG elements
│       ├── TypographyBlock.jsx # Animated oversized text
│       └── FloatingElements.jsx# Floating cards and stats
│
├── store/
│   └── cartStore.js            # Zustand cart store (persisted)
│
├── services/                   # API-ready service layer
│   ├── products.js             # Product CRUD (mocked)
│   ├── cart.js                 # Cart sync (mocked)
│   ├── orders.js               # Order management (mocked)
│   ├── search.js               # Search/filter (mocked)
│   └── journal.js              # Journal CMS (mocked)
│
├── data/
│   ├── products.js             # Mock product data
│   └── journal.js              # Mock editorial content
│
├── hooks/
│   ├── useGSAP.js              # Safe GSAP hook for Next.js
│   └── useLenis.js             # Lenis smooth scroll hook
│
├── animations/
│   └── gsap.js                 # Animation presets + utilities
│
├── constants/
│   └── navigation.js           # Nav links, footer links, site config
│
├── providers/
│   └── Providers.jsx           # GSAP + Lenis initialization
│
└── utils/
    └── helpers.js              # formatPrice, formatDate, cn, etc.
```

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 15.x | App Router, SSR/SSG |
| React | 19.x | UI framework |
| Tailwind CSS | 3.x | Utility-first styling |
| GSAP | 3.12.x | Cinematic animations |
| Lenis | 1.1.x | Smooth scrolling |
| Zustand | 5.x | Cart state management |

---

## 🎨 Design System

### Colors
| Token | Value | Use |
|-------|-------|-----|
| `ivory-base` | `#FCFAF2` | Background |
| `matte-black` | `#121212` | Dark sections |
| `champagne-gold` | `#E2C9A1` | Accents |
| `primary` | `#735c00` | Interactive |
| `outline` | `#7f7663` | Muted text |

### Typography
- **Headings**: Bodoni Moda (Google Fonts)
- **Body**: Inter (Google Fonts)
- Pattern: oversized serif + minimal sans-serif

### Motion
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (luxury feel)
- Scroll reveals: `power3.out`, 0.8–1.6s duration
- Stagger: 0.1–0.15s between elements

---

## 🔌 Connecting a Real API

All data fetching is abstracted in `services/`. To connect a backend:

1. Open the relevant service file (e.g. `services/products.js`)
2. Uncomment the `fetch()` call
3. Remove the mock data return

Example:
```js
// Before (mock):
export async function getProducts() {
  return PRODUCTS;
}

// After (real API):
export async function getProducts(filters = {}) {
  const res = await fetch(`/api/products?${new URLSearchParams(filters)}`);
  return res.json();
}
```

---

## 🛒 Cart State

Cart is managed via Zustand with localStorage persistence.

```js
import useCartStore from '@/store/cartStore';

const { addToCart, removeFromCart, items, getSubtotal } = useCartStore();
```

Actions: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

Deploy to Vercel:
```bash
npx vercel --prod
```

---

## 📝 Notes

- No checkout flow implemented (placeholder CTA only)
- All images use Aurelia Lore editorial photography via Google Hosted URLs
- Replace `data/products.js` and `data/journal.js` with CMS/API calls when backend is ready
- Cart persists across sessions via `zustand/middleware` `persist`
