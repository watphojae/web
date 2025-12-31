/**
 * script.js - Interactive features for วัดโพธิ์แจ้ website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Reset overflow to ensure scrolling works, especially on mobile/refresh
    document.body.style.overflow = 'auto';
    // document.body.style.overflowX = 'hidden'; // REMOVED
    // 1. Smooth Scrolling for Navigation
    const handleSmoothScroll = (e) => {
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    // 2. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('section, .news-card, .directory-card').forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // 4. News Modal Logic
    const newsData = {
        "1": {
            title: "สวดมนต์ข้ามปี",
            content: "ขอเชิญพุทธศาสนิกชนร่วมเจริญจิตตภาวนา และสวดมนต์ข้ามปี เพื่อความเป็นสิริมงคลต้อนรับศักราชใหม่ ณ อุโบสถวัดโพธิ์แจ้ เริ่มเวลา 22.00 น. เป็นต้นไป",
            image: "static/images/NewYearPrayer2026.jpg"
        },
        "2": {
            title: "งานประจำปี ปิดทองหลวงพ่อโตวัดโพธิ์แจ้",
            content: "ขอเชิญเที่ยวงานประจำปี ปิดทองนมัสการหลวงพ่อโต และรอยพระพุทธบาทจำลอง ระหว่างวันที่ 24-26 มกราคม 2569<br><br>ชมมหรสพฟรีตลอดงาน!<br>- 24 ม.ค.: จ๊ะ นงผณี<br>- 25 ม.ค.: ไหมไทย หัวใจศิลป์<br>- 26 ม.ค.: เวียง นฤมล<br><br>กลางคืนชมลิเกคณะสมชายบุตรสำราญ",
            image: "static/images/annual_event_poster.jpg"
        },
        "3": {
            title: "พิธีเจริญพระพุทธมนต์ฯ วันอาทิตย์",
            content: "ขอเชิญร่วมพิธีเจริญพระพุทธมนต์ ทำวัตรเย็นและเจริญกัมมัฏฐานวันอาทิตย์ เพื่ออุทิศถวายเป็นพระราชกุศลแด่ สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง<br><br>ทุกๆ วันอาทิตย์ ตลอดปี ๒๕๖๙ เวลา ๑๗.๓๐ น.<br>ณ ศาลาปฏิบัติธรรม (ศาลาหลวงพ่อหยก) วัดโพธิ์แจ้ จ.สมุทรสาคร",
            image: "static/images/dhamma_sunday_poster.png"
        }
    };

    const modal = document.getElementById("newsModal");
    const modalBody = document.getElementById("modalBody");
    const closeBtn = document.querySelector(".close-modal");

    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', () => {
            const newsId = card.getAttribute('data-news-id');
            const data = newsData[newsId];
            if (data) {
                let visualContent = '';
                if (data.image) {
                    visualContent = `<img src="${data.image}" style="width: 100%; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">`;
                } else {
                    visualContent = `<div style="font-size: 4rem; text-align: center; margin-bottom: 20px;">${data.icon}</div>`;
                }

                modalBody.innerHTML = `
                    ${visualContent}
                    <h2>${data.title}</h2>
                    <p>${data.content}</p>
                    <div style="margin-top: 30px; text-align: center;">
                        <button class="btn-booking" onclick="document.getElementById('newsModal').style.display='none'; document.body.style.overflow='auto';">ปิด</button>
                    </div>
                `;
                modal.style.display = "block";
                document.body.style.overflow = "hidden"; // Prevent background scroll
            }
        });
    });

    closeBtn.onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    // Image Lightbox Logic (Reusing News Modal)
    document.querySelectorAll('.clickable-image').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click if nested
            const fullImgSrc = img.getAttribute('data-full-img');
            const altText = img.getAttribute('alt');

            modalBody.innerHTML = `
                <img src="${fullImgSrc}" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <h2 style="text-align: center;">${altText}</h2>
                <div style="margin-top: 20px; text-align: center;">
                    <button class="btn-booking" onclick="document.getElementById('newsModal').style.display='none'; document.body.style.overflow='auto';">ปิด</button>
                </div>
            `;
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    });

    // 5. Booking Logic & Quota Management
    const bookingForm = document.getElementById('bookingForm');
    const bookingResult = document.getElementById('bookingResult');
    // Use relative path if on server, or direct localhost if on file://
    // Use relative path if on server, or direct localhost if on file://
    const getApiUrl = () => {
        // If opened directly as a file
        if (window.location.protocol === 'file:') {
            return 'http://localhost:5000/api/bookings';
        }
        // If accessed via web server (localhost or LAN IP), use relative path
        return '/api/bookings';
    };
    const API_URL = getApiUrl();

    // Data handling with Backend API & localStorage fallback
    const getBookings = async () => {
        try {
            const resp = await fetch(API_URL);
            if (resp.ok) {
                const data = await resp.json();
                localStorage.setItem('temple_bookings_v2', JSON.stringify(data));

                // Remove demo banner if exists
                const demoBanner = document.getElementById('demoModeBanner');
                if (demoBanner) demoBanner.remove();

                return data;
            }
        } catch (e) {
            console.warn('Backend offline, using local data');
            showDemoModeBanner();
        }
        const stored = localStorage.getItem('temple_bookings_v2');
        return stored ? JSON.parse(stored) : [];
    };

    const showDemoModeBanner = () => {
        if (document.getElementById('demoModeBanner')) return;

        const banner = document.createElement('div');
        banner.id = 'demoModeBanner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: #ff9800;
            color: #fff;
            text-align: center;
            padding: 10px;
            font-size: 0.9rem;
            z-index: 10000;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        `;
        banner.innerHTML = `
            ⚠️ <strong>Demo Mode (Offline)</strong>: ระบบกำลังทำงานแบบจำลอง ไม่มีการเชื่อมต่อกับเซิร์ฟเวอร์จริง ข้อมูลจะถูกบันทึกเฉพาะในเครื่องนี้เท่านั้น
            <button onclick="this.parentElement.remove()" style="margin-left:15px; background:none; border:1px solid #fff; color:#fff; border-radius:4px; cursor:pointer; padding:2px 8px;">ปิด</button>
        `;
        document.body.appendChild(banner);
    };

    const saveBooking = async (bookingData) => {
        try {
            const resp = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            if (resp.ok) return await resp.json();
        } catch (e) {
            console.error('Failed to save to backend, saving locally');
        }

        // Local Fallback
        const bookings = JSON.parse(localStorage.getItem('temple_bookings_v2') || '[]');
        bookingData.id = Date.now().toString();
        bookingData.createdAt = new Date().toISOString();
        bookings.push(bookingData);
        localStorage.setItem('temple_bookings_v2', JSON.stringify(bookings));
        return { success: true, booking: bookingData };
    };

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const hostName = document.getElementById('hostName').value;
        const hostPhone = document.getElementById('hostPhone').value;
        const date = document.getElementById('bookingDate').value;
        const slot = document.getElementById('timeSlot').value;
        const monkCount = document.getElementById('monkCount').value;
        const location = document.getElementById('location').value;

        // Validation: Phone Number (Strict)
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(hostPhone)) {
            alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก ขึ้นต้นด้วย 0)");
            return;
        }

        const pickupTimes = {
            "06.30": "06.00 น.",
            "08.30": "08.00 น.",
            "10.30": "10.00 น."
        };

        const bookings = await getBookings();
        const currentCount = bookings.filter(b => b.date === date && b.slot === slot).length;
        const displayTime = slot.startsWith('afternoon_') ? slot.replace('afternoon_', '') : slot;

        // Set different quotas for different slots
        const quotaLimit = (slot === "06.30") ? 1 : 2;

        if (currentCount >= quotaLimit) {
            // Quota Full
            bookingResult.innerHTML = `
                <div class="result-error">
                    <p><strong>🚫 ขออภัย คิวงานรอบนี้เต็มแล้ว</strong></p>
                    <p>เจริญพรคุณโยม ${hostName}</p>
                    <p>เนื่องจากในวันที่ ${date} รอบเวลา ${displayTime} น. มีเจ้าภาพนิมนต์ครบ ${quotaLimit} งานตามโควตาแล้ว</p>
                    <p>ทางวัดขอเสนอทางเลือกดังนี้:</p>
                    <ul>
                        <li>เปลี่ยนเป็นรอบเวลาอื่น (หากยังว่าง)</li>
                        <li>เปลี่ยนเป็นวันอื่นที่สะดวก</li>
                    </ul>
                </div>
            `;
            bookingResult.style.display = 'block';
        } else {
            // Success
            const bookingData = {
                date, slot, hostName, hostPhone, monkCount, location,
                type: 'online'
            };

            bookingResult.innerHTML = `<div class="result-success">⌛ กำลังบันทึกข้อมูลและส่งแจ้งเตือน...</div>`;
            bookingResult.style.display = 'block';

            const result = await saveBooking(bookingData);

            if (result.success) {
                let pickupText = "";
                if (pickupTimes[slot]) {
                    pickupText = ` (ต้องมารับพระ ${pickupTimes[slot]})`;
                } else if (slot.startsWith('afternoon_')) {
                    const timeStr = slot.replace('afternoon_', '');
                    const [hour, min] = timeStr.split('.');
                    let pMin = parseInt(min) - 30;
                    let pHour = parseInt(hour);
                    if (pMin < 0) { pMin = 30; pHour -= 1; }
                    const pHourStr = pHour < 10 ? `0${pHour}` : pHour;
                    const pMinStr = pMin === 0 ? "00" : pMin;
                    pickupText = ` (ต้องมารับพระ ${pHourStr}.${pMinStr} น.)`;
                }

                const formatThaiDate = (dateStr) => {
                    const months = [
                        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
                    ];
                    const [y, m, d] = dateStr.split('-');
                    const thaiYear = parseInt(y) + 543;
                    const thaiMonth = months[parseInt(m) - 1];
                    const thaiDay = parseInt(d);
                    return `${thaiDay} ${thaiMonth} ${thaiYear}`;
                };

                bookingResult.innerHTML = `
                    <div class="result-success no-print-background">
                        <div id="printSlip">
                            <div class="slip-header">
                                <h2 style="color: #2d5a27; margin-bottom: 5px;">ใบจองนิมนต์พระออนไลน์</h2>
                                <p>วัดโพธิ์แจ้ จ.สมุทรสาคร</p>
                            </div>
                            <hr style="border: 1px dashed #ccc; margin: 15px 0;">
                            <p><strong>ชื่อเจ้าภาพ:</strong> ${hostName}</p>
                            <p><strong>เบอร์โทร:</strong> ${hostPhone}</p>
                            <p><strong>วันที่จัดงาน:</strong> ${formatThaiDate(date)}</p>
                            <p><strong>รอบเวลา:</strong> ${displayTime} น. ${pickupText}</p>
                            <p><strong>จำนวนพระ:</strong> ${monkCount} รูป</p>
                            <p><strong>สถานที่:</strong> ${location}</p>
                            <hr style="border: 1px dashed #ccc; margin: 15px 0;">
                            <p style="font-size: 0.9rem; color: #666;">*บันทึกแจ้งเตือนผ่านไลน์เรียบร้อยแล้ว กรุณาพิมพ์ใบจองไว้เป็นหลักฐาน</p>
                        </div>
                        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;" class="no-print">
                            <button class="btn-booking" onclick="window.print()">🖨️ พิมพ์ใบจอง</button>
                            <button class="btn-booking" style="background: #666;" onclick="document.getElementById('bookingResult').style.display='none'">ปิด</button>
                        </div>
                    </div>
                `;
                bookingForm.reset();
            }
        }
    });

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
        if (event.target == document.getElementById('calendarModal')) {
            document.getElementById('calendarModal').style.display = 'none';
        }
    };

    // --- CALENDAR LOGIC START ---
    let currentCalendarDate = new Date();
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarModal = document.getElementById('calendarModal');
    const closeCalendarModal = document.getElementById('closeCalendarModal');

    async function fetchAllBookings() {
        try {
            // Auto-detect API base URL
            const apiBase = window.location.protocol === 'file:' ? 'http://127.0.0.1:5000' : '';
            const resp = await fetch(`${apiBase}/api/bookings`);
            return await resp.json();
        } catch (e) {
            console.error('API Error:', e);
            // Fallback to local storage if needed, or return empty
            return JSON.parse(localStorage.getItem('temple_bookings_v2') || '[]');
        }
    }

    async function renderCalendar() {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();

        // Update Header
        const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        monthYearDisplay.textContent = `${monthNames[month]} ${year + 543}`;

        // Clear Grid
        calendarGrid.innerHTML = '';

        // Calculate Days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fetch Data
        const allBookings = await fetchAllBookings();

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';

            // Limit check logic (Same as checkQuota)
            const dayBookings = allBookings.filter(b => b.date === dateStr);
            const status = calculateDailyStatus(dayBookings);

            dayCell.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="status-dot status-${status}"></div>
            `;

            dayCell.onclick = () => openCalendarDetail(dateStr, dayBookings);
            calendarGrid.appendChild(dayCell);
        }
    }

    function calculateDailyStatus(bookings) {
        // Quota: 06.30 = 1, Others = 2
        // Slots: 06.30, 08.30, 10.30, 12.00, 13.00, 14.00, 15.00, 16.00 (Total 8 slots)
        // Total Capacity: 1 + (7 * 2) = 15 jobs per day

        const slots = ["06.30", "08.30", "10.30", "afternoon_12.00", "afternoon_13.00", "afternoon_14.00", "afternoon_15.00", "afternoon_16.00"];
        let fullSlots = 0;

        slots.forEach(slot => {
            const limit = slot === "06.30" ? 1 : 2;
            const count = bookings.filter(b => b.slot === slot).length;
            if (count >= limit) fullSlots++;
        });

        if (fullSlots === 0) return 'green';
        if (fullSlots === slots.length) return 'red';
        return 'yellow';
    }

    function openCalendarDetail(dateStr, bookings) {
        const [y, m, d] = dateStr.split('-');
        document.getElementById('modalDateTitle').textContent = `สถานะคิววันที่ ${d}/${m}/${parseInt(y) + 543}`;

        const slotsDisplay = [
            { id: "06.30", label: "06.30 น.", limit: 1 },
            { id: "08.30", label: "08.30 น.", limit: 2 },
            { id: "10.30", label: "10.30 น.", limit: 2 },
            { id: "afternoon_12.00", label: "12.00 น.", limit: 2 },
            { id: "afternoon_13.00", label: "13.00 น.", limit: 2 },
            { id: "afternoon_14.00", label: "14.00 น.", limit: 2 },
            { id: "afternoon_15.00", label: "15.00 น.", limit: 2 },
            { id: "afternoon_16.00", label: "16.00 น.", limit: 2 }
        ];

        let html = '';
        slotsDisplay.forEach(item => {
            const count = bookings.filter(b => b.slot === item.id).length;
            const isFull = count >= item.limit;
            const statusText = isFull ? "เต็ม" : `ว่าง (${count}/${item.limit})`;
            const statusClass = isFull ? "slot-full" : "slot-available";

            html += `
                <div class="slot-item">
                    <span>${item.label}</span>
                    <span class="slot-status ${statusClass}">${statusText}</span>
                </div>
            `;
        });

        document.getElementById('modalSlotDetails').innerHTML = html;
        calendarModal.style.display = 'block';
    }

    prevMonthBtn.onclick = () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    };

    nextMonthBtn.onclick = () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    };

    closeCalendarModal.onclick = () => {
        calendarModal.style.display = 'none';
    };

    // Initial Render
    if (document.getElementById('calendarGrid')) {
        renderCalendar();
    }
    // --- CALENDAR LOGIC END ---

});
