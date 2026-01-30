// Certificate Carousel Module

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

// Export functions
window.initCertificatesCarousel = initCertificatesCarousel;
window.initCertificateModal = initCertificateModal;
window.loadPDFPreviews = loadPDFPreviews;
