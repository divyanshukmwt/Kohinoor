/**
 * useRecommendations Hook — Éclat Platform
 *
 * Encapsulates the recommendation lifecycle:
 * - Loading state management
 * - Error handling with graceful fallback
 * - Retry logic
 * - Integration with Zustand chatbot store
 */

import { useCallback, useState } from 'react';
import useChatbotStore from '../store/useChatbotStore';
import { getFlowRecommendations, getConversationalRecommendations } from '../services/recommendations';

export function useRecommendations() {
  const store = useChatbotStore();
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Fetch recommendations from flow selections.
   * Called after the last flow step is completed.
   */
  const fetchFlowRecommendations = useCallback(async (selections, conversationalQuery = '') => {
    setError(null);
    store.setLoadingRecommendations(true);

    try {
      const result = await getFlowRecommendations(selections, conversationalQuery);

      store.setRecommendations(result.products ?? [], {
        source:         result.source,
        embeddingQuery: result.embeddingQuery,
      });

      return result.products ?? [];
    } catch (err) {
      console.error('[useRecommendations] Flow error:', err);
      setError('Unable to retrieve recommendations. Please try again.');
      store.setRecommendations([]);
      return [];
    } finally {
      store.setLoadingRecommendations(false);
    }
  }, [store]);

  /**
   * Fetch recommendations from a free-text conversational query.
   */
  const fetchConversationalRecommendations = useCallback(async (query, context = {}) => {
    setError(null);
    store.setLoadingRecommendations(true);

    try {
      const result = await getConversationalRecommendations(query, context);

      store.setRecommendations(result.products ?? [], {
        source:         result.source,
        embeddingQuery: result.embeddingQuery,
      });

      return result.products ?? [];
    } catch (err) {
      console.error('[useRecommendations] Conversational error:', err);
      setError('Search failed. Please try a different query.');
      store.setRecommendations([]);
      return [];
    } finally {
      store.setLoadingRecommendations(false);
    }
  }, [store]);

  /**
   * Retry the last recommendation request.
   */
  const retry = useCallback(async () => {
    setRetryCount((c) => c + 1);
    const { flowSelections, conversationPhase } = store;
    if (conversationPhase === 'recommendations') {
      await fetchFlowRecommendations(flowSelections);
    }
  }, [store, fetchFlowRecommendations]);

  return {
    recommendations:          store.recommendations,
    isLoading:                store.isLoadingRecommendations,
    error,
    source:                   store.recommendationSource,
    embeddingQuery:           store.lastEmbeddingQuery,
    fetchFlowRecommendations,
    fetchConversationalRecommendations,
    retry,
    retryCount,
    clearRecommendations:     store.clearRecommendations,
  };
}
