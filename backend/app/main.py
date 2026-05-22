from fastapi import FastAPI
from app.products.product_routes import router as product_router
from app.cart.cart_routes import router as cart_router
from app.orders.order_routes import router as order_router
from app.chatbot.chatbot_routes import router as chatbot_router

app = FastAPI(title="Kohinoor Jewelry API")

app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(chatbot_router)

@app.get("/")
def home():
    return {"message": "Welcome to Kohinoor Jewelry API"}
