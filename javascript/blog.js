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
const btn = document.getElementById('theme-buttom');

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