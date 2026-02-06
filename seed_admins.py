import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Hardcoded connection string as seen in other files
MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"

client = AsyncIOMotorClient(MONGO_URL)
db = client.vaividhya_db  # Correct DB name - matches database.py
admins_collection = db.admins

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

async def seed_admins():
    print("Clearing existing admins...")
    await admins_collection.delete_many({})
    
    admins = []
    # Specific credentials provided by user
    team_credentials = {
        "TEAM1": "92jAzvoC",
        "TEAM2": "Y9HwuSLm",
        "TEAM3": "ULBU1CU8",
        "TEAM4": "pm6srCqx",
        "TEAM5": "N5tX5QxB",
        "TEAM6": "egR2W5aP",
        "TEAM7": "EM9sEonA",
        "TEAM8": "J4ylrPI2",
        "TEAM9": "yyNd0U5j",
        "TEAM10": "ar7YBxY7"
    }

    print("Generating team admins...")
    for username, password in team_credentials.items():
        print(f"Hashing password for {username}: '{password}' (len: {len(password)})")
        hashed_password = pwd_context.hash(password)
        
        admins.append({
            "username": username,
            "password": hashed_password
        })
        print(f"Created {username}")
        
    await admins_collection.insert_many(admins)
    print("Admin seeding complete!")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_admins())
