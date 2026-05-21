import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from pinecone import Pinecone
from database.connection import engine
from database.models import Product

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Session = sessionmaker(bind=engine)
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))

class RecommendRequest(BaseModel):
    category: str = ""
    material: str = ""
    occasion: str = ""
    budget: float = 0

@app.get("/")
def home():
    return {"message": "Kohinoor Backend Running"}

@app.get("/products")
def get_products():
    session = Session()
    products = session.query(Product).all()
    return products

@app.post("/recommend")
def recommend(req: RecommendRequest):
    results = index.query(
        vector=[0.1] * 1024,
        top_k=5,
        include_metadata=True
    )
    product_ids = [match["id"] for match in results["matches"]]
    session = Session()
    products = session.query(Product).filter(Product.id.in_(product_ids)).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "category": p.category,
            "images": p.images,
            "description": p.description,
            "occasions": p.occasions,
            "materials": p.materials,
            "style_tags": p.style_tags,
        }
        for p in products
    ]