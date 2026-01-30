# Portafolio - Estructura Modular

## 📁 Estructura del Proyecto

```
Portofolio/
├── index.html          # Página principal
├── styles.css          # Punto de entrada CSS (importa módulos)
├── CNAME              # Configuración dominio
│
├── css/               # Módulos CSS
│   ├── variables.css  # Variables y temas
│   ├── base.css       # Estilos base
│   ├── navigation.css # Navegación y header
│   ├── components.css # Componentes reutilizables
│   ├── sections.css   # Secciones específicas
│   └── responsive.css # Media queries
│
├── js/                # Módulos JavaScript
│   ├── config.js      # Configuración EmailJS
│   ├── translator.js  # Sistema de traducción
│   ├── theme.js       # Gestión tema dark/light
│   ├── navigation.js  # Navegación y scroll
│   ├── animations.js  # Animaciones y efectos
│   ├── carousel.js    # Carrusel de certificados
│   ├── projects.js    # Integración GitHub API
│   ├── contact.js     # Formulario de contacto
│   └── main.js        # Inicialización general
│
├── certificados/      # PDFs de certificados
└── backup/           # Archivos originales
    ├── script.backup.js
    └── styles.backup.css
```

## 🎨 Módulos CSS

### `variables.css`
- Variables CSS personalizadas
- Colores para tema claro y oscuro
- Transiciones y efectos

### `base.css`
- Estilos globales y reset
- Tipografía base
- Elementos comunes

### `navigation.css`
- Header y navegación
- Menú móvil (hamburger)
- Estados activos

### `components.css`
- Botones y enlaces
- Tarjetas (cards)
- Modales y overlays
- Componentes reutilizables

### `sections.css`
- Hero
- About
- Skills (Stack)
- Certificates
- Projects
- Contact

### `responsive.css`
- Breakpoints y media queries
- Ajustes móviles y tablet
- Optimización para diferentes pantallas

## 🚀 Módulos JavaScript

### `config.js`
- Configuración de EmailJS
- Credenciales de servicio
- **No modificar sin conocer las claves**

### `translator.js`
- Sistema de traducción ES/EN
- Gestión de idioma activo
- Persistencia en localStorage

### `theme.js`
**Funciones exportadas:**
- `initTheme()` - Inicializa tema desde localStorage
- `toggleTheme()` - Alterna entre light/dark
- `updateThemeIcon()` - Actualiza icono del botón

### `navigation.js`
**Funciones exportadas:**
- `setupSmoothScrolling()` - Scroll suave en enlaces
- `updateActiveNavLink()` - Actualiza link activo al hacer scroll
- `toggleMobileMenu()` - Abre/cierra menú móvil

### `animations.js`
**Funciones exportadas:**
- `animateCounters()` - Anima contadores numéricos
- `observeElements()` - Fade-in al entrar en viewport
- `typeWriter()` - Efecto máquina de escribir
- `handleParallax()` - Efecto parallax en hero

### `carousel.js`
**Funciones exportadas:**
- `initCertificatesCarousel()` - Inicializa carrusel
- `initCertificateModal()` - Modal para ver PDFs
- `loadPDFPreviews()` - Carga previews con PDF.js
- `openCertificateModal(url)` - Abre modal (global)

### `projects.js`
**Funciones exportadas:**
- `loadGitHubProjects()` - Carga repos desde GitHub API
- `displayProjects(repos)` - Renderiza tarjetas de proyectos
- `displayProjectsError()` - Muestra error de carga

### `contact.js`
**Funciones exportadas:**
- `setupContactForm()` - Configura formulario con EmailJS
- Validación de campos
- Feedback visual en botón de envío

### `main.js`
**Funciones exportadas:**
- `portfolioInit()` - Función de inicialización principal
- Orquesta todos los módulos
- Configura event listeners globales

## 🔧 Cómo Funciona

1. **Carga de módulos**: El HTML carga todos los scripts con `defer` en orden
2. **Exportación**: Cada módulo exporta funciones al objeto `window`
3. **Inicialización**: `main.js` ejecuta todo cuando el DOM está listo
4. **Independencia**: Cada módulo puede funcionar por separado

## 📝 Modificaciones Futuras

### Para agregar una nueva característica:

1. Crea un nuevo archivo en `/js` (ej: `feature.js`)
2. Exporta las funciones necesarias a `window`
3. Agrega el script en `index.html` antes de `main.js`
4. Llama a las funciones desde `main.js`

### Para modificar estilos:

1. Identifica el módulo CSS correspondiente
2. Edita solo ese archivo
3. Los cambios se reflejan automáticamente (CSS usa @import)

## ⚠️ Importante

- **NO eliminar** archivos de `/backup`
- **EmailJS**: `config.js` contiene credenciales sensibles
- **PDF.js**: Necesario para preview de certificados
- **Módulos**: Todos deben cargarse para funcionamiento completo

## 🌐 Deploy

El portfolio está configurado para:
- **GitHub Pages**: Netlify, Vercel, etc.
- **Dominio**: nicolasluna.dev (configurado en CNAME)
- **CDNs**: Font Awesome, PDF.js, EmailJS desde CDN

---

**Autor**: Nicolás Luna  
**Versión**: 2.0 (Modular)  
**Última actualización**: 2025
