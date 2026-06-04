import React from "react";

export default function TypingIndicator() {
  return (
    <div className="eclat-typing-indicator">
      <span className="eclat-typing-dot" style={{ "--delay": "0s" }} />
      <span className="eclat-typing-dot" style={{ "--delay": "0.2s" }} />
      <span className="eclat-typing-dot" style={{ "--delay": "0.4s" }} />
    </div>
  );
}
