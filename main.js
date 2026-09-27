// Navbar effect on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }


    // Animated Hero Ship Scroll Logic
    const heroTrack = document.getElementById('hero-scroll-track');
    if (heroTrack) {
        const rect = heroTrack.getBoundingClientRect();
        const totalScroll = rect.height - window.innerHeight;
        if (totalScroll > 0) {
            let progress = -rect.top / totalScroll;
            progress = Math.max(0, Math.min(1, progress));
            
            const ship = document.getElementById('hero-cargo-ship');
            if (ship) {
                // Starts at -50vh, moves down to 0 over the 200vh scroll
                // Let's translate it down by progress * 50vh
                ship.style.transform = `translateX(-50%) translateY(calc(-50vh + ${progress * 50}vh))`;
            }

            const title = document.getElementById('hero-main-title');
            if (title) {
                // Fade out title quickly (by 20% scroll)
                title.style.opacity = Math.max(0, 1 - (progress * 5));
                title.style.transform = `translateY(${30 + progress * 50}px)`;
            }

            const indicator = document.getElementById('hero-scroll-indicator');
            if (indicator) indicator.style.opacity = Math.max(0, 1 - (progress * 10));

            const badge = document.getElementById('hero-badge');
            if (badge) badge.style.opacity = Math.max(0, 1 - (progress * 5));
        }
    }
});

// Reveal animations on scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal, .reveal-slide-down");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
            
            // Trigger counter if element contains count-up
            const counters = reveals[i].querySelectorAll('.count-up');
            counters.forEach(counter => {
                if (!counter.classList.contains('counted')) {
                    animateCounter(counter);
                }
            });
        }
    }


}

function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimal') || 0);
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (outQuad)
        const ease = 1 - (1 - progress) * (1 - progress);
        
        const current = start + ease * (target - start);
        el.innerText = current.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.classList.add('counted');
        }
    }

    requestAnimationFrame(update);
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form submission (placeholder)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

// Preloader Logic
window.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Hardcoded delay: 4.5s for the full SVG sequence, or 800ms for just text
    const hasFigura = document.getElementById('preloader-logo');
    const delay = hasFigura ? 3200 : 800;
    
    setTimeout(() => {
        body.classList.add('loaded');
        body.classList.remove('loading');
        
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) {
            // Slight delay so the curtains animate gracefully after the preloader gates open
            setTimeout(() => { heroContainer.classList.add('active'); }, 200);
        }

        setTimeout(reveal, 500);
    }, delay);
});

// Menu Toggle Overlay Logic
document.addEventListener('DOMContentLoaded', () => {
    const navOverlay = document.getElementById('nav-overlay');

    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#menu-toggle, .menu-toggle');
        const closeBtn = e.target.closest('#menu-close, .menu-close');
        const overlayLink = e.target.closest('#nav-overlay a');

        if (toggleBtn && navOverlay) {
            e.preventDefault();
            navOverlay.classList.add('active');
            navOverlay.style.opacity = '1';
            navOverlay.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
        } else if ((closeBtn || overlayLink) && navOverlay) {
            navOverlay.classList.remove('active');
            navOverlay.style.opacity = '0';
            navOverlay.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay && navOverlay.classList.contains('active')) {
            navOverlay.classList.remove('active');
            navOverlay.style.opacity = '0';
            navOverlay.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        }
    });
});



// Footer Reveal Observer
document.addEventListener("DOMContentLoaded", () => {
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll(".footer-container").forEach(el => footerObserver.observe(el));
});

// Scroll-interactive Operator Track Logic
document.addEventListener("DOMContentLoaded", () => {
    const textBlocks = document.querySelectorAll(".scroll-text-block");
    const imageLayers = document.querySelectorAll(".sticky-img-layer");
    
    if (textBlocks.length === 0 || imageLayers.length === 0) return;

    const trackObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activate the current text block
                textBlocks.forEach(b => b.classList.remove("active"));
                entry.target.classList.add("active");
                
                // Get index
                const index = entry.target.getAttribute("data-index");
                
                // Activate the corresponding image
                imageLayers.forEach(img => img.classList.remove("active"));
                const targetImg = document.querySelector(`.sticky-img-layer[data-index="${index}"]`);
                if (targetImg) {
                    targetImg.classList.add("active");
                }
            }
        });
    }, {
        rootMargin: "-40% 0px -40% 0px" // Trigger when block is near the middle of the screen
    });
    
    textBlocks.forEach(block => trackObserver.observe(block));
});



// Universal Scroll Highlight Text Engine
function initScrollHighlightTexts() {
    const targets = document.querySelectorAll('#intro-text, .scroll-highlight-text');
    if (!targets.length) return;

    targets.forEach(el => {
        if (el.dataset.highlightInit) return;
        el.dataset.highlightInit = "true";

        const text = el.innerText.trim();
        if (!text) return;

        const words = text.split(/\s+/);
        el.innerHTML = '';

        words.forEach((word, idx) => {
            const span = document.createElement('span');
            span.className = 'highlight-word';
            span.textContent = word + (idx < words.length - 1 ? ' ' : '');
            el.appendChild(span);
        });
    });

    function updateHighlightProgress() {
        const elements = document.querySelectorAll('#intro-text, .scroll-highlight-text');
        const windowHeight = window.innerHeight;

        elements.forEach(el => {
            const spans = el.querySelectorAll('.highlight-word');
            if (!spans.length) return;

            const rect = el.getBoundingClientRect();
            const start = windowHeight * 0.85;
            const end = windowHeight * 0.30;

            let progress = (start - rect.top) / (start - end);
            progress = Math.max(0, Math.min(1, progress));

            const total = spans.length;
            const activeCount = Math.floor(progress * total);
            const subProgress = (progress * total) % 1;

            spans.forEach((span, idx) => {
                if (idx < activeCount) {
                    span.style.opacity = '1';
                    span.classList.add('active');
                } else if (idx === activeCount) {
                    span.style.opacity = (0.22 + 0.78 * subProgress).toFixed(3);
                    if (subProgress > 0.45) {
                        span.classList.add('active');
                    } else {
                        span.classList.remove('active');
                    }
                } else {
                    span.style.opacity = '0.22';
                    span.classList.remove('active');
                }
            });
        });
    }

    window.addEventListener('scroll', updateHighlightProgress, { passive: true });
    window.addEventListener('resize', updateHighlightProgress, { passive: true });
    updateHighlightProgress();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollHighlightTexts);
} else {
    initScrollHighlightTexts();
}

// Cookie Consent Banner System
function initCookieConsent() {
    if (localStorage.getItem('synergy_cookies_consented')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
        <div class="cookie-banner-inner">
            <div class="cookie-banner-title">Cookie & Privacy Preferences</div>
            <p class="cookie-banner-text">
                We use essential cookies and analytics to enhance your browsing experience, optimize site performance, and analyze platform traffic in accordance with our <a href="privacy.html">Privacy Policy</a>.
            </p>
            <div class="cookie-banner-actions">
                <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Accept All</button>
                <button id="cookie-essential" class="cookie-btn cookie-btn-secondary">Essential Only</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);

    // Smoothly animate in after 800ms
    setTimeout(() => {
        banner.classList.add('visible');
    }, 800);

    const dismissBanner = () => {
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 400);
        localStorage.setItem('synergy_cookies_consented', 'true');
    };

    document.getElementById('cookie-accept-all')?.addEventListener('click', dismissBanner);
    document.getElementById('cookie-essential')?.addEventListener('click', dismissBanner);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
    initCookieConsent();
}



// Sticky Platform Narrative & Showcase Numbers Controller (Homepage)
function initPlatformShowcase() {
    const showcase = document.getElementById('platform-showcase');
    if (!showcase) return;

    const bg1 = document.getElementById('stat-bg-1');
    const bg2 = document.getElementById('stat-bg-2');
    const bg3 = document.getElementById('stat-bg-3');

    const card1 = document.getElementById('platform-card-1');
    const card2 = document.getElementById('platform-card-2');
    const card3 = document.getElementById('platform-card-3');

    const pill1 = document.getElementById('pill-1');
    const pill2 = document.getElementById('pill-2');
    const pill3 = document.getElementById('pill-3');

    let ticking = false;

    function updateShowcase() {
        const rect = showcase.getBoundingClientRect();
        const total = showcase.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        
        const progress = Math.min(Math.max(-rect.top / total, 0), 1);

        if (progress < 0.33) {
            if (bg1) bg1.classList.add('active');
            if (bg2) bg2.classList.remove('active');
            if (bg3) bg3.classList.remove('active');

            if (card1) card1.classList.add('is-active', 'is-spotlight');
            if (card2) card2.classList.remove('is-active', 'is-spotlight');
            if (card3) card3.classList.remove('is-active', 'is-spotlight');

            if (pill1) pill1.classList.add('active');
            if (pill2) pill2.classList.remove('active');
            if (pill3) pill3.classList.remove('active');
        } else if (progress < 0.66) {
            if (bg1) bg1.classList.remove('active');
            if (bg2) bg2.classList.add('active');
            if (bg3) bg3.classList.remove('active');

            if (card1) { card1.classList.add('is-active'); card1.classList.remove('is-spotlight'); }
            if (card2) { card2.classList.add('is-active', 'is-spotlight'); }
            if (card3) { card3.classList.remove('is-active', 'is-spotlight'); }

            if (pill1) pill1.classList.remove('active');
            if (pill2) pill2.classList.add('active');
            if (pill3) pill3.classList.remove('active');
        } else {
            if (bg1) bg1.classList.remove('active');
            if (bg2) bg2.classList.remove('active');
            if (bg3) bg3.classList.add('active');

            if (card1) { card1.classList.add('is-active'); card1.classList.remove('is-spotlight'); }
            if (card2) { card2.classList.add('is-active'); card2.classList.remove('is-spotlight'); }
            if (card3) { card3.classList.add('is-active', 'is-spotlight'); }

            if (pill1) pill1.classList.remove('active');
            if (pill2) pill2.classList.remove('active');
            if (pill3) pill3.classList.add('active');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateShowcase);
            ticking = true;
        }
    }, { passive: true });

    updateShowcase();
}

// Integrated Operator & Institutional Investor Loading Effect (About Page)
function initCapabilitiesLoading() {
    const opTrack = document.getElementById('operating-track');
    const invTrack = document.getElementById('investor-track');
    if (!opTrack && !invTrack) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('track-visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    if (opTrack) observer.observe(opTrack);
    if (invTrack) observer.observe(invTrack);
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPlatformShowcase();
        initCapabilitiesLoading();
    });
} else {
    initPlatformShowcase();
    initCapabilitiesLoading();
}
