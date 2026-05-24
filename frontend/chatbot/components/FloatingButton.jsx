import React, { useEffect, useRef } from "react";
import { animateFloatingButton } from "../animations/chatAnimations";

export default function FloatingButton({ onClick, isOpen, hasNotification }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      animateFloatingButton(buttonRef);
    }
  }, [isOpen]);

  return (
    <button
      ref={buttonRef}
      className={`eclat-floating-btn ${isOpen ? "eclat-floating-btn--open" : ""}`}
      onClick={onClick}
      aria-label="Open Jewellery Concierge"
    >
      {isOpen ? (
        <span className="eclat-floating-close">✕</span>
      ) : (
        <>
          <span className="eclat-floating-gem">◆</span>
          <span className="eclat-floating-label">Concierge</span>
          {hasNotification && <span className="eclat-floating-badge" />}
        </>
      )}
    </button>
  );
}
