from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class SelectedEvent(BaseModel):
    event_id: str
    event_name: str
    price: int

class Registration(BaseModel):
    enrollment_no: str
    full_name: str
    email: EmailStr
    phone: str
    college: str
    department: str
    year: str
   

class RegistrationInDB(Registration):
    total_amount: int
    receipt_no: str
    created_at: datetime
