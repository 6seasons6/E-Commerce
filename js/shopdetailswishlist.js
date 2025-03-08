document.getElementById('add-to-wishlist-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    
    const productImage = document.getElementById('product-image').src;
    const productName = document.getElementById('product-name').textContent;
    const productPrice = document.getElementById('product-price').textContent;
    
    // Create an object representing the product
    const product = {
        image: productImage,
        name: productName,
        price: productPrice
    };
    
    // Get the wishlist from localStorage or initialize it
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Add the new product to the wishlist
    wishlist.push(product);
    
    // Save the updated wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    updateWishlistCount(); // Update wishlist count in UI
    
    // Show success message
    showSuccessMessage(`${productName} successfully added to wishlist!`);
});

// Function to show a success message
function showSuccessMessage(message) {
    const successMessageDiv = document.createElement('div');
    successMessageDiv.classList.add('success-message');
    successMessageDiv.textContent = message;

    // Append the success message to the body
    document.body.appendChild(successMessageDiv);

    // Set a timeout to remove the message after 3 seconds
    setTimeout(function () {
        successMessageDiv.remove();
    }, 3000);
}

// Function to update all elements with the wishlist count class
function updateWishlistCount() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    
    // Update all elements with the .wishlist-count class
    wishlistCountElements.forEach(function(element) {
        element.textContent = wishlist.length;
    });
}

// Update wishlist count on page load
document.addEventListener('DOMContentLoaded', updateWishlistCount);