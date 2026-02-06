# How to Deploy Backend on Render.com

## 1. Prepare the Repository
Since you have the code in a Zip file, you (or your team) need to:
1. Unzip the code.
2. Create a **new repository** on GitHub (e.g., `vaividhya-backend`).
3. Upload ONLY the `backend` folder contents to this repository.
   - The repository root should contain `main.py`, `requirements.txt`, etc.

## 2. Create New Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository**.
4. Connect your GitHub account and select the `vaividhya-backend` repository.

## 3. Configuration Settings
Fill in these details:

| Setting | Value |
| :--- | :--- |
| **Name** | `vaividhya-backend` (or similar) |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Runtime** | **Python 3** |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

## 4. Environment Variables (Critical!)
Scroll down to "Environment Variables" and click **Add Environment Variable**:

1. **Key:** `MONGO_URL`
   **Value:** `mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/`
   *(This is your database creation string. Make sure "Access from Anywhere" is enabled in MongoDB Atlas)*

2. **Key:** `DATABASE_NAME`
   **Value:** `vaividhya_db`

3. **Key:** `PYTHON_VERSION`
   **Value:** `3.10.0`

## 5. Deploy
1. Click **Create Web Service**.
2. Wait for the logs to show "Your service is live".
3. Copy the URL (e.g., `https://vaividhya-backend.onrender.com`).

## 6. Connect Frontend
Once the Backend is live:
1. Go to your **Cloudflare Pages** (Frontend).
2. Go to **Settings -> Environment Variables**.
3. Add: `REACT_APP_API_URL` = `https://vaividhya-backend.onrender.com` (Your Render URL).
4. **Redeploy** the Frontend.
