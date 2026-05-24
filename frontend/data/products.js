/**
 * Mock product data for Aurelia Lore
 * Replace with API calls via services/products.js when backend is ready
 */

export const PRODUCTS = [
  {
    id: 'aura-solitaire-ring',
    slug: 'aura-solitaire-ring',
    name: 'Aura Solitaire Ring',
    category: 'rings',
    price: 4850,
    originalPrice: null,
    discount: null,
    description:
      'A breathtaking 1.2ct oval diamond, set in a hand-forged 18k champagne gold band. The tension setting allows light to pass beneath the stone, creating an ethereal halo effect. Each ring is individually crafted over six weeks in our Geneva atelier.',
    shortDescription: 'Oval diamond in 18k champagne gold. A study in pure light.',
    stock: 3,
    rating: 4.9,
    reviewCount: 24,
    materials: ['18k Champagne Gold', 'Oval Diamond 1.2ct', 'VS1 Clarity'],
    dimensions: 'Stone: 9mm × 7mm · Band width: 1.8mm',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_Q93cuGxfblNSYTry8AijmrQzW28ZPHgsxDbhT_SxL2ta_7pMwEou--Bk-l4El7P6OI3mg8ZoF55U2JttCnQZD2Augie0jyNccXi3oF9MZKnQW50hufvX_NhsE6yJGrE-EmU2gWZ5FVr9_YjvQJbz6t3MXIopRWWY8xmjbh0bGMbh_arjmiNGJRIZ6gHnsgt2BSvlfIs5vttRe9b6Co7M-DZ1TIAOAba8g36JEPDIQa92GMcrEOJ5M3h5w9plW3XfWOmYTDKXoCx',
        alt: 'Aura Solitaire Ring front view',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxKnPnxbcU9GL3Kn0xf5G0BXI-Y8NnPH2D6LlwQl2PVoX-AJKEXJXsftlDYJ3G4ZBfzIJGZJOKoTrnMpf7xY1EUU5hfM3Y1ihwSjbm_8Lfrtp5ec93DYElgr_LNnas7P2E-Ve0PJlb6X3hW1D4cowsIkEX5E-hCagUXY3spMESwaSo0cmMZhGS9hZY1D0Pbd9AHxuqKAoie4B57ZDJP48rU9n5teNnBqW71NswuOSxQ1lEb_Rp_gerPkiW0GLm9NcMbF8LMuxiblQ',
        alt: 'Aura Solitaire Ring side profile',
      },
    ],
    tags: ['bestseller', 'diamond', 'rings'],
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    relatedProductIds: ['lumiere-drop-earrings', 'celestial-band', 'cascade-necklace'],
  },
  {
    id: 'lumiere-drop-earrings',
    slug: 'lumiere-drop-earrings',
    name: 'Lumière Drop Earrings',
    category: 'earrings',
    price: 3200,
    originalPrice: null,
    discount: null,
    description:
      'Inspired by the way afternoon light fractures through crystal, these pendant earrings feature hand-cut pear-shaped diamonds cascading from a delicate 18k rose gold chain. A contemporary take on the chandelier earring, distilled to its most essential form.',
    shortDescription: 'Cascading pear diamonds in 18k rose gold. Pure suspended light.',
    stock: 5,
    rating: 4.8,
    reviewCount: 18,
    materials: ['18k Rose Gold', 'Pear Diamond 0.8ct total', 'VVS2 Clarity'],
    dimensions: 'Drop length: 42mm · Stone: 6mm × 4mm each',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxKnPnxbcU9GL3Kn0xf5G0BXI-Y8NnPH2D6LlwQl2PVoX-AJKEXJXsftlDYJ3G4ZBfzIJGZJOKoTrnMpf7xY1EUU5hfM3Y1ihwSjbm_8Lfrtp5ec93DYElgr_LNnas7P2E-Ve0PJlb6X3hW1D4cowsIkEX5E-hCagUXY3spMESwaSo0cmMZhGS9hZY1D0Pbd9AHxuqKAoie4B57ZDJP48rU9n5teNnBqW71NswuOSxQ1lEb_Rp_gerPkiW0GLm9NcMbF8LMuxiblQ',
        alt: 'Lumière Drop Earrings front view',
      },
    ],
    tags: ['earrings', 'diamond', 'rose-gold'],
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    relatedProductIds: ['aura-solitaire-ring', 'cascade-necklace'],
  },
  {
    id: 'celestial-band',
    slug: 'celestial-band',
    name: 'Celestial Band',
    category: 'rings',
    price: 2400,
    originalPrice: null,
    discount: null,
    description:
      'A constellation of pavé-set brilliant diamonds traces the circumference of this refined eternity band. Set in 18k white gold, the stones are hand-selected for uniform brilliance. Meant to be worn alone, or stacked with intention.',
    shortDescription: 'Pavé diamond eternity band in 18k white gold.',
    stock: 8,
    rating: 4.7,
    reviewCount: 31,
    materials: ['18k White Gold', 'Pavé Diamonds 1.0ct total', 'F-G Color'],
    dimensions: 'Band width: 2.2mm · Stone size: 1.3mm each',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlpxlvj5Ns-LEBueYL19E3CJfWQr0pzCVcPFEMqi3aU8k1A12GB78Wc-8mZQUyqaI6cxGu8bUVAgQPvOrqhn5CQ8vM-OmbqVCxYDTFxEv9OGlIXGJrWL3N7Klg21Be8rAy7sf0jBUIUSBTXrvorB77YVWcfLmn406VRk7ShseIVay1UkpjkFubi7noU0On4thDqM7EN4WohM2pxbaFXbu-TVnDu7Ey3n_3uFRPQiQ0hU75hf4JLDlRTkND0a7s_YR__vVpe2HDT8Ug',
        alt: 'Celestial Band top view',
      },
    ],
    tags: ['rings', 'diamond', 'white-gold', 'eternity'],
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    relatedProductIds: ['aura-solitaire-ring', 'lumiere-drop-earrings'],
  },
  {
    id: 'cascade-necklace',
    slug: 'cascade-necklace',
    name: '18k Diamond Cascade Necklace',
    category: 'necklaces',
    price: 12800,
    originalPrice: null,
    discount: null,
    description:
      'The Cascade Necklace is the definitive statement piece of the Lumière collection. Three graduated strands of individually hand-knotted diamonds fall in perfect asymmetry against the décolletage. The centerpiece stone — a 2.4ct pear-shaped D-color diamond — catches light from every angle. Crafted over fourteen weeks in our Geneva atelier.',
    shortDescription: 'Three-strand diamond cascade in 18k yellow gold. The definitive statement.',
    stock: 1,
    rating: 5.0,
    reviewCount: 7,
    materials: ['18k Yellow Gold', 'Pear Diamond 2.4ct centerpiece', 'Pavé Diamonds 4.2ct total', 'D Color, VS1 Clarity'],
    dimensions: 'Length: 42cm adjustable · Centerpiece drop: 28mm',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiVfzwSl3dQsEoy05Mpggcx41gvqQkXvWxEv8-ii573O6nX9K6lndSE06NOZ5163yDTmHhYJfZIzCUwcDBkgkxpSwpQIO3igNgiqeIKO_Cu0YboQhfhRGVkVbfN8VeKxcnMqv5X40zsQj75EonLjpwfuYpx0jR5A7-wBILN69J0bmhdoW0F5Hdqso1Rz0gVD3JqHtsifA5t5jH0IAu5GXVDvTHzePXff07pASzX0uuCzQDhU7PqIdRabYx70MTBZG5H8dxqsyOGcRm',
        alt: 'Diamond Cascade Necklace editorial shot',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSRLJA5zPSPaHVx0btaOzPXXFFW7meYKOAUOB3sbcYzMKVqD8wKya8b5SHoGuu1mt6mc5WkkFRBw1EkoPnmCBIIZcyRp7w7nS8u3sGfBoAOBz6uUxuEimWG35u3wzQa9Frhihu1w6mXdPaqKvw_VziYaMdvALNTGHPaiqSgtUBoDHycrrjRfHtCIEFnLxNGIQv-FmRch8VL9RjsyIv1y6TbR8S8e_ehCuxhIpGZKU29F6eGk6euWIlE9NA5vEyWsaoQnYrWIAihUWW',
        alt: 'Diamond Cascade Necklace worn editorial',
      },
    ],
    tags: ['necklaces', 'diamond', 'statement', 'yellow-gold'],
    isNew: false,
    isBestseller: false,
    isFeatured: true,
    relatedProductIds: ['aura-solitaire-ring', 'lumiere-drop-earrings', 'celestial-band'],
  },
  {
    id: 'soleil-bracelet',
    slug: 'soleil-bracelet',
    name: 'Soleil Tennis Bracelet',
    category: 'bracelets',
    price: 6400,
    originalPrice: null,
    discount: null,
    description:
      'A modern reimagining of the classic tennis bracelet. Sixty-four round brilliant diamonds are prong-set in a continuous line of 18k yellow gold, each stone individually assessed for cut quality. The result is a bracelet that moves with liquid grace.',
    shortDescription: '64 round brilliant diamonds in 18k yellow gold. Fluid, eternal.',
    stock: 4,
    rating: 4.9,
    reviewCount: 12,
    materials: ['18k Yellow Gold', 'Round Brilliant Diamonds 5.1ct total', 'E-F Color, VVS Clarity'],
    dimensions: 'Length: 18cm · Width: 3.4mm',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_Q93cuGxfblNSYTry8AijmrQzW28ZPHgsxDbhT_SxL2ta_7pMwEou--Bk-l4El7P6OI3mg8ZoF55U2JttCnQZD2Augie0jyNccXi3oF9MZKnQW50hufvX_NhsE6yJGrE-EmU2gWZ5FVr9_YjvQJbz6t3MXIopRWWY8xmjbh0bGMbh_arjmiNGJRIZ6gHnsgt2BSvlfIs5vttRe9b6Co7M-DZ1TIAOAba8g36JEPDIQa92GMcrEOJ5M3h5w9plW3XfWOmYTDKXoCx',
        alt: 'Soleil Tennis Bracelet',
      },
    ],
    tags: ['bracelets', 'diamond', 'tennis', 'yellow-gold'],
    isNew: true,
    isBestseller: false,
    isFeatured: false,
    relatedProductIds: ['cascade-necklace', 'celestial-band'],
  },
  {
    id: 'arc-pendant',
    slug: 'arc-pendant',
    name: 'Arc Pendant',
    category: 'necklaces',
    price: 1950,
    originalPrice: null,
    discount: null,
    description:
      'Architectural minimalism at its finest. A single arc of 18k gold, hand-hammered to create a matte texture that absorbs light rather than reflecting it. A piece for those who understand that restraint is its own form of luxury.',
    shortDescription: 'Hand-hammered 18k gold arc. Architecture as adornment.',
    stock: 12,
    rating: 4.6,
    reviewCount: 44,
    materials: ['18k Yellow Gold', 'Hand-hammered matte finish'],
    dimensions: 'Arc width: 38mm · Chain length: 45cm',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlpxlvj5Ns-LEBueYL19E3CJfWQr0pzCVcPFEMqi3aU8k1A12GB78Wc-8mZQUyqaI6cxGu8bUVAgQPvOrqhn5CQ8vM-OmbqVCxYDTFxEv9OGlIXGJrWL3N7Klg21Be8rAy7sf0jBUIUSBTXrvorB77YVWcfLmn406VRk7ShseIVay1UkpjkFubi7noU0On4thDqM7EN4WohM2pxbaFXbu-TVnDu7Ey3n_3uFRPQiQ0hU75hf4JLDlRTkND0a7s_YR__vVpe2HDT8Ug',
        alt: 'Arc Pendant close-up',
      },
    ],
    tags: ['necklaces', 'minimalist', 'yellow-gold'],
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    relatedProductIds: ['cascade-necklace', 'soleil-bracelet'],
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Pieces' },
  { id: 'rings', label: 'Rings' },
  { id: 'necklaces', label: 'Necklaces' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bracelets', label: 'Bracelets' },
];

export const PRICE_RANGES = [
  { id: 'under-2000', label: 'Under $2,000', min: 0, max: 2000 },
  { id: '2000-5000', label: '$2,000 – $5,000', min: 2000, max: 5000 },
  { id: '5000-10000', label: '$5,000 – $10,000', min: 5000, max: 10000 },
  { id: 'over-10000', label: 'Over $10,000', min: 10000, max: Infinity },
];

export const MATERIALS = [
  { id: '18k-yellow-gold', label: '18k Yellow Gold' },
  { id: '18k-white-gold', label: '18k White Gold' },
  { id: '18k-rose-gold', label: '18k Rose Gold' },
  { id: 'champagne-gold', label: 'Champagne Gold' },
  { id: 'diamond', label: 'Diamond' },
];
