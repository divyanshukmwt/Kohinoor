# Kohinoor — AI-Powered Heritage & Luxury Jewellery Platform

Clean, minimal jewellery e-commerce platform with an integrated **Guided AI Jewellery Stylist**, **Seeded Jewellery Knowledge Base** (no Pinecone required), and **Dynamic Gemini Model & API Key selection**.

---

## Quick Start

### 1. Start the FastAPI Backend (Auto-Seeds SQLite + Knowledge Base)
```bash
cd backend
python -m scripts.seed_products
python -m uvicorn app.main:app --reload --port 8000
```
- Uses local SQLite (`backend/kohinoor_store.db`) and `backend/app/data/jewellery_knowledge_base.json` out of the box—no Docker or Pinecone required.
- Optional PostgreSQL: set `USE_POSTGRES=true` and `DATABASE_URL=postgresql://...` in `backend/.env`.

### 2. Start the Frontend (`frontend new`)
```bash
cd "frontend new"
npm install
npm run dev
```
Open **http://localhost:5173**

---

## Key Features

1. **Seeded Jewellery Knowledge Base (No Pinecone)**:
   - 16 curated pieces across **Necklaces, Earrings, Rings, and Bracelets/Anklets** stored in `backend/app/data/jewellery_knowledge_base.json` and auto-seeded into the database on startup.
2. **Guided + Conversational AI Stylist (`AIConcierge.jsx`)**:
   - Click **AI Stylist** in the navigation bar or bottom-right corner.
   - Answer the guided questions (Occasion, Piece Type, Material, Style, Budget) or type your question directly.
   - Refines your question and retrieves matching products with instant **View Details** and **Add to Bag** actions.
3. **Dynamic Gemini Model & API Key Selector**:
   - Click **Model** inside the AI Stylist header to dynamically switch between:
     - `gemini-2.5-flash`
     - `gemini-2.5-pro`
     - `gemini-2.0-flash`
     - `gemini-1.5-flash`
     - `gemini-1.5-pro`
   - Supply your own Gemini API key at runtime (or leave blank to use `GEMINI_API_KEY` from `backend/.env` or deterministic local Knowledge Base refinement).
