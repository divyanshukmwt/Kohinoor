import React, { useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import { animateChatOpen, animateChatClose } from "../animations/chatAnimations";

export default function ChatWindow({
  messages,
  isTyping,
  isOpen,
  flowStep,
  conversationPhase,
  inputValue,
  onClose,
  onReset,
  onCapsuleSelect,
  onUserMessage,
  onInputChange,
  messagesContainerRef,
}) {
  const windowRef = useRef(null);

  useEffect(() => {
    if (isOpen && windowRef.current) {
      animateChatOpen(windowRef);
    }
  }, [isOpen]);

  const handleClose = () => {
    animateChatClose(windowRef, onClose);
  };

  return (
    <div className="eclat-chat-window" ref={windowRef}>
      {/* Decorative accent */}
      <div className="eclat-window-accent" />

      {/* Header */}
      <ChatHeader onClose={handleClose} onReset={onReset} />

      {/* Step progress bar */}
      {conversationPhase === "flow" && (
        <div className="eclat-progress-bar">
          <div
            className="eclat-progress-fill"
            style={{ width: `${(flowStep / 6) * 100}%` }}
          />
        </div>
      )}

      {/* Messages */}
      <div className="eclat-messages-container" ref={messagesContainerRef}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCapsuleSelect={onCapsuleSelect}
            currentFlowStep={flowStep}
          />
        ))}

        {isTyping && (
          <div className="eclat-message eclat-message--assistant">
            <div className="eclat-message-avatar">É</div>
            <div className="eclat-message-content">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSubmit={onUserMessage}
        disabled={isTyping}
        conversationPhase={conversationPhase}
      />
    </div>
  );
}
