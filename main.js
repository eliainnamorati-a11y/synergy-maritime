// Navbar effect on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    // Sticky Accordion Scroll Logic
    const track = document.querySelector('.sticky-accordion-track');
    if (track) {
        const item1 = document.getElementById('acc-item-1');
        const item2 = document.getElementById('acc-item-2');
        const item3 = document.getElementById('acc-item-3');

        if (window.innerWidth <= 768) {
            if (item1 && item2 && item3) {
                item1.classList.add('active');
                item2.classList.add('active');
                item3.classList.add('active');
            }
        } else {
            const trackRect = track.getBoundingClientRect();
            const scrollDistance = trackRect.height - window.innerHeight;
            
            if (scrollDistance > 0) {
                let progress = -trackRect.top / scrollDistance;
                progress = Math.max(0, Math.min(1, progress));

                if (item1 && item2 && item3) {
                    item1.classList.remove('active');
                    item2.classList.remove('active');
                    item3.classList.remove('active');

                    if (progress < 0.33) {
                        item1.classList.add('active');
                    } else if (progress < 0.66) {
                        item2.classList.add('active');
                    } else {
                        item3.classList.add('active');
                    }
                }
            }
        }
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
