import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from connection import engine
from models import Product
from pinecone import Pinecone

load_dotenv()

# PostgreSQL session
Session = sessionmaker(bind=engine)
session = Session()

# Pinecone connect
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))

# Sample product
product = Product(
    id="prd_102",
    slug="gold-diamond-necklace-2",
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
    embedding_text="Elegant 18K gold diamond necklace designed for wedding styling and anniversary gifting with timeless luxury aesthetics.",
    related_products=[],
    complete_look=[],
    featured=True
)

# PostgreSQL mein insert
session.add(product)
session.commit()
print("Product inserted in PostgreSQL!")

# Pinecone mein insert
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