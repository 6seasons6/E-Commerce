 // Sort functionality
 document.getElementById('priceSort').addEventListener('change', function() {
    var sortValue = this.value;
    var products = document.querySelectorAll('.col-sm-6.col-md-6.col-lg-4.col-xl-4.product-sortable');
    var productsArray = Array.from(products);

    if (sortValue === "2") { // High Price → Low Price
        productsArray.sort(function(a, b) {
            var priceA = parseFloat(a.getAttribute('data-price'));
            var priceB = parseFloat(b.getAttribute('data-price'));
            return priceB - priceA; // Sort descending
        });
    } else if (sortValue === "3") { // Low Price → High Price
        productsArray.sort(function(a, b) {
            var priceA = parseFloat(a.getAttribute('data-price'));
            var priceB = parseFloat(b.getAttribute('data-price'));
            return priceA - priceB; // Sort ascending
        });
    }

    // Remove all current product items from the DOM
    var productsContainer = document.querySelector('.products-container .row');
    productsContainer.innerHTML = '';

    // Re-append sorted products
    productsArray.forEach(function(product) {
        productsContainer.appendChild(product);
    });
});