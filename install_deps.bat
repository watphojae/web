@echo off
echo Installing Project Dependencies...
echo ----------------------------------

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed yet!
    echo Please install Node.js from the website first.
    echo Then run this file again.
    pause
    exit /b
)

echo Found Node.js. Installing libraries...
call npm install
echo.
echo ----------------------------------
echo Installation Complete!
echo You can now run start_server.bat
echo ----------------------------------
pause
