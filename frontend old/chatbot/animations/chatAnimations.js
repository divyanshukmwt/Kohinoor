/**
 * Chatbot Animations
 * GSAP-powered cinematic motion for the luxury jewellery concierge.
 *
 * Motion principles:
 * - Calm, intentional, cinematic
 * - Slow eases with precision
 * - Editorial reveals
 * - Never bouncy or playful
 */

/**
 * Animate chatbot window opening
 */
export function animateChatOpen(containerRef) {
  if (typeof window === "undefined") return;

  const gsap = window.gsap;
  if (!gsap || !containerRef.current) return;

  gsap.fromTo(
    containerRef.current,
    {
      opacity: 0,
      y: 24,
      scale: 0.97,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: "power3.out",
    }
  );
}

/**
 * Animate chatbot window closing
 */
export function animateChatClose(containerRef, onComplete) {
  if (typeof window === "undefined") return;

  const gsap = window.gsap;
  if (!gsap || !containerRef.current) {
    onComplete?.();
    return;
  }

  gsap.to(containerRef.current, {
    opacity: 0,
    y: 16,
    scale: 0.97,
    duration: 0.35,
    ease: "power2.in",
    onComplete,
  });
}

/**
 * Animate message bubble appearing
 */
export function animateMessageIn(element) {
  if (typeof window === "undefined" || !element) return;

  const gsap = window.gsap;
  if (!gsap) return;

  gsap.fromTo(
    element,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
  );
}

/**
 * Animate capsule options appearing
 */
export function animateCapsules(containerRef) {
  if (typeof window === "undefined") return;

  const gsap = window.gsap;
  if (!gsap || !containerRef.current) return;

  const capsules = containerRef.current.querySelectorAll("[data-capsule]");

  gsap.fromTo(
    capsules,
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      stagger: 0.06,
      ease: "power2.out",
    }
  );
}

/**
 * Animate product cards appearing
 */
export function animateProductCards(containerRef) {
  if (typeof window === "undefined") return;

  const gsap = window.gsap;
  if (!gsap || !containerRef.current) return;

  const cards = containerRef.current.querySelectorAll("[data-product-card]");

  gsap.fromTo(
    cards,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.1,
    }
  );
}

/**
 * Animate floating button
 */
export function animateFloatingButton(buttonRef) {
  if (typeof window === "undefined") return;

  const gsap = window.gsap;
  if (!gsap || !buttonRef.current) return;

  // Subtle float animation
  gsap.to(buttonRef.current, {
    y: -4,
    duration: 2.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Capsule hover animation
 */
export function onCapsuleHover(element) {
  if (typeof window === "undefined" || !element) return;
  const gsap = window.gsap;
  if (!gsap) return;

  gsap.to(element, {
    scale: 1.03,
    duration: 0.25,
    ease: "power2.out",
  });
}

/**
 * Capsule hover out animation
 */
export function onCapsuleHoverOut(element) {
  if (typeof window === "undefined" || !element) return;
  const gsap = window.gsap;
  if (!gsap) return;

  gsap.to(element, {
    scale: 1,
    duration: 0.25,
    ease: "power2.out",
  });
}

/**
 * Scroll to bottom of messages container
 */
export function scrollToBottom(containerRef) {
  if (!containerRef.current) return;

  const gsap = window.gsap;
  if (gsap) {
    gsap.to(containerRef.current, {
      scrollTop: containerRef.current.scrollHeight,
      duration: 0.4,
      ease: "power2.out",
    });
  } else {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
}
