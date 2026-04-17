/**
 * =====================================================
 *  SITE_DATA — ไฟล์แก้ไขข้อมูลเว็บวัดโพธิ์แจ้
 *  แก้ไขที่นี่ที่เดียว ข้อมูลทุกส่วนจะอัพเดตอัตโนมัติ
 * =====================================================
 */
const SITE_DATA = {

    // ══════════════════════════════════════════════
    // ข่าวประชาสัมพันธ์
    // - description = ข้อความสั้น แสดงบนการ์ด
    // - content     = ข้อความยาว แสดงใน popup
    // - เพิ่มข่าว: คัดลอก { ... } ต่อท้าย id ห้ามซ้ำ
    // - ลบข่าว: ลบ { ... } ออกทั้งก้อน
    // ══════════════════════════════════════════════
    news: [
        {
            id: 1,
            title: "วันสงกรานต์ ๒๕๖๙",
            description: "ขอเชิญพุทธศาสนิกชนร่วมทำบุญวันสงกรานต์ ณ วัดโพธิ์แจ้ ระหว่างวันที่ ๑๓-๑๕ เมษายน ๒๕๖๙ ต.บางน้ำจืด อ.เมืองสมุทรสาคร จ.สมุทรสาคร",
            content: "<b>วันจันทร์ที่ ๑๓ เมษายน ๒๕๖๙</b> (แรม ๑๑ ค่ำ เดือน ๕)<br>• เวลา ๑๑.๐๐ น. ถวายภัตตาหารเพล<br>• เวลา ๑๒.๐๐ น. มาติกา-บังสุกุลอัฐิรวมที่เจดีย์<br><br><b>วันอังคารที่ ๑๔ เมษายน ๒๕๖๙</b> (แรม ๑๒ ค่ำ เดือน ๕)<br>• เวลา ๐๘.๓๐ น. ทำบุญตักบาตร ณ ศาลาการเปรียญ<br><br><b>วันพุธที่ ๑๕ เมษายน ๒๕๖๙</b> (แรม ๑๓ ค่ำ เดือน ๕)<br>• เวลา ๐๘.๓๐ น. ทำบุญตักบาตร ณ ศาลาการเปรียญ และมาติกา-บังสุกุลรวม<br>• เวลา ๑๒.๑๕ น. พิธีสรงน้ำพระ<br><br>ขอเชิญพุทธศาสนิกชนมาร่วมทำบุญโดยพร้อมเพรียงกัน",
            image: "static/images/songkran_2569.jpg"
        },
        {
            id: 2,
            title: "งานประจำปี ปิดทองหลวงพ่อโต",
            description: "ขอเชิญเที่ยวงานประจำปี ปิดทองนมัสการหลวงพ่อโต และรอยพระพุทธบาทจำลอง ระหว่างวันที่ 24-26 มกราคม 2569 พร้อมชมมหรสพสมโภชฟรีตลอดงาน",
            content: "ขอเชิญเที่ยวงานประจำปี ปิดทองนมัสการหลวงพ่อโต และรอยพระพุทธบาทจำลอง ระหว่างวันที่ 24-26 มกราคม 2569<br><br>ชมมหรสพฟรีตลอดงาน!<br>- 24 ม.ค.: จ๊ะ นงผณี<br>- 25 ม.ค.: ไหมไทย หัวใจศิลป์<br>- 26 ม.ค.: เวียง นฤมล<br><br>กลางคืนชมลิเกคณะสมชายบุตรสำราญ",
            image: "static/images/annual_event_poster.jpg"
        },
        {
            id: 3,
            title: "พิธีเจริญพระพุทธมนต์ฯ วันอาทิตย์",
            description: "ขอเชิญร่วมพิธีเจริญพระพุทธมนต์ ทำวัตรเย็นและเจริญกัมมัฏฐาน ทุกวันอาทิตย์ ตลอดเดือนมกราคม 2569 เวลา 17.30 น. เพื่อถวายเป็นพระราชกุศล",
            content: "ขอเชิญร่วมพิธีเจริญพระพุทธมนต์ ทำวัตรเย็นและเจริญกัมมัฏฐานเพื่อถวายเป็นพระราชกุศลแด่ สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง<br><br>ทุกๆ วันอาทิตย์ ตลอดปี 2569 เวลา 17.30 น.<br>ณ ศาลาปฏิบัติธรรม (ศาลาหลวงพ่อหยก) วัดโพธิ์แจ้ จ.สมุทรสาคร",
            image: "static/images/dhamma_sunday_poster.png"
        }
    ],

    // ══════════════════════════════════════════════
    // ปฏิทินกิจกรรม
    // ══════════════════════════════════════════════
    events: {

        // กิจกรรมประจำ
        // color: สีแถบวัน เช่น "bg-emerald-100 text-primary" / "bg-amber-100 text-amber-800"
        regular: [
            {
                day1: "ทุก",
                day2: "อาทิตย์",
                title: "เจริญพระพุทธมนต์ ทำวัตรเย็น และเจริญกัมมัฏฐาน",
                time: "17:30 น.",
                location: "ศาลาปฏิบัติธรรม (ศาลาหลวงพ่อหยก)",
                color: "bg-emerald-100 text-primary"
            }

        ],

        // วันสำคัญทางพระพุทธศาสนา
        holidaysYear: "2569",
        holidays: [
            { date: "3 มี.ค.", name: "มาฆบูชา", title: "วันมาฆบูชา", detail: "เวียนเทียนรอบอุโบสถ เวลา 19:30 น.", color: "bg-gold/10 text-yellow-800" },
            { date: "31 พ.ค.", name: "วิสาขบูชา", title: "วันวิสาขบูชา", detail: "เวียนเทียนรอบอุโบสถ เวลา 19:30 น.", color: "bg-gold/10 text-yellow-800" },
            { date: "29 ก.ค.", name: "อาสาฬหบูชา", title: "วันอาสาฬหบูชา", detail: "เวียนเทียนรอบอุโบสถ เวลา 19:30 น.", color: "bg-gold/10 text-yellow-800" },
            { date: "30 ก.ค.", name: "เข้าพรรษา", title: "วันเข้าพรรษา", detail: "ถวายเทียนพรรษาและผ้าอาบน้ำฝน", color: "bg-emerald-100 text-primary" }
        ],

        // กิจกรรมที่กำลังจะมาถึง
        // badgeClass:  "badge-primary" / "badge-warning" / "badge-success"
        // borderColor: "border-primary" / "border-gold" / "border-emerald-400"
        // dateClass:   สีกล่องวันที่ด้านซ้าย
        upcoming: [
            {
                month: "ม.ค.", date: "24–26",
                badge: "ประจำปี", badgeClass: "badge-primary",
                borderColor: "border-primary",
                dateClass: "bg-primary text-white",
                title: "งานประจำปี ปิดทองหลวงพ่อโต",
                detail: "ปิดทองนมัสการหลวงพ่อโตและรอยพระพุทธบาทจำลอง<br>มหรสพฟรีตลอดงาน"
            },
            {
                month: "เม.ย.", date: "13-15",
                badge: "สงกรานต์", badgeClass: "badge-warning",
                borderColor: "border-yellow-400",
                dateClass: "bg-yellow-50 text-amber-900",
                title: "วันสงกรานต์ ๒๕๖๙",
                detail: "๑๓ เม.ย.: ถวายภัตตาหารเพล | มาติกา-บังสุกุลอัฐิ<br>๑๔ เม.ย.: ทำบุญตักบาตร<br>๑๕ เม.ย.: ทำบุญตักบาตร | สรงน้ำพระ เวลา ๑๒.๑๕ น."
            },
            {
                month: "ตลอดปี", date: "2569",
                badge: "ประจำสัปดาห์", badgeClass: "badge-success",
                borderColor: "border-emerald-400",
                dateClass: "bg-emerald-50 text-primary",
                title: "เจริญพระพุทธมนต์วันอาทิตย์",
                detail: "ถวายเป็นพระราชกุศลแด่สมเด็จพระนางเจ้าสิริกิติ์ฯ<br>ทุกวันอาทิตย์ เวลา 17:30 น."
            }
        ]
    },

    // ══════════════════════════════════════════════
    // แกลเลอรีภาพ
    // wide: true = รูปกว้างพิเศษ (ใช้ได้แค่รูปแรก)
    // เพิ่มรูป: คัดลอก { src, alt } ต่อท้าย
    // ══════════════════════════════════════════════
    gallery: [
        { src: "static/images/main_collage.jpg", alt: "วัดโพธิ์แจ้", wide: true },
        { src: "static/images/NewYearPrayer2026.jpg", alt: "พิธีสวดมนต์ข้ามปี 2569" },
        { src: "static/images/merit_ceremony_2025.jpg", alt: "งานทำบุญประจำปี 2568" },
        { src: "static/images/songkran_2569.jpg", alt: "งานสงกรานต์ 2569" },
        { src: "static/images/annual_event_poster.jpg", alt: "งานประจำปีวัดโพธิ์แจ้" },
        { src: "static/images/dhamma_sunday_poster.png", alt: "เจริญสมาธิภาวนาวันอาทิตย์" },
        { src: "static/gallery/EOS-R6-10_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-124_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-127_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-129_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-14_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-15_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-16_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-17_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-18_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-19_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-24_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-25_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-26_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-652_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-653_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-654_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-655_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-656_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-657_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-658_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-659_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-660_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-661_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-662_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-663_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-664_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-665_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/EOS-R6-666_0.JPG", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4249_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4251_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4709_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4713_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4713_1.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4724_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4726_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4726_1.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4737_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4737_1.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4744_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4744_1.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4749_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4749_1.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4753_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4753_1.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4754_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4757_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4763_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4764_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4768_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/IMG_4792_0.jpg", alt: "บรรยากาศวัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_1_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_2_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_3_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_4_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_5_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_6_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_7_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_8_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_9_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_10_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_11_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
        { src: "static/gallery/LINE_ALBUM_โบสถ์_250301_12_0.jpg", alt: "โบสถ์วัดโพธิ์แจ้" },
    ],

    // ══════════════════════════════════════════════
    // ทำบุญออนไลน์
    // ══════════════════════════════════════════════
    donation: {
        bank: "— ธนาคารกรุงไทย —",
        accountName: "วัดโพธิ์แจ้",
        accountNumber: "— 821-0-17199-2 —",
        qrImage: "static/images/qr_donation.jpg",
        lineUrl: "https://line.me/ti/p/~watphojae",
        lineId: "watphojae"
    },

    // ══════════════════════════════════════════════
    // ทำเนียบเจ้าอาวาส
    // image: null = แสดงรูปภาพจำลอง (ไม่มีรูป)
    // isCurrent: true = เน้นกรอบทอง (เจ้าอาวาสปัจจุบัน)
    // เพิ่มเจ้าอาวาส: คัดลอก { ... } ต่อท้าย
    // ══════════════════════════════════════════════
    abbots: [
        { sequence: "ลำดับที่ 1", name: "พระจัน", years: "ไม่ปรากฎปีที่ดำรงตำแหน่ง", image: null },
        { sequence: "ลำดับที่ 2", name: "พระทิม", years: "ไม่ปรากฎปีที่ดำรงตำแหน่ง", image: null },
        { sequence: "ลำดับที่ 3", name: "พระโก๋ อุตฺตโม", years: "พ.ศ. 2487", image: null },
        { sequence: "ลำดับที่ 4", name: "พระสด กมโล", years: "พ.ศ. 2488 - 2491", image: null },
        { sequence: "ลำดับที่ 5", name: "พระครูวิธานสุตโสภณ", years: "พ.ศ. 2492 - 2505", image: "static/images/phrakru_withan_sutasophon.jpg" },
        { sequence: "ลำดับที่ 6", name: "พระครูสาครปิยธรรม", years: "พ.ศ. 2506 - 2559", image: "static/images/phrakru_sakorn_piyadham.jpg" },
        { sequence: "ลำดับที่ 7", name: "พระครูวัชรธรรมสาคร ดร.", years: "พ.ศ. 2560 - ปัจจุบัน", image: "static/images/abbot_new.jpg", isCurrent: true }
    ],

    // ══════════════════════════════════════════════
    // พระสังฆาธิการ
    // badgeClass: "badge-primary"              = เขียว (เจ้าอาวาส)
    //             "badge-outline badge-warning" = ทอง  (ผู้ช่วย)
    // frameBorder: "border-primary" = กรอบเขียว  (ไม่ใส่ = กรอบปกติ)
    // เพิ่มพระ: คัดลอก { ... } ต่อท้าย
    // ══════════════════════════════════════════════
    officials: [
        {
            name: "พระครูวัชรธรรมสาคร ดร.<br>(ธมฺมสาโร)",
            position: "เจ้าอาวาส",
            badgeClass: "badge-primary",
            frameBorder: "border-primary",
            image: "static/images/abbot_new.jpg"
        },
        {
            name: "พระมหาจิรโชติ อรุโณ",
            position: "ผู้ช่วยเจ้าอาวาส",
            badgeClass: "badge-outline badge-warning",
            image: "static/images/PhraMahaJirachotAruno.jpg"
        },
        {
            name: "พระมหาสำราญ พลวโร",
            position: "ผู้ช่วยเจ้าอาวาส",
            badgeClass: "badge-outline badge-warning",
            image: "static/images/monk_samran_new.jpg"
        }
    ],

    // ══════════════════════════════════════════════
    // ติดต่อสอบถาม
    // ══════════════════════════════════════════════
    contact: {
        phone: "087-774-0111",
        lineId: "watphojae",
        lineUrl: "https://line.me/ti/p/~watphojae",
        facebook: "https://www.facebook.com/watphojae",
        facebookName: "วัดโพธิ์แจ้",
        email: "watphojae@gmail.com"
    },

    // ══════════════════════════════════════════════
    // Google Calendar Embed URL
    // วิธีได้ URL: Google Calendar > Settings > ชื่อปฏิทิน > Integrate calendar
    //              > คัดลอก "Public URL to this calendar" หรือ "Embed code" src=...
    // ตัวอย่าง: "https://calendar.google.com/calendar/embed?src=xxx%40group.calendar.google.com&ctz=Asia%2FBangkok"
    // ถ้าไม่มี ปล่อยว่างไว้ — ส่วนนี้จะซ่อนอัตโนมัติ
    // ══════════════════════════════════════════════
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=th.th%23holiday%40group.v.calendar.google.com&ctz=Asia%2FBangkok",
};
