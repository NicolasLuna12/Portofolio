// Main Initialization Module

// DOM Elements (references from other modules)
const getThemeToggle = () => document.getElementById('theme-toggle');
const getHamburger = () => document.querySelector('.hamburger');
const getHeroSubtitle = () => document.querySelector('.hero-subtitle');

// Initialize Everything
const init = () => {
    // Get DOM elements
    const themeToggle = getThemeToggle();
    const hamburger = getHamburger();
    const heroSubtitle = getHeroSubtitle();
    
    // Theme
    if (typeof initTheme === 'function') initTheme();
    if (themeToggle && typeof toggleTheme === 'function') {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Navigation
    if (typeof initMobileMenu === 'function') {
        initMobileMenu();
    }
    if (typeof setupSmoothScrolling === 'function') {
        setupSmoothScrolling();
    }
    
    // Animations
    if (typeof animateCounters === 'function') animateCounters();
    if (typeof observeElements === 'function') observeElements();
    
    // Certificates Carousel
    if (typeof initCertificatesCarousel === 'function') {
        initCertificatesCarousel();
    }
    
    // Projects
    if (typeof loadGitHubProjects === 'function') {
        loadGitHubProjects();
    }
    
    // Scroll Events
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (typeof updateActiveNavLink === 'function') updateActiveNavLink();
                if (typeof handleParallax === 'function') handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Typing effect for hero subtitle
    if (heroSubtitle && typeof typeWriter === 'function') {
        const originalText = heroSubtitle.textContent;
        const speed = typeof TYPING_SPEED !== 'undefined' ? TYPING_SPEED : 100;
        const delay = typeof TYPING_DELAY !== 'undefined' ? TYPING_DELAY : 500;
        
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, speed);
        }, delay);
    }
    
    // Setup EmailJS Contact Form
    if (typeof setupContactForm === 'function') {
        setupContactForm();
    }
};

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export init function
window.portfolioInit = init;
