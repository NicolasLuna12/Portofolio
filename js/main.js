// Main Initialization Module

// DOM Elements (references from other modules)
const getThemeToggle = () => document.getElementById('theme-toggle');
const getHamburger = () => document.querySelector('.hamburger');

// Initialize Everything
const init = () => {
    // Get DOM elements
    const themeToggle = getThemeToggle();
    const hamburger = getHamburger();
    
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
    if (typeof updateNavbarState === 'function') {
        updateNavbarState();
    }
    
    // Animations
    if (typeof animateCounters === 'function') animateCounters();
    if (typeof observeElements === 'function') observeElements();
    if (typeof setupParallax === 'function') setupParallax();
    
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
                if (typeof updateNavbarState === 'function') updateNavbarState();
                if (typeof handleParallax === 'function') handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener('resize', () => {
        if (typeof setupParallax === 'function') setupParallax();
    });
    
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
