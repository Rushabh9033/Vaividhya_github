from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URL from environment variable or use hardcoded fallback
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "vaividhya_db")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

events_collection = db.events
registrations_collection = db.registrations
admins_collection = db.admins
