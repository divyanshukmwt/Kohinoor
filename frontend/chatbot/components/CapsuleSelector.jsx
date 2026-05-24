import React, { useEffect, useRef } from "react";
import { animateCapsules, onCapsuleHover, onCapsuleHoverOut } from "../animations/chatAnimations";

export default function CapsuleSelector({ options, stepId, onSelect, disabled }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      animateCapsules(containerRef);
    }
  }, [disabled]);

  return (
    <div className="eclat-capsule-container" ref={containerRef}>
      {options.map((option) => (
        <button
          key={option.value}
          data-capsule
          className={`eclat-capsule ${disabled ? "eclat-capsule--disabled" : ""}`}
          onClick={() => !disabled && onSelect(stepId, option.value)}
          onMouseEnter={(e) => !disabled && onCapsuleHover(e.currentTarget)}
          onMouseLeave={(e) => !disabled && onCapsuleHoverOut(e.currentTarget)}
          disabled={disabled}
        >
          <span className="eclat-capsule-icon">{option.icon}</span>
          <span className="eclat-capsule-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
