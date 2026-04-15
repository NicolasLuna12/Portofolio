// Theme Management
const themeToggle = document.getElementById('theme-toggle');

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
    if (!themeToggle) return;

    themeToggle.setAttribute('data-theme-state', theme);

    if (theme === 'dark') {
        themeToggle.setAttribute('aria-label', 'Activar modo claro');
    } else {
        themeToggle.setAttribute('aria-label', 'Activar modo oscuro');
    }
};

// Export functions
window.initTheme = initTheme;
window.toggleTheme = toggleTheme;
