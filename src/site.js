const GRAVATAR_HASH = 'dba3a23dd59ec3e3da3d72f98d6fa284e751f23a0b8533ac85ac25cd26745ec4';

const iconMap = {
    'github': 'fa-brands fa-github',
    'linkedin': 'fa-brands fa-linkedin-in',
    'twitter': 'fa-brands fa-x-twitter',
    'x': 'fa-brands fa-x-twitter',
    'youtube': 'fa-brands fa-youtube',
    'threads': 'fa-brands fa-threads',
    'mastodon': 'fa-brands fa-mastodon'
};

async function initGravatar() {
    const hero = document.getElementById('hero');
    try {
        const response = await fetch(`https://api.gravatar.com/v3/profiles/${GRAVATAR_HASH}`);
        const data = await response.json();

        const nameEl = document.getElementById('grav-name');
        if (nameEl && data.display_name) nameEl.innerText = data.display_name;

        const titleEl = document.getElementById('grav-title');
        const compEl = document.getElementById('grav-company');

        if (titleEl && data.job_title) titleEl.innerText = data.job_title;
        if (compEl) {
            if (data.company) {
                compEl.innerText = data.company;
            } else if (!data.job_title) {
                compEl.style.display = 'none';
            }
        }

        const grid = document.getElementById('social-grid');
        if (grid && data.verified_accounts && data.verified_accounts.length) {
            data.verified_accounts.forEach(acc => {
                const serviceKey = acc.service_label.toLowerCase();
                const iconClass = iconMap[serviceKey] || 'fa-solid fa-link';

                const chip = document.createElement('a');
                chip.href = acc.url;
                chip.target = '_blank';
                chip.rel = 'noopener';
                chip.className = 'social-chip';
                chip.innerHTML = `<i class="${iconClass}"></i><span>${acc.service_label}</span>`;
                grid.appendChild(chip);
            });
        }
    } catch (error) {
        console.error('Gravatar load failed', error);
    } finally {
        if (hero) hero.classList.add('loaded');
    }
}

function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in-view'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    items.forEach(el => observer.observe(el));
}

function initNavShadow() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
}

function initActiveNav() {
    const current = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

initGravatar();
initReveal();
initNavShadow();
initActiveNav();
