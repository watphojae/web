import requests
import json
import os

# Load config manually
ENV_FILE = '.env'
config = {}
if os.path.exists(ENV_FILE):
    with open(ENV_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                config[key.strip()] = value.strip()

TOKEN = config.get('LINE_CHANNEL_ACCESS_TOKEN')
USER_ID = config.get('LINE_USER_ID')

print(f"Testing LINE Messaging API Configuration...")
print(f"-------------------------------------------")
print(f"Token (First 10 chars): {TOKEN[:10]}..." if TOKEN else "Token: MISSING")
print(f"User ID: {USER_ID}" if USER_ID else "User ID: MISSING")
print(f"-------------------------------------------")

if not TOKEN or not USER_ID:
    print("❌ Configuration missing. Please check .env file.")
    exit()

url = 'https://api.line.me/v2/bot/message/push'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {TOKEN}'
}
payload = {
    'to': USER_ID,
    'messages': [{'type': 'text', 'text': '✅ ทดสอบการเชื่อมต่อ: ระบบวัดโพธิ์แจ้ใช้งานได้แล้วครับ!'}]
}

try:
    print("Attempting to send message...")
    response = requests.post(url, headers=headers, json=payload)
    
    print(f"Response Code: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ SUCCESS! Message sent.")
        print("ถ้าในมือถือยังไม่เด้ง แปลว่า 'ยังไม่ได้เป็นเพื่อนกับบอท'")
        print("กรุณาสแกน QR Code เพิ่มเพื่อนในหน้า LINE Developers ด่วนครับ")
    else:
        print("\n❌ FAILED!")
        if "Invalid user ID" in response.text:
            print("สาเหตุ: User ID ผิด (อาจจะไปเอา ID ของคนอื่น หรือ ID บอทมาใส่)")
        elif "Invalid reply token" in response.text or "Authentication failed" in response.text:
             print("สาเหตุ: Token ผิด หรือหมดอายุ")
except Exception as e:
    print(f"\n❌ Error: {e}")

input("\nกด Enter เพื่อปิดหน้าต่าง...")
