@echo off
chcp 65001 > nul
echo ========================================================
echo   Auto Update Website to GitHub (ระบบอัปเดตเว็บไซต์อัตโนมัติ)
echo ========================================================
echo.

:: 1. Add all changes
echo [1/3] Adding files...
git add .

:: 2. Commit changes
echo [2/3] Saving changes...
set /p msg="Enter update message (ใส่ข้อความบันทึกสั้นๆ): "
if "%msg%"=="" set msg="Update website content"
git commit -m "%msg%"

:: 3. Push to GitHub
echo [3/3] Uploading to GitHub...
git push

echo.
echo ========================================================
echo   Update Complete! (อัปเดตเสร็จเรียบร้อย)
echo   Please wait 1-2 minutes for the website to refresh.
echo ========================================================
pause
