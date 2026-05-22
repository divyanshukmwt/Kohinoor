# ======================================================
# PINECONE CLIENT - Kohinoor Jewelry Shop
# FILE: Kohinoor/backend/app/database/pinecone_client.py
# PURPOSE: Pinecone se connect karna
# ======================================================

import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

# Pinecone client banao
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Index se connect karo
index = pc.Index(os.getenv("PINECONE_INDEX"))

print("Pinecone Connected Successfully")