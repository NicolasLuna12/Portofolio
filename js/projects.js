// GitHub Projects Module
// Constants
const GITHUB_USERNAME = 'NicolasLuna12';
const REPOS_PER_PAGE = 100;
const ISPC_FOOD_REPOS = ['backmobile1', 'frontprod', 'back2fa', 'backmp', 'Android-Tesis-2025'];
const PROJECT_I_DO_REPO = 'Proyectido';
const EXCLUDED_REPOS = ['nicolasluna12', 'NicolasLuna12', 'Portofolio', 'portofolio', 'Invitacion', 'invitacion', 'NicolasLuna12.github.io'];
const STAR_WEIGHT = 1000000;
let cachedRepos = [];
let hadProjectsError = false;

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');

const PROJECT_TEXT = {
    es: {
        systemComponent: 'Componente del sistema',
        viewCode: 'Ver codigo',
        code: 'Codigo',
        demo: 'Demo',
        fullStack: 'Full Stack',
        systemComponents: 'Componentes del Sistema',
        ispcFoodTitle: 'Sistema ISPC Food',
        ispcFoodDescription: 'Sistema completo de gestion de alimentos con arquitectura de microservicios. Incluye backend Django, frontend Angular, app movil Android y servicios especializados para autenticacion 2FA y procesamiento de pagos con MercadoPago.',
        projectIDoTitle: 'Project I Do',
        projectIDoDescription: 'Sistema completo de gestion de tareas y proyectos con arquitectura moderna. Aplicacion web full stack con backend robusto, frontend responsive y aplicacion movil nativa en Kotlin para gestion de productividad en cualquier dispositivo.',
        defaultProjectDescription: 'Proyecto de desarrollo',
        loadingError: 'No se pudieron cargar los proyectos.',
        viewOnGithub: 'Ver en GitHub',
        fallbackTech: 'Backend'
    },
    en: {
        systemComponent: 'System component',
        viewCode: 'View code',
        code: 'Code',
        demo: 'Demo',
        fullStack: 'Full Stack',
        systemComponents: 'System Components',
        ispcFoodTitle: 'ISPC Food System',
        ispcFoodDescription: 'Comprehensive food management system built with microservices architecture. Includes Django backend, Angular frontend, Android mobile app, and specialized services for 2FA authentication and MercadoPago payment processing.',
        projectIDoTitle: 'Project I Do',
        projectIDoDescription: 'End-to-end task and project management system with a modern architecture. Full stack web app with robust backend, responsive frontend, and native Kotlin mobile app for productivity on any device.',
        defaultProjectDescription: 'Development project',
        loadingError: 'Projects could not be loaded.',
        viewOnGithub: 'View on GitHub',
        fallbackTech: 'Backend'
    }
};

const getCurrentLanguage = () => localStorage.getItem('lang') === 'en' ? 'en' : 'es';

const PROJECT_CONFIG = {
    'backmobile1': {
        displayName: {
            es: 'Backend Principal',
            en: 'Core Backend'
        },
        description: {
            es: 'API REST con Django - Gestion completa del sistema',
            en: 'Django REST API - Complete system management'
        },
        language: 'Python'
    },
    'frontprod': {
        displayName: {
            es: 'Frontend Web',
            en: 'Web Frontend'
        },
        description: {
            es: 'Interfaz de usuario con Angular - Panel administrativo',
            en: 'Angular user interface - Admin dashboard'
        },
        language: 'TypeScript'
    },
    'back2fa': {
        displayName: {
            es: 'Microservicio 2FA',
            en: '2FA Microservice'
        },
        description: {
            es: 'Autenticacion de dos factores - Seguridad avanzada',
            en: 'Two-factor authentication - Advanced security'
        },
        language: 'Python'
    },
    'backmp': {
        displayName: {
            es: 'Microservicio Pagos',
            en: 'Payments Microservice'
        },
        description: {
            es: 'Integracion MercadoPago - Procesamiento de pagos',
            en: 'MercadoPago integration - Payment processing'
        },
        language: 'Python'
    },
    'Android-Tesis-2025': {
        displayName: {
            es: 'App Android',
            en: 'Android App'
        },
        description: {
            es: 'Aplicacion movil nativa - Gestion de pedidos',
            en: 'Native mobile app - Order management'
        },
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

// GitHub Projects Integration
const loadGitHubProjects = async () => {
    if (!projectsGrid) return;
    
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
            cachedRepos = allRepos;
            hadProjectsError = false;
            displayProjects(allRepos);
        } else {
            cachedRepos = [];
            hadProjectsError = true;
            displayProjectsError();
        }
    } catch (error) {
        cachedRepos = [];
        hadProjectsError = true;
        displayProjectsError();
    }
};

const displayProjects = (repos) => {
    const projectsGrid = document.getElementById('projects-grid');
    const lang = getCurrentLanguage();
    const t = PROJECT_TEXT[lang];
    
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
                description: lang === 'en' ? 'Android app - Food management system' : 'Aplicacion Android - Sistema de gestion de alimentos',
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
            const displayName = config?.displayName?.[lang] || config?.displayName || repo.name;
            const customDescription = config?.description?.[lang] || config?.description || repo.description || t.systemComponent;
            const language = config?.language || repo.language;
            
            return `
                <div class="subproject-card">
                    <div class="subproject-header">
                        <h4 class="subproject-title">${displayName}</h4>
                        ${language ? `<span class="language-badge-small">${language}</span>` : ''}
                    </div>
                    <p class="subproject-description">${customDescription}</p>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="subproject-link">
                        <i class="fab fa-github"></i> ${t.viewCode}
                    </a>
                </div>
            `;
        }).join('');
        
        projectsHTML += `
            <div class="project-card project-card-main fade-in">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">
                            <i class="fas fa-utensils"></i> ${t.ispcFoodTitle}
                        </h3>
                    </div>
                    <div class="project-language">
                        <span class="language-badge">${t.fullStack}</span>
                    </div>
                </div>
                <p class="project-description">
                    ${t.ispcFoodDescription}
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
                        <i class="fas fa-layer-group"></i> ${t.systemComponents}
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
                title: lang === 'en' ? 'Mobile App' : 'App Movil',
                description: lang === 'en' ? 'Native Android app in Kotlin - Mobile management' : 'Aplicacion nativa Android en Kotlin - Gestion movil',
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
                    <a href="${component.url}" target="_blank" rel="noopener noreferrer" class="subproject-link">
                        <i class="fab fa-github"></i> ${t.viewCode}
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
                        <span class="language-badge">${t.fullStack}</span>
                    </div>
                </div>
                <p class="project-description">
                    ${t.projectIDoDescription}
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
                        <i class="fas fa-layer-group"></i> ${t.systemComponents}
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
        const customDescription = repo.description || t.defaultProjectDescription;
        
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
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fab fa-github"></i>
                        ${t.code}
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            ${t.demo}
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    projectsGrid.innerHTML = projectsHTML;
};

const displayProjectsError = () => {
    const projectsGrid = document.getElementById('projects-grid');
    const lang = getCurrentLanguage();
    const t = PROJECT_TEXT[lang];
    
    projectsGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-circle"></i>
            <p>${t.loadingError} <a href="https://github.com/NicolasLuna12" target="_blank" rel="noopener noreferrer">${t.viewOnGithub}</a></p>
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
    
    return languageMap[language] || [language || PROJECT_TEXT[getCurrentLanguage()].fallbackTech];
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
    
    return techStack.length > 0 ? techStack : [PROJECT_TEXT[getCurrentLanguage()].fallbackTech];
};

document.addEventListener('languageChanged', () => {
    if (cachedRepos.length > 0) {
        displayProjects(cachedRepos);
        return;
    }

    if (hadProjectsError) {
        displayProjectsError();
    }
});

// Export functions
window.loadGitHubProjects = loadGitHubProjects;
window.displayProjects = displayProjects;
window.displayProjectsError = displayProjectsError;
