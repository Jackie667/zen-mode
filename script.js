document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. Custom Cursor
    // =========================================
    const cursor = document.querySelector('.custom-cursor');
    const clickableElements = document.querySelectorAll(
        'a, .project-slide, .shelf-item, .fragment-card, .theme-toggle-btn, .slide-link'
    );

    if (cursor) {
        document.body.classList.add('custom-cursor-active');

        document.addEventListener('mousemove', (e) => {
            cursor.style.setProperty('--x', e.clientX + 'px');
            cursor.style.setProperty('--y', e.clientY + 'px');
        });

        clickableElements.forEach(elem => {
            elem.addEventListener('mouseenter', () => cursor.classList.add('hover-effect'));
            elem.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
        });
    }

    // =========================================
    // 2. Scroll Progress Bar
    // =========================================
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            progressBar.style.transform = `scaleX(${scrolled})`;
        }, { passive: true });
    }

    // =========================================
    // 3. Scroll Reveal
    // =========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // =========================================
    // 4. Parallax Scroll
    // =========================================
    const parallaxLayers = document.querySelectorAll('.parallax-bg, .parallax-deco, [data-parallax]');

    function updateParallax() {
        const winH = window.innerHeight;
        parallaxLayers.forEach(layer => {
            const section = layer.closest('.parallax-section');
            if (!section) return;
            const speed = parseFloat(layer.dataset.speed) || 0.3;
            const rect = section.getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - winH / 2) * speed * -1;
            layer.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { updateParallax(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    updateParallax();

    // =========================================
    // 5. Theme Toggle
    // =========================================
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }

    // =========================================
    // 6. Footer Clock
    // =========================================
    const clockElement = document.getElementById('local-time');
    if (clockElement) {
        function updateClock() {
            clockElement.textContent = new Date().toLocaleTimeString('en-US', {
                hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit'
            });
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    // =========================================
    // 7. Card Stack — Deal & Spread
    // =========================================
    const stacks = document.querySelectorAll('.card-stack');

    stacks.forEach(stack => {
        const cards = Array.from(stack.children);
        const n = cards.length;
        const stackW = stack.offsetWidth;
        const stackH = stack.offsetHeight;
        const cx = stackW / 2;
        const cy = stackH / 2;

        cards.forEach((card, i) => {
            const cardCx = card.offsetLeft + card.offsetWidth / 2;
            const cardCy = card.offsetTop + card.offsetHeight / 2;
            const dx = cx - cardCx;
            const dy = (cy - cardCy) * 0.6;
            const rot = (i - (n - 1) / 2) * 6;
            const s = 1 - (n - 1 - i) * 0.03;

            card.style.transition = 'none';
            card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${s})`;
            card.style.opacity = '0.85';
            card.style.zIndex = i;
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cards.forEach((card, i) => {
                    const delay = 0.35 + i * 0.12;
                    card.style.transition =
                        `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, ` +
                        `opacity 0.6s ease ${delay}s`;
                });
            });
        });
    });

    const stackObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const stack = entry.target.querySelector('.card-stack');
            if (!stack) return;
            Array.from(stack.children).forEach(card => {
                card.style.transform = '';
                card.style.opacity = '';
            });
            stackObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.parallax-section').forEach(section => {
        if (section.querySelector('.card-stack')) stackObserver.observe(section);
    });

    // =========================================
    // 8. Horizontal Scroll — Drag with visual feedback
    // =========================================
    const track = document.querySelector('.projects-track');
    if (track) {
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;
        let lastX = 0;
        let velocity = 0;
        const slides = track.querySelectorAll('.project-slide');

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            lastX = e.pageX;
            scrollStart = track.scrollLeft;
            velocity = 0;
            track.classList.add('is-dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentX = e.pageX;
            const dx = currentX - startX;
            velocity = currentX - lastX;
            lastX = currentX;

            track.scrollLeft = scrollStart - dx;

            // Tilt cards in drag direction — clamp to ±4 degrees
            const tilt = Math.max(-4, Math.min(4, velocity * -0.3));
            const scale = 0.97;
            slides.forEach(slide => {
                slide.style.transform = `rotate(${tilt}deg) scale(${scale})`;
            });
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('is-dragging');

            // Momentum: coast with remaining velocity
            const coast = velocity * 8;
            track.scrollBy({ left: -coast, behavior: 'smooth' });

            // Snap cards back upright
            slides.forEach(slide => {
                slide.style.transform = '';
            });
        });

        // Touch support
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            lastX = startX;
            scrollStart = track.scrollLeft;
            velocity = 0;
            track.classList.add('is-dragging');
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            const currentX = e.touches[0].pageX;
            velocity = currentX - lastX;
            lastX = currentX;
            track.scrollLeft = scrollStart - (currentX - startX);

            const tilt = Math.max(-4, Math.min(4, velocity * -0.3));
            slides.forEach(slide => {
                slide.style.transform = `rotate(${tilt}deg) scale(0.97)`;
            });
        }, { passive: true });

        track.addEventListener('touchend', () => {
            track.classList.remove('is-dragging');
            const coast = velocity * 6;
            track.scrollBy({ left: -coast, behavior: 'smooth' });
            slides.forEach(slide => { slide.style.transform = ''; });
        });

        // Update progress dots + progress bar
        const dots = document.querySelectorAll('.track-dots .dot');
        const progressFill = document.querySelector('.track-progress-fill');

        track.addEventListener('scroll', () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (maxScroll <= 0) return;
            const progress = track.scrollLeft / maxScroll;

            if (progressFill) {
                progressFill.style.width = `${progress * 100}%`;
            }

            if (dots.length) {
                const activeIndex = Math.round(progress * (dots.length - 1));
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === activeIndex);
                });
            }
        });
    }

    // =========================================
    // 9. Animated Counters
    // =========================================
    const counters = document.querySelectorAll('.stat-number');

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * ease);
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // =========================================
    // 10. Rotating Zen Quotes
    // =========================================
    const zenQuotes = [
        { text: '"In the beginner\'s mind there are many possibilities, in the expert\'s mind there are few."', author: '— Shunryu Suzuki' },
        { text: '"We shape our buildings, and afterwards our buildings shape us."', author: '— Winston Churchill' },
        { text: '"There is a crack in everything. That\'s how the light gets in."', author: '— Leonard Cohen' },
        { text: '"The space between things is as important as the things themselves."', author: '— 間 Ma' },
        { text: '"Nature does not hurry, yet everything is accomplished."', author: '— Lao Tzu' },
        { text: '"Less, but better."', author: '— Dieter Rams' },
    ];

    const quoteEl = document.getElementById('zen-quote');
    const authorEl = document.getElementById('zen-author');

    if (quoteEl && authorEl) {
        let quoteIndex = 0;

        setInterval(() => {
            quoteIndex = (quoteIndex + 1) % zenQuotes.length;
            quoteEl.style.opacity = '0';
            authorEl.style.opacity = '0';

            setTimeout(() => {
                quoteEl.textContent = zenQuotes[quoteIndex].text;
                authorEl.textContent = zenQuotes[quoteIndex].author;
                quoteEl.style.opacity = '1';
                authorEl.style.opacity = '1';
            }, 400);
        }, 6000);

        quoteEl.style.transition = 'opacity 0.4s ease';
        authorEl.style.transition = 'opacity 0.4s ease';
    }

    // =========================================
    // 11. Active Nav Highlight
    // =========================================
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.parallax-section');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('nav-active'));
                const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('nav-active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => navObserver.observe(section));
});
