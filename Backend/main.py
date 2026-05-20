from fastapi import FastAPI

from sqlalchemy.orm import sessionmaker

from database.connection import engine
from database.models import Product

app = FastAPI()

Session = sessionmaker(bind=engine)

@app.get("/")
def home():

    return {"message": "Backend Running"}

@app.get("/products")
def get_products():

    session = Session()

    products = session.query(Product).all()

    return products