// หน้าแรกแบบภาพเต็มจอ: เมนูเต็มจอ, ค้นหาในเว็บ, ข่าวล่าสุดบนแถบหัว
(function () {
    const overlay = document.getElementById('hvOverlay');
    const input = document.getElementById('hvSearchInput');
    const results = document.getElementById('hvSearchResults');
    if (!overlay) return;
    // site-data.js declares SITE_DATA with const: it is global but not a window property.
    const data = () => (typeof SITE_DATA !== 'undefined' ? SITE_DATA : {});

    // ── Hero slideshow: one photo every 6 s, the next one loaded before it is shown ──
    const HERO_PHOTOS = [
        'IMG_4753_0.jpg', 'EOS-R6-124_0.JPG', 'IMG_4749_0.jpg', 'EOS-R6-664_0.JPG', 'LINE_ALBUM_โบสถ์_250301_7_0.jpg',
        'IMG_4249_0.jpg', 'EOS-R6-17_0.JPG', 'IMG_4763_0.jpg', 'EOS-R6-26_0.JPG', 'LINE_ALBUM_โบสถ์_250301_3_0.jpg',
        'IMG_4768_0.jpg', 'EOS-R6-661_0.JPG', 'IMG_4724_0.jpg', 'EOS-R6-25_0.JPG', 'LINE_ALBUM_โบสถ์_250301_8_0.jpg',
        'IMG_4792_0.jpg', 'EOS-R6-16_0.JPG', 'IMG_4726_0.jpg', 'IMG_4709_0.jpg', 'LINE_ALBUM_โบสถ์_250301_12_0.jpg',
    ].map((f) => 'static/gallery/' + encodeURIComponent(f));
    const slidesBox = document.getElementById('hvSlides');
    const count = document.getElementById('hvCount');
    if (slidesBox) {
        const th = (n) => String(n).replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);
        let current = 0, timer = null, ticket = 0;
        const show = (i, back = false) => {
            const next = (i + HERO_PHOTOS.length) % HERO_PHOTOS.length, mine = ++ticket;
            current = next;
            if (count) count.textContent = `${th(current + 1)} / ${th(HERO_PHOTOS.length)}`;
            const img = new Image();
            img.onload = img.onerror = () => {
                if (mine !== ticket) return; // a newer click won
                const layer = document.createElement('div');
                // The new photo fades in over the shown one, which then goes.
                layer.className = 'hv-slide';
                layer.style.backgroundImage = `url('${HERO_PHOTOS[next]}')`;
                slidesBox.appendChild(layer);
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    layer.classList.add('on');
                }));
                // Older layers go once this one has faded in.
                setTimeout(() => { let el; while ((el = slidesBox.firstElementChild) && el !== layer && slidesBox.lastElementChild === layer) el.remove(); }, 2100);
                new Image().src = HERO_PHOTOS[(next + 1) % HERO_PHOTOS.length];
            };
            img.src = HERO_PHOTOS[next];
        };
        const restart = () => { clearInterval(timer); timer = setInterval(() => { if (!document.hidden) show(current + 1); }, 6000); };
        document.getElementById('hvNext')?.addEventListener('click', () => { show(current + 1); restart(); });
        document.getElementById('hvPrev')?.addEventListener('click', () => { show(current - 1, true); restart(); });
        if (count) count.textContent = `${th(1)} / ${th(HERO_PHOTOS.length)}`;
        new Image().src = HERO_PHOTOS[1];
        restart();
    }

    window.hvOpen = (mode) => {
        overlay.dataset.mode = mode;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('hv-lock');
        if (mode === 'search') setTimeout(() => input?.focus(), 50);
    };
    window.hvClose = () => {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('hv-lock');
    };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) hvClose(); });
    // A menu link closes the overlay; the page then scrolls to the section.
    overlay.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) hvClose(); });

    // Footer year in Buddhist Era, Thai digits.
    const yearEl = document.getElementById('hv-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear() + 543).replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);

    // Theme icon matches the saved theme.
    const icon = document.getElementById('themeIcon');
    if (icon && document.documentElement.getAttribute('data-theme') === 'dark') icon.className = 'fas fa-sun';

    // ── Header bar: the next upcoming event (events.json → upcoming, with "start") and a live countdown ──
    const notice = document.getElementById('hv-notice-text');
    const thd = (n) => String(n).replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);
    const two = (n) => thd(String(n).padStart(2, '0'));
    let nextEvent = null;
    function pickEvent(list) {
        const now = Date.now();
        const timed = (list || []).filter((e) => e.start && !isNaN(Date.parse(e.start)))
            .map((e) => ({ ...e, t0: Date.parse(e.start), t1: Date.parse(e.end || e.start) }))
            .filter((e) => e.t1 > now).sort((a, b) => a.t0 - b.t0);
        return timed[0] || null;
    }
    function tick() {
        if (!notice || !nextEvent) return;
        const left = nextEvent.t0 - Date.now();
        if (left <= 0) {
            if (Date.now() > nextEvent.t1) { nextEvent = pickEvent(data().events?.upcoming); if (!nextEvent) { notice.parentElement.hidden = true; return; } return tick(); }
            notice.innerHTML = `${esc(nextEvent.title)} <b class="hv-cd">กำลังจัดอยู่ขณะนี้</b>`;
            return;
        }
        const s = Math.floor(left / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
        notice.innerHTML = `${esc(nextEvent.title)} <b class="hv-cd">อีก ${d ? thd(d) + ' วัน ' : ''}${two(h)}:${two(m)}:${two(s % 60)}</b>`;
    }
    if (notice) {
        notice.parentElement.hidden = true; // shown once an event with a start time is found
        notice.parentElement.href = '#events';
        fetch('static/data/events.json').then((r) => (r.ok ? r.json() : null)).then((d) => {
            nextEvent = pickEvent(d?.upcoming || data().events?.upcoming);
            if (!nextEvent) return;
            notice.parentElement.hidden = false;
            tick(); setInterval(tick, 1000);
        }).catch(() => {});
    }

    // ── Search: news items, then page sections whose text contains the words ──
    const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const SECTIONS = [['about', 'ประวัติวัด'], ['news', 'ข่าวสาร'], ['events', 'ปฏิทินกิจกรรม'], ['gallery', 'แกลเลอรี'],
        ['donation', 'ทำบุญออนไลน์'], ['abbots', 'ทำเนียบเจ้าอาวาส'], ['officials', 'พระสังฆาธิการ'], ['contact', 'ติดต่อวัด']];
    const snippet = (text, q) => {
        const i = text.toLowerCase().indexOf(q);
        if (i < 0) return '';
        const s = Math.max(0, i - 40);
        return (s ? '…' : '') + text.slice(s, i + q.length + 60).trim() + '…';
    };
    function search(raw) {
        const q = raw.trim().toLowerCase();
        if (!q) { results.innerHTML = ''; return; }
        const out = [];
        for (const n of data().news || []) {
            const hay = [n.title, n.description, n.content].join(' ');
            if (hay.toLowerCase().includes(q)) out.push(`<a href="#news-${esc(n.id)}" data-news="${esc(n.id)}"><span class="hv-r-type">ข่าวสาร</span>
                <span class="hv-r-title">${esc(n.title)}</span><span class="hv-r-desc">${esc(n.description || '')}</span></a>`);
        }
        for (const [id, label] of SECTIONS) {
            const el = document.getElementById(id);
            if (!el) continue;
            const text = el.innerText.replace(/\s+/g, ' ');
            if (label.toLowerCase().includes(q) || text.toLowerCase().includes(q))
                out.push(`<a href="#${id}"><span class="hv-r-type">หัวข้อในหน้า</span><span class="hv-r-title">${esc(label)}</span>
                    <span class="hv-r-desc">${esc(snippet(text, q))}</span></a>`);
        }
        results.innerHTML = out.length ? out.join('') : `<div class="hv-empty">ไม่พบ "${esc(raw.trim())}"</div>`;
    }
    input?.addEventListener('input', () => search(input.value));
    results?.addEventListener('click', (e) => {
        const a = e.target.closest('a[data-news]');
        if (a) { e.preventDefault(); hvClose(); window.showModal?.(a.dataset.news); }
    });
})();
