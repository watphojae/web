/**
 * script.js - Interactive features for วัดโพธิ์แจ้ website
 * ข้อมูลทั้งหมดอยู่ใน static/js/site-data.js
 */

// ══════════════════════════════════════════════
// Share System (ระบบแชร์กลาง)
// ══════════════════════════════════════════════
window.shareContent = function(hash, title, text) {
    const base = window.location.origin + window.location.pathname;
    const url = hash ? base + hash : base;
    if (navigator.share) {
        navigator.share({ title: title || document.title, text: text || title, url }).catch(() => {});
        return;
    }
    const popup = document.getElementById('sharePopup');
    if (!popup) return;
    document.getElementById('sharePopupText').textContent = title || 'แชร์';
    document.getElementById('shareFbBtn').onclick = () => {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(title || ''), '_blank', 'width=600,height=500');
        popup.classList.add('hidden');
    };
    document.getElementById('shareLineBtn').onclick = () => {
        window.open('https://line.me/R/share?text=' + encodeURIComponent((title || document.title) + '\n' + url), '_blank');
        popup.classList.add('hidden');
    };
    const igBtn = document.getElementById('shareIgBtn');
    if (igBtn) igBtn.onclick = () => {
        navigator.clipboard.writeText(url).then(() => {
            igBtn.innerHTML = '<i class="fab fa-instagram text-xs"></i> คัดลอกแล้ว!';
            igBtn.title = 'นำลิงก์ไปวางใน Instagram';
            setTimeout(() => { igBtn.innerHTML = '<i class="fab fa-instagram text-xs"></i> Instagram'; popup.classList.add('hidden'); }, 2000);
        });
    };
    document.getElementById('shareCopyBtn').onclick = () => {
        navigator.clipboard.writeText(url).then(() => {
            const btn = document.getElementById('shareCopyBtn');
            btn.innerHTML = '<i class="fas fa-check"></i> คัดลอกแล้ว';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-link"></i> คัดลอก'; popup.classList.add('hidden'); }, 1500);
        });
    };
    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('hidden'), 8000);
};
window.closeSharePopup = () => document.getElementById('sharePopup')?.classList.add('hidden');

// ══════════════════════════════════════════════
// Dark Mode Toggle
// ══════════════════════════════════════════════
window.toggleTheme = function () {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'emerald' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('wat_theme', next);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = next === 'dark' ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg';
};

// ── SVG รูปภาพจำลองสำหรับเจ้าอาวาสที่ไม่มีรูป ──
const PORTRAIT_PLACEHOLDER = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 133" fill="none" class="w-full h-full">
    <rect width="100" height="133" fill="#f0f6f2"/>
    <ellipse cx="50" cy="38" rx="18" ry="20" fill="#c5a059" opacity="0.4"/>
    <path d="M20 110 Q50 80 80 110" stroke="#c5a059" stroke-width="2" fill="#c5a059" opacity="0.25"/>
    <path d="M15 133 Q25 95 50 88 Q75 95 85 133" fill="#1b4d3e" opacity="0.15"/>
    <text x="50" y="125" text-anchor="middle" font-size="9" fill="#1b4d3e" opacity="0.4" font-family="serif">ไม่ปรากฎรูป</text>
</svg>`;

// ══════════════════════════════════════════════
// Render: Google Calendar
// ══════════════════════════════════════════════
function renderCalendar() {
    const container = document.getElementById('calendar-embed-root');
    if (!container) return;
    const url = SITE_DATA.calendarEmbedUrl;
    if (!url) { container.style.display = 'none'; return; }
    container.innerHTML = `
        <div class="mt-16 max-w-4xl mx-auto" data-aos="fade-up">
            <h3 class="text-xl font-['Pridi'] font-bold text-primary mb-6 flex items-center gap-3">
                <span class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <i class="fa-brands fa-google text-primary text-sm"></i>
                </span>
                ปฏิทิน Google
            </h3>
            <div class="rounded-3xl overflow-hidden shadow-xl border border-base-200">
                <iframe src="${url}&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&mode=MONTH&hl=th"
                    style="border:0" width="100%" height="500" frameborder="0" scrolling="no"
                    title="ปฏิทินกิจกรรมวัดโพธิ์แจ้"></iframe>
            </div>
        </div>
    `;
}

// ══════════════════════════════════════════════
// Render: แกลเลอรีภาพ
// ══════════════════════════════════════════════
function renderGallery() {
    const container = document.getElementById('gallery-render-root');
    if (!container) return;
    container.innerHTML = SITE_DATA.gallery.map((img, i) => `
        <div class="gallery-item${img.wide ? ' gallery-wide' : ''}" data-aos="fade-up" data-aos-delay="${Math.min(i * 50, 300)}" onclick="openImageModal(${i})">
            <img src="${img.src}" alt="${img.alt}" class="gallery-img" loading="lazy">
            <div class="gallery-overlay">
                <span>${img.alt}</span>
                <button class="btn btn-xs btn-ghost text-white border border-white/40 rounded-full gap-1 mt-2"
                    onclick="event.stopPropagation();shareContent('#gallery','${img.alt.replace(/'/g,"\\'")} — วัดโพธิ์แจ้','ภาพ: ${img.alt.replace(/'/g,"\\'")} จากวัดโพธิ์แจ้')" title="แชร์รูปภาพ">
                    <i class="fas fa-share-nodes text-xs"></i> แชร์
                </button>
            </div>
        </div>
    `).join('');
}

// ══════════════════════════════════════════════
// Render: ปฏิทินกิจกรรม
// ══════════════════════════════════════════════
function renderEvents() {
    const container = document.getElementById('events-render-root');
    if (!container) return;
    const { regular, holidays, holidaysYear, upcoming } = SITE_DATA.events;

    const regularHTML = regular.map(e => `
        <div class="event-list-item">
            <div class="event-date-badge ${e.color}">
                <span class="text-xs font-bold">${e.day1}</span>
                <span class="text-lg font-extrabold font-['Pridi']">${e.day2}</span>
            </div>
            <div class="event-info">
                <p class="font-semibold text-base-content">${e.title}</p>
                <p class="text-sm text-base-content/60 mt-1">
                    <i class="fa-regular fa-clock mr-1"></i>เวลา ${e.time} &nbsp;|&nbsp; ${e.location}
                </p>
            </div>
        </div>
    `).join('');

    const holidaysHTML = holidays.map(h => `
        <div class="event-list-item">
            <div class="event-date-badge ${h.color}">
                <span class="text-xs font-bold">${h.date}</span>
                <span class="text-sm font-extrabold font-['Pridi']">${h.name}</span>
            </div>
            <div class="event-info">
                <p class="font-semibold text-base-content">${h.title}</p>
                <p class="text-sm text-base-content/60 mt-1">${h.detail}</p>
            </div>
        </div>
    `).join('');

    const today = new Date(); today.setHours(0,0,0,0);
    const activeUpcoming = upcoming.filter(e => !e.endDate || new Date(e.endDate) >= today);
    const upcomingHTML = activeUpcoming.map(e => `
        <div class="event-list-item border-l-4 ${e.borderColor}">
            <div class="event-date-badge ${e.dateClass}">
                <span class="text-xs font-bold">${e.month}</span>
                <span class="text-2xl font-extrabold font-['Pridi']">${e.date}</span>
            </div>
            <div class="event-info flex-1">
                <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="badge ${e.badgeClass} badge-xs text-white">${e.badge}</span>
                    <button class="btn btn-xs btn-ghost text-base-content/40 hover:text-primary rounded-full gap-1"
                        onclick="shareContent('#events','${e.title.replace(/'/g,"\\'")} — ${e.month} ${e.date}','${e.title.replace(/'/g,"\\'")} ${e.detail.replace(/'/g,"\\'")} วันที่ ${e.month} ${e.date}')" title="แชร์กิจกรรม">
                        <i class="fas fa-share-nodes text-xs"></i>
                    </button>
                </div>
                <p class="font-semibold text-base-content">${e.title}</p>
                <p class="text-sm text-base-content/60 mt-1">${e.detail}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div data-aos="fade-right">
                <h3 class="text-xl font-['Pridi'] font-bold text-primary mb-6 flex items-center gap-3">
                    <span class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <i class="fa-solid fa-rotate text-primary text-sm"></i>
                    </span>
                    กิจกรรมประจำ
                </h3>
                <div class="space-y-4">${regularHTML}</div>

                <h3 class="text-xl font-['Pridi'] font-bold text-primary mt-10 mb-6 flex items-center gap-3">
                    <span class="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
                        <i class="fa-solid fa-star text-gold text-sm"></i>
                    </span>
                    วันสำคัญทางพระพุทธศาสนา ${holidaysYear}
                </h3>
                <div class="space-y-4">${holidaysHTML}</div>
            </div>

            <div data-aos="fade-left">
                <h3 class="text-xl font-['Pridi'] font-bold text-primary mb-6 flex items-center gap-3">
                    <span class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <i class="fa-solid fa-calendar-days text-primary text-sm"></i>
                    </span>
                    กิจกรรมที่กำลังจะมาถึง
                </h3>
                <div class="space-y-4">${upcomingHTML}</div>
            </div>
        </div>
    `;
}

// ══════════════════════════════════════════════
// Render: ทำเนียบเจ้าอาวาส
// ══════════════════════════════════════════════
function renderAbbots() {
    const container = document.getElementById('abbots-render-root');
    if (!container) return;
    container.innerHTML = SITE_DATA.abbots.map((a, i) => `
        <div class="temple-directory-card ${a.isCurrent ? 'border-gold border-2 shadow-2xl animate__animated animate__zoomIn' : 'animate__animated animate__fadeInUp'}"
             style="animation-delay: ${i * 0.1}s">
            <div class="portrait-frame${a.isCurrent ? ' border-gold' : ''}">
                ${a.image
                    ? `<img src="${a.image}" alt="${a.name}" class="cursor-zoom-in" onclick="openImageModal(this)">`
                    : PORTRAIT_PLACEHOLDER}
            </div>
            <div class="space-y-1">
                <span class="badge ${a.isCurrent ? 'badge-warning font-bold badge-sm' : 'badge-outline badge-warning badge-xs'}">
                    ${a.isCurrent ? 'ปัจจุบัน' : a.sequence}
                </span>
                <h3 class="monk-name">${a.name}</h3>
                <p class="monk-title ${a.isCurrent ? 'text-primary font-bold' : 'italic'}">${a.years}</p>
                <button class="btn btn-xs btn-ghost text-base-content/40 hover:text-primary rounded-full gap-1 mt-1"
                    onclick="shareContent('#abbots','${a.name.replace(/'/g,"\\'")} — เจ้าอาวาสวัดโพธิ์แจ้','${a.name.replace(/'/g,"\\'")} เจ้าอาวาสวัดโพธิ์แจ้ ${a.years.replace(/'/g,"\\'")} | วัดโพธิ์แจ้')">
                    <i class="fas fa-share-nodes text-xs"></i> แชร์
                </button>
            </div>
        </div>
    `).join('');
}

// ══════════════════════════════════════════════
// Render: พระสังฆาธิการ
// ══════════════════════════════════════════════
function renderOfficials() {
    const container = document.getElementById('officials-render-root');
    if (!container) return;
    container.innerHTML = SITE_DATA.officials.map((o, i) => `
        <div class="temple-directory-card animate__animated animate__fadeInUp" style="animation-delay: ${i * 0.1}s">
            <div class="portrait-frame${o.frameBorder ? ' ' + o.frameBorder : ''}">
                <img src="${o.image}" alt="${o.name.replace(/<br>/g, ' ')}" class="cursor-zoom-in" onclick="openImageModal(this)"/>
            </div>
            <div class="pt-2">
                <span class="badge ${o.badgeClass} badge-sm mb-2">${o.position}</span>
                <h3 class="monk-name leading-tight">${o.name}</h3>
                <button class="btn btn-xs btn-ghost text-base-content/40 hover:text-primary rounded-full gap-1 mt-1"
                    onclick="shareContent('#officials','${o.position.replace(/'/g,"\\'")} ${o.name.replace(/<br>/g,' ').replace(/'/g,"\\'")} — วัดโพธิ์แจ้','${o.position.replace(/'/g,"\\'")} ${o.name.replace(/<br>/g,' ').replace(/'/g,"\\'")} | วัดโพธิ์แจ้')">
                    <i class="fas fa-share-nodes text-xs"></i> แชร์
                </button>
            </div>
        </div>
    `).join('');
}

// ══════════════════════════════════════════════
// Update: ข้อมูลทำบุญออนไลน์
// ══════════════════════════════════════════════
function updateDonation() {
    const d = SITE_DATA.donation;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHref = (id, val) => { const el = document.getElementById(id); if (el) el.href = val; };
    set('donation-bank', d.bank);
    set('donation-account-name', d.accountName);
    set('donation-account-number', d.accountNumber);
    setHref('donation-line-url', d.lineUrl);
    const lineText = document.getElementById('donation-line-text');
    if (lineText) lineText.textContent = 'LINE ' + d.lineId;
}

// ══════════════════════════════════════════════
// Update: ข้อมูลติดต่อสอบถาม
// ══════════════════════════════════════════════
function updateContact() {
    const c = SITE_DATA.contact;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHref = (id, val) => { const el = document.getElementById(id); if (el) el.href = val; };
    set('contact-phone', c.phone);
    set('footer-phone', c.phone);
    set('contact-line-id', c.lineId);
    set('contact-facebook-name', c.facebookName);
    set('contact-email', c.email);
    setHref('contact-facebook-url', c.facebook);
    setHref('contact-email-url', 'mailto:' + c.email);
}

// ══════════════════════════════════════════════
// News Modal (ใช้ SITE_DATA.news)
// ══════════════════════════════════════════════
window.showModal = (newsId) => {
    const modal = document.getElementById("newsModal");
    const modalBody = document.getElementById("modalBody");
    const data = SITE_DATA.news.find(n => n.id == newsId);

    if (data && modal && modalBody) {
        const visualContent = data.image ? `
            <div style="background:#000;border-radius:1rem;overflow:hidden;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);">
                <img src="${data.image}" style="width:100%;max-height:80vh;object-fit:contain;display:block;">
            </div>` : '';

        modalBody.innerHTML = `
            <div class="animate__animated animate__fadeIn">
                ${visualContent}
                <h2 class="text-2xl md:text-3xl font-['Pridi'] font-bold text-primary mb-4">${data.title}</h2>
                <div class="prose prose-emerald max-w-none text-base-content/80 leading-relaxed font-['Sarabun']">
                    ${typeof marked !== 'undefined' ? marked.parse(data.content) : data.content}
                </div>
                <div class="mt-8 flex flex-wrap justify-center gap-3 no-print">
                    <button class="btn btn-outline btn-sm rounded-full gap-2" onclick="window.printAnnouncement('${data.title.replace(/'/g,"\\'")}')">
                        <i class="fas fa-print"></i> พิมพ์ประกาศ
                    </button>
                    <button class="btn btn-sm rounded-full gap-2 bg-[#1877F2] text-white border-none hover:bg-[#1565c0]"
                        onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.origin+window.location.pathname+'#news-${data.id}')+'&quote='+encodeURIComponent('${data.title.replace(/'/g,"\\'")}'),'_blank','width=600,height=500')">
                        <i class="fab fa-facebook-f"></i> Facebook
                    </button>
                    <button class="btn btn-sm rounded-full gap-2 bg-[#06C755] text-white border-none hover:bg-[#05a847]"
                        onclick="window.open('https://line.me/R/share?text='+encodeURIComponent('${data.title.replace(/'/g,"\\'")}\\n'+(window.location.origin+window.location.pathname+'#news-${data.id}')),'_blank')">
                        <i class="fab fa-line"></i> LINE
                    </button>
                    ${navigator.share ? `<button class="btn btn-sm rounded-full gap-2 bg-primary text-white border-none hover:bg-primary/80"
                        onclick="navigator.share({title:'${data.title.replace(/'/g,"\\'")}',text:'${data.description.replace(/'/g,"\\'")}',url:window.location.origin+window.location.pathname+'#news-${data.id}'})">
                        <i class="fas fa-share-nodes"></i> แชร์
                    </button>` : ''}
                    <button class="btn btn-sm btn-outline rounded-full gap-2"
                        onclick="navigator.clipboard.writeText(window.location.origin+window.location.pathname+'#news-${data.id}').then(()=>{this.innerHTML='<i class=\'fas fa-check\'></i> คัดลอกแล้ว';setTimeout(()=>{this.innerHTML='<i class=\'fas fa-link\'></i> คัดลอกลิงก์';},2000)})">
                        <i class="fas fa-link"></i> คัดลอกลิงก์
                    </button>
                    <button class="btn btn-primary btn-wide rounded-full shadow-lg" onclick="window.closeNewsModal()">ปิดหน้าต่าง</button>
                </div>
            </div>
        `;
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
};

window.closeNewsModal = () => {
    const modal = document.getElementById("newsModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
};

// ══════════════════════════════════════════════
// Print Announcement
// ══════════════════════════════════════════════
window.printAnnouncement = (title) => {
    document.title = title + ' — วัดโพธิ์แจ้';
    document.body.classList.add('printing-news');
    window.print();
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing-news');
        document.title = 'วัดโพธิ์แจ้ - ต.บางน้ำจืด อ.เมือง จ.สมุทรสาคร';
    }, { once: true });
};

// ══════════════════════════════════════════════
// DOMContentLoaded
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
    document.body.style.overflow = 'auto';

    // โหลดข้อมูลจาก CMS JSON files (ถ้ามี) แล้ว override SITE_DATA
    try {
        const [newsRes, contactRes, eventsRes] = await Promise.all([
            fetch('static/data/news.json'),
            fetch('static/data/contact.json'),
            fetch('static/data/events.json')
        ]);
        if (newsRes.ok) {
            const newsData = await newsRes.json();
            if (newsData.items) SITE_DATA.news = newsData.items;
        }
        if (contactRes.ok) {
            const contactData = await contactRes.json();
            Object.assign(SITE_DATA.contact, contactData);
        }
        if (eventsRes.ok) {
            const eventsData = await eventsRes.json();
            Object.assign(SITE_DATA.events, eventsData);
        }
        const galleryRes = await fetch('static/data/gallery.json');
        if (galleryRes.ok) {
            const galleryData = await galleryRes.json();
            if (galleryData.items && galleryData.items.length > 0) SITE_DATA.gallery = galleryData.items;
        }
        const [abbotsRes, officialsRes, donationRes, settingsRes] = await Promise.all([
            fetch('static/data/abbots.json'),
            fetch('static/data/officials.json'),
            fetch('static/data/donation.json'),
            fetch('static/data/site-settings.json')
        ]);
        if (abbotsRes.ok) { const d = await abbotsRes.json(); if (d.items) SITE_DATA.abbots = d.items; }
        if (officialsRes.ok) { const d = await officialsRes.json(); if (d.items) SITE_DATA.officials = d.items; }
        if (donationRes.ok) { const d = await donationRes.json(); Object.assign(SITE_DATA.donation, d); }
        if (settingsRes.ok) { const d = await settingsRes.json(); if (d.calendarEmbedUrl) SITE_DATA.calendarEmbedUrl = d.calendarEmbedUrl; }
    } catch (e) { /* ใช้ข้อมูล fallback จาก site-data.js */ }

    // Render ทุก section จาก SITE_DATA
    renderGallery();
    renderEvents();
    renderCalendar();
    renderAbbots();
    renderOfficials();
    updateDonation();
    updateContact();

    // Apply saved theme icon
    const savedTheme = localStorage.getItem('wat_theme') || 'emerald';
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg';

    // News notification toast — แสดงครั้งแรกที่เข้าเว็บ (per session)
    if (!sessionStorage.getItem('notif_shown')) {
        setTimeout(() => {
            const toast = document.getElementById('notifToast');
            if (toast) {
                toast.classList.remove('hidden');
                sessionStorage.setItem('notif_shown', '1');
            }
        }, 4000);
    }

    // Visitor Counter
    const updateVisitorCount = () => {
        const counterElement = document.getElementById('visitorCount');
        if (!counterElement) return;
        const baseCount = 12500;
        let sessionVisited = sessionStorage.getItem('temple_session_visited');
        let totalVisits = parseInt(localStorage.getItem('temple_visitor_count') || '0');
        if (!sessionVisited) {
            totalVisits += 1;
            localStorage.setItem('temple_visitor_count', totalVisits);
            sessionStorage.setItem('temple_session_visited', 'true');
        }
        const totalCount = baseCount + totalVisits;
        let start = Math.max(0, totalCount - 10);
        const duration = 1500;
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (totalCount - start) * ease);
            counterElement.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(animate);
            else counterElement.textContent = totalCount.toLocaleString();
        };
        requestAnimationFrame(animate);
    };
    updateVisitorCount();

    // Smooth Scrolling + Mobile Menu Close
    // (CSS scroll-behavior:smooth handles desktop, JS handles mobile dropdown)
    document.querySelectorAll('.dropdown-content a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const headerH = document.querySelector('header')?.offsetHeight || 70;
                    const top = targetEl.getBoundingClientRect().top + window.scrollY - headerH;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
            // ปิด mobile dropdown หลังกดลิงก์
            document.activeElement?.blur();
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header-scrolled', window.scrollY > 50);
    });

    // AOS — refresh หลัง renderGallery เพิ่ม elements เข้า DOM แล้ว
    AOS.init({ once: true, duration: 800, offset: 100 });
    AOS.refresh();

    // Back to Top + Mobile Share FAB
    const backToTopBtn = document.getElementById('backToTop');
    const mobileFab = document.getElementById('mobileShareFab');
    window.addEventListener('scroll', () => {
        const visible = window.scrollY > 400;
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('opacity-0', !visible);
            backToTopBtn.classList.toggle('translate-y-4', !visible);
            backToTopBtn.classList.toggle('opacity-100', visible);
            backToTopBtn.classList.toggle('translate-y-0', visible);
        }
        if (mobileFab) {
            mobileFab.classList.toggle('opacity-0', !visible);
            mobileFab.classList.toggle('translate-y-4', !visible);
            mobileFab.classList.toggle('opacity-100', visible);
            mobileFab.classList.toggle('translate-y-0', visible);
        }
    });

    // Hash-based news link: #news-5 → open modal
    const openNewsFromHash = () => {
        const match = window.location.hash.match(/^#news-(\d+)$/);
        if (match) {
            const id = parseInt(match[1]);
            setTimeout(() => { if (SITE_DATA.news.find(n => n.id == id)) window.showModal(id); }, 500);
        }
    };
    openNewsFromHash();
    window.addEventListener('hashchange', openNewsFromHash);

    // Image Lightbox
    let _modalIndex = -1;
    let _modalItems = [];
    let _touchStartX = 0, _touchStartY = 0;

    function _showModalAt(idx) {
        const modalImg = document.getElementById('modalImage');
        const scroll = document.getElementById('imageModalScroll');
        if (!modalImg || !_modalItems[idx]) return;
        _modalIndex = idx;
        const item = _modalItems[idx];
        modalImg.src = item.src;
        modalImg.alt = item.alt;
        const counter = document.getElementById('imageModalCounter');
        if (counter) counter.textContent = `${idx + 1} / ${_modalItems.length}`;
        const shareBtn = document.getElementById('imageModalShareBtn');
        if (shareBtn) shareBtn.onclick = () => shareContent('#gallery', item.alt + ' — วัดโพธิ์แจ้', 'ภาพ: ' + item.alt + ' จากวัดโพธิ์แจ้');
        if (scroll) scroll.scrollTop = 0;
    }

    window.openImageModal = (idx) => {
        const modal = document.getElementById('imageModal');
        if (!modal) return;
        _modalItems = SITE_DATA.gallery;
        _showModalAt(idx >= 0 ? idx : 0);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.navigateImageModal = (dir) => {
        const next = (_modalIndex + dir + _modalItems.length) % _modalItems.length;
        _showModalAt(next);
    };

    window.closeImageModal = () => {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            setTimeout(() => { const m = document.getElementById('modalImage'); if (m) m.src = ''; }, 200);
        }
    };

    // Swipe — เฉพาะแนวนอน (ไม่ trigger เมื่อ scroll แนวตั้ง)
    const _modalScroll = document.getElementById('imageModalScroll');
    if (_modalScroll) {
        _modalScroll.addEventListener('touchstart', e => {
            _touchStartX = e.touches[0].clientX;
            _touchStartY = e.touches[0].clientY;
        }, { passive: true });
        _modalScroll.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - _touchStartX;
            const dy = e.changedTouches[0].clientY - _touchStartY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
                navigateImageModal(dx < 0 ? 1 : -1);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { window.closeImageModal(); window.closeNewsModal(); }
        if (e.key === 'ArrowRight') navigateImageModal(1);
        if (e.key === 'ArrowLeft') navigateImageModal(-1);
    });

    // Service Worker (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/web/sw.js').catch(() => {});
    }
});
