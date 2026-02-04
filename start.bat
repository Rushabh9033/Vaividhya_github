@echo off
echo ========================================
echo Starting Vaividhya 2K26 Application
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server (Port 8000)...
start "Vaividhya Backend" cmd /k "cd /d %~dp0backend && ..\\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo [2/2] Starting Frontend Server (Port 3000)...
start "Vaividhya Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo Network:  Check frontend terminal for network IP
echo.
echo Press any key to exit this window...
pause >nul
