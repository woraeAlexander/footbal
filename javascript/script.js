/* ================================================================
   SRC SPORTS ACADEMY - JAVASCRIPT
   Interactivity, Forms, Search, and Utilities
   ================================================================ */

// ================================================================
// 1. HAMBURGER MENU TOGGLE
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// ================================================================
// 2. VISITOR COUNTER
// ================================================================
function initializeVisitorCounter() {
    const counterDisplay = document.getElementById('visitor-count');
    
    if (counterDisplay) {
        // Get count from localStorage or sessionStorage
        let visitCount = localStorage.getItem('visitCount');
        
        if (!visitCount) {
            visitCount = 0;
        }
        
        visitCount = parseInt(visitCount) + 1;
        localStorage.setItem('visitCount', visitCount);
        
        // Display the count
        counterDisplay.textContent = visitCount.toLocaleString();
        
        // Also update sessionStorage for current session
        sessionStorage.setItem('currentSessionVisit', new Date().toLocaleString());
    }
}

// ================================================================
// 3. SEARCH FUNCTIONALITY
// ================================================================
function initializeSearch() {
    const searchForm = document.querySelector('.search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = document.querySelector('.search-input');
            const query = searchInput.value.trim().toLowerCase();
            
            if (query === '') {
                alert('Please enter a search term');
                return;
            }
            
            // Simulate search functionality
            console.log('Searching for:', query);
            
            // Search through visible content on page
            const searchableContent = document.body.innerText.toLowerCase();
            
            if (searchableContent.includes(query)) {
                alert('Found matches for "' + query + '". In production, this would show filtered results.');
                // In production, you would redirect to a search results page
            } else {
                alert('No matches found for "' + query + '"');
            }
            
            searchInput.value = '';
        });
    }
}

// ================================================================
// 4. FORM VALIDATION
// ================================================================
function validateForm(formId) {
    const form = document.getElementById(formId);
    
    if (!form) return true;
    
    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            showFormErrors(form);
        } else {
            // Validate CAPTCHA if present
            const captchaInput = form.querySelector('[name="captcha"]');
            if (captchaInput) {
                if (!validateCaptcha(form)) {
                    e.preventDefault();
                    alert('CAPTCHA verification failed. Please try again.');
                    return false;
                }
            }
            
            // Validate email if present
            const emailInputs = form.querySelectorAll('input[type="email"]');
            emailInputs.forEach(input => {
                if (!validateEmail(input.value)) {
                    e.preventDefault();
                    alert('Please enter a valid email address');
                    input.focus();
                }
            });
        }
        
        form.classList.add('was-validated');
    }, false);
}

function showFormErrors(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.style.borderColor = '#e74c3c';
            
            // Show error message
            const errorMsg = getErrorMessage(input);
            const existingError = input.parentElement.querySelector('.error-message');
            
            if (!existingError && errorMsg) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = '#e74c3c';
                errorDiv.style.fontSize = '0.875rem';
                errorDiv.style.marginTop = '0.25rem';
                errorDiv.textContent = errorMsg;
                input.parentElement.appendChild(errorDiv);
            }
        } else {
            input.style.borderColor = '';
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
}

function getErrorMessage(input) {
    if (input.validity.valueMissing) {
        return `${input.previousElementSibling ? input.previousElementSibling.textContent : 'This field'} is required`;
    }
    if (input.validity.typeMismatch) {
        if (input.type === 'email') {
            return 'Please enter a valid email address';
        }
        if (input.type === 'tel') {
            return 'Please enter a valid phone number';
        }
    }
    if (input.validity.tooShort) {
        return `Minimum length is ${input.minLength} characters`;
    }
    if (input.validity.rangeUnderflow) {
        return `Minimum value is ${input.min}`;
    }
    if (input.validity.rangeOverflow) {
        return `Maximum value is ${input.max}`;
    }
    return 'Please enter a valid value';
}

// ================================================================
// 5. EMAIL VALIDATION
// ================================================================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ================================================================
// 6. CAPTCHA VERIFICATION
// ================================================================
function validateCaptcha(form) {
    const captchaQuestion = form.querySelector('[id$="-captcha-question"]');
    const captchaInput = form.querySelector('[name="captcha"]');
    
    if (!captchaQuestion || !captchaInput) return true;
    
    const question = captchaQuestion.textContent;
    const answer = captchaInput.value.trim();
    
    // Simple CAPTCHA validation
    // Questions: "What is 5 + 3?" = 8, "What is 3 × 7?" = 21
    const correctAnswers = {
        'What is 5 + 3?': ['8', 'eight'],
        'What is 3 × 7?': ['21', 'twenty-one'],
        'What is 10 - 2?': ['8', 'eight'],
        'What is 2 × 5?': ['10', 'ten']
    };
    
    if (correctAnswers[question]) {
        return correctAnswers[question].includes(answer.toLowerCase());
    }
    
    return false;
}

// ================================================================
// 7. SMOOTH SCROLLING FOR ANCHOR LINKS
// ================================================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================================================
// 8. NEWSLETTER SUBSCRIPTION
// ================================================================
function initializeNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate subscription
            localStorage.setItem('subscribedEmail', email);
            alert('Thank you for subscribing! Check your email for confirmation.');
            
            emailInput.value = '';
        });
    });
}

// ================================================================
// 9. REGISTRATION & BOOKING FORM HANDLING
// ================================================================
function initializeFormHandlers() {
    const registrationForm = document.getElementById('registrationForm');
    const bookingForm = document.getElementById('bookingForm');
    
    if (registrationForm) {
        validateForm('registrationForm');
        
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('was-validated')) {
                // Form is valid, simulate submission
                const formData = new FormData(this);
                simulateFormSubmission('Registration', formData);
                this.reset();
            }
        });
    }
    
    if (bookingForm) {
        validateForm('bookingForm');
        
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('was-validated')) {
                // Form is valid, simulate submission
                const formData = new FormData(this);
                simulateFormSubmission('Booking', formData);
                this.reset();
            }
        });
    }
}

function simulateFormSubmission(formType, formData) {
    // In production, this would send data to a server
    console.log(formType + ' Form Data:', Object.fromEntries(formData));
    
    alert(formType + ' submitted successfully!\n\nIn production, this would be sent to the server.\nFor now, check the browser console for details.');
    
    // Store submission in localStorage for reference
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push({
        type: formType,
        timestamp: new Date().toLocaleString(),
        data: Object.fromEntries(formData)
    });
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
}

// ================================================================
// 10. KEYBOARD ACCESSIBILITY
// ================================================================
function initializeKeyboardAccessibility() {
    // Add keyboard support for custom elements
    const details = document.querySelectorAll('details');
    
    details.forEach(detail => {
        const summary = detail.querySelector('summary');
        
        if (summary) {
            summary.setAttribute('role', 'button');
            summary.setAttribute('tabindex', '0');
            
            summary.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    detail.open = !detail.open;
                }
            });
        }
    });
}

// ================================================================
// 11. LANGUAGE & THEME PREFERENCES
// ================================================================
function loadUserPreferences() {
    const theme = localStorage.getItem('theme') || 'light';
    applyTheme(theme);
    
    const language = localStorage.getItem('language') || 'en';
    // In production, load appropriate language strings
}

function applyTheme(theme) {
    // In production, this would switch CSS themes
    document.documentElement.setAttribute('data-theme', theme);
}

// ================================================================
// 12. ANALYTICS & TRACKING (GDPR Compliant)
// ================================================================
function trackPageView() {
    const currentPage = window.location.pathname;
    const timestamp = new Date().toISOString();
    
    // Store page view locally
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
    pageViews.push({
        page: currentPage,
        timestamp: timestamp
    });
    
    // Keep only last 50 page views
    if (pageViews.length > 50) {
        pageViews.shift();
    }
    
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
}

// ================================================================
// 13. INITIALIZE ALL FUNCTIONS ON PAGE LOAD
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeVisitorCounter();
    initializeSearch();
    initializeNewsletter();
    initializeFormHandlers();
    initializeSmoothScroll();
    initializeKeyboardAccessibility();
    loadUserPreferences();
    trackPageView();
    
    // Log initialization
    console.log('SRC Sports Academy - All features initialized');
});

// ================================================================
// 14. UTILITY FUNCTIONS
// ================================================================

/**
 * Format numbers with thousands separator
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Get URL parameters
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ================================================================
// 15. ERROR HANDLING
// ================================================================
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    // In production, send error to logging service
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // In production, send error to logging service
});

// ================================================================
// 16. PERFORMANCE OPTIMIZATION
// ================================================================

// Lazy load images (optional, for images with data-src attribute)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ================================================================
// 17. CONSOLE WELCOME MESSAGE
// ================================================================
console.log(`
%c🏅 Welcome to SRC Sports Academy Website 🏅
%cVersion 1.0 | Developed with modern web standards
%cFor accessibility support, use keyboard navigation (Tab, Enter, Arrow Keys)

Visit our social media for updates and announcements!
`, 'font-size: 18px; font-weight: bold; color: #e74c3c;', 'font-size: 12px; color: #3498db;', 'font-size: 12px; color: #27ae60;');
