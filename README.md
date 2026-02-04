# Vaividhya 2K26 - Tech Fest Registration System

Event registration and payment management system for Vaividhya 2K26 technical festival.

## 📁 Project Structure

```
vaividhya_final/
├── frontend/          # React frontend application (Port 3000)
├── backend/           # FastAPI backend server (Port 8000)
├── .venv/            # Python virtual environment
├── start.bat         # Quick start script (Windows)
└── README.md         # This file
```

## 🚀 Quick Start

### Option 1: Using Batch File (Recommended)
Simply double-click `start.bat` to start both servers automatically!

### Option 2: Manual Start

**Backend:**
```bash
cd backend
..\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm start
```

## 🌐 Access URLs

- **Frontend (Local)**: http://localhost:3000
- **Frontend (Network)**: http://192.168.x.x:3000 (shown in terminal)
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 👥 Admin Login Credentials

See `admin_credentials.md` in the artifacts folder for all team passwords.

Example:
- Team: TEAM1
- Password: 92jAzvoC

## 🗄️ Database

- **Type**: MongoDB Atlas (Cloud)
- **Database**: vaividhya_db
- **Collections**: events, registrations, admins

## 📱 Mobile Testing

1. Find your PC's IP: `ipconfig` (look for IPv4 Address)
2. Ensure mobile is on same WiFi network
3. Access: `http://YOUR_IP:3000`

## 🛠️ Technologies

**Frontend:**
- React
- Bootstrap
- React Router

**Backend:**
- FastAPI
- MongoDB (Motor)
- Python 3.9+

## 📄 License

© 2026 Vaividhya Tech Fest. All Rights Reserved.
