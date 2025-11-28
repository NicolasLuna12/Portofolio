// Prohibir el uso de consola en toda la página
window.console = {
    log: function() {},
    warn: function() {},
    error: function() {},
    info: function() {},
    debug: function() {},
    trace: function() {},
    dir: function() {},
    dirxml: function() {},
    group: function() {},
    groupCollapsed: function() {},
    groupEnd: function() {},
    time: function() {},
    timeEnd: function() {},
    timeLog: function() {},
    assert: function() {},
    clear: function() {},
    count: function() {},
    countReset: function() {},
    table: function() {},
    profile: function() {},
    profileEnd: function() {},
    timeStamp: function() {},
    context: function() {}
};

// Constants
const ANIMATION_DURATION = 2000;
const FRAME_DURATION = 16;
const REPOS_PER_PAGE = 100;
const MAX_PROJECTS = 20;
const TYPING_SPEED = 150;
const TYPING_DELAY = 1000;
const GITHUB_USERNAME = 'NicolasLuna12';

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const projectsGrid = document.getElementById('projects-grid');
const contactForm = document.getElementById('contact-form');

// Theme Management
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

const updateThemeIcon = (theme) => {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
};

// Mobile Navigation
const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
};

// Smooth Scrolling for Navigation Links
const setupSmoothScrolling = () => {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
};

// Active Navigation Link Highlighting
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
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

// Skill Bars Animation
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
};

// GitHub Projects Integration
const loadGitHubProjects = async () => {
    try {
        // Cargar todos los repos paginados
        let allRepos = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPOS_PER_PAGE}&page=${page}`);
            const repos = await response.json();
            
            if (Array.isArray(repos) && repos.length > 0) {
                allRepos = [...allRepos, ...repos];
                page++;
                hasMore = repos.length === REPOS_PER_PAGE;
            } else {
                hasMore = false;
            }
        }
        
        if (allRepos.length > 0) {
            displayProjects(allRepos);
        } else {
            displayProjectsError();
        }
    } catch (error) {
        displayProjectsError();
    }
};

const PROJECT_CONFIG = {
    'backmobile1': {
        displayName: 'Backend Principal',
        description: 'Backend Main'
    },
    'frontprod': {
        displayName: 'Frontend Principal',
        description: 'Frontend Main'
    },
    'back2fa': {
        displayName: 'Microservicio Autentificación 2FA',
        description: 'Servicio de autenticación en 2 pasos'
    },
    'backmp': {
        displayName: 'Microservicio MercadoPago',
        description: 'Servicio de gestion de pagos con MercadoPago'
    },
    'Android-Tesis-2025': {
        displayName: 'Aplicación Android',
        description: 'Aplicación Android Pura'
    }
};

const EXCLUDED_REPOS = ['nicolasluna12', 'NicolasLuna12', 'Portofolio', 'portofolio'];
const STAR_WEIGHT = 1000000;

const displayProjects = (repos) => {
    const filteredRepos = repos.filter(repo => 
        !repo.fork && 
        repo.size > 0 &&
        !EXCLUDED_REPOS.includes(repo.name)
    ).sort((a, b) => {
        const aScore = new Date(a.updated_at).getTime() + (a.stargazers_count * STAR_WEIGHT);
        const bScore = new Date(b.updated_at).getTime() + (b.stargazers_count * STAR_WEIGHT);
        return bScore - aScore;
    });
    
    // Agregar el proyecto Android si no está en los filtrados
    if (!filteredRepos.find(r => r.name === 'Android-Tesis-2025')) {
        // Agregar manualmente el proyecto Android-Tesis-2025 si no está en GitHub
        const androidProject = {
            name: 'Android-Tesis-2025',
            description: 'Aplicación Android - Sistema de gestión de alimentos',
            html_url: 'https://github.com/NicolasLuna12/Android-Tesis-2025',
            language: 'Java',
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: new Date().toISOString()
        };
        filteredRepos.unshift(androidProject); // Lo ponemos al principio
    }
    
    const projectsHTML = filteredRepos.map(repo => {
        const techStack = getTechStack(repo.name, repo.description || '');
        const config = PROJECT_CONFIG[repo.name];
        
        const displayName = config?.displayName || repo.name;
        const customDescription = config?.description || repo.description || 'Proyecto de desarrollo';
        const customDemoUrl = null;
        
        return `
            <div class="project-card fade-in">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${displayName}</h3>
                        <div class="project-stats">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                            <span><i class="fas fa-eye"></i> ${repo.watchers_count}</span>
                        </div>
                    </div>
                    <div class="project-language">
                        ${repo.language ? `<span class="language-badge">${repo.language}</span>` : ''}
                    </div>
                </div>
                <p class="project-description">${customDescription}</p>
                <div class="project-tech">
                    ${techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i>
                        Código
                    </a>
                    ${customDemoUrl ? `
                        <a href="${customDemoUrl}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            Ver Demo
                        </a>
                    ` : repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    projectsGrid.innerHTML = projectsHTML;
};

const displayProjectsError = () => {
    projectsGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-circle"></i>
            <p>No se pudieron cargar los proyectos. <a href="https://github.com/NicolasLuna12" target="_blank">Ver en GitHub</a></p>
        </div>
    `;
};

const getProjectLanguages = (language) => {
    const languageMap = {
        'JavaScript': ['JavaScript', 'Node.js'],
        'TypeScript': ['TypeScript', 'Node.js'],
        'Python': ['Python'],
        'Java': ['Java'],
        'C#': ['C#', '.NET'],
        'Go': ['Go'],
        'Rust': ['Rust'],
        'PHP': ['PHP']
    };
    
    return languageMap[language] || [language || 'Backend'];
};

const getTechStack = (name, description) => {
    const nameAndDesc = (name + ' ' + description).toLowerCase();
    const techStack = [];
    
    // Backend frameworks and technologies
    if (nameAndDesc.includes('express') || nameAndDesc.includes('node')) techStack.push('Express.js');
    if (nameAndDesc.includes('django')) techStack.push('Django');
    if (nameAndDesc.includes('flask')) techStack.push('Flask');
    if (nameAndDesc.includes('spring')) techStack.push('Spring Boot');
    if (nameAndDesc.includes('fastapi')) techStack.push('FastAPI');
    
    // Databases
    if (nameAndDesc.includes('mongo')) techStack.push('MongoDB');
    if (nameAndDesc.includes('postgres') || nameAndDesc.includes('postgresql')) techStack.push('PostgreSQL');
    if (nameAndDesc.includes('mysql')) techStack.push('MySQL');
    if (nameAndDesc.includes('redis')) techStack.push('Redis');
    
    // Cloud and DevOps
    if (nameAndDesc.includes('docker')) techStack.push('Docker');
    if (nameAndDesc.includes('aws')) techStack.push('AWS');
    if (nameAndDesc.includes('kubernetes') || nameAndDesc.includes('k8s')) techStack.push('Kubernetes');
    
    // APIs and protocols
    if (nameAndDesc.includes('api') || nameAndDesc.includes('rest')) techStack.push('REST API');
    if (nameAndDesc.includes('graphql')) techStack.push('GraphQL');
    if (nameAndDesc.includes('websocket')) techStack.push('WebSocket');
    
    // Frontend (for full-stack projects)
    if (nameAndDesc.includes('react')) techStack.push('React');
    if (nameAndDesc.includes('vue')) techStack.push('Vue.js');
    if (nameAndDesc.includes('angular')) techStack.push('Angular');
    
    return techStack.length > 0 ? techStack : ['Backend'];
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
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
};

// Initialize Everything
const init = () => {
    // Theme
    initTheme();
    themeToggle?.addEventListener('click', toggleTheme);
    
    // Navigation
    hamburger?.addEventListener('click', toggleMobileMenu);
    setupSmoothScrolling();
    
    // Animations
    animateCounters();
    animateSkillBars();
    observeElements();
    
    // Projects
    loadGitHubProjects();
    
    // Scroll Events
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavLink();
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Typing effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, TYPING_SPEED);
        }, TYPING_DELAY);
    }
    
    // Setup EmailJS Contact Form
    setupContactForm();
};

// Contact Form with EmailJS
const setupContactForm = () => {
    // Verificar que el archivo de configuración esté cargado
    if (typeof EMAIL_CONFIG === 'undefined') {
        return;
    }
    
    // Inicializar EmailJS con la configuración
    emailjs.init(EMAIL_CONFIG.publicKey);
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario directamente
            const formData = new FormData(contactForm);
            
            const templateParams = {
                nombre: formData.get('name'),
                email: formData.get('email'),
                asunto: formData.get('subject'),
                mensaje: formData.get('message')
            };
            
            // Deshabilitar el botón de envío
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            const originalButtonStyle = submitButton.style.cssText;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
            
            // Enviar el email usando EmailJS
            emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
                .then(function(response) {
                    // Éxito - Transformar botón en verde con check
                    submitButton.innerHTML = '<i class="fas fa-check-circle"></i> <span>¡Mensaje Enviado!</span>';
                    submitButton.style.cssText = originalButtonStyle + 'background: #10b981 !important; cursor: not-allowed;';
                    
                    // Limpiar formulario
                    contactForm.reset();
                }, function(error) {
                    // Error - Mostrar error en el botón
                    submitButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Error - Intenta nuevamente</span>';
                    submitButton.style.cssText = originalButtonStyle + 'background: #ef4444 !important;';
                    submitButton.disabled = false;
                    
                    // Restaurar botón después de 3 segundos
                    setTimeout(function() {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.style.cssText = originalButtonStyle;
                    }, 3000);
                });
        });
    }
};

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
