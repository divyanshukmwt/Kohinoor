import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Collections } from './pages/Collections';
import { ProductDetail } from './pages/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { NavigationDrawer } from './components/NavigationDrawer';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-surface">
          {/* Global Header/Nav */}
          <Navbar />

          {/* Page Routing */}
          <main className="flex-grow pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              {/* Fallback routes for compatibility with older .html link structures */}
              <Route path="/listing.html" element={<Navigate to="/collections" replace />} />
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="/product.html" element={<Navigate to="/product/boho-pendant-necklace" replace />} />
              
              <Route path="/product/:productId" element={<ProductDetail />} />
              {/* Fallback routing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Global Interactive Overlays */}
          <CartDrawer />
          <SearchOverlay />
          <NavigationDrawer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
