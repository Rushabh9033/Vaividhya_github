import uuid

def generate_receipt():
    return "VIV-" + uuid.uuid4().hex[:6].upper()
