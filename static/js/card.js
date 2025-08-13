// Product Card JavaScript Functions

// Flip card animation
function flipCard(button) {
    const card = button.closest('.product-card');
    card.classList.toggle('flipped');
}

// Add product to collection
async function addProduct(button) {
    const card = button.closest('.product-card');
    const usdPrice = parseFloat(card.dataset.productPrice);
    const inrPrice = convertToINR(usdPrice);
    
    const productData = {
        id: card.dataset.productId,
        title: card.dataset.productTitle,
        price: inrPrice, // Use converted INR price
        description: card.dataset.productDescription,
        category: card.dataset.productCategory,
        image: card.dataset.productImage,
        rating: {
            rate: parseFloat(card.dataset.productRate),
            count: parseInt(card.dataset.productCount)
        }
    };

    // Add loading state
    button.classList.add('loading');
    button.disabled = true;

    try {
        // Get CSRF token from Django template or cookie
        const csrfToken = getCSRFToken();
        
        const response = await fetch('/product/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Success state
            button.classList.remove('loading');
            button.classList.add('success');
            button.innerHTML = '<i class="bi bi-check-circle me-1"></i>Added!';
            
            // Show toast notification
            showToast(result.message, 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.classList.remove('success');
                button.innerHTML = '<i class="bi bi-plus-circle me-1"></i>Add';
                button.disabled = false;
            }, 3000);
            
        } else {
            // Error state
            button.classList.remove('loading');
            button.disabled = false;
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        button.classList.remove('loading');
        button.disabled = false;
        showToast('Network error. Please try again.', 'error');
    }
}

// Get CSRF token from Django template or cookie
function getCSRFToken() {
    // First try to get from Django template variable
    const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfTokenElement) {
        return csrfTokenElement.value;
    }
    
    // Fallback to cookie method
    return getCookie('csrftoken');
}

// Get CSRF token from cookie (fallback method)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastElement = document.getElementById('productToast');
    const toastBody = document.getElementById('toastMessage');
    const toastHeader = toastElement.querySelector('.toast-header');
    
    // Update message
    toastBody.textContent = message;
    
    // Update icon and style based on type
    const icon = toastHeader.querySelector('i');
    icon.className = type === 'success' ? 
        'bi bi-check-circle-fill text-success me-2' : 
        'bi bi-exclamation-circle-fill text-danger me-2';
    
    // Show toast
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Initialize card animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Convert USD prices to INR and update display
    updatePricesToINR();
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.product-card-wrapper');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add hover effects
    cards.forEach(cardWrapper => {
        const card = cardWrapper.querySelector('.product-card');
        
        cardWrapper.addEventListener('mouseenter', function() {
            if (!card.classList.contains('flipped')) {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }
        });
        
        cardWrapper.addEventListener('mouseleave', function() {
            if (!card.classList.contains('flipped')) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }
        });
    });
});

// Convert and update all USD prices to INR
function updatePricesToINR() {
    const priceElements = document.querySelectorAll('.price-value');
    priceElements.forEach(priceElement => {
        const usdPrice = parseFloat(priceElement.textContent);
        const inrPrice = convertToINR(usdPrice);
        priceElement.textContent = inrPrice.toLocaleString('en-IN');
    });
}

// Search functionality
function searchProducts() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card-wrapper');
    let visibleCount = 0;

    productCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const category = card.querySelector('.card-category').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = !categoryFilter || category.includes(categoryFilter);
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });

    // Update product count
    const countBadge = document.querySelector('.products-stats .badge');
    if (countBadge) {
        countBadge.innerHTML = `<i class="bi bi-box-seam me-1"></i>${visibleCount} Products`;
    }

    // Show empty state if no products found
    showEmptyState(visibleCount === 0);
}

// Show/hide empty state
function showEmptyState(show) {
    let emptyState = document.querySelector('.empty-state');
    
    if (show && !emptyState) {
        const grid = document.getElementById('productsGrid');
        emptyState = document.createElement('div');
        emptyState.className = 'col-12';
        emptyState.innerHTML = `
            <div class="empty-state text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="text-muted mt-3">No products found</h3>
                <p class="text-muted">Try adjusting your search or filters</p>
            </div>
        `;
        grid.appendChild(emptyState);
    } else if (!show && emptyState) {
        emptyState.remove();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'S' to focus search
    if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        document.getElementById('searchProducts').focus();
    }
    
    // Press 'Escape' to clear search
    if (e.key === 'Escape') {
        document.getElementById('searchProducts').value = '';
        document.getElementById('categoryFilter').value = '';
        searchProducts();
    }
});

// Price conversion to INR with proper formatting
function convertToINR(usdPrice) {
    const exchangeRate = 83.12; // Current USD to INR rate (approximate)
    const inrPrice = usdPrice * exchangeRate;
    return Math.round(inrPrice); // Round to nearest rupee
}

// Format price for display
function formatINRPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollBtn.className = 'btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle';
    scrollBtn.style.width = '50px';
    scrollBtn.style.height = '50px';
    scrollBtn.style.zIndex = '1000';
    scrollBtn.style.display = 'none';
    scrollBtn.onclick = scrollToTop;
    document.body.appendChild(scrollBtn);

    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
});