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

// 黑白主题切换
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

// ========== 卡片滚动浮动弹跳动画 ==========
(function() {
    // 获取所有需要动画的卡片（第一个和第二个）
    const animatedCards = document.querySelectorAll('.card');
    
    if (animatedCards.length === 0) return;
    
    // 为每个卡片添加动画类名
    animatedCards.forEach(card => {
        card.classList.add('card-animate');
    });
    
    // 使用 IntersectionObserver 监听卡片进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('card-visible')) {
                entry.target.classList.add('card-visible');
                observer.unobserve(entry.target); // 触发一次后停止监听
            }
        });
    }, { threshold: 0.2 }); // 卡片露出20%时触发
    
    // 开始监听所有卡片
    animatedCards.forEach(card => {
        observer.observe(card);
    });
    
    // 兼容老旧浏览器（降级方案）
    if (!window.IntersectionObserver) {
        function checkVisibility() {
            animatedCards.forEach(card => {
                if (!card.classList.contains('card-visible')) {
                    const rect = card.getBoundingClientRect();
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    if (rect.top < windowHeight - 100 && rect.bottom > 50) {
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