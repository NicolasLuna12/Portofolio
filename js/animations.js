// Animations Module
// Constants
const ANIMATION_DURATION = 2000;
const FRAME_DURATION = 16;
const TYPING_SPEED = 150;
const TYPING_DELAY = 1000;

// Parallax state
let parallaxTargets = null;
let parallaxSectionObserver = null;
const activeParallaxSections = new Set();

const getParallaxTargets = () => {
    if (parallaxTargets) return parallaxTargets;

    const hero = document.querySelector('.hero');
    const sections = Array.from(document.querySelectorAll('section:not(.hero)'));

    if (!hero) {
        parallaxTargets = { hero: null, content: null, image: null, sections };
        return parallaxTargets;
    }

    parallaxTargets = {
        hero,
        content: hero.querySelector('.hero-content'),
        image: hero.querySelector('.hero-image'),
        sections
    };

    return parallaxTargets;
};

const shouldDisableParallax = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileViewport = window.matchMedia('(max-width: 768px)').matches;
    return reduceMotion || mobileViewport;
};

const setupParallaxSectionObserver = () => {
    const { sections } = getParallaxTargets();

    if (!sections.length || parallaxSectionObserver) {
        return;
    }

    parallaxSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeParallaxSections.add(entry.target);
            } else {
                activeParallaxSections.delete(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '20% 0px 20% 0px',
        threshold: 0
    });

    sections.forEach(section => parallaxSectionObserver.observe(section));
};

const resetParallaxTransforms = () => {
    const { hero, content, image, sections } = getParallaxTargets();

    if (hero) {
        hero.style.setProperty('--hero-parallax-y', '0px');
    }

    if (content) {
        content.style.transform = '';
    }

    if (image) {
        image.style.transform = '';
    }

    sections.forEach(section => {
        section.style.setProperty('--section-parallax-y', '0px');
    });
};

const setupParallax = () => {
    getParallaxTargets();
    setupParallaxSectionObserver();

    if (shouldDisableParallax()) {
        resetParallaxTransforms();
        return;
    }

    handleParallax();
};

// Animated Counters
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (ANIMATION_DURATION / FRAME_DURATION);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
};

// Scroll Animations
const observeElements = () => {
    const elements = document.querySelectorAll('section, .project-card, .skill-category');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
};

// Typing Effect for Hero
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Parallax Effect
const handleParallax = () => {
    const { hero, content, image, sections } = getParallaxTargets();

    if (shouldDisableParallax()) {
        resetParallaxTransforms();
        return;
    }

    const scrolled = window.pageYOffset;

    if (hero) {
        const heroTop = hero.offsetTop;
        const relativeScroll = scrolled - heroTop;
        const bgShift = relativeScroll * 0.18;
        const contentShift = relativeScroll * -0.08;
        const imageShift = relativeScroll * 0.13;

        hero.style.setProperty('--hero-parallax-y', `${bgShift.toFixed(2)}px`);

        if (content) {
            content.style.transform = `translate3d(0, ${contentShift.toFixed(2)}px, 0)`;
        }

        if (image) {
            image.style.transform = `translate3d(0, ${imageShift.toFixed(2)}px, 0)`;
        }
    }

    const targetSections = activeParallaxSections.size > 0
        ? Array.from(activeParallaxSections)
        : sections;

    targetSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distanceFromCenter = sectionCenter - viewportCenter;
        const shift = Math.max(-22, Math.min(22, distanceFromCenter * -0.08));

        section.style.setProperty('--section-parallax-y', `${shift.toFixed(2)}px`);
    });
};

// Export functions
window.animateCounters = animateCounters;
window.observeElements = observeElements;
window.typeWriter = typeWriter;
window.handleParallax = handleParallax;
window.setupParallax = setupParallax;
window.TYPING_SPEED = TYPING_SPEED;
window.TYPING_DELAY = TYPING_DELAY;
