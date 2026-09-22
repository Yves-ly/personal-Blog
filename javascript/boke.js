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

//---卡片滚动浮动弹跳动画---//
(function() {
    const blocks = document.querySelectorAll('.zuopingblock, .bokeblock,.stepsblock,.historyblock');
    if (blocks.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('block-visible')) {
                entry.target.classList.add('block-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    blocks.forEach(block => observer.observe(block));
    if (!window.IntersectionObserver) {
        function checkVisibility() {
            blocks.forEach(block => {
                if (!block.classList.contains('block-visible')) {
                    const rect = block.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.top < windowHeight - 100 && rect.bottom > 50) {
                        block.classList.add('block-visible');
                    }
                }
            });
        }
        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);
        checkVisibility();
    }
})();

//---加载个人作品数据---//
fetch('posts/personal.json')
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById('personal-container');
        container.innerHTML = '';
        data.forEach(item => {
            fetch(item.file)
                .then(r => r.text())
                .then(md => marked.parse(md))
                .then(html => {
                    container.innerHTML += `
                    <div class = "personal-item">
                        <h1 id="section${item.id}">${item.title}:</h1>
                        <h3> --${item.time}--</h3>
                        ${html}
                    </div>
                    `;
                })
        })
    });

//---加载博客数据---//
fetch('posts/boke.json')
    .then(r => r.json())
    .then(data => {
        // 定义容器变量，通过id绑定博客容器到container变量
        const container = document.getElementById('boke-container');
        // 将容器container赋值为空
        container.innerHTML = '';
        // 将上面fetch后解析的对象存入容器并编译后排序
        data.forEach(item => {
            fetch(item.file)
                .then(r => r.text())
                .then(md => marked.parse(md))
        // 反引号和＄配合使用，不可删除
        // id用于目录跳转，json编写时不可乱写
                .then(html => {
                    container.innerHTML += `
                    <div class = "boke-item">
                        <h1 id="section${item.id}">${item.title}:</h1>
                        <h3> --${item.time}--</h3>
                        ${html}
                    </div>
                    `;
                })
        })
    });

//---加载说明数据---//
fetch('posts/steps.json')
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById('steps-container');
        container.innerHTML = '';
        data.forEach(item => {
            fetch(item.file)
                .then(r => r.text())
                .then(md => marked.parse(md))
                .then(html => {
                    container.innerHTML += `
                    <div class = "steps-item">
                        <h1 id="section${item.id}">${item.title}:</h1>
                        <h3> --${item.time}--</h3>
                        ${html}
                    </div>
                    `;
                })
        })
    });

//---加载说明数据---//
fetch('posts/history.json')
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById('history-container');
        container.innerHTML = '';
        data.forEach(item => {
            fetch(item.file)
                .then(r => r.text())
                .then(md => marked.parse(md))
                .then(html => {
                    container.innerHTML += `
                    <div class = "history-item">
                        <h1 id="section${item.id}">${item.title}:</h1>
                        <h3> --${item.time}--</h3>
                        ${html}
                    </div>
                    `;
                })
        })
    });