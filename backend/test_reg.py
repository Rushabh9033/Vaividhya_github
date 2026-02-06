import requests
import json

BASE_URL = "https://vaividhya2k26-backend.onrender.com/api"

test_user = {
    "full_name": "Test User",
    "enrollment_no": "TEST12345",
    "email": "test@example.com",
    "phone": "1234567890",
    "college": "Test College",
    "department": "Test Dept",
    "year": "3rd"
}

print(f"Testing Registration at {BASE_URL}/registrations")
try:
    response = requests.post(f"{BASE_URL}/registrations", json=test_user, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
