@echo off
title Scribe Management System

echo ==========================================
echo       SCRIBE MANAGEMENT SYSTEM
echo ==========================================
echo.

echo Starting backend...
start "Scribe Backend" cmd /k "cd /d "%~dp0scribe-backend" && npm start"

timeout /t 3 /nobreak >nul

echo Starting frontend...
start "Scribe Frontend" cmd /k "cd /d "%~dp0scribe-frontend" && npm start"

echo.
echo ==========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo ==========================================
echo.
echo Keep both terminal windows open.
echo.
pause