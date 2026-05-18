@echo off
echo 🚀 Lukupäiväkirja - Pika-asennus
echo =================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js ei ole asennettu. Asenna Node.js osoitteesta: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js löydetty
node --version
echo.

REM Install backend dependencies
echo 📦 Asennetaan backend-riippuvuudet...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend-asennuksessa tapahtui virhe
    pause
    exit /b 1
)
cd ..
echo ✅ Backend-riippuvuudet asennettu
echo.

REM Install frontend dependencies
echo 📦 Asennetaan frontend-riippuvuudet...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend-asennuksessa tapahtui virhe
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend-riippuvuudet asennettu
echo.

echo ✨ Asennus valmis!
echo.
echo Käynnistä sovellus kahdessa eri komentokehotteessa:
echo.
echo Komentokehote 1 (Backend):
echo   cd backend
echo   npm start
echo.
echo Komentokehote 2 (Frontend):
echo   cd frontend
echo   npm start
echo.
echo Sovellus avautuu automaattisesti osoitteessa http://localhost:3000
echo.
pause
