/**
 * Chatbot Flow Configuration — Éclat Platform
 * 
 * Budget keys here MUST match backend BUDGET_RANGES in recommendation_engine.py
 */

export const FLOW_STEPS = [
  {
    id: 'purpose',
    step: 1,
    question: 'What is the purpose of your jewellery purchase?',
    options: [
      { label: 'Gifting',          value: 'gifting',           icon: '◇' },
      { label: 'Wedding',          value: 'wedding',           icon: '◈' },
      { label: 'Anniversary',      value: 'anniversary',       icon: '◉' },
      { label: 'Daily Wear',       value: 'daily wear',        icon: '◌' },
      { label: 'Self Purchase',    value: 'self purchase',     icon: '◎' },
      { label: 'Luxury Collection',value: 'luxury collection', icon: '◆' },
      { label: 'Special Occasion', value: 'special occasion',  icon: '◐' },
    ],
  },
  {
    id: 'gender',
    step: 2,
    question: 'Who is this piece for?',
    options: [
      { label: 'Her',    value: 'female', icon: '○' },
      { label: 'Him',    value: 'male',   icon: '●' },
      { label: 'Unisex', value: 'unisex', icon: '◎' },
    ],
  },
  {
    id: 'material',
    step: 3,
    question: 'Which material speaks to you?',
    options: [
      { label: 'Gold',      value: 'gold',      icon: '◆' },
      { label: 'Silver',    value: 'silver',    icon: '◇' },
      { label: 'Rose Gold', value: 'rose gold', icon: '◈' },
      { label: 'Platinum',  value: 'platinum',  icon: '◉' },
      { label: 'Diamond',   value: 'diamond',   icon: '◎' },
    ],
  },
  {
    id: 'wearType',
    step: 4,
    question: 'Where will it be worn?',
    options: [
      { label: 'Neck',   value: 'neck',   icon: '◌' },
      { label: 'Wrist',  value: 'wrist',  icon: '◎' },
      { label: 'Finger', value: 'finger', icon: '○' },
      { label: 'Ear',    value: 'ear',    icon: '●' },
    ],
  },
  {
    id: 'style',
    step: 5,
    question: 'What aesthetic defines your vision?',
    options: [
      { label: 'Minimal',   value: 'minimal',   icon: '—' },
      { label: 'Elegant',   value: 'elegant',   icon: '◇' },
      { label: 'Bold',      value: 'bold',      icon: '◆' },
      { label: 'Timeless',  value: 'timeless',  icon: '◎' },
      { label: 'Modern',    value: 'modern',    icon: '○' },
    ],
  },
  {
    id: 'budget',
    step: 6,
    question: 'What is your investment range?',
    options: [
      { label: 'Under ₹5,000',       value: 'under_5k', icon: '◌', max: 5000 },
      { label: '₹5k — ₹15k',         value: '5k_15k',   icon: '◇', min: 5000,  max: 15000 },
      { label: '₹15k — ₹50k',        value: '15k_50k',  icon: '◈', min: 15000, max: 50000 },
      { label: 'Luxury Collection',   value: 'luxury',   icon: '◆', min: 50000 },
    ],
  },
];

export const BUDGET_RANGES = {
  under_5k: { min: 0,     max: 5_000 },
  '5k_15k': { min: 5_000, max: 15_000 },
  '15k_50k':{ min: 15_000,max: 50_000 },
  luxury:   { min: 50_000,max: Infinity },
};

export const STEP_KEYS = ['purpose', 'gender', 'material', 'wearType', 'style', 'budget'];

export default FLOW_STEPS;
