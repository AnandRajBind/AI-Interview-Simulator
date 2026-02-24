@echo off
setlocal enabledelayedexpansion

REM AI Interview Simulator Setup Script for Windows
REM This script helps set up the project for development

echo ==================================
echo AI Interview Simulator - Setup
echo ==================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js !NODE_VERSION! is installed

REM Check if MongoDB is installed (optional)
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB is installed
) else (
    echo [!] MongoDB not found locally - you can use MongoDB Atlas instead
)

echo.

REM Install server dependencies
echo Installing server dependencies...
cd Server
if not exist package.json (
    echo X Server\package.json not found
    pause
    exit /b 1
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install server dependencies
    pause
    exit /b 1
)
echo [OK] Server dependencies installed

REM Setup server .env if it doesn't exist
if not exist .env (
    echo.
    echo Creating Server\.env from template...
    if exist .env.example (
        copy .env.example .env >nul
        echo [OK] Server\.env created
        echo [!] IMPORTANT: Edit Server\.env and add your actual values!
    ) else (
        echo X .env.example not found
    )
) else (
    echo [!] Server\.env already exists, skipping...
)

cd ..

echo.

REM Install client dependencies
echo Installing client dependencies...
cd Client
if not exist package.json (
    echo X Client\package.json not found
    pause
    exit /b 1
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install client dependencies
    pause
    exit /b 1
)
echo [OK] Client dependencies installed

REM Setup client .env if it doesn't exist
if not exist .env (
    echo.
    echo Creating Client\.env...
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo [OK] Client\.env created
) else (
    echo [!] Client\.env already exists, skipping...
)

cd ..

echo.
echo ==================================
echo [OK] Setup Complete!
echo ==================================
echo.
echo IMPORTANT NEXT STEPS:
echo.
echo 1. Edit Server\.env and add your actual values:
echo    - Generate strong JWT_SECRET
echo      Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo    - Add your OpenAI API key from https://platform.openai.com/api-keys
echo    - Configure MongoDB URI
echo.
echo 2. Make sure MongoDB is running
echo.
echo 3. Start the application:
echo    Terminal 1: cd Server ^&^& npm run dev
echo    Terminal 2: cd Client ^&^& npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo [!] SECURITY WARNING:
echo     If you previously committed .env files with API keys,
echo     REVOKE those keys immediately at https://platform.openai.com/api-keys
echo.
echo For more details, see README.md and SECURITY.md
echo.

pause
