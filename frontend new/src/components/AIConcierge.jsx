import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { fetchGuidedFlow, requestAiRecommendations } from '../services/api';

export const AIConcierge = () => {
  const { conciergeOpen, setConciergeOpen, toggleConcierge, addToCart } =
    useContext(AppContext);

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selections, setSelections] = useState({});
  const [questionInput, setQuestionInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchGuidedFlow().then((flowSteps) => {
      if (Array.isArray(flowSteps) && flowSteps.length > 0) {
        setSteps(flowSteps);
      }
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentStepIdx, result, isLoading]);

  const currentStep = steps[currentStepIdx] || null;

  const runRetrieval = async (updatedSelections, customQuery = '') => {
    setIsLoading(true);
    try {
      const response = await requestAiRecommendations({
        selections: updatedSelections,
        query: customQuery,
        topK: 4,
      });
      setResult(response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (field, option) => {
    const nextSelections = { ...selections, [field]: option.value };
    setSelections(nextSelections);

    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setCurrentStepIdx(steps.length);
      runRetrieval(nextSelections, questionInput);
    }
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const trimmed = questionInput.trim();
    if (!trimmed && Object.keys(selections).length === 0) return;
    runRetrieval(selections, trimmed);
  };

  const handleReset = () => {
    setSelections({});
    setCurrentStepIdx(0);
    setQuestionInput('');
    setResult(null);
  };

  const handleViewProduct = (productId) => {
    setConciergeOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleAddFromConcierge = (product) => {
    addToCart(product, 1, 'Standard', false);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!conciergeOpen && (
        <button
          onClick={toggleConcierge}
          className="fixed bottom-6 right-6 z-[65] flex items-center gap-2.5 bg-primary text-on-primary px-5 py-3.5 rounded-full shadow-lg hover:bg-primary/95 transition-colors duration-200 border border-gold-accent/40"
          aria-label="Open AI Jewellery Concierge"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
            auto_awesome
          </span>
          <span className="font-label-md text-xs tracking-widest uppercase font-semibold">
            AI Stylist
          </span>
        </button>
      )}

      {/* Backdrop on mobile */}
      <div
        onClick={() => setConciergeOpen(false)}
        className={`fixed inset-0 bg-black/30 z-[75] md:hidden transition-opacity duration-200 ${
          conciergeOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      />

      {/* Clean Minimal Concierge Panel */}
      <aside
        className={`fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[85] w-full md:w-[420px] max-h-[88vh] md:h-[620px] bg-surface border border-outline-variant/60 md:rounded-xl shadow-xl flex flex-col overflow-hidden transition-opacity duration-200 ${
          conciergeOpen
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-primary text-on-primary flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                diamond
              </span>
              <h3 className="font-display text-base font-semibold tracking-wide">
                Kohinoor AI Stylist
              </h3>
            </div>
            <p className="text-[11px] text-white/75 mt-0.5">
              Personal Jewellery Concierge
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReset}
              title="Reset preferences"
              className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setConciergeOpen(false)}
              title="Close"
              className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-surface">
          {/* Welcome Guidance Card */}
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
            <p className="text-xs text-on-surface leading-relaxed">
              Welcome to Kohinoor. Select your preferences below or type what you are looking for,
              and I will retrieve the matching pieces for you.
            </p>
          </div>

          {/* Selected Preference Summary Chips */}
          {Object.keys(selections).length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Your Selections
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-primary underline"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(selections).map(([key, val]) =>
                  val ? (
                    <span
                      key={key}
                      className="px-2.5 py-1 bg-secondary-container/70 text-on-secondary-container rounded-full text-[11px] font-medium capitalize"
                    >
                      {key === 'wearType' ? 'Piece' : key}: {String(val).replace('_', ' ')}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Active Guided Question Step */}
          {currentStep && !result && (
            <div className="bg-surface-container/60 border border-outline-variant/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                <span>
                  Step {currentStepIdx + 1} of {steps.length}
                </span>
                {Object.keys(selections).length > 0 && (
                  <button
                    type="button"
                    onClick={() => runRetrieval(selections, questionInput)}
                    className="text-primary font-bold hover:underline"
                  >
                    Retrieve Now →
                  </button>
                )}
              </div>

              <p className="font-display text-base text-on-surface font-semibold">
                {currentStep.question}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {(currentStep.options || []).map((opt) => {
                  const isSelected = selections[currentStep.field] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(currentStep.field, opt)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors duration-150 ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface border-outline-variant/70 text-on-surface hover:border-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clean, Minimal Loading State */}
          {isLoading && (
            <div className="p-4 rounded-lg border border-outline-variant/50 bg-surface-container-low text-xs text-on-surface-variant">
              Refining your request and retrieving matching pieces...
            </div>
          )}

          {/* Refined Question + Retrieved Products */}
          {result && !isLoading && (
            <div className="space-y-4">
              {result.refinedQuestion && (
                <div className="p-3.5 rounded-lg bg-surface-container border border-outline-variant/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
                    Refined Search Intent
                  </span>
                  <p className="text-xs font-medium text-on-surface">
                    {result.refinedQuestion}
                  </p>
                </div>
              )}

              {result.conciergeMessage && (
                <p className="text-xs text-on-surface-variant leading-relaxed px-1">
                  {result.conciergeMessage}
                </p>
              )}

              {/* Matched Products List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface">
                    Retrieved Pieces ({(result.products || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-primary font-semibold hover:underline"
                  >
                    Start New Search
                  </button>
                </div>

                {(result.products || []).length > 0 ? (
                  (result.products || []).map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-3.5 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50 transition-colors duration-150"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        onClick={() => handleViewProduct(product.id)}
                        className="w-16 h-20 object-cover rounded bg-surface-container cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              onClick={() => handleViewProduct(product.id)}
                              className="text-xs font-bold text-on-surface hover:text-primary cursor-pointer truncate"
                            >
                              {product.name}
                            </h4>
                            <span className="text-xs font-bold text-primary flex-shrink-0">
                              ₹{Number(product.price || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                            {product.shortDescription || product.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleViewProduct(product.id)}
                            className="px-2.5 py-1 rounded border border-outline-variant text-[11px] font-semibold text-on-surface hover:border-primary transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddFromConcierge(product)}
                            className="px-3 py-1 rounded bg-primary text-on-primary text-[11px] font-semibold tracking-wider uppercase hover:bg-primary/90 transition-colors"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-surface-container text-center text-xs text-on-surface-variant">
                    No exact match found. Try broadening your preferences or asking a new question below.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Question Input */}
        <form
          onSubmit={handleQuestionSubmit}
          className="p-3.5 bg-surface-container-low border-t border-outline-variant/50 flex gap-2"
        >
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Or type your question (e.g. rose gold ring under ₹15,000)..."
            className="flex-1 bg-surface border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-on-primary px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Find
          </button>
        </form>
      </aside>
    </>
  );
};
