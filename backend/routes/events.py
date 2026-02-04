from fastapi import APIRouter
from database import events_collection
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
