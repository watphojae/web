/**
 * script.js - Interactive features for วัดโพธิ์แจ้ website
 * ข้อมูลทั้งหมดอยู่ใน static/js/site-data.js
 */

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
        <div class="gallery-item${img.wide ? ' gallery-wide' : ''}" data-aos="fade-up" data-aos-delay="${i * 50}">
            <img src="${img.src}" alt="${img.alt}" onclick="openImageModal(this)" class="gallery-img" loading="lazy">
            <div class="gallery-overlay"><span>${img.alt}</span></div>
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
            <div class="event-info">
                <div class="flex items-center gap-2 mb-1">
                    <span class="badge ${e.badgeClass} badge-xs text-white">${e.badge}</span>
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
            if (galleryData.items) SITE_DATA.gallery = galleryData.items;
        }
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

    // Smooth Scrolling
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header-scrolled', window.scrollY > 50);
    });

    // AOS
    AOS.init({ once: true, duration: 800, offset: 100 });

    // Back to Top
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-4');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
                backToTopBtn.classList.add('opacity-0', 'translate-y-4');
            }
        });
    }

    // Image Lightbox
    window.openImageModal = (imgOrSrc) => {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        if (modal && modalImg) {
            modalImg.src = typeof imgOrSrc === 'string' ? imgOrSrc : imgOrSrc.src;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeImageModal = () => {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            setTimeout(() => { const m = document.getElementById('modalImage'); if (m) m.src = ''; }, 200);
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { window.closeImageModal(); window.closeNewsModal(); }
    });

    // Service Worker (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/web/sw.js').catch(() => {});
    }
});
