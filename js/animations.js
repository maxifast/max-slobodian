/* ═══════════════════════════════════════════
   GSAP + ScrollTrigger Animations
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Preloader ──────────────────────────────
    var preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }

    // Hide as soon as DOM + critical resources are ready
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(hidePreloader, 600);
    });

    // Safety-net fallback (in case DOMContentLoaded already fired)
    setTimeout(hidePreloader, 1200);


    // ── Register GSAP plugins ──────────────────
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // ── Navigation scroll effect ───────────────
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ── Hamburger menu ─────────────────────────
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        var mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ── Smooth scroll for anchor links ────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offsetY = 70;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offsetY;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ── Hero Pin (about rides over hero) ───────
    var heroSection = document.getElementById('hero');
    var aboutSection = document.getElementById('about');

    if (heroSection && aboutSection && window.innerWidth > 768) {
        ScrollTrigger.create({
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            pinSpacing: false
        });
    }

    // ── Scroll animations ──────────────────────
    var animatedElements = document.querySelectorAll('[data-animate]');

    animatedElements.forEach(function (el) {
        var delay = parseFloat(el.getAttribute('data-delay')) || 0;

        gsap.fromTo(el,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: delay,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                    onEnter: function () {
                        el.classList.add('animated');
                    }
                }
            }
        );
    });

    // ── Count-up animation ─────────────────────
    var statNumbers = document.querySelectorAll('[data-count]');

    statNumbers.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);

        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: function () {
                var obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        el.textContent = Math.round(obj.val);
                    }
                });
            }
        });
    });

    // ── Custom cursor ──────────────────────────
    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursor-follower');

    if (cursor && follower && window.innerWidth > 768) {
        var cx = 0, cy = 0;
        var fx = 0, fy = 0;

        document.addEventListener('mousemove', function (e) {
            cx = e.clientX;
            cy = e.clientY;
        });

        function updateCursor() {
            cursor.style.transform = 'translate(' + (cx - 4) + 'px, ' + (cy - 4) + 'px)';

            fx += (cx - fx) * 0.12;
            fy += (cy - fy) * 0.12;
            follower.style.transform = 'translate(' + (fx - 18) + 'px, ' + (fy - 18) + 'px)';

            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Hover effects on interactive elements
        var hoverTargets = document.querySelectorAll('a, button, .review-card, .about-card, .consult-card, .thought-btn, .magnetic');
        hoverTargets.forEach(function (target) {
            target.addEventListener('mouseenter', function () {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            target.addEventListener('mouseleave', function () {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    // ── Magnetic buttons ───────────────────────
    if (window.innerWidth > 768) {
        var magneticBtns = document.querySelectorAll('.magnetic');
        magneticBtns.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    // ── Lightbox ───────────────────────────────
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxClose = document.getElementById('lightbox-close');
    var reviewCards = document.querySelectorAll('.review-card img');

    if (lightbox && lightboxImg) {
        reviewCards.forEach(function (img) {
            img.addEventListener('click', function () {
                lightboxImg.src = this.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // ── Floating Telegram button visibility ────
    var floatingTg = document.getElementById('floating-tg');
    if (floatingTg) {
        floatingTg.style.opacity = '0';
        floatingTg.style.visibility = 'hidden';

        window.addEventListener('scroll', function () {
            if (window.scrollY > 600) {
                floatingTg.style.opacity = '1';
                floatingTg.style.visibility = 'visible';
                floatingTg.style.transition = 'opacity 0.4s, visibility 0.4s, transform 0.3s, box-shadow 0.3s';
            } else {
                floatingTg.style.opacity = '0';
                floatingTg.style.visibility = 'hidden';
            }
        });
    }
})();
