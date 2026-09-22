// script.js
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        let href = this.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
            e.preventDefault();
            document.body.style.animation = 'none';
            setTimeout(() => {
                window.location.href = href;
            }, 10);
        }
    });
});

//---黑白主题切换---//
// 获取按钮
const btn = document.getElementById('theme-buttom-ID');

// 页面加载时读取存储
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    btn.textContent = '☀️ ';
}

// 点击按钮切换 dark 类
btn.addEventListener('click', function() {
    document.body.classList.toggle('dark');
    
    // 改变按钮文字并记忆当前主题颜色
    if (document.body.classList.contains('dark')) {
        btn.textContent = '☀️ ';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.textContent = '🌙 ';
        localStorage.setItem('theme', 'light');
    }
});

//---三个联系卡片从左到右依次跳动出现---//
(function() {
    const cards = document.querySelectorAll('.cards-row .card');
    if (cards.length === 0) return;

    // 使用 IntersectionObserver 监听卡片出现
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 添加可见类，触发动画
                entry.target.classList.add('card-visible');
                observer.unobserve(entry.target); // 只触发一次
            }
        });
    }, { threshold: 0.2 }); // 卡片露出20%时触发

    // 监听每个卡片
    cards.forEach(card => {
        observer.observe(card);
    });

// 弹窗内容存储表
const infoMap = {
    Mail: {
        img: 'Photo/Contact/Mail.png',
        text: 'Yves0428@163.com\n烦请备注来意'
    },
    QQ: {
        img: 'Photo/Contact/QQ.png',
        text: '3314228099\n添加时请备注来意'
    },
    WeChat: {
        img: 'Photo/Contact/WeChat.png',
        text: '18025892883\n电话微信同号，烦请备注来意'
    }
};

// 弹窗内容
const overlay = document.getElementById('popupOverlay');
const close = document.getElementById('popupClose');
const popupTitle = document.getElementById('popupTitle');
const popupInfo = document.getElementById('popupInfo');

document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const data = infoMap[this.dataset.key];
        popupTitle.textContent = `📬 ${this.dataset.contact}`;
        popupInfo.innerHTML = `
            <img src="${data.img}" style="width:280px;display:block;margin:0 auto 8px;border-radius:8px;">
            <p style="text-align:center;font-size:14px;color:#333;white-space:pre-line;margin:0;">${data.text}</p>
        `;
        overlay.classList.add('active');
    });
});
// 关闭弹窗判定
close.addEventListener('click', () => overlay.classList.remove('active'));
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
    }
});

    // 兼容老旧浏览器（不支持 IntersectionObserver 时的降级方案）
    if (!window.IntersectionObserver) {
        function checkVisibility() {
            cards.forEach(card => {
                if (!card.classList.contains('card-visible')) {
                    const rect = card.getBoundingClientRect();
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    if (rect.top < windowHeight - 50 && rect.bottom > 20) {
                        card.classList.add('card-visible');
                    }
                }
            });
        }
        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);
        checkVisibility();
    }
})();