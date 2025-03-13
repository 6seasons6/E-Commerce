// Function to calculate price for a given weight and product base price
function calculatePrice(basePrice, weight) {
    return (weight / 250) * basePrice;
}
function updatePrice(productId) {
    const productElement = document.querySelector(`#product-item-${productId}`);
    const basePrice = parseFloat(productElement.getAttribute("data-price"));
    const weightSelect = document.getElementById(`weight-select-${productId}`);
    const quantityInput = document.getElementById(`quantity-input-${productId}`);
    const priceDisplay = document.getElementById(`price-display-${productId}`);
    
    const selectedWeight = parseInt(weightSelect.value);
    const quantity = parseInt(quantityInput.value);
    const totalPrice = calculatePrice(basePrice, selectedWeight) * quantity;
    priceDisplay.textContent = `₹${totalPrice.toFixed(2)}`;
    return {
        name: productElement.querySelector("h4").textContent, 
        image: productElement.querySelector("img").src, 
        price: basePrice,
        weight: selectedWeight,
        quantity: quantity,
        total: totalPrice
    };
}
function updateCartCount() {
    const cartTableBody = document.querySelector("#cart-body");
    const cartItemsCount = cartTableBody.querySelectorAll("tr").length;
    const cartCountElement = document.getElementById("cart-count");
        cartCountElement.textContent = cartItemsCount;
}
    function addToCart(productId) {
    const productDetails = updatePrice(productId); 
    const cartTableBody = document.querySelector("#cart-body");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td><img src="${productDetails.image}" alt="${productDetails.name}" style="width: 50px;"></td>
        <td>${productDetails.name}</td>
        <td>₹${productDetails.price.toFixed(2)}</td>
        <td>${productDetails.weight} gms</td>
        <td>${productDetails.quantity}</td>
        <td>₹${productDetails.total.toFixed(2)}</td>
        <td><button class="remove-item-btn">Remove</button></td>
    `;
    cartTableBody.appendChild(newRow);
    document.getElementById(`quantity-input-${productId}`).value = 1;
    updateCartCount();
}
// Event listener for "Add to Cart" buttons
document.addEventListener("DOMContentLoaded", function () {
    function calculatePrice(basePrice, weight) {
        const multiplier = weight / 250; 
        return basePrice * multiplier;
    }
    function updatePrice(productId) {
        const productElement = document.getElementById(`product-item-${productId}`);
        const basePrice = parseFloat(productElement.getAttribute("data-price"));
        const weightSelect = document.getElementById(`weight-select-${productId}`);
        const quantityInput = document.getElementById(`quantity-input-${productId}`);
        const priceDisplay = document.getElementById(`price-display-${productId}`);
        
        const selectedWeight = parseInt(weightSelect.value.replace("g", ""));
        const quantity = parseInt(quantityInput.value);
        const totalPrice = calculatePrice(basePrice, selectedWeight) * quantity;
        priceDisplay.textContent = `₹${totalPrice.toFixed(2)}`;
    }
    const productItems = document.querySelectorAll(".product-item");
    productItems.forEach(productItem => {
        const productId = productItem.getAttribute("data-product-id");
         const weightSelect = document.getElementById(`weight-select-${productId}`);
        weightSelect.addEventListener("change", function () {
            updatePrice(productId);
        });
        const quantityInput = document.getElementById(`quantity-input-${productId}`);
        quantityInput.addEventListener("input", function () {
            updatePrice(productId);
        });
        updatePrice(productId);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.buy-now-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const productId = button.getAttribute('data-product-id');

            const productElement = document.getElementById(`product-item-${productId}`);
            const productName = productElement.querySelector('h4').textContent;
            const selectedWeight = parseInt(document.getElementById(`weight-select-${productId}`).value, 10);
            const quantity = parseInt(document.getElementById(`quantity-input-${productId}`).value, 10) || 1;
            const pricePer250Grams = parseFloat(productElement.getAttribute('data-price'));
            const totalPrice = calculateTotalPrice(pricePer250Grams, selectedWeight, quantity);
 
 
            localStorage.setItem('productName', productName);
            localStorage.setItem('totalPrice', totalPrice.toFixed(2));
            localStorage.setItem('quantity', quantity);
            window.location.href = 'checkout.html';
        });
    });
});
 
 
function calculateTotalPrice(pricePer250Grams, selectedWeight, quantity) {
    const priceForSelectedWeight = (pricePer250Grams / 250) * selectedWeight;
    return priceForSelectedWeight * quantity;
}

window.onload = function() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBody = document.getElementById('wishlist-body');
    const wishlistcount = document.getElementById('wishlist-count');
 
     
        // Function to update the wishlist count
    function updateWishlistcount() {
        // Set the wishlist count in the icon
        wishlistcount.textContent = wishlist.length > 0 ? wishlist.length : "";
    }
    // Loop through the wishlist and add each product to the table
    wishlist.forEach(product => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;"></td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>In Stock</td>
            <td><button class="btn btn-primary">Add Item</button></td>
            <td><button class="btn btn-danger remove-wishlist-item">Remove</button></td>
        `;
         
       
        // Append the new row to the wishlist table
        wishlistBody.appendChild(newRow);
 
        // Add event listener for "Remove" button
        newRow.querySelector('.remove-wishlist-item').addEventListener('click', function () {
            // Remove the product from localStorage
            const updatedWishlist = wishlist.filter(p => p.name !== product.name);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
 
            // Remove the row from the table
            wishlistBody.removeChild(newRow);
            updateWishlistcount();
        });
    });
}
      // Update the wishlist count on the page
    updateWishlistcount();
 
    // Function to update the wishlist count in the navigation
function updateWishlistcount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistcount = document.getElementById('wishlist-count');
 
    // Update the wishlist count in the wishlist icon (in your navigation)
    wishlistcount.textContent = wishlist.length > 0 ? wishlist.length : ''; // Display the count or hide if empty
}
 
// Initial render on page load
window.onload = function() {
    renderWishlistItems(); // Render wishlist items when the page loads
 
};
//adding tocart
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); 
            const productId = button.getAttribute('data-product-id'); 
            addToCart(productId); 
        });
    });
    function addToCart(productId) {
        const productElement = document.getElementById(`product-item-${productId}`);
        const image = productElement.querySelector('img').src; 
        const name = productElement.querySelector('h4').textContent; 
        const basePrice = parseFloat(productElement.getAttribute('data-price')); 
        const weightSelect = productElement.querySelector(`#weight-select-${productId}`); 
        const quantityInput = productElement.querySelector(`#quantity-input-${productId}`); 
        const selectedWeight = parseInt(weightSelect.value.replace('g', '')); 
        const quantity = parseInt(quantityInput.value); 
        const totalPrice = calculatePrice(basePrice, selectedWeight) * quantity; 
      // Create product object
        const productDetails = {
            image: image,
            name: name,
            price: basePrice,
            weight: selectedWeight,
            quantity: quantity,
            total: totalPrice
        };
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (!Array.isArray(cartItems)) {
            cartItems = [];  // Reset to an empty array if it is not valid
        }
        const existingItemIndex = cartItems.findIndex(item => item.name === name && item.weight === selectedWeight);
    if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += quantity;
            cartItems[existingItemIndex].total += totalPrice;
        } else {
            cartItems.push(productDetails);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        showSuccessMessage('Product successfully added to cart');
    }
    function calculatePrice(basePrice, weight) {
        const multiplier = weight / 250;
        return basePrice * multiplier;
    }
    function showSuccessMessage(message) {
        const successMessage = document.createElement('div');
        successMessage.classList.add('success-message');
        successMessage.innerText = message;

        document.body.appendChild(successMessage);
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 10);

        setTimeout(() => {
            successMessage.classList.remove('show');
            document.body.removeChild(successMessage);
        }, 3000);
    }
});

