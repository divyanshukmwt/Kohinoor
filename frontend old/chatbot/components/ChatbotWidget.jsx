"use client";

import React, { useEffect } from "react";
import FloatingButton from "./FloatingButton";
import ChatWindow from "./ChatWindow";
import { useChatbot, useGSAP } from "../hooks/useChatbot";
import "../styles/chatbot.css";

/**
 * ChatbotWidget — The luxury Éclat jewellery concierge
 * Drop into any layout: <ChatbotWidget />
 */
export default function ChatbotWidget({
  accentColor = "#C9A84C",
  position = "bottom-right",
}) {
  useGSAP();

  const {
    messages,
    isTyping,
    isOpen,
    flowStep,
    conversationPhase,
    cartNotification,
    inputValue,
    messagesContainerRef,
    toggleChat,
    closeChat,
    handleCapsuleSelect,
    handleUserMessage,
    setInputValue,
    resetChat,
  } = useChatbot();

  const positionClass = position === "bottom-left"
    ? "eclat-widget--left"
    : "eclat-widget--right";

  useEffect(() => {
    if (accentColor !== "#C9A84C") {
      document.documentElement.style.setProperty("--eclat-gold", accentColor);
    }
  }, [accentColor]);

  // cartNotification can be { productName, action } or null
  const toastText = cartNotification
    ? typeof cartNotification === "string"
      ? cartNotification
      : `${cartNotification.productName} added to bag`
    : null;

  return (
    <div className={`eclat-widget ${positionClass}`}>
      {/* Cart notification toast */}
      {toastText && (
        <div className="eclat-cart-toast">
          <span className="eclat-cart-icon">◆</span>
          {toastText}
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          isOpen={isOpen}
          flowStep={flowStep}
          conversationPhase={conversationPhase}
          inputValue={inputValue}
          onClose={closeChat}
          onReset={resetChat}
          onCapsuleSelect={handleCapsuleSelect}
          onUserMessage={handleUserMessage}
          onInputChange={setInputValue}
          messagesContainerRef={messagesContainerRef}
        />
      )}

      {/* Floating trigger button */}
      <FloatingButton
        onClick={toggleChat}
        isOpen={isOpen}
        hasNotification={!isOpen && messages.length === 0}
      />
    </div>
  );
}
