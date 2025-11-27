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
        const duration = 2000;
        const increment = target / (duration / 16);
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
            const response = await fetch(`https://api.github.com/users/NicolasLuna12/repos?sort=updated&per_page=100&page=${page}`);
            const repos = await response.json();
            
            if (Array.isArray(repos) && repos.length > 0) {
                allRepos = [...allRepos, ...repos];
                page++;
                // Si devuelve menos de 100, ya no hay más páginas
                hasMore = repos.length === 100;
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

const displayProjects = (repos) => {
    // Filter for most relevant projects - todos los que no sean forks y tengan descripción
    const filteredRepos = repos.filter(repo => 
        !repo.fork && 
        repo.size > 0 &&
        repo.name !== 'nicolasluna12' &&  // Excluir el proyecto nicolasluna12
        repo.name !== 'NicolasLuna12' &&  // Por si acaso está con mayúsculas
        repo.name !== 'Portofolio' &&     // Excluir el repositorio Portfolio
        repo.name !== 'portofolio'        // Por si acaso está en minúsculas
    ).sort((a, b) => {
        // Ordenar por última actualización y número de estrellas
        const aScore = new Date(a.updated_at).getTime() + (a.stargazers_count * 1000000);
        const bScore = new Date(b.updated_at).getTime() + (b.stargazers_count * 1000000);
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
        const languages = getProjectLanguages(repo.language);
        const techStack = getTechStack(repo.name, repo.description || '');
        
        // Cambiar nombres mostrados para proyectos específicos
        let displayName = repo.name;
        let customDemoUrl = null;
        let customDescription = repo.description || 'Proyecto de desarrollo';
        
        if (repo.name === 'backmobile1') {
            displayName = 'Backend Principal';
            customDescription = 'Backend Main';
        } else if (repo.name === 'frontprod') {
            displayName = 'Frontend Principal';
            customDescription = 'Frontend Main';
        } else if (repo.name === 'back2fa') {
            displayName = 'Microservicio Autentificación 2FA';
            customDescription = 'Servicio de autenticación en 2 pasos';
        } else if (repo.name === 'backmp') {
            displayName = 'Microservicio MercadoPago';
            customDescription = 'Servicio de gestion de pagos con MercadoPago';
        } else if (repo.name === 'Android-Tesis-2025') {
            displayName = 'Aplicación Android';
            customDescription = 'Aplicación Android Pura';
        }
        
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

// Contact Form Handler - ELIMINADO (ahora se usa EmailJS al final del archivo)

// Notification System (Implementada al final del archivo para EmailJS)

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
    
    // Setup confetti button
    // Confetti deshabilitado
    
    // Contact Form - Ahora manejado por EmailJS al final del archivo (línea ~700)
    // contactForm?.addEventListener('submit', handleContactForm); // DESHABILITADO
    
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
            typeWriter(heroSubtitle, originalText, 150);
        }, 1000);
    }
    
};

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add CSS for notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-color: var(--success-color);
    }
    
    .notification-success i {
        color: var(--success-color);
    }
    
    .language-badge {
        background: var(--primary-color);
        color: white;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 500;
    }
    
    .project-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
    }
    
    .project-stats span {
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Confetti Animation Function
const createConfetti = (x, y) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#fd79a8', '#00b894', '#e17055'];
    
    for (let i = 0; i < 25; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posición inicial en el botón con un poco de variación
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        confetti.style.left = (x + offsetX) + 'px';
        confetti.style.top = (y + offsetY) + 'px';
        
        // Color y forma aleatoria
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Trayectoria más orgánica - usando ángulos radiales con variación
        const baseAngle = (Math.PI * 2 * i) / 25;
        const angleVariation = (Math.random() - 0.5) * 1.2;
        const angle = baseAngle + angleVariation;
        const velocity = Math.random() * 120 + 80;
        
        // Trayectoria curva con puntos de control
        const finalX = Math.cos(angle) * velocity + (Math.random() - 0.5) * 50;
        const finalY = Math.sin(angle) * velocity * 0.6 + Math.random() * 150 + 100;
        const midX = finalX * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 80;
        const midY = -(Math.random() * 60 + 30) + Math.sin(angle) * 20;
        
        // Crear variables CSS para el movimiento orgánico
        confetti.style.setProperty('--final-x', finalX + 'px');
        confetti.style.setProperty('--final-y', finalY + 'px');
        confetti.style.setProperty('--mid-x', midX + 'px');
        confetti.style.setProperty('--mid-y', midY + 'px');
        
        // Rotación orgánica con variación
        const rotationSpeed = Math.random() * 3 + 1.5; // Velocidad variable
        const rotationDirection = Math.random() > 0.5 ? 1 : -1;
        const totalRotation = rotationSpeed * 360 * rotationDirection;
        confetti.style.setProperty('--rotations', totalRotation + 'deg');
        
        // Duración y retraso más orgánicos
        const baseDuration = 2.2;
        const durationVariation = (Math.random() - 0.5) * 1.0;
        const duration = baseDuration + durationVariation;
        const delay = Math.random() * 0.15 + (i * 0.01); // Delay escalonado
        
        // Función de easing más natural
        const easingFunctions = [
            'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            'cubic-bezier(0.165, 0.84, 0.44, 1)',
            'cubic-bezier(0.19, 1, 0.22, 1)',
            'cubic-bezier(0.23, 1, 0.32, 1)'
        ];
        const easing = easingFunctions[Math.floor(Math.random() * easingFunctions.length)];
        
        confetti.style.animation = `confetti-organic ${duration}s ${easing} ${delay}s forwards`;
        
        // Variaciones en el tamaño más orgánicas
        const baseSize = 5 + Math.random() * 4; // 5-9px base
        const aspectRatio = 0.7 + Math.random() * 0.6; // Ratio 0.7-1.3
        
        confetti.style.width = baseSize + 'px';
        confetti.style.height = (baseSize * aspectRatio) + 'px';
        
        // Formas más variadas
        const shapeRandom = Math.random();
        if (shapeRandom < 0.4) {
            confetti.style.borderRadius = '50%'; // Círculos
        } else if (shapeRandom < 0.7) {
            confetti.style.borderRadius = '2px'; // Rectángulos redondeados
        } else if (shapeRandom < 0.85) {
            confetti.style.borderRadius = '50% 0 50% 0'; // Formas orgánicas
        } else {
            confetti.style.borderRadius = '0 50% 0 50%'; // Formas asimétricas
        }
        
        // Agregar sutil efecto de sombra para más realismo
        confetti.style.boxShadow = `0 2px 4px rgba(0,0,0,0.1)`;
        
        document.body.appendChild(confetti);
        
        // Limpiar con tiempo variable
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, (duration + delay) * 1000 + 300);
    }
};

// Add click event to demo button
const setupConfettiButton = () => {
    setTimeout(() => {
        const demoButton = document.querySelector('.btn-secondary');
        if (demoButton) {
            demoButton.addEventListener('click', (e) => {
                e.preventDefault();
                const rect = e.target.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                createConfetti(x, y);
                setTimeout(() => {
                    // window.open deshabilitado para demo
                }, 2500);
            });
        }
    }, 1000);
};

// ============================================
// CONTACT FORM FUNCTIONALITY WITH EMAILJS
// ============================================

// Inicializar EmailJS cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que el archivo de configuración esté cargado
    if (typeof EMAIL_CONFIG === 'undefined') {
        return;
    }
    
    // Inicializar EmailJS con la configuración
    emailjs.init(EMAIL_CONFIG.publicKey);
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const nombreValue = document.getElementById('name').value.trim();
            const emailValue = document.getElementById('email').value.trim();
            const asuntoValue = document.getElementById('subject').value.trim();
            const mensajeValue = document.getElementById('message').value.trim();
            
            // Probar con TODAS las variaciones posibles de nombres de variables
            const templateParams = {
                // Español
                nombre: nombreValue,
                email: emailValue,
                asunto: asuntoValue,
                mensaje: mensajeValue,
                // Inglés
                name: nombreValue,
                from_name: nombreValue,
                from_email: emailValue,
                subject: asuntoValue,
                message: mensajeValue,
                // Reply
                reply_to: emailValue,
                to_email: 'nicolasluna.ca@gmail.com'
            };
            
            // Deshabilitar el botón de envío
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
            
            // Mostrar notificación de "enviando"
            showNotification('📨 Enviando tu mensaje...', 'info');
            
            // Enviar el email usando EmailJS
            emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
                .then(function(response) {
                    // Éxito - Delay más largo para mejor transición
                    setTimeout(function() {
                        showNotification('✅ ¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
                    }, 1500); // Aumentado a 1.5 segundos
                    
                    contactForm.reset();
                }, function(error) {
                    // Error - Delay más largo para mejor transición
                    setTimeout(function() {
                        showNotification('❌ Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctame directamente por email.', 'error');
                    }, 1500); // Aumentado a 1.5 segundos
                })
                .finally(function() {
                    // Rehabilitar el botón
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
        });
    }
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Eliminar notificaciones previas
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Determinar icono según el tipo
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'error') icon = 'exclamation-circle';
    else if (type === 'info') icon = 'paper-plane';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--bg-secondary, #1e1e1e);
                color: var(--text-primary, #fff);
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                max-width: 450px;
                font-size: 1rem;
                font-weight: 500;
                backdrop-filter: blur(10px);
            }
            
            .notification-success {
                border-left: 5px solid #10b981;
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, var(--bg-secondary, #1e1e1e) 100%);
            }
            
            .notification-success i {
                color: #10b981;
                font-size: 1.8rem;
            }
            
            .notification-error {
                border-left: 5px solid #ef4444;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, var(--bg-secondary, #1e1e1e) 100%);
            }
            
            .notification-error i {
                color: #ef4444;
                font-size: 1.8rem;
            }
            
            .notification-info {
                border-left: 5px solid #3b82f6;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, var(--bg-secondary, #1e1e1e) 100%);
            }
            
            .notification-info i {
                color: #3b82f6;
                font-size: 1.8rem;
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: calc(100% - 20px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar la notificación al body
    document.body.appendChild(notification);
    
    // Duración según el tipo de notificación (aumentada para mejor lectura)
    let duration = 8000; // Por defecto 8 segundos
    if (type === 'info') {
        duration = 3000; // 3 segundos para "Enviando..." (se reemplaza rápido por el éxito)
    } else if (type === 'success') {
        duration = 12000; // 12 segundos para éxito (tiempo suficiente para leer)
    } else if (type === 'error') {
        duration = 15000; // 15 segundos para errores (más tiempo porque son importantes)
    }
    
    // Remover la notificación después del tiempo especificado
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}
