/**
 * script.js - Interactive features for วัดโพธิ์แจ้ website
 */

const newsData = {
    "1": {
        title: "สวดมนต์ข้ามปี ๒๕๖๙",
        content: "ขอเชิญพุทธศาสนิกชนร่วมเจริญจิตตภาวนา และสวดมนต์ข้ามปี เพื่อความเป็นสิริมงคลต้อนรับศักราชใหม่ และเสริมบารมีให้ชีวิตรุ่งเรือง ณ อุโบสถวัดโพธิ์แจ้ เริ่มเวลา 22.00 น. เป็นต้นไป",
        image: "static/images/NewYearPrayer2026.jpg"
    },
    "2": {
        title: "งานประจำปี ปิดทองหลวงพ่อโตวัดโพธิ์แจ้",
        content: "ขอเชิญเที่ยวงานประจำปี ปิดทองนมัสการหลวงพ่อโต และรอยพระพุทธบาทจำลอง ระหว่างวันที่ 24-26 มกราคม 2569<br><br>ชมมหรสพฟรีตลอดงาน!<br>- 24 ม.ค.: จ๊ะ นงผณี<br>- 25 ม.ค.: ไหมไทย หัวใจศิลป์<br>- 26 ม.ค.: เวียง นฤมล<br><br>กลางคืนชมลิเกคณะสมชายบุตรสำราญ",
        image: "static/images/annual_event_poster.jpg"
    },
    "3": {
        title: "พิธีเจริญพระพุทธมนต์ฯ วันอาทิตย์",
        content: "ขอเชิญร่วมพิธีเจริญพระพุทธมนต์ ทำวัตรเย็นและเจริญกัมมัฏฐานเพื่อถวายเป็นพระราชกุศลแด่ สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง<br><br>ทุกๆ วันอาทิตย์ ตลอดปี 2569 เวลา 17.30 น.<br>ณ ศาลาปฏิบัติธรรม (ศาลาหลวงพ่อหยก) วัดโพธิ์แจ้ จ.สมุทรสาคร",
        image: "static/images/dhamma_sunday_poster.png"
    }
};

window.showModal = (newsId) => {
    const modal = document.getElementById("newsModal");
    const modalBody = document.getElementById("modalBody");
    const data = newsData[newsId];

    if (data && modal && modalBody) {
        let visualContent = '';
        if (data.image) {
            visualContent = `
                <div style="background: #000; border-radius: 1rem; overflow: hidden; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
                    <img src="${data.image}" style="width: 100%; max-height: 80vh; object-fit: contain; display: block;">
                </div>`;
        }

        modalBody.innerHTML = `
            <div class="animate__animated animate__fadeIn">
                ${visualContent}
                <h2 class="text-2xl md:text-3xl font-['Pridi'] font-bold text-primary mb-4">${data.title}</h2>
                <div class="prose prose-emerald max-w-none text-base-content/80 leading-relaxed font-['Sarabun']">
                    ${data.content}
                </div>
                <div class="mt-8 flex justify-center">
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

document.addEventListener('DOMContentLoaded', () => {
    // Reset overflow to ensure scrolling works, especially on mobile/refresh
    document.body.style.overflow = 'auto';
    // document.body.style.overflowX = 'hidden'; // REMOVED

    // --- VISITOR COUNTER LOGIC ---
    const updateVisitorCount = () => {
        const counterElement = document.getElementById('visitorCount');
        if (!counterElement) return;

        // Mock "Global" Base Count (e.g., started at 12,500)
        const baseCount = 12500;

        // Local increment (simulate user visits)
        let localVisits = localStorage.getItem('temple_visitor_count');

        if (!localVisits) {
            localVisits = 0;
        }

        // Increment on each load (or session)
        localVisits = parseInt(localVisits) + 1;
        localStorage.setItem('temple_visitor_count', localVisits);

        // Display Total
        const totalCount = baseCount + localVisits;

        // Animate counting up effect
        let start = totalCount - 50;
        if (start < 0) start = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(start + (totalCount - start) * ease);
            counterElement.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counterElement.textContent = totalCount.toLocaleString();
            }
        };

        requestAnimationFrame(animate);
    };

    updateVisitorCount();

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

    // 3. Initialize AOS (Animate On Scroll)
    AOS.init({
        once: true,
        duration: 800,
        offset: 100
    });


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



});
