// DOM Elements
const header = document.getElementById('header');
const contactForm = document.getElementById('contact-form');

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}



// Header scroll effect
function initHeaderScroll() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.section__header');
    sectionHeaders.forEach(el => {
        observer.observe(el);
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

// Form validation and submission
function initFormHandling() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const contact = formData.get('contact').trim();
            const business = formData.get('business').trim();
            
            // Basic validation
            if (!name || !contact) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            if (!validateContact(contact)) {
                showNotification('Пожалуйста, введите корректный Telegram или номер телефона', 'error');
                return;
            }
            
            // Prepare WhatsApp message
            const message = `Заявка с лендинга Tulkiflow:%0A%0A` +
                          `Имя: ${encodeURIComponent(name)}%0A` +
                          `Контакт: ${encodeURIComponent(contact)}%0A` +
                          `Бизнес: ${encodeURIComponent(business || 'Не указано')}`;
            
            const phone = "77027215915"; // Your WhatsApp number without +
            
            // Update button state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Перенаправление в WhatsApp...';
            submitButton.disabled = true;
            
            // Show notification and redirect to WhatsApp
            showNotification('Перенаправляем вас в WhatsApp для отправки заявки...', 'success');
            
            setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                
                // Reset form and button after redirect
                setTimeout(() => {
                    this.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    showNotification('Заявка подготовлена! Нажмите "Отправить" в WhatsApp для завершения.', 'success');
                }, 1000);
            }, 1500);
        });
    }
}

// Contact validation
function validateContact(contact) {
    // Telegram username pattern (@username or username)
    const telegramPattern = /^@?[A-Za-z0-9_]{5,32}$/;
    
    // Phone pattern (basic international format)
    const phonePattern = /^[\+]?[1-9][\d]{7,15}$/;
    
    return telegramPattern.test(contact) || phonePattern.test(contact.replace(/[\s\-\(\)]/g, ''));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<p class="message">${message}</p>`;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// CTA button handlers
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.hero__cta, .contact__cta, .header__cta');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const contactSection = document.getElementById('contacts');
            const form = document.getElementById('contact-form');
            
            if (contactSection && form) {
                const headerHeight = header.offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Focus on first input after scroll
                setTimeout(() => {
                    form.querySelector('input[name="name"]').focus();
                }, 800);
            }
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero__visual');
    
    if (heroSection && heroVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (scrolled < heroSection.offsetHeight) {
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[src$=".svg"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Tab navigation for mobile menu
        if (e.key === 'Tab' && mobileMenu.classList.contains('active')) {
            const focusableElements = mobileMenu.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Loading animation
function initLoadingAnimation() {
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero elements on load
        const heroElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__cta, .hero__note, .hero__visual');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
}

// Resize handler
function initResizeHandler() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        resizeTimer = setTimeout(function() {
            // Recalculate any layout-dependent features
            initParallaxEffect();
        }, 250);
    });
}

// Custom cursor effect (optional enhancement)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        const distance = Math.sqrt(Math.pow(mouseX - cursorX, 2) + Math.pow(mouseY - cursorY, 2));
        const speed = distance * 0.1;
        
        if (distance > 1) {
            cursorX += (mouseX - cursorX) * speed * 0.1;
            cursorY += (mouseY - cursorY) * speed * 0.1;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        }
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .pillar-card, .audience-card, .step-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initSmoothScrolling();
    initHeaderScroll();
    initScrollAnimations();
    initFormHandling();
    initCTAButtons();
    initKeyboardNavigation();
    initResizeHandler();
    
    // Enhanced features
    initParallaxEffect();
    initLazyLoading();
    initLoadingAnimation();
    
    // Optional: Enable custom cursor on desktop
    if (window.innerWidth > 1024) {
        // initCustomCursor(); // Uncomment to enable
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    console.log('Tulkiflow website initialized successfully! 🚀');
});

// Service Worker for performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for testing (if needed)
window.TulkiflowApp = {
    showNotification,
    validateContact
};