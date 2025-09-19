@echo off
echo Installing Electron for SkyParty Desktop Edition...
echo.

echo Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

echo Node.js found! Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

echo npm found! Installing Electron...
echo.

npm install electron

if %errorlevel% equ 0 (
    echo.
    echo ✅ Electron installation complete!
    echo You can now run SkyParty Desktop Edition.
    echo.
) else (
    echo.
    echo ❌ Electron installation failed!
    echo Please check your internet connection and try again.
    echo.
)

pause
