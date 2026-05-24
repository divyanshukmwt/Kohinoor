import './globals.css';
import Providers from '@/providers/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ChatbotWidget from '@/chatbot/components/ChatbotWidget';

export const metadata = {
  title: {
    default: 'AURELIA LORE — Luxury Fine Jewellery',
    template: '%s | AURELIA LORE',
  },
  description:
    'Uncompromising artisanal excellence. We craft heirlooms that capture light and transcend generations. Ethical diamonds. Geneva atelier.',
  keywords: ['luxury jewellery', 'fine jewelry', 'ethical diamonds', 'Geneva', 'heirloom'],
  openGraph: {
    title: 'AURELIA LORE — Luxury Fine Jewellery',
    description: 'Crafted for Eternity. Ethically sourced, Geneva atelier.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-ivory-base text-on-surface antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          {/* Éclat AI Jewellery Concierge */}
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
