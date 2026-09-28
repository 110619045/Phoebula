const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/Phoebula/' : '/';

// 統一路徑格式：結尾是 / 的補上 index.html
function normalize(path) {
    return path.endsWith('/') ? path + 'index.html' : path;
}

fetch(basePath + 'components/sidebar.html')
    .then(response => {
        if (!response.ok) throw new Error(response.status + ' ' + response.url);
        return response.text();
    })
    .then(data => {
        const container = document.getElementById('sidebar-container');
        container.innerHTML = data;

        const currentPath = normalize(window.location.pathname);

        container.querySelectorAll('[data-path]').forEach(link => {
            // 修正連結路徑
            link.href = basePath + link.dataset.path;

            // 標記目前所在頁面
            if (normalize(new URL(link.href).pathname) === currentPath) {
                link.classList.add('current');

                // 如果在子選單裡（例如 Week 1），自動展開該選單
                const parentLi = link.closest('#menu > ul > li');
                const opener = parentLi && parentLi.querySelector(':scope > .opener');
                if (opener) opener.classList.add('active');
            }
        });
        // opener 裡的文字連結：阻止事件冒泡到 opener，讓它正常跳頁
        container.querySelectorAll('.opener > a').forEach(link => {
            link.addEventListener('click', e => e.stopPropagation());
        });

        // sidebar 插入後再載入 main.js
        const script = document.createElement('script');
        script.src = basePath + 'assets/js/main.js';
        script.onload = () => {
            // main.js 等不到 window load 事件，手動移除 is-preload
            setTimeout(() => document.body.classList.remove('is-preload'), 100);
        };
        document.body.appendChild(script);
    })
    .catch(err => console.error('Sidebar 載入失敗：', err));

///////////////////////////////////////////////////////////////////////////////////////////////////////////