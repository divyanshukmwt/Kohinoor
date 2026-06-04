# Kohinoor Jewelry Frontend

A luxury, high-end e-commerce frontend representing the perfect bridge between ancient Indian heritage and contemporary luxury. Built using React, Vite, Tailwind CSS, and React Router DOM.

## Project Features

* **Design Accuracy**: Built strictly according to `DESIGN.md` guidelines using curated warm cream, deep cherry red, soft gold, and natural dark brown tones.
* **Component-driven Architecture**: Fully modular components for Navbar, Navigation Sidebar, Slide-out Cart, Search Overlay, Product Cards, and Material Promise blocks.
* **State Management**: Context-based global cart, wishlist toggling, and layout state logic with LocalStorage synchronization.
* **Dynamic Search & Filtering**: Client-side query search with autocomplete and filter presets.
* **Product Details Showcase**: Multi-image thumbnail selection gallery, custom length option selector, details accordions, review board listings, and related product carousels.
* **Responsive Layouts**: Optimizations for Mobile, Tablet, Laptop, and Desktop screens, including a mobile-friendly header and a scroll-sensitive sticky mobile cart CTA.

## Tech Stack

* **Core**: React.js, JavaScript, HTML5, Vanilla CSS
* **Build tool**: Vite
* **Styling**: Tailwind CSS
* **Navigation**: React Router DOM (v6)
* **Icons**: Google Material Symbols Outlined

## File Structure

```text
/
├── package.json         - Dependencies & scripts
├── vite.config.js       - Vite React settings
├── tailwind.config.js   - Tailored design tokens config
├── postcss.config.js    - PostCSS config
├── index.html           - Main template including Google Fonts
├── src/
│   ├── main.jsx         - React bootstrapping
│   ├── App.jsx          - Global routing & providers layout
│   ├── index.css        - Global custom style configurations
│   ├── context/
│   │   └── AppContext.jsx - Cart, Wishlist, Drawer global state
│   ├── data/
│   │   └── products.js  - Wealthy mock product database (12 items)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── SearchOverlay.jsx
│   │   ├── NavigationDrawer.jsx
│   │   ├── ProductCard.jsx
│   │   └── MaterialPromise.jsx
│   └── pages/
│       ├── Home.jsx       - Banner slideshows, grid selections, newsletter
│       ├── Collections.jsx- Filter pills, sort selection, grid list, pagination
│       └── ProductDetail.jsx - Image zoom carousel, options, accordions, reviews
```

## Running the Project

### Installation
Install the project dependencies using npm:
```bash
npm install
```

### Dev Mode
Launch the local development environment:
```bash
npm run dev
```

### Production Build
Compile optimized production assets:
```bash
npm run build
```
The compiled files will be outputted under the `/dist` directory.
