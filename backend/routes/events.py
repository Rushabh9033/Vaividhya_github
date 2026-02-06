from fastapi import APIRouter
from database import events_collection, registrations_collection
from models.event import Event

router = APIRouter()

@router.get("/events")
async def list_events():
    events = await events_collection.find({}, {"_id": 0}).to_list(100)
    return events

@router.post("/events")
async def create_event(event: Event):
    await events_collection.insert_one(event.dict())
    return {"message": "Event created"}

@router.get("/availability")
async def get_event_availability():
    # 1. Hardcoded Permanent Closures (User Order)
    PERMANENTLY_CLOSED = [
        "free-fire-pro", 
        "web-treasure-hunting", 
        "ludo-king",
        "mystic-mover" 
    ]
    
    # Dynamic Limit: 50
    pipeline = [
        {"$unwind": "$selected_events"},
        {"$group": {"_id": "$selected_events", "count": {"$sum": 1}}},
        {"$match": {"count": {"$gte": 50}}}, # Filter only full events
        {"$project": {"event_id": "$_id", "_id": 0}}
    ]

    # registrations_collection is now global
    
    full_events = list(PERMANENTLY_CLOSED) # Start with closed ones
    async for doc in registrations_collection.aggregate(pipeline):
        full_events.append(doc["event_id"])
        
    return {"full_events": full_events}
