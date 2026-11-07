// สร้าง static/css/tw.css (แทน cdn.tailwindcss.com):  npx tailwindcss@3.4.17 -c tools/tailwind.config.js -i tools/tw-input.css -o static/css/tw.css --minify
// ต้องรันใหม่ทุกครั้งที่ใช้ class ของ Tailwind ใหม่ใน index.html / script.js / static/js
const path = require('path');
const root = path.join(__dirname, '..');
module.exports = {
  content: [path.join(root, 'index.html'), path.join(root, 'script.js'), path.join(root, 'static/js/*.js'), path.join(root, 'static/js/src/*.jsx'), path.join(root, 'static/data/*.json')],
  theme: {
    extend: {
      colors: { primary: '#1b4d3e', gold: '#c5a059' },
      animation: { 'slow-fade': 'fadeIn 2s ease-in-out' },
      keyframes: { fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } } },
    },
  },
};
