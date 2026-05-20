from connection import engine

from sqlalchemy.orm import sessionmaker

from models import Product

Session = sessionmaker(bind=engine)

session = Session()

product1 = Product(
    name="Gold Ring",
    category="Ring",
    price=5000,
    stock=10,
    image_url="uploads/ring.jpg",
    description="Beautiful Gold Ring"
)

session.add(product1)

session.commit()

print("Product Inserted Successfully")