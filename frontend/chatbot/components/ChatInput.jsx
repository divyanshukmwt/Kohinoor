import React, { useRef } from "react";

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  conversationPhase,
}) {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  const showInput =
    conversationPhase === "conversational" ||
    conversationPhase === "recommendations";

  if (!showInput) {
    return (
      <div className="eclat-input-placeholder">
        <span>Select an option above to continue</span>
      </div>
    );
  }

  return (
    <div className="eclat-chat-input-wrap">
      <div className="eclat-input-container">
        <input
          ref={inputRef}
          type="text"
          className="eclat-chat-input"
          placeholder="Ask for any piece you desire..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          className="eclat-input-send"
          onClick={() => onSubmit(value)}
          disabled={disabled || !value.trim()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 8L2 2L5.5 8L2 14L14 8Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <div className="eclat-input-hint">
        Powered by Éclat AI · Semantic Jewellery Discovery
      </div>
    </div>
  );
}
