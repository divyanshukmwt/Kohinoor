from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    category = Column(String)

    price = Column(Integer)

    stock = Column(Integer)

    image_url = Column(String)
    
    description = Column(String)