echo off
setlocal

REM Launch Backend (installs deps if node_modules missing)
start "Backend" cmd /k cd /d "%~dp0backend" ^&^& (if not exist node_modules npm install --no-fund --no-audit) ^& npm run dev

REM Launch Frontend (installs deps if node_modules missing)
start "Frontend" cmd /k cd /d "%~dp0frontend" ^&^& (if not exist node_modules npm install --no-fund --no-audit) ^& npm run dev

endlocal
