// Contact Form Module with EmailJS

// DOM Element
const contactForm = document.getElementById('contact-form');

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

// Export functions
window.setupContactForm = setupContactForm;
