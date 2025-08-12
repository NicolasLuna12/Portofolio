// Internacionalización (i18n) para el Portfolio
class Internationalization {
    constructor() {
        this.currentLang = localStorage.getItem('portfolio-lang') || 'es';
        this.translations = {
            es: {
                // Navegación
                nav_home: 'Inicio',
                nav_about: 'Sobre mí',
                nav_skills: 'Skills',
                nav_projects: 'Proyectos',
                nav_contact: 'Contacto',
                
                // Hero Section
                hero_hello: 'Hola, soy',
                hero_title: 'Técnico Superior en Desarrollo Web y Aplicaciones Móviles',
                hero_description: 'Técnico especializado en desarrollo backend con Python/Django y sistemas legacy COBOL. Experiencia en arquitecturas web escalables, APIs RESTful, bases de datos relacionales y desarrollo de aplicaciones móviles. Enfocado en soluciones robustas y código limpio.',
                hero_projects_btn: 'Ver Proyectos',
                hero_contact_btn: 'Contactarme',
                
                // About Section
                about_title: 'Sobre Mí',
                about_subtitle: 'Especializado en desarrollo web y aplicaciones móviles',
                about_description_1: 'Con 3+ años de experiencia en desarrollo de sistemas backend robustos y escalables. Especializado en Python/Django para aplicaciones web modernas y COBOL para mantenimiento de sistemas legacy empresariales.',
                about_description_2: 'Mi formación técnica incluye diseño de APIs RESTful, optimización de bases de datos SQL/NoSQL, desarrollo de aplicaciones móviles y despliegues en cloud (AWS/Google Cloud). Comprometido con las mejores prácticas: código limpio, testing automatizado y documentación técnica profesional.',
                about_projects_stat: 'Proyectos',
                about_experience_stat: 'Años Experiencia',
                about_tech_stat: 'Tecnologías',
                about_counting: 'Y contando...',
                
                // Skills Section
                skills_title: 'Stack Tecnológico',
                skills_subtitle: 'Tecnologías aprendidas en mi formación técnica superior y experiencia profesional',
                
                // Projects Section
                projects_title: 'Portfolio de Proyectos',
                projects_subtitle: 'Selección de proyectos backend que demuestran mi experiencia técnica',
                projects_loading: 'Cargando proyectos desde GitHub...',
                projects_view_more: 'Ver más en GitHub',
                projects_view_demo: 'Ver Demo',
                
                // Contact Section
                contact_title: 'Contacto Profesional',
                contact_subtitle: '¿Interesado en colaborar? Conectemos para discutir oportunidades',
                contact_info_title: 'Información de Contacto',
                contact_location: 'Córdoba, Argentina',
                contact_availability: 'Disponible para todo tipo de proyectos',
                contact_form_name: 'Nombre',
                contact_form_email: 'Email',
                contact_form_subject: 'Asunto',
                contact_form_message: 'Mensaje',
                contact_form_send: 'Enviar Mensaje',
                
                // Footer
                footer_rights: 'Todos los derechos reservados.',
                footer_passion: 'Desarrollado con pasión por el código limpio'
            },
            en: {
                // Navigation
                nav_home: 'Home',
                nav_about: 'About',
                nav_skills: 'Skills',
                nav_projects: 'Projects',
                nav_contact: 'Contact',
                
                // Hero Section
                hero_hello: 'Hi, I\'m',
                hero_title: 'Senior Web & Mobile Application Developer',
                hero_description: 'Technical specialist in backend development with Python/Django and legacy COBOL systems. Experience in scalable web architectures, RESTful APIs, relational databases and mobile application development. Focused on robust solutions and clean code.',
                hero_projects_btn: 'View Projects',
                hero_contact_btn: 'Contact Me',
                
                // About Section
                about_title: 'About Me',
                about_subtitle: 'Specialized in web and mobile application development',
                about_description_1: 'With 3+ years of experience developing robust and scalable backend systems. Specialized in Python/Django for modern web applications and COBOL for enterprise legacy system maintenance.',
                about_description_2: 'My technical training includes RESTful API design, SQL/NoSQL database optimization, mobile application development, and cloud deployments (AWS/Google Cloud). Committed to best practices: clean code, automated testing, and professional technical documentation.',
                about_projects_stat: 'Projects',
                about_experience_stat: 'Years Experience',
                about_tech_stat: 'Technologies',
                about_counting: 'And counting...',
                
                // Skills Section
                skills_title: 'Technology Stack',
                skills_subtitle: 'Technologies learned in my technical education and professional experience',
                
                // Projects Section
                projects_title: 'Project Portfolio',
                projects_subtitle: 'Selection of backend projects that demonstrate my technical experience',
                projects_loading: 'Loading projects from GitHub...',
                projects_view_more: 'View more on GitHub',
                projects_view_demo: 'View Demo',
                
                // Contact Section
                contact_title: 'Professional Contact',
                contact_subtitle: 'Interested in collaborating? Let\'s connect to discuss opportunities',
                contact_info_title: 'Contact Information',
                contact_location: 'Córdoba, Argentina',
                contact_availability: 'Available for all types of projects',
                contact_form_name: 'Name',
                contact_form_email: 'Email',
                contact_form_subject: 'Subject',
                contact_form_message: 'Message',
                contact_form_send: 'Send Message',
                
                // Footer
                footer_rights: 'All rights reserved.',
                footer_passion: 'Developed with passion for clean code'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupLanguageToggle();
        this.translatePage();
    }
    
    setupLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }
    
    toggleLanguage() {
        this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('portfolio-lang', this.currentLang);
        this.translatePage();
        this.updateLanguageButton();
    }
    
    updateLanguageButton() {
        const langToggle = document.getElementById('lang-toggle');
        const langText = langToggle.querySelector('.lang-text');
        
        if (this.currentLang === 'en') {
            langText.textContent = 'US';
        } else {
            langText.textContent = 'ES';
        }
    }
    
    translatePage() {
        document.documentElement.lang = this.currentLang;
        
        // Traduce elementos con atributo data-translate
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[this.currentLang][key];
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Traduce elementos específicos que no tienen data-translate
        this.translateSpecificElements();
        this.updateLanguageButton();
    }
    
    translateSpecificElements() {
        // Actualiza el title del documento
        if (this.currentLang === 'en') {
            document.title = 'Nicolas Luna - Senior Web & Mobile App Developer';
        } else {
            document.title = 'Nicolas Luna - Técnico Superior en Desarrollo Web y Apps Móviles';
        }
        
        // Traduce estadísticas
        const statsLabels = document.querySelectorAll('.stat-label');
        const statsTranslations = {
            es: ['Proyectos', 'Años Experiencia', 'Tecnologías'],
            en: ['Projects', 'Years Experience', 'Technologies']
        };
        
        statsLabels.forEach((label, index) => {
            if (statsTranslations[this.currentLang][index]) {
                label.textContent = statsTranslations[this.currentLang][index];
            }
        });
        
        // Traduce el footer
        const footerTexts = document.querySelectorAll('.footer-bottom p');
        if (footerTexts.length >= 2) {
            footerTexts[0].innerHTML = `&copy; 2025 Nicolas Luna. ${this.translations[this.currentLang].footer_rights}`;
            footerTexts[1].textContent = this.translations[this.currentLang].footer_passion;
        }
    }
}

// Inicializar la internacionalización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new Internationalization();
});
