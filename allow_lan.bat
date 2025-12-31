@echo off
chcp 65001 > nul
cls

:: ตรวจสอบสิทธิ์ Admin (Check permissions)
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] มีสิทธิ์ผู้ดูแลระบบ
    echo กำลังดำเนินการเปิด Firewall...
    
    :: ลบกฎเก่าก่อนกันซ้ำ
    netsh advfirewall firewall delete rule name="Allow Flask 5000" >nul 2>&1
    
    :: เพิ่มกฎใหม่
    netsh advfirewall firewall add rule name="Allow Flask 5000" dir=in action=allow protocol=TCP localport=5000
    
    echo.
    echo ========================================================
    echo ✅ ทำรายการสำเร็จ! (Success)
    echo เปิด Port 5000 เรียบร้อยแล้ว
    echo.
    echo ลองใช้มือถือเข้าลิงก์นี้ได้เลยครับ:
    echo http://192.168.1.124:5000
    echo ========================================================
) else (
    echo ========================================================
    echo ❌ เกิดข้อผิดพลาด (Error)
    echo.
    echo "ต้องรันในฐานะผู้ดูแลระบบ"
    echo.
    echo วิธีแก้:
    echo 1. ปิดหน้าต่างนี้ไปก่อน
    echo 2. คลิกขวาที่ไฟล์ allow_lan
    echo 3. เลือก "Run as administrator" (รันในฐานะผู้ดูแล)
    echo ========================================================
)
pause
