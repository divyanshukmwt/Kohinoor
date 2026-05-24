# Éclat — AI-Powered Luxury Jewellery Platform

Cinematic AI-native jewellery commerce. Gemini → Pinecone → PostgreSQL → Editorial UI.

---

## Quick Start (3 commands)

```bash
# 1. Clone / unzip the project
cd kohinoor-final

# 2. Start PostgreSQL via Docker
docker-compose up postgres -d

# 3. Backend
cd backend
cp .env .env.local          # add your API keys
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m scripts.seed_products          # seed DB + Pinecone
uvicorn app.main:app --reload --port 8000

# 4. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Required | Notes                                    |
|-------------------|----------|------------------------------------------|
| `DATABASE_URL`    | ✅       | PostgreSQL connection string             |
| `GEMINI_API_KEY`  | ✅       | Google AI Studio — aistudio.google.com   |
| `PINECONE_API_KEY`| ✅       | app.pinecone.io                          |
| `PINECONE_INDEX`  | default  | `eclat-jewellery`                        |
| `ALLOWED_ORIGINS` | default  | `http://localhost:3000`                  |
| `ADMIN_API_KEY`   | default  | `eclat-dev-key`                          |

### Frontend (`frontend/.env.local`)

| Variable                       | Notes                                |
|--------------------------------|--------------------------------------|
| `NEXT_PUBLIC_API_URL`          | Backend URL — `http://localhost:8000`|
| `NEXT_PUBLIC_GEMINI_API_KEY`   | Optional — client-side chat only     |
| `NEXT_PUBLIC_MOCK_FALLBACK`    | `true` for offline dev               |

---

## Running Without API Keys (Mock Mode)

```env
# frontend/.env.local
NEXT_PUBLIC_MOCK_FALLBACK=true
```

Everything works with mock data — no PostgreSQL, Pinecone, or Gemini needed.

---

## Recommendation Pipeline

```
User completes flow (6 steps)
         │
         ▼
  POST /api/chatbot/recommend
         │
         ▼
  Gemini 1.5 Flash
  → embeddingQuery + filters (JSON)
         │
         ▼
  Pinecone
  → vector similarity search
  → ranked product IDs
         │
         ▼
  PostgreSQL
  → hydrate full product objects
         │
         ▼
  Frontend recommendation cards
  → Add to Bag → Unified Cart Store
  → CartDrawer updates instantly
```

---

## API Reference

### Products
```
GET  /api/products                     list with filters
GET  /api/products/featured            featured products
GET  /api/products/slug/{slug}         by slug (PDP)
POST /api/products/batch               batch by IDs
GET  /api/products/{id}                single product
POST /api/products                     create
PUT  /api/products/{id}                update
DELETE /api/products/{id}              delete
```

### Cart  (`X-Session-ID` header required)
```
GET    /api/cart                       get session cart
POST   /api/cart                       add item {productId, quantity}
PATCH  /api/cart/{itemId}              update quantity
DELETE /api/cart/{itemId}              remove item
DELETE /api/cart                       clear cart
```

### Orders  (`X-Session-ID` header required)
```
POST /api/orders                       create from cart
GET  /api/orders                       list session orders
GET  /api/orders/{id}                  get single order
```

### Chatbot
```
POST /api/chatbot/recommend            full pipeline
POST /api/chatbot/semantic-search      raw vector search
POST /api/chatbot/conversation         Éclat chat response
GET  /api/chatbot/flow                 flow step definitions
POST /api/chatbot/step                 advance step
POST /api/chatbot/index-product        upsert to Pinecone
POST /api/chatbot/index-products-bulk  bulk Pinecone upsert
```

### Admin  (`X-Admin-Key` header required)
```
POST   /api/admin/sync-pinecone            sync all products
POST   /api/admin/sync-pinecone/{id}       sync one product
DELETE /api/admin/sync-pinecone/{id}       remove from index
GET    /api/admin/stats                    platform stats
```

---

## Architecture

```
Browser
  ├── Next.js Frontend (port 3000)
  │     ├── Luxury UI  (GSAP + Lenis + Tailwind)
  │     ├── Chatbot Widget (Éclat Concierge)
  │     │     ├── useChatbot hook (flow orchestration)
  │     │     ├── useRecommendations (pipeline)
  │     │     └── useChatbotStore → useCartStore (unified)
  │     ├── services/products.js  → FastAPI /api/products
  │     ├── services/cart.js      → FastAPI /api/cart
  │     └── services/orders.js    → FastAPI /api/orders
  │
  └── FastAPI Backend (port 8000)
        ├── /api/products    → PostgreSQL
        ├── /api/cart        → PostgreSQL (session-based)
        ├── /api/orders      → PostgreSQL
        └── /api/chatbot
              ├── /recommend      → Gemini → Pinecone → PostgreSQL
              ├── /semantic-search→ Gemini embedding → Pinecone
              └── /conversation   → Gemini chat
```

---

## Cart Architecture

The chatbot and main UI share **one unified cart store** (`store/cartStore.js`).

- `useCartStore.addToCart(product)` — called from ProductCard, AddToCartButton, chatbot ProductCardMini
- Optimistic update → instant UI feedback
- Backend sync via `POST /api/cart` (non-blocking)
- `CartDrawer` reads from the same store — always in sync
- Persisted to localStorage via Zustand `persist` middleware

---

## Seeding & Pinecone Sync

```bash
# Seed DB with 10 sample products + auto-index to Pinecone
python -m scripts.seed_products

# Re-sync all products to Pinecone (run after bulk edits)
python -m scripts.sync_pinecone

# Sync a single product
python -m scripts.sync_pinecone prd_abc123
```

---

## Deployment

### Backend (Railway / Render)
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
Set `ALLOWED_ORIGINS` to your production frontend URL.

### Frontend (Vercel)
```bash
npx vercel --prod
```
Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
