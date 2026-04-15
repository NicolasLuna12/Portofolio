// Traductor simple
let currentLang = 'es';

const TRANSLATIONS = {
    es: {
        nav_home: 'Inicio',
        nav_about: 'Sobre mí',
        nav_skills: 'Tecnologías',
        nav_certificates: 'Certificados',
        nav_projects: 'Proyectos',
        nav_contact: 'Contacto',
        hero_badge: 'Disponible para nuevos proyectos 2026',
        hero_title_prefix: 'Hola, soy',
        hero_subtitle: 'Técnico Superior en Desarrollo Web y Aplicaciones Digitales',
        hero_description: 'Desarrollador Full Stack especializado en Python/Django, .NET y desarrollo móvil Android. Experiencia en sistemas legacy COBOL, arquitecturas web escalables, APIs RESTful y bases de datos relacionales. Enfocado en soluciones robustas y código limpio.',
        hero_btn_projects: 'Ver Proyectos',
        hero_btn_contact: 'Contactarme',
        about_title: 'Sobre Mí',
        about_description_1: 'Apasionado por resolver problemas complejos a través de la tecnología. Mi experiencia abarca desde el desarrollo de sistemas modernos hasta la modernización y mantenimiento de aplicaciones críticas de negocio, trabajando tanto en startups como en entornos corporativos.',
        about_description_2: 'Me impulsa crear soluciones que generen impacto real. He liderado el desarrollo de sistemas completos de e-commerce, aplicaciones móviles nativas y arquitecturas de microservicios escalables. Creo en el aprendizaje continuo, la colaboración en equipo y en compartir conocimiento con la comunidad de desarrolladores.',
        about_projects_stat: 'Proyectos',
        about_experience_stat: 'Años Experiencia',
        about_tech_stat: 'Tecnologías',
        experience_title: 'Experiencia Profesional',
        experience_subtitle: 'Mi trayectoria en desarrollo de software',
        experience_role_intern: 'Pasante en Desarrollo de Software',
        experience_desc_intern: 'Desarrollo de aplicaciones web empresariales utilizando .NET y Blazor. Implementación de funcionalidades CRUD, gestión de bases de datos SQL Server y creación de interfaces interactivas. Colaboración en equipos ágiles y participación en el ciclo completo de desarrollo.',
        experience_role_freelance: 'Desarrollador Full Stack Independiente',
        experience_company_freelance: 'Freelance',
        experience_period_current: '2024 - Presente',
        experience_desc_freelance: 'Desarrollo de soluciones personalizadas para clientes, incluyendo sistemas web completos, aplicaciones móviles y arquitecturas de microservicios. Especializado en Python/Django, React y desarrollo Android con Kotlin.',
        skills_title: 'Tecnologías',
        skills_subtitle: 'Tecnologías aprendidas en mi formación técnica superior y experiencia profesional',
        skills_meta_backend: 'Arquitectura de negocio, APIs y lógica de dominio',
        skills_meta_database: 'Modelado relacional, performance y persistencia',
        skills_meta_devops: 'Versionado, contenedores y despliegues',
        skills_meta_web: 'Interfaces modernas y experiencia de usuario',
        skills_meta_mobile: 'Apps nativas y consumo de servicios backend',
        certificates_title: 'Certificaciones',
        certificates_subtitle: 'Certificados profesionales y badges obtenidos en plataformas reconocidas',
        projects_title: 'Portfolio de Proyectos',
        projects_subtitle: 'Selección de proyectos backend que demuestran mi experiencia técnica',
        projects_loading: 'Cargando proyectos desde GitHub...',
        contact_title: 'Contacto Profesional',
        contact_subtitle: '¿Interesado en colaborar? Conectemos para discutir oportunidades',
        contact_info_title: 'Información de Contacto',
        contact_location: 'Córdoba, Argentina',
        contact_availability: 'Disponible para todo tipo de proyectos',
        contact_download_cv: 'Descargar CV',
        contact_form_name: 'Nombre',
        contact_form_email: 'Email',
        contact_form_subject: 'Asunto',
        contact_form_message: 'Mensaje',
        contact_form_send: 'Enviar Mensaje'
    },
    en: {
        nav_home: 'Home',
        nav_about: 'About',
        nav_skills: 'Stack',
        nav_certificates: 'Certificates',
        nav_projects: 'Projects',
        nav_contact: 'Contact',
        hero_badge: 'Available for new projects in 2026',
        hero_title_prefix: "Hi, I'm",
        hero_subtitle: 'Web Development and Digital Applications Technician',
        hero_description: 'Full Stack Developer specialized in Python/Django, .NET and Android mobile development. Experience in legacy COBOL systems, scalable web architectures, RESTful APIs and relational databases. Focused on robust solutions and clean code.',
        hero_btn_projects: 'View Projects',
        hero_btn_contact: 'Contact Me',
        about_title: 'About Me',
        about_description_1: 'Passionate about solving complex problems through technology. My experience ranges from building modern systems to modernizing and maintaining mission-critical business applications, working in both startups and corporate environments.',
        about_description_2: 'I am driven to create solutions with real impact. I have led the development of end-to-end e-commerce systems, native mobile applications, and scalable microservices architectures. I believe in continuous learning, teamwork, and sharing knowledge with the developer community.',
        about_projects_stat: 'Projects',
        about_experience_stat: 'Years Experience',
        about_tech_stat: 'Technologies',
        experience_title: 'Professional Experience',
        experience_subtitle: 'My journey in software development',
        experience_role_intern: 'Software Development Intern',
        experience_desc_intern: 'Developed enterprise web applications using .NET and Blazor. Implemented CRUD features, managed SQL Server databases, and built interactive interfaces. Collaborated in agile teams and participated in the full development lifecycle.',
        experience_role_freelance: 'Independent Full Stack Developer',
        experience_company_freelance: 'Freelance',
        experience_period_current: '2024 - Present',
        experience_desc_freelance: 'Built custom solutions for clients, including complete web systems, mobile applications, and microservices architectures. Specialized in Python/Django, React, and Android development with Kotlin.',
        skills_title: 'Tech Stack',
        skills_subtitle: 'Technologies learned through my higher technical education and professional experience',
        skills_meta_backend: 'Business architecture, APIs and domain logic',
        skills_meta_database: 'Relational modeling, performance and persistence',
        skills_meta_devops: 'Versioning, containers and deployments',
        skills_meta_web: 'Modern interfaces and user experience',
        skills_meta_mobile: 'Native apps and backend service integration',
        certificates_title: 'Certifications',
        certificates_subtitle: 'Professional certificates and badges earned on recognized platforms',
        projects_title: 'Project Portfolio',
        projects_subtitle: 'A selection of backend projects that showcase my technical expertise',
        projects_loading: 'Loading projects from GitHub...',
        contact_title: 'Professional Contact',
        contact_subtitle: 'Interested in collaborating? Let us connect to discuss opportunities',
        contact_info_title: 'Contact Information',
        contact_location: 'Cordoba, Argentina',
        contact_availability: 'Available for all kinds of projects',
        contact_download_cv: 'Download CV',
        contact_form_name: 'Name',
        contact_form_email: 'Email',
        contact_form_subject: 'Subject',
        contact_form_message: 'Message',
        contact_form_send: 'Send Message'
    }
};

function applyLanguage(lang) {
    currentLang = lang;

    // Traduccion por clave para el resto de la pagina
    document.querySelectorAll('[data-translate]').forEach((element) => {
        const key = element.getAttribute('data-translate');
        const translatedText = TRANSLATIONS[currentLang]?.[key];

        if (translatedText) {
            element.textContent = translatedText;
        }
    });

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        const langCode = langBtn.querySelector('.lang-code');
        if (langCode) {
            langCode.textContent = currentLang === 'es' ? 'ES' : 'EN';
        }

        if (currentLang === 'es') {
            langBtn.setAttribute('aria-label', 'Switch language to English');
        } else {
            langBtn.setAttribute('aria-label', 'Cambiar idioma a español');
        }
    }

    document.documentElement.lang = currentLang;
    localStorage.setItem('lang', currentLang);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

function toggleLanguage() {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    applyLanguage(nextLang);
}

// Inicializar cuando carga la pagina
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('lang');
    const initialLang = savedLang === 'en' ? 'en' : 'es';

    applyLanguage(initialLang);

    const langToggleButton = document.getElementById('lang-toggle');
    if (langToggleButton) {
        langToggleButton.addEventListener('click', toggleLanguage);
    }
});
