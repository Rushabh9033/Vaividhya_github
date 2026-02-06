import requests

urls = [
    "https://vaividhya2k26-backend.onrender.com/",
    "https://vaividhya2k26-backend.onrender.com/db-test",
    "https://vaividhya2k26-backend.onrender.com/api/events",
    "https://vaividhya2k26-backend.onrender.com/api/admin/event-stats"
]

for url in urls:
    try:
        r = requests.get(url, timeout=5)
        print(f"URL: {url}")
        print(f"Status: {r.status_code}")
        print(f"Body: {r.text[:100]}")
        print("-" * 20)
    except Exception as e:
        print(f"URL: {url} | Error: {e}")
