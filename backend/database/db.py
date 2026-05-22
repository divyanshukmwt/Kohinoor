from connection import engine
from models import Base

# Purani tables drop karke nai banao
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

print("Tables Created Successfully")