from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:1234@localhost/jewellery_ai"

engine = create_engine(DATABASE_URL)

connection = engine.connect()

print("Database Connected Successfully")

from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:1234@localhost/jewellery_ai"

engine = create_engine(DATABASE_URL)

connection = engine.connect()

print("Database Connected Successfully")

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base

DATABASE_URL = "postgresql://postgres:1234@localhost/jewellery_ai"

engine = create_engine(DATABASE_URL)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)

Base.metadata.create_all(engine)

print("Table Created Successfully")
