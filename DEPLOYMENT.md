# Deployment Quick Reference

## 📁 Folders to Deploy

**Backend**: `d:\vaividhya_final\backend`
**Frontend**: `d:\vaividhya_final\frontend`

## 🔗 MongoDB Connection

```
mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/
Database: vaividhya_db
```

## ⚙️ Configuration Updates Needed

### 1. After Backend Deployment
Update `frontend/src/config/api.js` line 15:
```javascript
return "https://YOUR-BACKEND-URL.vercel.app";
```

### 2. After Frontend Deployment  
Update `backend/main.py` line 14:
```python
allow_origins=["https://YOUR-FRONTEND-URL.vercel.app", "http://localhost:3000"],
```

## 🧪 Test URLs

After deployment, test:
- `https://YOUR-BACKEND-URL.vercel.app/api/events`
- `https://YOUR-BACKEND-URL.vercel.app/db-test`
- `https://YOUR-FRONTEND-URL.vercel.app`

## 📊 Project Stats

- **Events**: 41 total
- **Admin Teams**: 10 (TEAM1-TEAM10)
- **Build Size**: 95.94 kB JS, 38.12 kB CSS
- **Database**: 1,111 registrations

**Everything is ready for manual deployment via Vercel website!** 🚀
