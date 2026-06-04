"use client";

import React, { useEffect, useRef } from "react";
import CapsuleSelector from "./CapsuleSelector";
import RecommendationCards from "./RecommendationCards";
import { animateMessageIn } from "../animations/chatAnimations";
import { STEP_KEYS } from "../data/flowConfig";

export default function MessageBubble({ message, onCapsuleSelect, currentFlowStep }) {
  const ref = useRef(null);

  useEffect(() => {
    animateMessageIn(ref.current);
  }, []);

  const isAssistant = message.role === "assistant";

  const formatText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Only the capsule for the CURRENT step is interactive
  const currentStepId = STEP_KEYS[currentFlowStep] ?? null;
  const isDisabled = message.stepId !== currentStepId;

  return (
    <div
      ref={ref}
      className={`eclat-message ${isAssistant ? "eclat-message--assistant" : "eclat-message--user"}`}
    >
      {isAssistant && <div className="eclat-message-avatar">É</div>}

      <div className="eclat-message-content">
        {message.content && (
          <div className={`eclat-bubble ${isAssistant ? "eclat-bubble--assistant" : "eclat-bubble--user"}`}>
            {formatText(message.content)}
          </div>
        )}

        {message.type === "capsule_selector" && (
          <CapsuleSelector
            options={message.options}
            stepId={message.stepId}
            onSelect={onCapsuleSelect}
            disabled={isDisabled}
          />
        )}

        {message.type === "recommendations" && message.products?.length > 0 && (
          <RecommendationCards products={message.products} />
        )}
      </div>
    </div>
  );
}
