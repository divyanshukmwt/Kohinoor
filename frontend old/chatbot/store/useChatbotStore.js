/**
 * Chatbot Store — Éclat Platform
 * 
 * Manages: conversation state, flow, recommendations, typing.
 * Cart actions delegate to the UNIFIED useCartStore (@/store/cartStore)
 * so chatbot-added items appear in the main CartDrawer.
 */

'use client';

import { create } from 'zustand';

const useChatbotStore = create((set, get) => ({
  // ── UI ────────────────────────────────────────────────────────────────
  isOpen:      false,
  isMinimized: false,

  // ── Conversation ──────────────────────────────────────────────────────
  messages:          [],
  isTyping:          false,
  conversationPhase: 'idle',   // idle | flow | recommendations | conversational

  // ── Flow ─────────────────────────────────────────────────────────────
  flowStep:  0,
  flowSelections: {
    purpose: null, gender: null, material: null,
    wearType: null, style: null, budget: null,
  },

  // ── Recommendations ───────────────────────────────────────────────────
  recommendations:          [],
  isLoadingRecommendations: false,
  recommendationSource:     null,
  lastEmbeddingQuery:       '',

  // ── Cart notifications (display only — actual cart = useCartStore) ─────
  cartNotification: null,

  // ── Input ─────────────────────────────────────────────────────────────
  inputValue: '',

  // ── UI actions ────────────────────────────────────────────────────────
  openChat:     () => set({ isOpen: true, isMinimized: false }),
  closeChat:    () => set({ isOpen: false }),
  toggleChat:   () => set((s) => ({ isOpen: !s.isOpen, isMinimized: false })),
  minimizeChat: () => set({ isMinimized: true }),
  setTyping:    (isTyping) => set({ isTyping }),
  setInputValue:(inputValue) => set({ inputValue }),

  // ── Message actions ───────────────────────────────────────────────────
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id:        `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          ...message,
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  // ── Flow actions ──────────────────────────────────────────────────────
  setConversationPhase: (conversationPhase) => set({ conversationPhase }),
  setFlowStep:          (flowStep) => set({ flowStep }),
  updateFlowSelection:  (key, value) =>
    set((state) => ({ flowSelections: { ...state.flowSelections, [key]: value } })),

  resetFlow: () =>
    set({
      flowStep:          0,
      flowSelections:    { purpose: null, gender: null, material: null, wearType: null, style: null, budget: null },
      conversationPhase: 'idle',
      recommendations:   [],
      recommendationSource: null,
      lastEmbeddingQuery:  '',
    }),

  // ── Recommendation actions ────────────────────────────────────────────
  setRecommendations: (recommendations, meta = {}) =>
    set({
      recommendations,
      recommendationSource: meta.source ?? null,
      lastEmbeddingQuery:   meta.embeddingQuery ?? '',
    }),
  setLoadingRecommendations: (v) => set({ isLoadingRecommendations: v }),
  clearRecommendations: () =>
    set({ recommendations: [], recommendationSource: null, lastEmbeddingQuery: '' }),

  // ── Cart actions (proxy to unified useCartStore) ───────────────────────
  /**
   * Add a single product to cart.
   * Delegates to the shared useCartStore so the main CartDrawer updates.
   */
  addToCart: async (product) => {
    const { default: useCartStore } = await import('@/store/cartStore');
    useCartStore.getState().addToCart(product);

    // Show chatbot-local notification
    set({ cartNotification: { productName: product.name, action: 'added' } });
    setTimeout(() => set({ cartNotification: null }), 3000);
  },

  /**
   * Add a "complete look" (multiple products) to cart.
   */
  addLookToCart: async (products) => {
    const { default: useCartStore } = await import('@/store/cartStore');
    products.forEach((p) => useCartStore.getState().addToCart(p));

    set({ cartNotification: { productName: `${products.length} pieces`, action: 'added' } });
    setTimeout(() => set({ cartNotification: null }), 3000);
  },
}));

export default useChatbotStore;
