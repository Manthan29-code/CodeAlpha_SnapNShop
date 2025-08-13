// Search functionality
document.getElementById('searchProducts').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    filterProducts();
});

// Category filter
document.getElementById('categoryFilter').addEventListener('change', function() {
    filterProducts();
});

function filterProducts() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card-wrapper');

    productCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const category = card.querySelector('.card-category').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = !selectedCategory || category.includes(selectedCategory);
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}