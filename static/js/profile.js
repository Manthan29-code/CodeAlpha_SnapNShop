// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize responsive behavior
    initializeResponsiveBehavior();
    
    // Initialize animations
    // initializeAnimations();
    
    // Initialize tooltips and other interactive elements
    initializeInteractiveElements();
}

function initializeFormValidation() {
    const profileForm = document.getElementById('profileForm');
    const updateBtn = document.getElementById('updateBtn');
    
    if (profileForm && updateBtn) {
        // Real-time validation
        const inputs = profileForm.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateInput(this);
                updateFormState();
            });
            
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
        
        // Form submission handling
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                updateBtn.classList.add('loading');
                updateBtn.disabled = true;
                updateBtn.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Updating...';
                
                // Submit the form
                setTimeout(() => {
                    this.submit();
                }, 500);
            }
        });
    }
}

function validateInput(input) {
    const value = input.value.trim();
    const name = input.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    input.classList.remove('is-invalid', 'is-valid');
    
    // Basic required validation
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Specific validations
        switch (name) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
                
            case 'username':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Username must be at least 3 characters long';
                } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Username can only contain letters, numbers, hyphens, and underscores';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
        }
    }
    
    // Apply validation styling
    if (isValid) {
        input.classList.add('is-valid');
        removeErrorMessage(input);
    } else {
        input.classList.add('is-invalid');
        showErrorMessage(input, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(input, message) {
    removeErrorMessage(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(input) {
    const existingError = input.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

function validateForm() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

function updateFormState() {
    const updateBtn = document.getElementById('updateBtn');
    const isValid = validateForm();
    
    if (updateBtn) {
        updateBtn.disabled = !isValid;
        
        if (isValid) {
            updateBtn.classList.remove('btn-secondary');
            updateBtn.classList.add('btn-primary');
        } else {
            updateBtn.classList.remove('btn-primary');
            updateBtn.classList.add('btn-secondary');
        }
    }
}

function initializeResponsiveBehavior() {
    // Handle responsive card heights
    function adjustCardHeights() {
        const cards = document.querySelectorAll('.profile-card');
        const windowWidth = window.innerWidth;
        
        cards.forEach(card => {
            if (windowWidth < 576) {
                // Extra small screens
                card.style.height = 'auto';
            } else if (windowWidth < 768) {
                // Small screens
                card.style.height = 'auto';
            } else if (windowWidth < 992) {
                // Medium screens
                card.style.height = 'auto';
            } else {
                // Large screens
                card.style.height = 'fit-content';
            }
        });
    }
    
    // Adjust on load and resize
    adjustCardHeights();
    window.addEventListener('resize', debounce(adjustCardHeights, 250));
    
    // Handle mobile-specific interactions
    if (isMobileDevice()) {
        addMobileOptimizations();
    }
}

function addMobileOptimizations() {
    // Add touch-friendly interactions
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 150);
        });
    });
    
    // Optimize form inputs for mobile
    const inputs = document.querySelectorAll('.auth-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.fontSize = '16px'; // Prevent zoom on iOS
        });
    });
}

function initializeAnimations() {
    // Animate statistics on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statItems = document.querySelectorAll('.stat-item h4');
    statItems.forEach(item => {
        observer.observe(item);
    });
    
    // Add stagger animation to product items
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in-up');
    });
}

function animateCounters(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on original text
        const originalText = element.textContent;
        if (originalText.includes('₹')) {
            element.textContent = `₹${Math.floor(current).toLocaleString()}`;
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

function initializeInteractiveElements() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add image error handling
    const productImages = document.querySelectorAll('.product-thumb');
    productImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/80x80?text=No+Image';
            this.alt = 'Product image not available';
        });
    });
}

// Utility functions
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

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Add custom styles for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
`;
document.head.appendChild(style);

// Export functions for external use
window.ProfileJS = {
    validateForm,
    validateInput,
    updateFormState
};