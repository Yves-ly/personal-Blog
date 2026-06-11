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