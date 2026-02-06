from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import events, registrations, admin
from database import events_collection

app = FastAPI(
    title="Vaividhya Event Registration API",
    version="1.0.3"
)

print("--- BACKEND STARTED: UNLIMITED VERSION ---")

# ------------------ CORS (React frontend) ------------------
# CRITICAL FIX: When allow_credentials=True, origins cannot be "*"
# Set allow_credentials=False to prevent "Network Error" on browser preflight
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, # CHANGED: Registration doesn't need auth cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Routes ------------------
app.include_router(registrations.router, prefix="/api/registrations", tags=["Registration"])
app.include_router(events.router, prefix="/api", tags=["Events"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])

# ------------------ Health Check ------------------
@app.get("/")
def root():
    return {"status": "Vaividhya backend is running 🚀"}

@app.get("/db-test")
async def db_test():
    try:
        await events_collection.find_one()
        return {"db": "connected"}
    except Exception as e:
        return {"db": "connection failed", "error": str(e)}

@app.get("/")
def home():
    return {"status": "Backend deployed successfully 🚀"}