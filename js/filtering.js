
document.getElementById('filterPrice').addEventListener('change', function() {
    var selectedValue = this.value; // Get selected value from the dropdown
    var products = document.querySelectorAll('.col-sm-6.col-md-6.col-lg-4.col-xl-4.product-sortable');

    products.forEach(function(product) {
        var productPrice = parseFloat(product.getAttribute('data-price')); // Get the product's price

        // Check the selected filter range
        if (selectedValue === "all") {
            product.style.display = ""; // Show all products
        } else if (selectedValue === "low" && productPrice <= 100) {
            product.style.display = ""; // Show products <= 100
        } else if (selectedValue === "medium" && productPrice > 100 && productPrice <= 500) {
            product.style.display = ""; // Show products between 101 and 200
        } else if (selectedValue === "high" && productPrice >1000) {
            product.style.display = ""; // Show products > 200
        } else {
            product.style.display = "none"; // Hide products that don't match
        }
    });
});