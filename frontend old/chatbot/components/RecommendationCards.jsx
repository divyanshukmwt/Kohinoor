import React, { useEffect, useRef } from "react";
import ProductCardMini from "./ProductCardMini";
import { animateProductCards } from "../animations/chatAnimations";

export default function RecommendationCards({ products }) {
  const containerRef = useRef(null);

  useEffect(() => {
    animateProductCards(containerRef);
  }, [products]);

  if (!products?.length) return null;

  return (
    <div className="eclat-recommendations" ref={containerRef}>
      <div className="eclat-recommendations-label">
        <span className="eclat-rec-line" />
        <span>Curated for You</span>
        <span className="eclat-rec-line" />
      </div>
      <div className="eclat-recommendations-grid">
        {products.map((product) => (
          <ProductCardMini key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
