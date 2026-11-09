// ข่าวสาร + ตัวนับผู้เข้าชม (React). แก้ไฟล์นี้แล้วแปลงเป็น static/js/react-parts.js
        const { useState, useEffect } = React;

        // News Component
        const NewsCard = ({ news }) => {
            const handleShare = (platform) => {
                const base = window.location.origin + window.location.pathname;
                const url = `${base}#news-${news.id}`;
                const text = `${news.title} — ${news.description}`;
                switch (platform) {
                    case 'facebook':
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(news.title)}`, '_blank', 'width=600,height=500');
                        break;
                    case 'line':
                        window.open(`https://line.me/R/share?text=${encodeURIComponent(news.title + '\n' + url)}`, '_blank');
                        break;
                    case 'twitter':
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                        break;
                    case 'instagram':
                        navigator.clipboard.writeText(url).then(() => {
                            alert('คัดลอกลิงก์แล้ว!\nนำไปวางใน Story หรือ Bio บน Instagram ได้เลย');
                        });
                        break;
                    case 'copy':
                        navigator.clipboard.writeText(url).then(() => {
                            const btn = document.querySelector('[data-share-copy]');
                            if (btn) { btn.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-link"></i>'; }, 2000); }
                            else alert('คัดลอกลิงก์เรียบร้อยแล้ว');
                        });
                        break;
                    default:
                        if (navigator.share) {
                            navigator.share({ title: news.title, text: text, url: url });
                        }
                }
            };

            return (
                <article
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-200 group overflow-hidden animate__animated animate__fadeInUp cursor-pointer h-full flex flex-col"
                    onClick={() => window.showModal(news.id)}
                >
                    <figure className="relative h-60 overflow-hidden shrink-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url('${String(news.image).replace(/\.webp$/, '-m.webp')}')` }}
                            role="img"
                            aria-label={news.title}
                        ></div>
                        <div className="absolute bottom-4 left-4">
                            <span className="badge badge-primary font-bold shadow-2xl backdrop-blur-md bg-primary border-2 border-white/40 px-4 py-3 h-auto text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>ข่าวประกาศ</span>
                        </div>
                    </figure>
                    <div className="card-body flex-1 flex flex-col">
                        <h3 className="card-title text-primary group-hover:text-gold transition-colors text-xl font-['Pridi'] font-bold leading-tight">
                            {news.title}
                        </h3>
                        <p className="text-base-content/70 line-clamp-3 text-sm leading-relaxed font-['Sarabun'] flex-1">
                            {news.description}
                        </p>
                        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-1">
                                <button className="btn btn-circle btn-xs btn-ghost text-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                                    onClick={() => handleShare('facebook')} title="แชร์ไป Facebook">
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button className="btn btn-circle btn-xs btn-ghost text-[#06C755] hover:bg-[#06C755] hover:text-white"
                                    onClick={() => handleShare('line')} title="แชร์ไป LINE">
                                    <i className="fab fa-line"></i>
                                </button>
                                <button className="btn btn-circle btn-xs btn-ghost text-[#E1306C] hover:bg-[#E1306C] hover:text-white"
                                    onClick={() => handleShare('instagram')} title="แชร์ไป Instagram">
                                    <i className="fab fa-instagram"></i>
                                </button>
                                {typeof navigator !== 'undefined' && navigator.share && (
                                    <button className="btn btn-circle btn-xs btn-ghost text-primary hover:bg-primary hover:text-white"
                                        onClick={() => handleShare('native')} title="แชร์">
                                        <i className="fas fa-share-nodes"></i>
                                    </button>
                                )}
                                <button data-share-copy className="btn btn-circle btn-xs btn-ghost text-gray-500 hover:bg-gray-200"
                                    onClick={() => handleShare('copy')} title="คัดลอกลิงก์">
                                    <i className="fas fa-link"></i>
                                </button>
                            </div>
                            <button
                                className="btn btn-primary btn-sm btn-outline rounded-full px-6 hover:scale-105 transition-transform group-hover:bg-primary group-hover:text-white"
                                onClick={() => window.showModal(news.id)}
                            >
                                รายละเอียด
                            </button>
                        </div>
                    </div>
                </article>
            );
        };

        // ข่าวล่าสุดเป็นรูปใหญ่ ข่าวอื่นเรียงเป็นรายการด้านข้าง (สไตล์อยู่ใน static/css/hero.css → .hv-news)
        const shareNews = (news, platform) => {
            const url = `${window.location.origin + window.location.pathname}#news-${news.id}`;
            if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(news.title)}`, '_blank', 'width=600,height=500');
            else if (platform === 'line') window.open(`https://line.me/R/share?text=${encodeURIComponent(news.title + '\n' + url)}`, '_blank');
            else if (platform === 'native' && navigator.share) navigator.share({ title: news.title, text: news.description, url });
            else navigator.clipboard.writeText(url).then(() => alert('คัดลอกลิงก์เรียบร้อยแล้ว'));
        };
        const Poster = ({ news, className }) => (
            <div className={className}>
                <div className="hv-news-blur" style={{ backgroundImage: `url('${String(news.image).replace(/\.webp$/, '-m.webp')}')` }}></div>
                <img src={String(news.image).replace(/\.webp$/, '-m.webp')} alt={news.title} loading="lazy"
                    onError={(e) => { if (!e.currentTarget.dataset.full) { e.currentTarget.dataset.full = "1"; e.currentTarget.src = news.image; } }} />
            </div>
        );
        const NewsSection = () => {
            const [newsData, setNewsData] = useState(SITE_DATA.news);
            const [all, setAll] = useState(false);

            useEffect(() => {
                fetch('static/data/news.json')
                    .then(r => r.ok ? r.json() : null)
                    .then(d => { if (d && d.items) { setNewsData(d.items); SITE_DATA.news = d.items; } })
                    .catch(() => {});
            }, []);

            if (!newsData.length) return null;
            const [first, ...rest] = newsData;
            const shown = all ? rest : rest.slice(0, 4);
            return (
                <div className="hv-news">
                    <article className="hv-news-feature" onClick={() => window.showModal(first.id)}>
                        <Poster news={first} className="hv-news-feature-img" />
                        <div className="hv-news-feature-body">
                            <span className="hv-news-tag">ข่าวล่าสุด</span>
                            <h3 className="hv-news-feature-title">{first.title}</h3>
                            <p className="hv-news-feature-desc">{first.description}</p>
                            <div className="hv-news-actions" onClick={(e) => e.stopPropagation()}>
                                <button type="button" className="hv-news-more" onClick={() => window.showModal(first.id)}>อ่านรายละเอียด <i className="fas fa-arrow-right"></i></button>
                                <span className="hv-news-share">
                                    <button type="button" onClick={() => shareNews(first, 'facebook')} title="แชร์ไป Facebook" aria-label="แชร์ไป Facebook"><i className="fab fa-facebook-f"></i></button>
                                    <button type="button" onClick={() => shareNews(first, 'line')} title="แชร์ไป LINE" aria-label="แชร์ไป LINE"><i className="fab fa-line"></i></button>
                                    {navigator.share && <button type="button" onClick={() => shareNews(first, 'native')} title="แชร์" aria-label="แชร์"><i className="fas fa-share-nodes"></i></button>}
                                    <button type="button" onClick={() => shareNews(first, 'copy')} title="คัดลอกลิงก์" aria-label="คัดลอกลิงก์"><i className="fas fa-link"></i></button>
                                </span>
                            </div>
                        </div>
                    </article>
                    {rest.length > 0 && (
                        <div className="hv-news-list">
                            <h3 className="hv-news-list-head">ข่าวอื่น ๆ</h3>
                            {shown.map(n => (
                                <article key={n.id} className="hv-news-item" onClick={() => window.showModal(n.id)}>
                                    <Poster news={n} className="hv-news-thumb" />
                                    <div>
                                        <h4 className="hv-news-item-title">{n.title}</h4>
                                        <p className="hv-news-item-desc">{n.description}</p>
                                        <span className="hv-news-item-more">อ่านต่อ <i className="fas fa-arrow-right"></i></span>
                                    </div>
                                </article>
                            ))}
                            {rest.length > 4 && (
                                <button type="button" className="hv-news-all" onClick={() => setAll(!all)}>
                                    {all ? 'แสดงน้อยลง' : `ดูข่าวทั้งหมด (${rest.length + 1})`}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            );
        };

        // Visitor Counter Component
        const VisitorCounter = () => {
            const [count, setCount] = useState("------");

            useEffect(() => {
                fetch('https://counterapi.dev/api/watphojae-web/visits/up')
                    .then(res => res.json())
                    .then(data => {
                        const num = data.value || 0;
                        setCount(num.toString().padStart(6, '0'));
                    })
                    .catch(() => {
                        let c = parseInt(localStorage.getItem('visitorCount') || '10250') + 1;
                        localStorage.setItem('visitorCount', c);
                        setCount(c.toString().padStart(6, '0'));
                    });
            }, []);

            // ตัวเลขเลขไทยแบบเรียบ (ท้ายเว็บ)
            const th = String(count).replace(/\d/g, (d) => '๐๑๒๓๔๕๖๗๘๙'[d]);
            return <span className="hv-visits-num">{th}</span>;
        };

        // Render Components
        const rootNews = ReactDOM.createRoot(document.getElementById('news-react-root'));
        rootNews.render(<NewsSection />);

        const rootCounter = ReactDOM.createRoot(document.getElementById('visitor-react-root'));
        rootCounter.render(<VisitorCounter />);
    