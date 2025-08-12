// Traductor simple
let currentLang = 'es';

function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    
    // Cambiar todos los elementos con data-es y data-en
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = element.getAttribute('data-' + currentLang);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Cambiar el texto del botón
    const langBtn = document.getElementById('lang-toggle');
    langBtn.textContent = currentLang === 'es' ? 'ES' : 'EN';
    
    // Cambiar el idioma del documento
    document.documentElement.lang = currentLang;
    
    // Guardar preferencia
    localStorage.setItem('lang', currentLang);
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Recuperar idioma guardado
    const savedLang = localStorage.getItem('lang');
    if (savedLang && savedLang === 'en') {
        toggleLanguage();
    }
    
    // Conectar el botón
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
});
