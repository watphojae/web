// สร้างจาก static/js/src/react-parts.jsx — อย่าแก้ไฟล์นี้โดยตรง
// ข่าวสาร + ตัวนับผู้เข้าชม (React). แก้ไฟล์นี้แล้วแปลงเป็น static/js/react-parts.js
const {
  useState,
  useEffect
} = React;

// News Component
const NewsCard = ({
  news
}) => {
  const handleShare = platform => {
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
          if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
              btn.innerHTML = '<i class="fas fa-link"></i>';
            }, 2000);
          } else alert('คัดลอกลิงก์เรียบร้อยแล้ว');
        });
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: news.title,
            text: text,
            url: url
          });
        }
    }
  };
  return /*#__PURE__*/React.createElement("article", {
    className: "card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-200 group overflow-hidden animate__animated animate__fadeInUp cursor-pointer h-full flex flex-col",
    onClick: () => window.showModal(news.id)
  }, /*#__PURE__*/React.createElement("figure", {
    className: "relative h-60 overflow-hidden shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110",
    style: {
      backgroundImage: `url('${String(news.image).replace(/\.webp$/, '-m.webp')}')`
    },
    role: "img",
    "aria-label": news.title
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-4 left-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-primary font-bold shadow-2xl backdrop-blur-md bg-primary border-2 border-white/40 px-4 py-3 h-auto text-white",
    style: {
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    }
  }, "\u0E02\u0E48\u0E32\u0E27\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28"))), /*#__PURE__*/React.createElement("div", {
    className: "card-body flex-1 flex flex-col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "card-title text-primary group-hover:text-gold transition-colors text-xl font-['Pridi'] font-bold leading-tight"
  }, news.title), /*#__PURE__*/React.createElement("p", {
    className: "text-base-content/70 line-clamp-3 text-sm leading-relaxed font-['Sarabun'] flex-1"
  }, news.description), /*#__PURE__*/React.createElement("div", {
    className: "card-actions justify-between items-center mt-4 pt-4 border-t border-base-200",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-circle btn-xs btn-ghost text-[#1877F2] hover:bg-[#1877F2] hover:text-white",
    onClick: () => handleShare('facebook'),
    title: "\u0E41\u0E0A\u0E23\u0E4C\u0E44\u0E1B Facebook"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fab fa-facebook-f"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-circle btn-xs btn-ghost text-[#06C755] hover:bg-[#06C755] hover:text-white",
    onClick: () => handleShare('line'),
    title: "\u0E41\u0E0A\u0E23\u0E4C\u0E44\u0E1B LINE"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fab fa-line"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-circle btn-xs btn-ghost text-[#E1306C] hover:bg-[#E1306C] hover:text-white",
    onClick: () => handleShare('instagram'),
    title: "\u0E41\u0E0A\u0E23\u0E4C\u0E44\u0E1B Instagram"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fab fa-instagram"
  })), typeof navigator !== 'undefined' && navigator.share && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-circle btn-xs btn-ghost text-primary hover:bg-primary hover:text-white",
    onClick: () => handleShare('native'),
    title: "\u0E41\u0E0A\u0E23\u0E4C"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-share-nodes"
  })), /*#__PURE__*/React.createElement("button", {
    "data-share-copy": true,
    className: "btn btn-circle btn-xs btn-ghost text-gray-500 hover:bg-gray-200",
    onClick: () => handleShare('copy'),
    title: "\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E25\u0E34\u0E07\u0E01\u0E4C"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm btn-outline rounded-full px-6 hover:scale-105 transition-transform group-hover:bg-primary group-hover:text-white",
    onClick: () => window.showModal(news.id)
  }, "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14"))));
};

// ข่าวล่าสุดเป็นรูปใหญ่ ข่าวอื่นเรียงเป็นรายการด้านข้าง (สไตล์อยู่ใน static/css/hero.css → .hv-news)
const shareNews = (news, platform) => {
  const url = `${window.location.origin + window.location.pathname}#news-${news.id}`;
  if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(news.title)}`, '_blank', 'width=600,height=500');else if (platform === 'line') window.open(`https://line.me/R/share?text=${encodeURIComponent(news.title + '\n' + url)}`, '_blank');else if (platform === 'native' && navigator.share) navigator.share({
    title: news.title,
    text: news.description,
    url
  });else navigator.clipboard.writeText(url).then(() => alert('คัดลอกลิงก์เรียบร้อยแล้ว'));
};
const Poster = ({
  news,
  className
}) => /*#__PURE__*/React.createElement("div", {
  className: className,
  role: "img",
  "aria-label": news.title
}, /*#__PURE__*/React.createElement("div", {
  className: "hv-news-blur",
  style: {
    backgroundImage: `url('${String(news.image).replace(/\.webp$/, '-m.webp')}')`
  }
}), /*#__PURE__*/React.createElement("img", {
  src: String(news.image).replace(/\.webp$/, '-m.webp'),
  alt: "",
  loading: "lazy",
  onError: e => {
    if (!e.currentTarget.dataset.full) {
      e.currentTarget.dataset.full = "1";
      e.currentTarget.src = news.image;
    }
  }
}));
const NewsSection = () => {
  const [newsData, setNewsData] = useState(SITE_DATA.news);
  const [all, setAll] = useState(false);
  useEffect(() => {
    fetch('static/data/news.json').then(r => r.ok ? r.json() : null).then(d => {
      if (d && d.items) {
        setNewsData(d.items);
        SITE_DATA.news = d.items;
      }
    }).catch(() => {});
  }, []);
  if (!newsData.length) return null;
  const [first, ...rest] = newsData;
  const shown = all ? rest : rest.slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    className: "hv-news"
  }, /*#__PURE__*/React.createElement("article", {
    className: "hv-news-feature",
    onClick: () => window.showModal(first.id)
  }, /*#__PURE__*/React.createElement(Poster, {
    news: first,
    className: "hv-news-feature-img"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hv-news-feature-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hv-news-tag"
  }, "\u0E02\u0E48\u0E32\u0E27\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14"), /*#__PURE__*/React.createElement("h3", {
    className: "hv-news-feature-title"
  }, first.title), /*#__PURE__*/React.createElement("p", {
    className: "hv-news-feature-desc"
  }, first.description), /*#__PURE__*/React.createElement("div", {
    className: "hv-news-actions",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "hv-news-more",
    onClick: () => window.showModal(first.id)
  }, "\u0E2D\u0E48\u0E32\u0E19\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14 ", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-right"
  })), /*#__PURE__*/React.createElement("span", {
    className: "hv-news-share"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => shareNews(first, 'facebook'),
    title: "\u0E41\u0E0A\u0E23\u0E4C\u0E44\u0E1B Facebook",
    "aria-label": "\u0E41\u0E0A\u0E23\u0E4C\u0E44\u0E1B Facebook"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fab fa-facebook-f"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => shareNews(first, 'line'),
    title: "\u0E41\u0E0A\u0E23\u0E4C\u0E44\u0E1B LINE",
    "aria-label": "\u0E41\u0E0A\u0E23\u0E4C\u0E44\u0E1B LINE"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fab fa-line"
  })), navigator.share && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => shareNews(first, 'native'),
    title: "\u0E41\u0E0A\u0E23\u0E4C",
    "aria-label": "\u0E41\u0E0A\u0E23\u0E4C"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-share-nodes"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => shareNews(first, 'copy'),
    title: "\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E25\u0E34\u0E07\u0E01\u0E4C",
    "aria-label": "\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E25\u0E34\u0E07\u0E01\u0E4C"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-link"
  })))))), rest.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "hv-news-list"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "hv-news-list-head"
  }, "\u0E02\u0E48\u0E32\u0E27\u0E2D\u0E37\u0E48\u0E19 \u0E46"), shown.map(n => /*#__PURE__*/React.createElement("article", {
    key: n.id,
    className: "hv-news-item",
    onClick: () => window.showModal(n.id)
  }, /*#__PURE__*/React.createElement(Poster, {
    news: n,
    className: "hv-news-thumb"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "hv-news-item-title"
  }, n.title), /*#__PURE__*/React.createElement("p", {
    className: "hv-news-item-desc"
  }, n.description), /*#__PURE__*/React.createElement("span", {
    className: "hv-news-item-more"
  }, "\u0E2D\u0E48\u0E32\u0E19\u0E15\u0E48\u0E2D ", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-right"
  }))))), rest.length > 4 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "hv-news-all",
    onClick: () => setAll(!all)
  }, all ? 'แสดงน้อยลง' : `ดูข่าวทั้งหมด (${rest.length + 1})`)));
};

// Visitor Counter Component
const VisitorCounter = () => {
  const [count, setCount] = useState("------");
  useEffect(() => {
    fetch('https://counterapi.dev/api/watphojae-web/visits/up').then(res => res.json()).then(data => {
      const num = data.value || 0;
      setCount(num.toString().padStart(6, '0'));
    }).catch(() => {
      let c = parseInt(localStorage.getItem('visitorCount') || '10250') + 1;
      localStorage.setItem('visitorCount', c);
      setCount(c.toString().padStart(6, '0'));
    });
  }, []);

  // ตัวเลขเลขไทยแบบเรียบ (ท้ายเว็บ)
  const th = String(count).replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]);
  return /*#__PURE__*/React.createElement("span", {
    className: "hv-visits-num"
  }, th);
};

// Render Components
const rootNews = ReactDOM.createRoot(document.getElementById('news-react-root'));
rootNews.render(/*#__PURE__*/React.createElement(NewsSection, null));
const rootCounter = ReactDOM.createRoot(document.getElementById('visitor-react-root'));
rootCounter.render(/*#__PURE__*/React.createElement(VisitorCounter, null));
