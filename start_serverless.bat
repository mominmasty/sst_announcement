@echo off
setlocal

echo Starting SST Announcement System (Serverless)...
echo.

REM Launch Vercel Dev (serverless backend on port 8787)
start "Vercel Dev (Backend)" cmd /k cd /d "%~dp0frontend" ^&^& (if not exist node_modules npm install --no-fund --no-audit) ^&^& npm run dev:vercel

REM Wait a moment for Vercel to start
timeout /t 3 /nobreak >nul

REM Launch Frontend (React on port 3000)
start "Frontend (React)" cmd /k cd /d "%~dp0frontend" ^&^& npm run dev

echo.
echo ========================================
echo   SST Announcement System Started!
echo ========================================
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8787
echo ========================================
echo.

endlocal
