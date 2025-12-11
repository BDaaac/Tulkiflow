// Enhanced WhatsApp compatibility fix
// Add this script to improve compatibility across different browsers and devices

(function() {
    'use strict';
    
    // Wait for DOM to load
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState !== 'loading') fn();
            });
        }
    }
    
    // Enhanced WhatsApp opener
    function openWhatsApp(phone, message) {
        var whatsappUrl = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
        var webUrl = 'https://web.whatsapp.com/send?phone=' + phone + '&text=' + encodeURIComponent(message);
        
        // Check if mobile device
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Try WhatsApp app first
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'whatsapp://send?phone=' + phone + '&text=' + encodeURIComponent(message);
            document.body.appendChild(iframe);
            
            // Fallback to web after short delay
            setTimeout(function() {
                document.body.removeChild(iframe);
                window.open(whatsappUrl, '_blank') || (window.location = whatsappUrl);
            }, 1000);
        } else {
            // Desktop - try web WhatsApp
            var opened = window.open(webUrl, '_blank', 'noopener,noreferrer');
            if (!opened) {
                // Fallback to mobile web
                window.open(whatsappUrl, '_blank') || (window.location = whatsappUrl);
            }
        }
    }
    
    // Add click handlers when DOM is ready
    ready(function() {
        // Find all CTA buttons more reliably
        var selectors = [
            '.hero__cta',
            '.header__cta', 
            'button[class*="cta"]',
            '.btn-primary',
            'button:contains("Получить консультацию")',
            'a:contains("Получить консультацию")'
        ];
        
        var allButtons = document.querySelectorAll('button, a, .btn');
        
        for (var i = 0; i < allButtons.length; i++) {
            var btn = allButtons[i];
            var text = btn.textContent || btn.innerText || '';
            
            if (text.indexOf('Получить консультацию') !== -1 && btn.type !== 'submit') {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Try to scroll to form first
                    var contactForm = document.getElementById('contacts');
                    if (contactForm) {
                        if (contactForm.scrollIntoView) {
                            contactForm.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            contactForm.scrollIntoView();
                        }
                        
                        setTimeout(function() {
                            var firstInput = contactForm.querySelector('input[type="text"], input[type="tel"], input[name="name"]');
                            if (firstInput && firstInput.focus) {
                                firstInput.focus();
                            }
                        }, 800);
                    } else {
                        // Direct WhatsApp if no form
                        openWhatsApp("77027215915", "Привет! Меня интересует консультация по Tulkiflow");
                    }
                });
            }
        }
        
        // Enhance form submission
        var contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                var formElements = this.elements;
                var name = '';
                var contact = '';
                var business = '';
                
                // Get form data reliably
                for (var i = 0; i < formElements.length; i++) {
                    var element = formElements[i];
                    if (element.name === 'name') name = element.value || '';
                    if (element.name === 'contact') contact = element.value || '';
                    if (element.name === 'business') business = element.value || '';
                }
                
                name = name.trim();
                contact = contact.trim();
                business = business.trim();
                
                // Validation
                if (!name || !contact) {
                    alert('Пожалуйста, заполните все обязательные поля');
                    return;
                }
                
                // Simple phone validation
                var phoneRegex = /[\d\+\-\(\)\s]{7,}/;
                if (!phoneRegex.test(contact)) {
                    alert('Пожалуйста, введите корректный номер телефона');
                    return;
                }
                
                // Prepare message
                var message = 'Заявка с лендинга Tulkiflow:\n\n' +
                             'Имя: ' + name + '\n' +
                             'Контакт: ' + contact + '\n' +
                             'Бизнес: ' + (business || 'Не указано');
                
                // Update button
                var submitBtn = this.querySelector('button[type="submit"]');
                var originalText = '';
                if (submitBtn) {
                    originalText = submitBtn.textContent || submitBtn.innerText;
                    submitBtn.textContent = 'Перенаправление...';
                    submitBtn.disabled = true;
                }
                
                // Send to WhatsApp
                openWhatsApp("77027215915", message);
                
                // Reset after delay
                setTimeout(function() {
                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                    contactForm.reset();
                }, 3000);
            });
        }
    });
})();