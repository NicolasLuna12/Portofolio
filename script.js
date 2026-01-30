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

const ISPC_FOOD_REPOS = ['backmobile1', 'frontprod', 'back2fa', 'backmp', 'Android-Tesis-2025'];
const PROJECT_I_DO_REPO = 'Proyectido';

const PROJECT_CONFIG = {
    'backmobile1': {
        displayName: 'Backend Principal',
        description: 'API REST con Django - Gestión completa del sistema',
        language: 'Python'
    },
    'frontprod': {
        displayName: 'Frontend Web',
        description: 'Interfaz de usuario con Angular - Panel administrativo',
        language: 'TypeScript'
    },
    'back2fa': {
        displayName: 'Microservicio 2FA',
        description: 'Autenticación de dos factores - Seguridad avanzada',
        language: 'Python'
    },
    'backmp': {
        displayName: 'Microservicio Pagos',
        description: 'Integración MercadoPago - Procesamiento de pagos',
        language: 'Python'
    },
    'Android-Tesis-2025': {
        displayName: 'App Android',
        description: 'Aplicación móvil nativa - Gestión de pedidos',
        language: 'Java'
    },
    'project-i-do-backend': {
        displayName: 'Backend API',
        description: 'API REST - Gestión de tareas y usuarios',
        language: 'Node.js'
    },
    'project-i-do-frontend': {
        displayName: 'Frontend Web',
        description: 'Interfaz web responsive - Gestión de proyectos',
        language: 'React'
    },
    'project-i-do-mobile': {
        displayName: 'App Móvil',
        description: 'Aplicación multiplataforma - Acceso móvil',
        language: 'React Native'
    }
};

const EXCLUDED_REPOS = ['nicolasluna12', 'NicolasLuna12', 'Portofolio', 'portofolio'];
const STAR_WEIGHT = 1000000;

const displayProjects = (repos) => {
    const filteredRepos = repos.filter(repo => 
        !repo.fork && 
        repo.size > 0 &&
        !EXCLUDED_REPOS.includes(repo.name)
    );
    
    // Separar proyectos por categoría
    const ispcFoodRepos = [];
    let projectIDoRepo = null;
    const otherRepos = [];
    
    ISPC_FOOD_REPOS.forEach(repoName => {
        let repo = filteredRepos.find(r => r.name === repoName);
        if (!repo && repoName === 'Android-Tesis-2025') {
            repo = {
                name: 'Android-Tesis-2025',
                description: 'Aplicación Android - Sistema de gestión de alimentos',
                html_url: 'https://github.com/NicolasLuna12/Android-Tesis-2025',
                language: 'Java',
                stargazers_count: 0,
                forks_count: 0,
                watchers_count: 0,
                updated_at: new Date().toISOString()
            };
        }
        if (repo) {
            ispcFoodRepos.push(repo);
        }
    });
    
    projectIDoRepo = filteredRepos.find(r => r.name === PROJECT_I_DO_REPO);
    
    filteredRepos.forEach(repo => {
        if (!ISPC_FOOD_REPOS.includes(repo.name) && repo.name !== PROJECT_I_DO_REPO) {
            otherRepos.push(repo);
        }
    });
    
    // Ordenar otros proyectos por fecha
    otherRepos.sort((a, b) => {
        const aScore = new Date(a.updated_at).getTime() + (a.stargazers_count * STAR_WEIGHT);
        const bScore = new Date(b.updated_at).getTime() + (b.stargazers_count * STAR_WEIGHT);
        return bScore - aScore;
    });
    
    let projectsHTML = '';
    
    // Tarjeta principal ISPC Food
    if (ispcFoodRepos.length > 0) {
        const subprojectsHTML = ispcFoodRepos.map(repo => {
            const config = PROJECT_CONFIG[repo.name];
            const displayName = config?.displayName || repo.name;
            const customDescription = config?.description || repo.description || 'Componente del sistema';
            const language = config?.language || repo.language;
            
            return `
                <div class="subproject-card">
                    <div class="subproject-header">
                        <h4 class="subproject-title">${displayName}</h4>
                        ${language ? `<span class="language-badge-small">${language}</span>` : ''}
                    </div>
                    <p class="subproject-description">${customDescription}</p>
                    <a href="${repo.html_url}" target="_blank" class="subproject-link">
                        <i class="fab fa-github"></i> Ver código
                    </a>
                </div>
            `;
        }).join('');
        
        projectsHTML += `
            <div class="project-card project-card-main fade-in">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">
                            <i class="fas fa-utensils"></i> Sistema ISPC Food
                        </h3>
                    </div>
                    <div class="project-language">
                        <span class="language-badge">Full Stack</span>
                    </div>
                </div>
                <p class="project-description">
                    Sistema completo de gestión de alimentos con arquitectura de microservicios. 
                    Incluye backend Django, frontend Angular, app móvil Android y servicios especializados 
                    para autenticación 2FA y procesamiento de pagos con MercadoPago.
                </p>
                <div class="project-tech">
                    <span class="tech-tag">Django</span>
                    <span class="tech-tag">Angular</span>
                    <span class="tech-tag">Android</span>
                    <span class="tech-tag">PostgreSQL</span>
                    <span class="tech-tag">MercadoPago API</span>
                    <span class="tech-tag">REST API</span>
                    <span class="tech-tag">Microservicios</span>
                </div>
                <div class="subprojects-container">
                    <h4 class="subprojects-title">
                        <i class="fas fa-layer-group"></i> Componentes del Sistema
                    </h4>
                    <div class="subprojects-grid">
                        ${subprojectsHTML}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Tarjeta principal Project I Do
    if (projectIDoRepo) {
        const projectIDoComponents = [
            {
                title: 'App Móvil',
                description: 'Aplicación nativa Android en Kotlin - Gestión móvil',
                language: 'Kotlin',
                url: projectIDoRepo.html_url
            }
        ];
        
        const subprojectsHTML = projectIDoComponents.map(component => {
            return `
                <div class="subproject-card">
                    <div class="subproject-header">
                        <h4 class="subproject-title">${component.title}</h4>
                        <span class="language-badge-small">${component.language}</span>
                    </div>
                    <p class="subproject-description">${component.description}</p>
                    <a href="${component.url}" target="_blank" class="subproject-link">
                        <i class="fab fa-github"></i> Ver código
                    </a>
                </div>
            `;
        }).join('');
        
        projectsHTML += `
            <div class="project-card project-card-main fade-in">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">
                            <i class="fas fa-tasks"></i> Project I Do
                        </h3>
                    </div>
                    <div class="project-language">
                        <span class="language-badge">Full Stack</span>
                    </div>
                </div>
                <p class="project-description">
                    Sistema completo de gestión de tareas y proyectos con arquitectura moderna. 
                    Aplicación web full stack con backend robusto, frontend responsive y 
                    aplicación móvil nativa en Kotlin para gestión de productividad en cualquier dispositivo.
                </p>
                <div class="project-tech">
                    <span class="tech-tag">Python</span>
                    <span class="tech-tag">Django</span>
                    <span class="tech-tag">React</span>
                    <span class="tech-tag">Kotlin</span>
                    <span class="tech-tag">PostgreSQL</span>
                    <span class="tech-tag">REST API</span>
                    <span class="tech-tag">Android</span>
                </div>
                <div class="subprojects-container">
                    <h4 class="subprojects-title">
                        <i class="fas fa-layer-group"></i> Componentes del Sistema
                    </h4>
                    <div class="subprojects-grid">
                        ${subprojectsHTML}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Otros proyectos
    projectsHTML += otherRepos.map(repo => {
        const techStack = getTechStack(repo.name, repo.description || '');
        const displayName = repo.name;
        const customDescription = repo.description || 'Proyecto de desarrollo';
        
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
                    ${repo.homepage ? `
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

// Load PDF Previews using PDF.js
const loadPDFPreviews = async () => {
    // Configure PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    const allCards = document.querySelectorAll('.certificate-card');
    
    for (const card of allCards) {
        const imageDiv = card.querySelector('.certificate-image');
        if (!imageDiv) continue;
        
        const pdfPath = card.getAttribute('data-pdf');
        if (!pdfPath) continue;
        
        try {
            // Load PDF
            const loadingTask = pdfjsLib.getDocument(pdfPath);
            const pdf = await loadingTask.promise;
            
            // Get first page
            const page = await pdf.getPage(1);
            
            // Create canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Set viewport to fit container with padding
            const viewport = page.getViewport({ scale: 1 });
            const scale = 300 / viewport.width; // Reducir a 300px para que se vea más chico
            const scaledViewport = page.getViewport({ scale });
            
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            
            // Render PDF page to canvas
            await page.render({
                canvasContext: context,
                viewport: scaledViewport
            }).promise;
            
            // Replace content with canvas
            imageDiv.innerHTML = '';
            imageDiv.appendChild(canvas);
            
        } catch (error) {
            console.error('Error loading PDF preview:', error);
            // Fallback to placeholder
            if (!imageDiv.querySelector('.certificate-placeholder')) {
                const placeholder = document.createElement('i');
                placeholder.className = 'fas fa-file-pdf certificate-placeholder';
                imageDiv.appendChild(placeholder);
            }
        }
    }
};

// Open Certificate Modal - Global function
window.openCertificateModal = (pdfUrl) => {
    const modal = document.getElementById('certificate-modal');
    const pdfViewer = document.getElementById('modal-pdf-viewer');
    if (modal && pdfViewer && pdfUrl) {
        pdfViewer.src = pdfUrl;
        modal.classList.add('active');
    }
};

// Certificate Modal
const initCertificateModal = () => {
    const modal = document.getElementById('certificate-modal');
    const modalClose = document.getElementById('modal-close');
    const pdfViewer = document.getElementById('modal-pdf-viewer');
    
    if (!modal || !modalClose || !pdfViewer) return;
    
    // Close modal on click outside or close button
    const closeModal = () => {
        modal.classList.remove('active');
        pdfViewer.src = '';
    };
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Add click handlers to certificate cards
    const cards = document.querySelectorAll('.certificate-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const pdfUrl = card.getAttribute('data-pdf');
            if (pdfUrl) {
                window.openCertificateModal(pdfUrl);
            }
        });
    });
};

// Certificates Carousel
const initCertificatesCarousel = () => {
    const track = document.getElementById('certificates-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track) return;
    
    const cards = Array.from(track.children);
    
    // Initialize modal immediately so clicks work right away
    initCertificateModal();
    
    // Load PDF previews in background
    loadPDFPreviews();
    if (cards.length === 0) return;
    
    // Responsive cards to show
    const getCardsToShow = () => {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };
    
    let cardsToShow = getCardsToShow();
    let currentIndex = 0;
    let autoRotateInterval = null;
    
    // Create dots
    const totalDots = Math.max(1, Math.ceil(cards.length / cardsToShow));
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoRotate();
        });
        dotsContainer.appendChild(dot);
    }
    
    const dots = Array.from(dotsContainer.children);
    
    const updateCarousel = () => {
        // Recalculate based on current window size
        cardsToShow = getCardsToShow();
        
        // En móvil usar 100% del contenedor, en desktop usar ancho fijo
        let slideWidth;
        if (window.innerWidth <= 480) {
            // En móvil: 100% del contenedor (sin gap)
            slideWidth = track.parentElement.offsetWidth;
        } else {
            // En desktop: ancho de tarjeta + gap
            const cardWidth = 350;
            const gap = 32;
            slideWidth = (cardWidth + gap);
        }
        
        const offset = currentIndex * slideWidth * cardsToShow;
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update buttons state
        if (prevBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentIndex >= totalDots - 1 ? '0.5' : '1';
            nextBtn.style.cursor = currentIndex >= totalDots - 1 ? 'not-allowed' : 'pointer';
        }
    };
    
    const goToSlide = (index) => {
        currentIndex = Math.max(0, Math.min(index, totalDots - 1));
        updateCarousel();
    };
    
    // Touch/Swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < totalDots - 1) {
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateCarousel();
            resetAutoRotate();
        }
        isDragging = false;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            resetAutoRotate();
        } else if (e.key === 'ArrowRight' && currentIndex < totalDots - 1) {
            currentIndex++;
            updateCarousel();
            resetAutoRotate();
        }
    });
    
    // Auto-rotate function
    const startAutoRotate = () => {
        autoRotateInterval = setInterval(() => {
            if (currentIndex < totalDots - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 5000); // Rotate every 5 seconds
    };
    
    const stopAutoRotate = () => {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    };
    
    const resetAutoRotate = () => {
        stopAutoRotate();
        startAutoRotate();
    };
    
    // Pause auto-rotate on hover
    track.addEventListener('mouseenter', stopAutoRotate);
    track.addEventListener('mouseleave', startAutoRotate);
    
    // Pause auto-rotate on interaction
    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            resetAutoRotate();
        }
    });
    
    nextBtn?.addEventListener('click', () => {
        if (currentIndex < totalDots - 1) {
            currentIndex++;
            updateCarousel();
            resetAutoRotate();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    updateCarousel();
    startAutoRotate(); // Start auto-rotation
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
    observeElements();
    
    // Certificates Carousel
    initCertificatesCarousel();
    
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
        console.error('EMAIL_CONFIG no está definido');
        return;
    }
    
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado');
        return;
    }
    
    // Inicializar EmailJS con la configuración
    try {
        emailjs.init(EMAIL_CONFIG.publicKey);
    } catch (error) {
        console.error('Error al inicializar EmailJS:', error);
        return;
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Deshabilitar el botón de envío
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            const originalButtonStyle = submitButton.style.cssText;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
            
            // Obtener datos del formulario manualmente y validar
            const nameValue = document.getElementById('name').value.trim();
            const emailValue = document.getElementById('email').value.trim();
            const subjectValue = document.getElementById('subject').value.trim();
            const messageValue = document.getElementById('message').value.trim();
            
            // Validar que los campos no estén vacíos
            if (!nameValue || !emailValue || !subjectValue || !messageValue) {
                submitButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Complete todos los campos</span>';
                submitButton.style.cssText = originalButtonStyle + 'background: #ef4444 !important;';
                submitButton.disabled = false;
                setTimeout(function() {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.style.cssText = originalButtonStyle;
                }, 3000);
                return;
            }
            
            const templateParams = {
                from_name: nameValue,
                from_email: emailValue,
                subject: subjectValue,
                message: messageValue
            };
            
            // Enviar el email usando EmailJS con los parámetros
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
