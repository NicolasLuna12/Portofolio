// GitHub Projects Module
// Constants
const GITHUB_USERNAME = 'NicolasLuna12';
const REPOS_PER_PAGE = 100;
const ISPC_FOOD_REPOS = ['backmobile1', 'frontprod', 'back2fa', 'backmp', 'Android-Tesis-2025'];
const PROJECT_I_DO_REPO = 'Proyectido';
const EXCLUDED_REPOS = ['nicolasluna12', 'NicolasLuna12', 'Portofolio', 'portofolio', 'Invitacion', 'invitacion'];
const STAR_WEIGHT = 1000000;

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');

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
            displayProjects(allRepos);
        } else {
            displayProjectsError();
        }
    } catch (error) {
        displayProjectsError();
    }
};

const displayProjects = (repos) => {
    const projectsGrid = document.getElementById('projects-grid');
    
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
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="subproject-link">
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
                    <a href="${component.url}" target="_blank" rel="noopener noreferrer" class="subproject-link">
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
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fab fa-github"></i>
                        Código
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
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
    const projectsGrid = document.getElementById('projects-grid');
    
    projectsGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-circle"></i>
            <p>No se pudieron cargar los proyectos. <a href="https://github.com/NicolasLuna12" target="_blank" rel="noopener noreferrer">Ver en GitHub</a></p>
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

// Export functions
window.loadGitHubProjects = loadGitHubProjects;
window.displayProjects = displayProjects;
window.displayProjectsError = displayProjectsError;
