import React from "react";
import useChatbotStore from "../store/useChatbotStore";

export default function ChatHeader({ onClose, onReset }) {
  const { conversationPhase } = useChatbotStore();

  return (
    <div className="eclat-chat-header">
      <div className="eclat-header-brand">
        <div className="eclat-header-gem">◆</div>
        <div className="eclat-header-text">
          <span className="eclat-header-name">Éclat</span>
          <span className="eclat-header-subtitle">Jewellery Concierge</span>
        </div>
      </div>

      <div className="eclat-header-status">
        <span className="eclat-status-dot" />
        <span className="eclat-status-label">Available</span>
      </div>

      <div className="eclat-header-actions">
        {conversationPhase !== "idle" && (
          <button
            className="eclat-header-btn"
            onClick={onReset}
            title="Start over"
          >
            ↺
          </button>
        )}
        <button
          className="eclat-header-btn eclat-header-btn--close"
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
