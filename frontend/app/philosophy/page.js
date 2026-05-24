import Image from 'next/image';
import NewsletterSection from '@/components/sections/NewsletterSection';
import TypographyBlock from '@/components/ui/TypographyBlock';
import { FloatingCard } from '@/components/ui/FloatingElements';
import { SVGOrbit } from '@/components/ui/SVGCurves';
import PhilosophyAnimations from './PhilosophyAnimations';

export const metadata = {
  title: 'Our Philosophy',
  description:
    'Rooted in the belief that true luxury is indistinguishable from responsibility. The Aurelia Lore story.',
};

const PILLARS = [
  {
    number: '01',
    title: 'Provenance',
    body: 'Every stone is traced to its source. We maintain direct relationships with certified mines in Botswana and Canada, visiting annually to verify ethical standards firsthand.',
  },
  {
    number: '02',
    title: 'Craft',
    body: 'No automated production. Each piece is the work of a single master goldsmith, crafted entirely by hand over six to fourteen weeks in our Geneva atelier.',
  },
  {
    number: '03',
    title: 'Permanence',
    body: 'We design for generations, not seasons. Every material decision — gauge of gold, depth of setting, quality of clasp — is made with the next hundred years in mind.',
  },
  {
    number: '04',
    title: 'Transparency',
    body: 'Your piece ships with complete documentation of every stone\'s origin, weight, and certification. Our costs are real, our margins declared.',
  },
];

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen bg-ivory-base pt-28">
      <PhilosophyAnimations />

      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-matte-black">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiVfzwSl3dQsEoy05Mpggcx41gvqQkXvWxEv8-ii573O6nX9K6lndSE06NOZ5163yDTmHhYJfZIzCUwcDBkgkxpSwpQIO3igNgiqeIKO_Cu0YboQhfhRGVkVbfN8VeKxcnMqv5X40zsQj75EonLjpwfuYpx0jR5A7-wBILN69J0bmhdoW0F5Hdqso1Rz0gVD3JqHtsifA5t5jH0IAu5GXVDvTHzePXff07pASzX0uuCzQDhU7PqIdRabYx70MTBZG5H8dxqsyOGcRm"
            alt="Aurelia Lore philosophy — light through stone"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/20 to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-[80px] pb-24 max-w-[1440px] mx-auto w-full">
          <p className="philosophy-reveal font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-6">
            Est. 2008 · Geneva
          </p>
          <h1 className="philosophy-reveal font-bodoni text-[clamp(44px,7vw,96px)] text-ivory-base leading-tight max-w-3xl">
            Rooted in the belief that{' '}
            <em className="italic font-light text-champagne-gold">
              true luxury is indistinguishable
            </em>{' '}
            from responsibility.
          </h1>
        </div>
      </section>

      {/* ── Mission Statement ── */}
      <section className="py-32 px-6 md:px-[80px] bg-ivory-base">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5">
            <SVGOrbit className="w-48 h-48 text-champagne-gold/20 mx-auto lg:mx-0" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-6">
              Our Founding Principle
            </p>
            <p className="font-bodoni text-[clamp(22px,3vw,36px)] text-on-background leading-tight mb-8">
              In 2008, founder Margaux Delacroix set a single condition for creating Aurelia Lore:
              that every decision, from stone to setting to shipping, would be one she could
              stand behind publicly.
            </p>
            <p className="font-inter text-[16px] leading-8 text-on-surface-variant">
              Seventeen years later, that condition remains the only filter that matters. It has
              cost us contracts, suppliers, and convenience. It has given us something rarer: a
              coherent identity in a world of interchangeable luxury brands.
            </p>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ── */}
      <section className="py-28 px-6 md:px-[80px] bg-surface-container-low/30">
        <div className="max-w-[1440px] mx-auto">
          <TypographyBlock
            tag="The Foundation"
            line1="Four pillars."
            line2="No exceptions."
            size="lg"
            className="mb-20 max-w-xl"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-champagne-gold/10">
            {PILLARS.map((pillar) => (
              <div key={pillar.number} className="bg-ivory-base p-12 group hover:bg-surface-container-low transition-colors duration-500">
                <p className="font-bodoni text-[52px] text-champagne-gold/30 leading-none mb-6 group-hover:text-champagne-gold/50 transition-colors duration-500">
                  {pillar.number}
                </p>
                <h3 className="font-inter text-[11px] uppercase tracking-[0.1em] text-primary mb-4">
                  {pillar.title}
                </h3>
                <p className="font-inter text-[15px] leading-7 text-on-surface-variant">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team / Atelier ── */}
      <section className="py-32 px-6 md:px-[80px] bg-matte-black text-ivory-base">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlpxlvj5Ns-LEBueYL19E3CJfWQr0pzCVcPFEMqi3aU8k1A12GB78Wc-8mZQUyqaI6cxGu8bUVAgQPvOrqhn5CQ8vM-OmbqVCxYDTFxEv9OGlIXGJrWL3N7Klg21Be8rAy7sf0jBUIUSBTXrvorB77YVWcfLmn406VRk7ShseIVay1UkpjkFubi7noU0On4thDqM7EN4WohM2pxbaFXbu-TVnDu7Ey3n_3uFRPQiQ0hU75hf4JLDlRTkND0a7s_YR__vVpe2HDT8Ug"
                alt="Master goldsmith at work"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-champagne-gold mb-6">
              The People
            </p>
            <h2 className="font-bodoni text-[clamp(28px,4vw,52px)] text-ivory-base leading-tight mb-8">
              Fourteen pairs of hands. One
              <em className="italic font-light text-champagne-gold"> standard.</em>
            </h2>
            <p className="font-inter text-[16px] leading-8 text-ivory-base/65 mb-8">
              Our Geneva atelier employs fourteen goldsmiths and gemologists. Each has been with
              us for a minimum of eight years. Average tenure: sixteen years. There is no
              onboarding process for our kind of work — only decades.
            </p>
            <p className="font-inter text-[16px] leading-8 text-ivory-base/65">
              Our master goldsmith, Émile Dubois, has been setting diamonds since 1983. He has
              declined three offers to join much larger houses. He says his hands would not know
              what to do with assembly-line tolerances.
            </p>
          </div>
        </div>
      </section>

      {/* ── Numbers Strip ── */}
      <section className="py-20 px-6 md:px-[80px] bg-ivory-base border-b border-champagne-gold/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: '17', label: 'Years in operation' },
            { value: '14', label: 'Master craftspeople' },
            { value: '0', label: 'Automated processes' },
            { value: '∞', label: 'Year guarantee' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-bodoni text-[56px] text-on-background leading-none mb-2">
                {item.value}
              </p>
              <p className="font-inter text-[11px] uppercase tracking-[0.08em] text-outline">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
