from pydantic import BaseModel
from typing import Optional

class Event(BaseModel):
    event_id: str  # We will use SLUG here
    event_name: str
    price: int
    category: str
    max_participants: Optional[int] = None
