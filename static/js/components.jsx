const { useState, useEffect } = React;

// News Component
const NewsCard = ({ news }) => (
    <article
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-200 group overflow-hidden animate__animated animate__fadeInUp cursor-pointer"
        onClick={() => window.showModal(news.id)}
    >
        <figure className="relative h-60 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${news.image}')` }}
                role="img"
                aria-label={news.title}
            ></div>
            <div className="absolute bottom-4 left-4">
                <span className="badge badge-primary font-bold shadow-2xl backdrop-blur-md bg-primary border-2 border-white/40 px-4 py-3 h-auto text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>ข่าวประกาศ</span>
            </div>
        </figure>
        <div className="card-body">
            <h3 className="card-title text-primary group-hover:text-gold transition-colors text-xl font-['Pridi'] font-bold leading-tight">
                {news.title}
            </h3>
            <p className="text-base-content/70 line-clamp-3 text-sm leading-relaxed font-['Sarabun']">
                {news.description}
            </p>
            <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                <button
                    className="btn btn-primary btn-sm btn-outline rounded-full px-6 hover:scale-105 transition-transform group-hover:bg-primary group-hover:text-white"
                >
                    รายละเอียด <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                </button>
            </div>
        </div>
    </article>
);

const NewsSection = () => {
    const [newsData] = useState([
        {
            id: 1,
            title: "พิธีบำเพ็ญกุศลอุทิศถวาย",
            description: "ขอเชิญร่วมพิธีบำเพ็ญกุศลอุทิศถวาย พระครูวิธานสุตโสภณ (ปอ ปุชโชโต) และพระครูสาครปิยธรรม (เปี้ยว ปิยธมฺโม) วันศุกร์ที่ 23 มกราคม 2568 ณ ศาลาการเปรียญฯ ผ.บางน้ำจืด อ.เมืองสมุทรสาคร จ.สมุทรสาคร",
            image: "static/images/merit_ceremony_2025.jpg"
        },
        {
            id: 2,
            title: "งานประจำปี ปิดทองหลวงพ่อโต",
            description: "ขอเชิญเที่ยวงานประจำปี ปิดทองนมัสการหลวงพ่อโต และรอยพระพุทธบาทจำลอง ระหว่างวันที่ 24-26 มกราคม 2569 พร้อมชมมหรสพสมโภชฟรีตลอดงาน",
            image: "static/images/annual_event_poster.jpg"
        },
        {
            id: 3,
            title: "พิธีเจริญพระพุทธมนต์ฯ วันอาทิตย์",
            description: "ขอเชิญร่วมพิธีเจริญพระพุทธมนต์ ทำวัตรเย็นและเจริญกัมมัฏฐาน ทุกวันอาทิตย์ ตลอดเดือนมกราคม 2569 เวลา 17.30 น. เพื่อถวายเป็นพระราชกุศล",
            image: "static/images/dhamma_sunday_poster.png"
        }
    ]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {newsData.map(news => <NewsCard key={news.id} news={news} />)}
        </div>
    );
};

// Visitor Counter Component
const VisitorCounter = () => {
    const [count, setCount] = useState("...");

    useEffect(() => {
        // Initial load from existing visitor counter logic or localStorage
        let currentCount = localStorage.getItem('visitorCount') || 10250;
        currentCount = parseInt(currentCount) + 1;
        localStorage.setItem('visitorCount', currentCount);

        let displayCount = currentCount.toString().padStart(6, '0');
        setCount(displayCount);
    }, []);

    return (
        <div className="flex items-center gap-3 bg-black/40 px-6 py-2 rounded-full border border-gold/30 shadow-inner">
            <span className="text-xs text-white/60 uppercase tracking-widest font-semibold">Visitors</span>
            <div className="flex gap-1">
                {count.split('').map((num, i) => (
                    <span key={i} className="w-8 h-10 bg-gold/20 flex items-center justify-center rounded text-gold font-mono text-xl font-bold border border-gold/30">
                        {num}
                    </span>
                ))}
            </div>
        </div>
    );
};

// Render Components
const rootNews = ReactDOM.createRoot(document.getElementById('news-react-root'));
rootNews.render(<NewsSection />);

const rootCounter = ReactDOM.createRoot(document.getElementById('visitor-react-root'));
rootCounter.render(<VisitorCounter />);
