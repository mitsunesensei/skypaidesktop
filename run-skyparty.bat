@echo off
title SkyParty Desktop Edition
echo.
echo 🎮 SkyParty Desktop Edition Launcher
echo ====================================
echo.

echo Checking for Node.js and npm...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js and npm found!

echo.
echo Checking for Electron...
if not exist node_modules\electron (
    echo ⚠️  Electron not found, installing...
    echo.
    npm install electron
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Electron!
        echo Please check your internet connection and try again.
        echo.
        pause
        exit /b 1
    )
    echo ✅ Electron installed successfully!
) else (
    echo ✅ Electron found!
)

echo.
echo 🚀 Starting SkyParty Desktop Edition...
echo.

npm start

if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to start SkyParty!
    echo Please check the error messages above.
    echo.
    pause
)
