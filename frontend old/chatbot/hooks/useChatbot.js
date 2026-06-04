'use client';

import { useEffect, useRef, useCallback } from 'react';
import useChatbotStore from '../store/useChatbotStore';
import { FLOW_STEPS, STEP_KEYS } from '../data/flowConfig';
import { generateChatResponse } from '../services/gemini';
import {
  getFlowRecommendations,
  getConversationalRecommendations,
} from '../services/recommendations';

/**
 * useChatbot — Core conversation orchestration hook.
 *
 * Handles: flow progression, recommendation fetching,
 * conversational responses, and cart actions.
 */
export function useChatbot() {
  const store = useChatbotStore();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [store.messages, store.isTyping]);

  // Start flow on first open
  useEffect(() => {
    if (store.isOpen && store.messages.length === 0) {
      startConversation();
    }
  }, [store.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ─────────────────────────────────────────────────────────
  const addAssistantMessage = useCallback((content, delayMs = 0, extras = {}) => {
    setTimeout(() => {
      useChatbotStore.getState().addMessage({ role: 'assistant', content, ...extras });
    }, delayMs);
  }, []);

  const addUserMessage = useCallback((content) => {
    useChatbotStore.getState().addMessage({ role: 'user', content });
  }, []);

  const simulateTyping = useCallback((duration) => {
    useChatbotStore.getState().setTyping(true);
    return new Promise((resolve) =>
      setTimeout(() => {
        useChatbotStore.getState().setTyping(false);
        resolve();
      }, duration)
    );
  }, []);

  // ── Flow ─────────────────────────────────────────────────────────────
  const startConversation = useCallback(async () => {
    const s = useChatbotStore.getState();
    s.setConversationPhase('flow');
    s.setFlowStep(0);
    addAssistantMessage(
      "Welcome. I am Éclat — your personal jewellery concierge.\n\nLet me help you discover something extraordinary.",
      0
    );
    setTimeout(() => presentFlowStep(0), 800);
  }, [addAssistantMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  const presentFlowStep = useCallback((stepIndex) => {
    const step = FLOW_STEPS[stepIndex];
    if (!step) return;
    addAssistantMessage(step.question, 0, {
      type:   'capsule_selector',
      stepId: step.id,
      options: step.options,
    });
  }, [addAssistantMessage]);

  const handleCapsuleSelect = useCallback(async (stepId, value) => {
    // Record selection using latest state (avoids stale closure)
    useChatbotStore.getState().updateFlowSelection(stepId, value);

    const currentStepIndex = STEP_KEYS.indexOf(stepId);
    const nextStepIndex    = currentStepIndex + 1;

    // Echo user selection
    const selectedOption = FLOW_STEPS[currentStepIndex]?.options.find((o) => o.value === value);
    addUserMessage(selectedOption?.label || value);

    useChatbotStore.getState().setFlowStep(nextStepIndex);

    if (nextStepIndex < FLOW_STEPS.length) {
      await simulateTyping(500);
      presentFlowStep(nextStepIndex);
    } else {
      // All steps complete — fetch recommendations
      await simulateTyping(800);
      addAssistantMessage('Exquisite taste. Searching our collection for you...', 0);
      await fetchAndDisplayRecommendations();
    }
  }, [addAssistantMessage, addUserMessage, simulateTyping, presentFlowStep]);

  const fetchAndDisplayRecommendations = useCallback(async () => {
    const s = useChatbotStore.getState();
    s.setLoadingRecommendations(true);
    s.setConversationPhase('recommendations');

    await simulateTyping(1000);

    try {
      // Always read latest selections from store state (not closure)
      const selections = useChatbotStore.getState().flowSelections;
      const result     = await getFlowRecommendations(selections);

      // result = { products: [], source: '...', embeddingQuery: '...' }
      const products = Array.isArray(result) ? result : (result.products ?? []);

      useChatbotStore.getState().setRecommendations(products, {
        source:         result.source,
        embeddingQuery: result.embeddingQuery,
      });

      if (products.length > 0) {
        addAssistantMessage(
          `I've curated ${products.length} piece${products.length > 1 ? 's' : ''} that speak to your vision.`,
          0,
          { type: 'recommendations', products }
        );
        setTimeout(() => {
          addAssistantMessage(
            "Would you like to refine further?\n\nYou may ask for:\n— elegant lightweight pieces\n— bold statement jewellery\n— minimal daily wear\n— a specific material or occasion",
            0
          );
          useChatbotStore.getState().setConversationPhase('conversational');
        }, 1600);
      } else {
        addAssistantMessage(
          "I wasn't able to find an exact match, but I'd love to guide you differently. What draws you most — a material, an occasion, or a feeling?",
          0
        );
        useChatbotStore.getState().setConversationPhase('conversational');
      }
    } catch (err) {
      console.error('[useChatbot] fetchRecommendations error:', err);
      addAssistantMessage(
        'My connection wavered for a moment. Please describe what you are looking for and I will find it.',
        0
      );
      useChatbotStore.getState().setConversationPhase('conversational');
    } finally {
      useChatbotStore.getState().setLoadingRecommendations(false);
    }
  }, [addAssistantMessage, simulateTyping]);

  const handleUserMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    addUserMessage(text);
    useChatbotStore.getState().setInputValue('');

    const phase      = useChatbotStore.getState().conversationPhase;
    const selections = useChatbotStore.getState().flowSelections;

    if (phase === 'conversational' || phase === 'recommendations') {
      await simulateTyping(900);

      try {
        const result   = await getConversationalRecommendations(text, selections);
        const products = Array.isArray(result) ? result : (result.products ?? []);

        if (products.length > 0) {
          useChatbotStore.getState().setRecommendations(products, {
            source:         result.source,
            embeddingQuery: result.embeddingQuery,
          });
          addAssistantMessage(
            `I found ${products.length} piece${products.length > 1 ? 's' : ''} that match your vision.`,
            0,
            { type: 'recommendations', products }
          );
        } else {
          // Fall back to Gemini conversational response
          const history = useChatbotStore
            .getState()
            .messages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content }));
          history.push({ role: 'user', content: text });
          const response = await generateChatResponse(history);
          addAssistantMessage(response, 0);
        }
      } catch (err) {
        console.error('[useChatbot] handleUserMessage error:', err);
        addAssistantMessage(
          'Something interrupted me — please try again.',
          0
        );
      } finally {
        useChatbotStore.getState().setTyping(false);
      }
    }
  }, [addAssistantMessage, addUserMessage, simulateTyping]);

  const resetChat = useCallback(() => {
    useChatbotStore.getState().resetFlow();
    useChatbotStore.getState().clearMessages();
    setTimeout(() => startConversation(), 100);
  }, [startConversation]);

  // ── Returned API ─────────────────────────────────────────────────────
  return {
    messages:                 store.messages,
    isTyping:                 store.isTyping,
    isOpen:                   store.isOpen,
    flowStep:                 store.flowStep,
    conversationPhase:        store.conversationPhase,
    recommendations:          store.recommendations,
    isLoadingRecommendations: store.isLoadingRecommendations,
    cartNotification:         store.cartNotification,
    inputValue:               store.inputValue,
    messagesContainerRef,
    messagesEndRef,
    openChat:                 store.openChat,
    closeChat:                store.closeChat,
    toggleChat:               store.toggleChat,
    handleCapsuleSelect,
    handleUserMessage,
    setInputValue:            store.setInputValue,
    addToCart:                store.addToCart,
    addLookToCart:            store.addLookToCart,
    resetChat,
  };
}

/**
 * useGSAP — Load GSAP from CDN (needed for chatbot animations)
 */
export function useGSAP() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current || typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    script.onload = () => { loaded.current = true; };
    document.head.appendChild(script);
  }, []);
}
