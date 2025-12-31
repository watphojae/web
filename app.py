from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import time
import requests
from datetime import datetime, timedelta
import threading

app = Flask(__name__)
CORS(app)

DB_FILE = 'bookings.json'
ENV_FILE = '.env'

# --- Helper: Load .env manually ---
config = {}
if os.path.exists(ENV_FILE):
    with open(ENV_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                config[key.strip()] = value.strip()

# Get Config
LINE_ACCESS_TOKEN = config.get('LINE_CHANNEL_ACCESS_TOKEN')
LINE_USER_ID = config.get('LINE_USER_ID')
PORT = int(config.get('PORT', 5000))

# Initialize DB
if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

# --- Helper: LINE Messaging API ---
def send_line_message(text_message):
    if not LINE_ACCESS_TOKEN or not LINE_USER_ID:
        print("⚠️ LINE Configuration missing in .env")
        return

    url = 'https://api.line.me/v2/bot/message/push'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {LINE_ACCESS_TOKEN}'
    }
    payload = {
        'to': LINE_USER_ID,
        'messages': [{'type': 'text', 'text': text_message}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            print("✅ LINE Message sent successfully")
        else:
            print(f"❌ LINE Error: {response.text}")
    except Exception as e:
        print(f"Error sending LINE: {e}")

def format_date(date_str):
    try:
        y, m, d = date_str.split('-')
        months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
        return f"{int(d)} {months[int(m)-1]} {int(y)+543}"
    except:
        return date_str

# --- Routes ---

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        return jsonify(json.load(f))

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    booking_data = request.json
    booking_data['id'] = str(int(time.time() * 1000))
    booking_data['createdAt'] = datetime.now().isoformat()
    
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        bookings = json.load(f)
    
    # Check Quota
    existing_count = sum(1 for b in bookings if b.get('date') == booking_data.get('date') and b.get('slot') == booking_data.get('slot'))
    limit = 1 if booking_data.get('slot') == '06.30' else 2
    
    if existing_count >= limit:
        return jsonify({"success": False, "message": f"เต็มแล้ว! รอบ {booking_data.get('slot')} รับได้ {limit} งาน"}), 400

    # Validation 2: Phone Number
    host_phone = booking_data.get('hostPhone', '').strip()
    if not host_phone.isdigit() or len(host_phone) != 10 or not host_phone.startswith('0'):
        return jsonify({"success": False, "message": "เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0)"}), 400

    bookings.append(booking_data)
    
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(bookings, f, indent=2, ensure_ascii=False)
    
    # Notify
    slot_time = booking_data.get('slot', '').replace('afternoon_', '')
    msg = f"""🔔 มีงานนิมนต์ใหม่! ({'ออนไลน์' if booking_data.get('type')=='online' else 'เจ้าหน้าที่'})
------------------
👤 เจ้าภาพ: {booking_data.get('hostName')}
📞 เบอร์โทร: {booking_data.get('hostPhone', '-')}
📅 วันที่: {format_date(booking_data.get('date'))}
⏰ เวลา: {slot_time} น.
⛪ สถานที่: {booking_data.get('location')}
🙏 จำนวนพระ: {booking_data.get('monkCount')} รูป
------------------
ตรวจสอบได้ที่: ระบบหลังบ้านวัดโพธิ์แจ้"""
    send_line_message(msg)
    
    return jsonify({"success": True, "booking": booking_data}), 201

@app.route('/api/bookings/<id>', methods=['DELETE'])
def delete_booking(id):
    try:
        reason = request.args.get('reason', 'ไม่ระบุเหตุผล')
        
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            bookings = json.load(f)
        
        target = next((b for b in bookings if b.get('id') == id), None)
        if not target:
            return jsonify({"success": False, "message": "Booking not found"}), 404

        bookings = [b for b in bookings if b.get('id') != id]
        
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(bookings, f, indent=2, ensure_ascii=False)
        
        # Notify
        slot_time = target.get('slot', '').replace('afternoon_', '')
        msg = f"""❌ แจ้งเตือน: ยกเลิกงานนิมนต์
------------------
📝 เหตุผล: {reason}
------------------
👤 เจ้าภาพ: {target.get('hostName')}
📅 วันที่: {format_date(target.get('date'))}
⏰ เวลา: {slot_time} น.
⛪ สถานที่: {target.get('location')}
------------------
ระบบได้ทำการลบข้อมูลออกจากปฏิทินแล้ว"""
        send_line_message(msg)
        
        return jsonify({"success": True})
    except Exception as e:
        print(f"Delete Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

# --- Reminder Scheduler ---
def check_reminders_task():
    last_run = None
    while True:
        now = datetime.now()
        # Run at 08:00 AM
        if now.hour == 8 and now.strftime('%Y-%m-%d') != last_run:
            print("⏰ Running Daily Reminders...")
            process_reminders()
            last_run = now.strftime('%Y-%m-%d')
        time.sleep(60)

def process_reminders():
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            bookings = json.load(f)
        
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        for b in bookings:
            if b.get('date') == tomorrow:
                slot_time = b.get('slot', '').replace('afternoon_', '')
                msg = f"""🔔 แจ้งเตือนล่วงหน้า 1 วัน
------------------
👤 เจ้าภาพ: {b.get('hostName')}
📞 เบอร์โทร: {b.get('hostPhone', '-')}
📅 วันที่: {format_date(b.get('date'))}
⏰ เวลา: {slot_time} น.
⛪ สถานที่: {b.get('location')}
🙏 จำนวนพระ: {b.get('monkCount')} รูป
------------------
โปรดเตรียมความพร้อมในวันพรุ่งนี้ครับ"""
                send_line_message(msg)
                time.sleep(1) # Prevent spam limit
                
    except Exception as e:
        print(f"Reminder Error: {e}")

# --- Static Files ---
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    threading.Thread(target=check_reminders_task, daemon=True).start()
    
    print(f"Python Server running on http://0.0.0.0:{PORT}")
    print(f"Database connection: {DB_FILE}")
    print(f"LINE Messaging API: {'Ready' if LINE_ACCESS_TOKEN else 'Not Configured'}")
    
    app.run(host='0.0.0.0', port=PORT, debug=True, use_reloader=False)
