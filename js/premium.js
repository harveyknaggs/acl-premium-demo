/* Premium JS — Advanced Concrete & Landscapes */
(function(){
    // Loading screen
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 1400);
    });

    // Scroll progress bar
    const scrollBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        scrollBar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    });

    // Header shrink on scroll
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Dark mode toggle
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('acl-theme');
    if (saved === 'light') document.body.classList.remove('dark-mode');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('acl-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Mobile nav
    const mobileBtn = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    mobileBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // Services tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
            const panel = document.querySelector(`.service-panel[data-panel="${btn.dataset.tab}"]`);
            if (panel) panel.classList.add('active');
        });
    });

    // Gallery lightbox
    const images = ['images/concrete-driveway.jpg','images/artificial-lawn.jpg','images/modern-landscaping.jpg','images/patio-path.jpg','images/large-project.jpg'];
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCounter = document.getElementById('lb-counter');
    let lbIndex = 0;

    function openLb(i) { lbIndex = i; lbImg.src = images[i]; lbCounter.textContent = (i+1)+' / '+images.length; lightbox.classList.add('open'); document.body.style.overflow='hidden'; }
    function closeLb() { lightbox.classList.remove('open'); document.body.style.overflow=''; }
    function lbNav(dir) { lbIndex = (lbIndex + dir + images.length) % images.length; openLb(lbIndex); }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => openLb(parseInt(item.dataset.index)));
    });
    document.querySelector('.lb-close').addEventListener('click', closeLb);
    document.querySelector('.lb-prev').addEventListener('click', () => lbNav(-1));
    document.querySelector('.lb-next').addEventListener('click', () => lbNav(1));
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') lbNav(-1);
        if (e.key === 'ArrowRight') lbNav(1);
    });

    // Multi-step form
    window.nextStep = function(step) {
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    };
    document.getElementById('contact-form').addEventListener('submit', e => {
        e.preventDefault();
        nextStep(3);
    });

    // Floating CTA & Back to top
    const floatingCta = document.getElementById('floating-cta');
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        const show = window.scrollY > window.innerHeight;
        floatingCta.classList.toggle('visible', show);
        backToTop.classList.toggle('visible', show);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Reveal on scroll (IntersectionObserver)
    const revealEls = document.querySelectorAll('.section-header, .about-grid, .service-panel, .gallery-item, .contact-grid, .stats-bar');
    revealEls.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));

    // GSAP Animations (if loaded)
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // Counter animation
        document.querySelectorAll('.stat-num').forEach(el => {
            const target = parseInt(el.dataset.target);
            gsap.fromTo(el, { textContent: 0 }, {
                textContent: target, duration: 2, ease: 'power2.out', snap: { textContent: 1 },
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        // Hero stagger
        gsap.from('.hero-content > *', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, delay: 1.5 });

        // Parallax on about image
        gsap.to('.about-img-wrap img', {
            yPercent: -8, ease: 'none',
            scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: true }
        });
    }

    // Wait for GSAP to load
    if (document.readyState === 'complete') initGSAP();
    else window.addEventListener('load', () => setTimeout(initGSAP, 100));

    // Particles (simple floating dots)
    const canvas = document.getElementById('particles');
    if (canvas) {
        const cvs = document.createElement('canvas');
        cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
        canvas.appendChild(cvs);
        const ctx = cvs.getContext('2d');
        let dots = [];
        function resize() { cvs.width = canvas.offsetWidth; cvs.height = canvas.offsetHeight; }
        resize(); window.addEventListener('resize', resize);
        for (let i = 0; i < 40; i++) dots.push({ x: Math.random()*cvs.width, y: Math.random()*cvs.height, r: Math.random()*2+1, dx: (Math.random()-.5)*.3, dy: (Math.random()-.5)-.2, o: Math.random()*.3+.1 });
        function draw() {
            ctx.clearRect(0,0,cvs.width,cvs.height);
            dots.forEach(d => { ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${d.o})`; ctx.fill(); d.x+=d.dx; d.y+=d.dy; if(d.x<0||d.x>cvs.width)d.dx*=-1; if(d.y<0||d.y>cvs.height){d.y=cvs.height;d.dy=-Math.abs(d.dy)} });
            requestAnimationFrame(draw);
        }
        draw();
    }

    // Auto-scroll testimonials
    const track = document.getElementById('testimonial-track');
    if (track) {
        let scrollDir = 1;
        setInterval(() => {
            track.scrollBy({ left: 360 * scrollDir, behavior: 'smooth' });
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) scrollDir = -1;
            if (track.scrollLeft <= 10) scrollDir = 1;
        }, 4000);
    }
})();
