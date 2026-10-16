@echo off
cd /d "%~dp0\food_project_web_ready2"
title LDCE FoodHub Server
echo ====================================================
echo Starting LDCE FoodHub Server...
echo ====================================================
node server.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Server stopped or encountered an error.
  pause
)
