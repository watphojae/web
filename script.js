// ข้อความ alt ของรูป — กันเครื่องหมายคำพูด/แท็กหลุดออกจาก attribute
const escAlt = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
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
        <div class="hv-cal" data-aos="fade-up">
            <h3 class="hv-ev-head"><i class="fa-brands fa-google"></i> วันหยุดราชการ (ปฏิทิน Google)</h3>
            <div class="hv-cal-frame">
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
// แกลเลอรีแบบอัลบั้มตามงาน: static/data/albums.json (ไม่มีไฟล์นี้ = แสดงรูปทั้งหมดจาก SITE_DATA.gallery แบบเดิม)
// หน้าแรกของแกลเลอรีแสดงปกอัลบั้ม กดเข้าไปเห็นรูปในอัลบั้มทีละ 12 รูป ลิงก์ตรงเข้าอัลบั้ม: #album-<id>
// (สไตล์อยู่ใน static/css/hero.css → .hv-alb, .hv-gal)
let galleryShown = 12, galleryAlbums = null, galleryOpen = null;
const thNum = (n) => String(n).replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);
const qAttr = (t) => String(t || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
// Grid / cover size: the 1280 px copy of a gallery photo (the zoom view keeps the full-size file).
const mediumOf = (src) => (/static\/gallery\/.+\.webp$/.test(src || '') && !/-m\.webp$/.test(src) ? src.replace(/\.webp$/, '-m.webp') : src);
function albumPhotos(al) {
    return (al.photos || []).map((x) => (typeof x === 'string' ? { src: x, alt: al.title } : { alt: al.title, ...x }));
}
function renderGallery() {
    const container = document.getElementById('gallery-render-root');
    if (!container) return;
    container.className = 'hv-gal-wrap';
    if (galleryAlbums === null) {
        galleryAlbums = [];
        fetch('static/data/albums.json').then((r) => (r.ok ? r.json() : null)).then((d) => {
            galleryAlbums = (d?.items || []).filter((al) => al.photos?.length);
            const m = location.hash.match(/^#album-(.+)$/);
            if (m) { openAlbum(decodeURIComponent(m[1]), true); return; }
            renderGallery();
        }).catch(() => renderGallery());
        return;
    }
    // ไม่มีอัลบั้ม: แสดงรูปทั้งหมดแบบเดิม
    if (!galleryAlbums.length) { window.galleryModalItems = null; return renderPhotoGrid(container, dedupe(SITE_DATA.gallery), null); }
    const al = galleryAlbums.find((x) => x.id === galleryOpen);
    if (al) return renderPhotoGrid(container, albumPhotos(al), al);
    window.galleryModalItems = null;
    container.innerHTML = `
        <div class="hv-alb">${galleryAlbums.map((x) => `
            <a class="hv-alb-card" href="#album-${encodeURIComponent(x.id)}" onclick="event.preventDefault(); openAlbum('${qAttr(x.id)}')">
                <div class="hv-alb-cover"><img src="${mediumOf(x.cover || albumPhotos(x)[0].src)}" alt="ภาพปก${escAlt(x.title || 'อัลบั้ม')}" loading="lazy"><span class="hv-alb-count"><i class="fa-regular fa-images"></i> ${thNum(x.photos.length)} รูป</span></div>
                <div class="hv-alb-body">
                    ${x.date ? `<span class="hv-alb-date">${x.date}</span>` : ''}
                    <h3 class="hv-alb-title">${x.title}</h3>
                    ${x.description ? `<p class="hv-alb-desc">${x.description}</p>` : ''}
                </div>
            </a>`).join('')}
        </div>
        <p class="hv-gal-count">${thNum(galleryAlbums.length)} อัลบั้ม · ${thNum(galleryAlbums.reduce((n, x) => n + x.photos.length, 0))} รูป</p>`;
}
function dedupe(list) {
    const seen = new Set();
    return (list || []).filter((img) => { const k = String(img.src).replace(/_\d+(\.\w+)$/, '$1').toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}
function renderPhotoGrid(container, list, al) {
    window.galleryModalItems = list; // หน้าต่างดูรูปเลื่อนเฉพาะรูปในอัลบั้มนี้
    const q = qAttr;
    container.innerHTML = `
        ${al ? `<div class="hv-alb-head">
            <button type="button" class="hv-alb-back" onclick="closeAlbum()"><i class="fas fa-arrow-left"></i> อัลบั้มทั้งหมด</button>
            <div class="hv-alb-head-text">
                ${al.date ? `<span class="hv-alb-date">${al.date}</span>` : ''}
                <h3 class="hv-alb-head-title">${al.title}</h3>
                ${al.description ? `<p class="hv-alb-desc">${al.description}</p>` : ''}
            </div>
            <button type="button" class="hv-alb-share" title="แชร์อัลบั้ม" aria-label="แชร์อัลบั้ม"
                onclick="shareContent('#album-${q(encodeURIComponent(al.id))}','${q(al.title)} — วัดโพธิ์แจ้','อัลบั้มภาพ: ${q(al.title)} ${q(al.date)}')"><i class="fas fa-share-nodes"></i> แชร์อัลบั้ม</button>
        </div>` : ''}
        <div class="hv-gal">${list.slice(0, galleryShown).map((img, i) => `
            <figure class="hv-gal-item" onclick="openImageModal(${i})">
                <img src="${mediumOf(img.src)}" alt="${escAlt(img.alt || ((al ? al.title : 'แกลเลอรีวัดโพธิ์แจ้') + ' รูปที่ ' + (i + 1)))}" loading="lazy" onload="if(this.naturalHeight>this.naturalWidth*1.1)this.parentNode.classList.add('tall')">
                <figcaption>
                    <span>${img.alt || ''}</span>
                    <button type="button" title="แชร์รูปภาพ" aria-label="แชร์รูปภาพ"
                        onclick="event.stopPropagation();shareContent('#gallery','${q(img.alt)} — วัดโพธิ์แจ้','ภาพ: ${q(img.alt)} จากวัดโพธิ์แจ้')"><i class="fas fa-share-nodes"></i></button>
                </figcaption>
            </figure>`).join('')}
        </div>
        ${list.length > galleryShown ? `<button type="button" class="hv-gal-more" onclick="galleryShown += 12; renderGallery();">ดูรูปเพิ่ม <span>(อีก ${thNum(list.length - galleryShown)} รูป)</span></button>` : ''}
        <p class="hv-gal-count">${al ? `${al.title} · ` : ''}ทั้งหมด ${thNum(list.length)} รูป</p>`;
}
window.openAlbum = (id, fromHash) => {
    galleryOpen = id; galleryShown = 12;
    renderGallery();
    if (!fromHash) history.replaceState(null, '', '#album-' + encodeURIComponent(id));
    const g = document.getElementById('gallery');
    if (g) window.scrollTo({ top: g.getBoundingClientRect().top + window.scrollY - 72, behavior: fromHash ? 'auto' : 'smooth' });
};
window.closeAlbum = () => {
    galleryOpen = null; galleryShown = 12;
    renderGallery();
    history.replaceState(null, '', '#gallery');
    const g = document.getElementById('gallery');
    if (g) window.scrollTo({ top: g.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
};

// ══════════════════════════════════════════════
// Render: ป้ายจำนวนพระภิกษุ-สามเณรจำพรรษา
// ══════════════════════════════════════════════
function renderMonks() {
    const root = document.getElementById('monks-render-root');
    const m = SITE_DATA.monks;
    if (!root || !m || m.show === false) { root?.closest('section')?.classList.add('hidden'); return; }
    const th = n => String(n).replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]);
    const b = Number(m.bhikkhu) || 0, s = Number(m.samanera) || 0;
    // แถบเขียวเข้มเต็มความกว้าง: หัวข้อซ้าย ตัวเลขใหญ่สีทองขวา (สไตล์อยู่ใน static/css/hero.css → .hv-monks)
    const item = (label, n, total) => `
        <div class="hv-monks-item${total ? ' total' : ''}">
            <span class="hv-monks-num">${th(n)}</span>
            <span class="hv-monks-label">${label} <small>รูป</small></span>
        </div>`;
    const share = (key, icon, title) => `<button type="button" onclick="shareMonks('${key}')" title="${title}" aria-label="${title}"><i class="${icon}"></i></button>`;
    root.innerHTML = `
        <div class="hv-monks" data-aos="fade-up">
            <div class="hv-monks-head">
                <span class="hv-sec-kicker">Vassa ${m.year}</span>
                <h2 class="hv-monks-title">พระภิกษุ-สามเณร<br><span class="nw">อยู่จำพรรษา พ.ศ. ${th(m.year)}</span></h2>
                <div class="hv-monks-share">
                    <span>แชร์</span>
                    ${share('facebook', 'fab fa-facebook-f', 'แชร์ไป Facebook')}
                    ${share('line', 'fab fa-line', 'แชร์ไป LINE')}
                    ${share('twitter', 'fab fa-x-twitter', 'แชร์ไป X')}
                    ${share('instagram', 'fab fa-instagram', 'แชร์ไป Instagram')}
                    ${navigator.share ? share('native', 'fas fa-share-nodes', 'แชร์') : ''}
                    <button type="button" id="monks-share-copy" onclick="shareMonks('copy')" title="คัดลอกลิงก์" aria-label="คัดลอกลิงก์"><i class="fas fa-link"></i></button>
                </div>
            </div>
            <div class="hv-monks-nums">
                ${item('พระภิกษุ', b)}
                ${item('สามเณร', s)}
                ${item('รวมทั้งสิ้น', b + s, true)}
            </div>
        </div>`;
}

function shareMonks(platform) {
    const m = SITE_DATA.monks;
    const b = Number(m.bhikkhu) || 0, s = Number(m.samanera) || 0;
    const url = window.location.origin + window.location.pathname + '#monks-stat';
    const title = `พระภิกษุ-สามเณร อยู่จำพรรษา พ.ศ. ${m.year} วัดโพธิ์แจ้`;
    const text = `${title}\nพระภิกษุ ${b} รูป | สามเณร ${s} รูป | รวม ${b + s} รูป`;
    const copied = msg => navigator.clipboard.writeText(platform === 'copy' ? url : text + '\n' + url).then(() => {
        const btn = document.getElementById('monks-share-copy');
        if (platform === 'copy' && btn) { btn.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-link"></i>'; }, 2000); }
        else alert(msg);
    });
    switch (platform) {
        case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=500'); break;
        case 'line': window.open(`https://line.me/R/share?text=${encodeURIComponent(text + '\n' + url)}`, '_blank'); break;
        case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400'); break;
        case 'instagram': copied('คัดลอกข้อความและลิงก์แล้ว!\nนำไปวางใน Story หรือ Bio บน Instagram ได้เลย'); break;
        case 'native': navigator.share({ title, text, url }).catch(() => {}); break;
        default: copied('คัดลอกลิงก์เรียบร้อยแล้ว');
    }
}

// ══════════════════════════════════════════════
// Render: ปฏิทินกิจกรรม
// ══════════════════════════════════════════════
function renderEvents() {
    // กล่องนับถอยหลังกิจกรรมถัดไป + ปฏิทิน 3 คอลัมน์ (สไตล์อยู่ใน static/css/hero.css → .hv-ev)
    const container = document.getElementById('events-render-root');
    if (!container) return;
    const { regular = [], holidays = [], holidaysYear, upcoming = [] } = SITE_DATA.events;
    const th = (n) => String(n).replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);
    const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const q = (t) => String(t).replace(/'/g, "\\'").replace(/<[^>]*>/g, ' ');
    // ข้อความให้เป็นระเบียบ: เลขไทยทั้งหมด, เวลา 17:30 → ๑๗.๓๐, "… ถึง …" ขึ้นบรรทัดใหม่,
    // ไม่ตัดคำกลางวงเล็บหรือพระนาม (สมเด็จ…)
    const nw = (m) => `<span class="hv-nw">${m}</span>`;
    const fmt = (t) => th(String(t || '').replace(/(\d{1,2}):(\d{2})/g, '$1.$2'))
        .replace(/\s+ถึง\s+/g, '<br>ถึง ')
        .replace(/\s*\|\s*/g, '<br>')
        .replace(/\([^)<]*\)/g, nw)
        .replace(/สมเด็จ[^\s<]*/g, nw);

    const dateBlock = (top, big, cls = '') => `
        <div class="hv-ev-date ${cls}${String(big).length > 3 ? ' is-long' : ''}"><span class="hv-ev-mon">${top}</span><span class="hv-ev-day">${th(big)}</span></div>`;
    const row = (date, title, detail, extra = '', cls = '', badge = '') => `
        <div class="hv-ev-row ${cls}">${date}<div class="hv-ev-info">${badge ? `<span class="hv-ev-badge">${badge}</span>` : ''}<p class="hv-ev-title">${fmt(title)}</p>${detail ? `<p class="hv-ev-detail">${fmt(detail)}</p>` : ''}${extra}</div></div>`;

    // กิจกรรมที่กำลังจะมาถึง (ซ่อนเองเมื่อเลย endDate)
    const active = upcoming.filter((e) => !e.endDate || new Date(e.endDate) >= today);
    const upcomingHTML = active.map((e) => row(
        dateBlock(e.month, e.date, 'is-main'),
        e.title,
        e.detail,
        `<button type="button" class="hv-ev-share" title="แชร์กิจกรรม" aria-label="แชร์กิจกรรม" onclick="shareContent('#events','${q(e.title)} — ${q(e.month)} ${q(e.date)}','${q(e.title)} ${q(e.detail)}')"><i class="fas fa-share-nodes"></i></button>`,
        '', e.badge || ''
    )).join('') || '<p class="hv-ev-empty">ยังไม่มีกิจกรรมที่ประกาศ</p>';

    const regularHTML = regular.map((e) => row(
        dateBlock(e.day1, e.day2, 'is-week'),
        e.title,
        `<i class="fa-regular fa-clock"></i> ${e.time}${e.location ? ` · ${e.location}` : ''}`
    )).join('');

    // วันสำคัญ: วันที่ผ่านไปแล้วในปีนี้แสดงจางลง
    const yearAD = (Number(holidaysYear) || today.getFullYear() + 543) - 543;
    const holidaysHTML = holidays.map((h) => {
        const m = String(h.date).match(/(\d+)\s*(\S+)/);
        const mi = m ? MONTHS.indexOf(m[2]) : -1;
        const past = mi >= 0 && new Date(yearAD, mi, +m[1]) < today;
        return row(dateBlock(m ? m[2] : '', m ? m[1] : h.date), h.title, h.detail, past ? '<span class="hv-ev-past">ผ่านไปแล้ว</span>' : '', past ? 'is-past' : '');
    }).join('');

    container.innerHTML = `
        <div id="hv-ev-next"></div>
        <div class="hv-ev">
            <div class="hv-ev-col" data-aos="fade-up">
                <h3 class="hv-ev-head"><i class="fa-solid fa-calendar-days"></i> กิจกรรมที่กำลังจะมาถึง</h3>
                ${upcomingHTML}
            </div>
            <div class="hv-ev-col" data-aos="fade-up" data-aos-delay="100">
                <h3 class="hv-ev-head"><i class="fa-solid fa-rotate"></i> กิจกรรมประจำ</h3>
                ${regularHTML}
            </div>
            <div class="hv-ev-col" data-aos="fade-up" data-aos-delay="200">
                <h3 class="hv-ev-head"><i class="fa-solid fa-star"></i> วันสำคัญทางพระพุทธศาสนา ${th(holidaysYear || '')}</h3>
                ${holidaysHTML}
            </div>
        </div>`;
    renderNextEvent(upcoming);
}

// กล่องนับถอยหลัง: กิจกรรมแรกที่มีเวลาเริ่ม (start) และยังไม่จบ (end)
let nextEventTimer = null;
function renderNextEvent(upcoming) {
    const box = document.getElementById('hv-ev-next');
    if (!box) return;
    const th = (n) => String(n).replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);
    const now = Date.now();
    const ev = (upcoming || []).filter((e) => e.start && !isNaN(Date.parse(e.start)))
        .map((e) => ({ ...e, t0: Date.parse(e.start), t1: Date.parse(e.end || e.start) }))
        .filter((e) => e.t1 > now).sort((a, b) => a.t0 - b.t0)[0];
    clearInterval(nextEventTimer);
    if (!ev) { box.innerHTML = ''; return; }
    box.innerHTML = `
        <div class="hv-ev-next" data-aos="fade-up">
            <div class="hv-ev-next-text">
                <span class="hv-ev-next-kicker">กิจกรรมถัดไป</span>
                <h3 class="hv-ev-next-title">${ev.title}</h3>
                <p class="hv-ev-next-detail">${ev.detail || ''}</p>
            </div>
            <div class="hv-ev-count" aria-live="off">
                <div><b data-u="d">-</b><span>วัน</span></div>
                <div><b data-u="h">-</b><span>ชั่วโมง</span></div>
                <div><b data-u="m">-</b><span>นาที</span></div>
                <div><b data-u="s">-</b><span>วินาที</span></div>
            </div>
        </div>`;
    const set = (u, v) => { const el = box.querySelector(`[data-u="${u}"]`); if (el) el.textContent = v; };
    const tick = () => {
        const left = ev.t0 - Date.now();
        if (left <= 0) {
            if (Date.now() > ev.t1) return renderNextEvent(upcoming);
            box.querySelector('.hv-ev-count').innerHTML = '<p class="hv-ev-live">กำลังจัดอยู่ขณะนี้</p>';
            clearInterval(nextEventTimer); nextEventTimer = setInterval(() => { if (Date.now() > ev.t1) renderNextEvent(upcoming); }, 30000);
            return;
        }
        const s = Math.floor(left / 1000);
        set('d', th(Math.floor(s / 86400)));
        set('h', th(String(Math.floor((s % 86400) / 3600)).padStart(2, '0')));
        set('m', th(String(Math.floor((s % 3600) / 60)).padStart(2, '0')));
        set('s', th(String(s % 60).padStart(2, '0')));
    };
    tick();
    if (ev.t0 > Date.now()) nextEventTimer = setInterval(tick, 1000);
}

// ══════════════════════════════════════════════
// Render: ทำเนียบเจ้าอาวาส
// ══════════════════════════════════════════════
function renderAbbots() {
    // เจ้าอาวาสรูปปัจจุบันเด่นด้านบน แล้วเรียงรูปก่อน ๆ ตามลำดับสมัยบนเส้นเวลา (สไตล์อยู่ใน static/css/hero.css → .hv-abb)
    const container = document.getElementById('abbots-render-root');
    if (!container) return;
    const th = (t) => String(t || '').replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);
    const plain = (t) => String(t || '').replace(/<br>/g, ' ');
    const q = (t) => plain(t).replace(/'/g, "\\'");
    const share = (a) => `shareContent('#abbots','${q(a.name)} — เจ้าอาวาสวัดโพธิ์แจ้','${q(a.name)} เจ้าอาวาสวัดโพธิ์แจ้ ${q(a.years)} | วัดโพธิ์แจ้')`;
    const seq = (a) => th(String(a.sequence || '').replace(/\D/g, ''));
    const photo = (a, cls) => a.image
        ? `<img src="${a.image}" alt="${plain(a.name)}" class="${cls}" loading="lazy" onclick="openImageModal(this)">`
        : `<div class="${cls} hv-abb-noimg" aria-label="ไม่ปรากฏรูป"><i class="fa-solid fa-dharmachakra"></i><span>ไม่ปรากฏรูป</span></div>`;
    const current = SITE_DATA.abbots.find((a) => a.isCurrent);
    const past = SITE_DATA.abbots.filter((a) => !a.isCurrent);
    container.className = 'hv-abb';
    container.innerHTML = `
        ${current ? `<div class="hv-abb-now" data-aos="fade-up">
            ${photo(current, 'hv-abb-now-img')}
            <div class="hv-abb-now-text">
                <span class="hv-abb-now-kicker">เจ้าอาวาสรูปปัจจุบัน · ลำดับที่ ${seq(current)}</span>
                <h3 class="hv-abb-now-name">${current.name}</h3>
                <p class="hv-abb-now-years">${th(current.years)}</p>
                <button type="button" class="hv-abb-share" onclick="${share(current)}"><i class="fas fa-share-nodes"></i> แชร์</button>
            </div>
        </div>` : ''}
        <h3 class="hv-abb-tl-head">ลำดับเจ้าอาวาสในอดีต</h3>
        <ol class="hv-abb-tl">${past.map((a) => `
            <li data-aos="fade-up">
                <span class="hv-abb-seq">${seq(a)}</span>
                ${photo(a, 'hv-abb-img')}
                <h4 class="hv-abb-name">${a.name}</h4>
                <p class="hv-abb-years">${th(a.years)}</p>
                <button type="button" class="hv-abb-share sm" title="แชร์" aria-label="แชร์" onclick="${share(a)}"><i class="fas fa-share-nodes"></i></button>
            </li>`).join('')}
        </ol>`;
}

// ══════════════════════════════════════════════
// Render: พระสังฆาธิการ
// ══════════════════════════════════════════════
function renderOfficials() {
    // รูปแนวตั้งในกรอบบาง ตำแหน่งสีทองเหนือชื่อ (สไตล์อยู่ใน static/css/hero.css → .hv-off)
    const container = document.getElementById('officials-render-root');
    if (!container) return;
    const plain = (t) => String(t || '').replace(/<br>/g, ' ');
    const q = (t) => plain(t).replace(/'/g, "\\'");
    container.className = 'hv-off';
    container.innerHTML = SITE_DATA.officials.map((o, i) => `
        <figure class="hv-off-item${i === 0 ? ' is-head' : ''}" data-aos="fade-up" data-aos-delay="${i * 100}">
            <img src="${o.image}" alt="${plain(o.name)}" loading="lazy" onclick="openImageModal(this)">
            <figcaption>
                <span class="hv-off-pos">${o.position}</span>
                <h3 class="hv-off-name">${o.name}</h3>
                <button type="button" class="hv-abb-share sm" title="แชร์" aria-label="แชร์"
                    onclick="shareContent('#officials','${q(o.position)} ${q(o.name)} — วัดโพธิ์แจ้','${q(o.position)} ${q(o.name)} | วัดโพธิ์แจ้')"><i class="fas fa-share-nodes"></i></button>
            </figcaption>
        </figure>`).join('');
}

// ══════════════════════════════════════════════
// Update: ข้อมูลทำบุญออนไลน์
// ══════════════════════════════════════════════
function updateDonation() {
    const d = SITE_DATA.donation;
    // ตัดขีดตกแต่ง "— ... —" ที่ใส่ไว้ในไฟล์ข้อมูลออก
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val || '').replace(/^[\s—–-]+|[\s—–-]+$/g, ''); };
    const setHref = (id, val) => { const el = document.getElementById(id); if (el) el.href = val; };
    if (d.qrImage) document.querySelectorAll('.hv-don-qr img, .hv-don-save').forEach((el) => { el[el.tagName === 'A' ? 'href' : 'src'] = d.qrImage; });
    set('donation-bank', d.bank);
    set('donation-account-name', d.accountName);
    set('donation-account-number', d.accountNumber);
    setHref('donation-line-url', d.lineUrl);
    const lineText = document.getElementById('donation-line-text');
    if (lineText) lineText.textContent = 'LINE ' + d.lineId;
}
// ปุ่มคัดลอกเลขบัญชี: คัดลอกเฉพาะตัวเลข เอาไปวางในแอปธนาคารได้ทันที
window.copyDonationAccount = (btn) => {
    const num = (document.getElementById('donation-account-number')?.textContent || '').replace(/\D/g, '');
    if (!num) return;
    const done = () => { const t = btn.querySelector('span'); btn.classList.add('ok'); if (t) t.textContent = 'คัดลอกแล้ว'; setTimeout(() => { btn.classList.remove('ok'); if (t) t.textContent = 'คัดลอก'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(num).then(done).catch(() => prompt('เลขที่บัญชี', num));
    else prompt('เลขที่บัญชี', num);
};

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
    setHref('contact-phone-url', 'tel:' + String(c.phone || '').replace(/[^\d+]/g, ''));
    if (c.lineUrl) setHref('contact-line-url', c.lineUrl);
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
                <img src="${data.image}" alt="${escAlt(data.title || 'ข่าววัดโพธิ์แจ้')}" style="width:100%;max-height:80vh;object-fit:contain;display:block;">
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
        if (settingsRes.ok) { const d = await settingsRes.json(); if (d.calendarEmbedUrl) SITE_DATA.calendarEmbedUrl = d.calendarEmbedUrl; if (d.monks) SITE_DATA.monks = Object.assign({}, SITE_DATA.monks, d.monks); }
    } catch (e) { /* ใช้ข้อมูล fallback จาก site-data.js */ }

    // Render ทุก section จาก SITE_DATA
    renderMonks();
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
                document.body.classList.add('notif-open');
                sessionStorage.setItem('notif_shown', '1');
                // ปิดเองหลัง 12 วินาที ไม่ให้บังหน้าจอมือถือนาน
                setTimeout(() => toast.classList.add('hidden'), 12000);
                // ปุ่มปิด/ลิงก์ในกล่องเพิ่ม class hidden → คืนปุ่มลอย
                new MutationObserver(() => {
                    if (toast.classList.contains('hidden')) document.body.classList.remove('notif-open');
                }).observe(toast, { attributes: true, attributeFilter: ['class'] });
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
    }, { passive: true });

    // AOS — refresh หลัง renderGallery เพิ่ม elements เข้า DOM แล้ว
    // Phones/tablets: no scroll-in animation. Sections hidden until they animate in showed as
    // blank white flashes while scrolling on mobile, so content is simply shown there.
    AOS.init({ once: true, duration: 800, offset: 100, disable: () => window.innerWidth < 1100 });
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
    }, { passive: true });

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
        modalImg.alt = item.alt || 'ภาพขยายจากแกลเลอรีวัดโพธิ์แจ้';
        const counter = document.getElementById('imageModalCounter');
        if (counter) counter.textContent = `${idx + 1} / ${_modalItems.length}`;
        const shareBtn = document.getElementById('imageModalShareBtn');
        if (shareBtn) shareBtn.onclick = () => shareContent('#gallery', item.alt + ' — วัดโพธิ์แจ้', 'ภาพ: ' + item.alt + ' จากวัดโพธิ์แจ้');
        if (scroll) scroll.scrollTop = 0;
    }

    window.openImageModal = (idxOrEl) => {
        const modal = document.getElementById('imageModal');
        if (!modal) return;
        if (typeof idxOrEl === 'number') {
            _modalItems = window.galleryModalItems || SITE_DATA.gallery;
            _showModalAt(idxOrEl);
        } else {
            const el = typeof idxOrEl === 'string' ? null : idxOrEl;
            const src = el ? el.src : idxOrEl;
            const alt = el ? (el.alt || '') : '';
            _modalItems = [{ src, alt }];
            _showModalAt(0);
        }
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const toast = document.getElementById('notifToast');
        if (toast) toast.classList.add('hidden'); // กล่องติดตามข่าวสารอยู่ชั้นบนกว่า — ปิดไม่ให้บังรูป
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
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});

// ลิงก์อัลบั้ม (#album-<id>) ที่กดขณะเปิดหน้าเว็บอยู่แล้ว
window.addEventListener('hashchange', () => {
    const m = location.hash.match(/^#album-(.+)$/);
    if (m && Array.isArray(galleryAlbums) && galleryAlbums.length) openAlbum(decodeURIComponent(m[1]), true);
});
