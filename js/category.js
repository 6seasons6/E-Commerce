// Add event listeners to filter by category and subcategory
document.querySelectorAll('.list-group-item-action').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        
        const selectedCategory = event.target.getAttribute('data-category');
        const selectedSubcategory = event.target.getAttribute('data-subcategory');
        
        // Filter the products based on the selected category and subcategory
        filterProducts(selectedCategory, selectedSubcategory);
    });
});

function filterProducts(category, subcategory) {
    const allProducts = document.querySelectorAll('.product-sortable');

    // Loop through all products to check if they match the selected category and/or subcategory
    allProducts.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const productSubcategory = product.getAttribute('data-subcategory');

        // Show the product if it matches the selected category and subcategory (or if no subcategory is selected)
        if (
            (category === productCategory || category === 'all') &&
            (subcategory === productSubcategory || subcategory === 'all' || !subcategory)
        ) {
            product.style.display = 'block'; // Show matching product
        } else {
            product.style.display = 'none'; // Hide non-matching product
        }
    });
}
