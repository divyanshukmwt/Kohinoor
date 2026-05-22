import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from connection import engine
from models import Product
from pinecone import Pinecone

load_dotenv()

Session = sessionmaker(bind=engine)
session = Session()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))

product = Product(
    id="prd_101",
    slug="gold-diamond-necklace",
    name="Gold Diamond Necklace",
    description="Elegant 18K gold diamond necklace for weddings and anniversaries.",
    price=52400,
    stock=5,
    images=["https://ik.imagekit.io/kohinoor/necklace.jpg"],
    category="necklace",
    collection="bridal",
    materials=["gold", "diamond"],
    gemstones=["diamond"],
    gender=["women"],
    occasions=["wedding", "anniversary"],
    style_tags=["elegant", "luxury"],
    wear_type="neck",
    embedding_text="Elegant 18K gold diamond necklace designed for wedding styling.",
    related_products=[],
    complete_look=[],
    featured=True
)

session.add(product)
session.commit()
print("Product inserted in PostgreSQL!")

index.upsert(
    vectors=[
        {
            "id": "prd_101",
            "values": [0.1] * 1024,
            "metadata": {
                "category": "necklace",
                "materials": ["gold", "diamond"],
                "occasions": ["wedding", "anniversary"],
                "styleTags": ["elegant", "luxury"],
                "wearType": "neck",
                "price": 52400
            }
        }
    ]
)
print("Product inserted in Pinecone!")
print("All Done!")