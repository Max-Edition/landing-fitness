// ========================================
// IRONCLAD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('.header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .program-card,
        .result-card,
        .pricing-card,
        .credential {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .program-card.visible,
        .result-card.visible,
        .pricing-card.visible,
        .credential.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero-title .title-line {
            opacity: 0;
            transform: translateY(30px);
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .title-line:nth-child(1) { animation-delay: 0.1s; }
        .title-line:nth-child(2) { animation-delay: 0.2s; }
        .title-line:nth-child(3) { animation-delay: 0.3s; }
        
        @keyframes slideUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .floating-stat {
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .stat-1 { animation-delay: 0.5s; }
        .stat-2 { animation-delay: 0.7s; }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Observe cards
    document.querySelectorAll('.program-card, .result-card, .pricing-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
        animateOnScroll.observe(card);
    });

    document.querySelectorAll('.credential').forEach((cred, index) => {
        cred.style.transitionDelay = `${index * 100}ms`;
        animateOnScroll.observe(cred);
    });

    // Counter animation for stats
    const animateCounter = (element, target, suffix = '') => {
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            element.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Observe stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    const text = statValue.textContent.trim();

                    if (text.includes('2,500')) {
                        animateCounter(statValue, 2500, '+');
                    } else if (text.includes('15')) {
                        animateCounter(statValue, 15, '+ Years');
                    }
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.floating-stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Parallax effect for hero background
    const heroGradient = document.querySelector('.hero-gradient');

    if (heroGradient && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 30;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 30;

            heroGradient.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }, { passive: true });
    }

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const button = this.querySelector('button[type="submit"]');
            const originalContent = button.innerHTML;

            button.innerHTML = `
                <span>Request Sent!</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            button.style.background = '#00C853';

            this.reset();

            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = '';
            }, 3000);
        });
    }

    // Program card hover effect
    document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            const number = this.querySelector('.program-number');
            if (number) {
                number.style.color = 'var(--accent)';
                number.style.transition = 'color 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', function () {
            const number = this.querySelector('.program-number');
            if (number) {
                number.style.color = '';
            }
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks?.classList.toggle('active');
            navActions?.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks?.classList.remove('active');
                navActions?.classList.remove('active');
            });
        });
    }

    console.log('💪 IRONCLAD - Page loaded with power!');
});
