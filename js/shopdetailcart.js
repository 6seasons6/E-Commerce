// Accessing DOM elements
const addToCartButton = document.getElementById("add-to-cart-btn");
const cartCount = document.getElementById("cart-count");
const cartList = document.getElementById("cart-list");
const productName = document.getElementById("product-name").innerText;
const productPrice = document.getElementById("product-price").innerText;
const productImage = document.getElementById("product-image").src;

// Reference to the "View Cart" button (ensure correct selection after DOM is ready)
let viewCartButton = null;

// Handle Add to Cart button click
addToCartButton.addEventListener("click", function () {
    // Create a new cart item object
    const cartItem = {
        name: productName,
        price: parseFloat(productPrice.replace(/[^\d.-]/g, "")), // Convert price to a number
        image: productImage,
    };

    // Retrieve existing cart items from localStorage, or create an empty array if not present
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Add the new cart item to the array
    cartItems.push(cartItem);

    // Save the updated cart items to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Update the cart UI
    updateCartUI();
});

// Update Cart UI
function updateCartUI() {
    // Clear the current cart list
    cartList.innerHTML = "";

    // Get cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

    // Update the cart item count
    cartCount.innerText = cartItems.length;

    // Add each cart item to the list
    cartItems.forEach(function(item, index) {
        const cartItemElement = document.createElement("li");
        cartItemElement.classList.add("cart-item");

        cartItemElement.innerHTML = `
            <a href="#" class="photo"><img src="${item.image}" class="cart-thumb" alt="${item.name}" /></a>
            <h6><a href="#">${item.name}</a></h6>
            <div class="price-and-remove">
                <p>1x - <span class="price">${item.price.toFixed(2)}</span></p>
                <button class="remove-item" data-index="${index}">X</button> <!-- Close button beside the price -->
            </div>
        `;

        // Append the cart item to the list
        cartList.appendChild(cartItemElement);
    });

    // Add total amount to the "View Cart" button if the cart is not empty
    const totalElement = document.querySelector('.cart-total-amount');
    if (totalAmount > 0) {
        totalElement.textContent = `$${totalAmount.toFixed(2)}`;
    } else {
        totalElement.textContent = ''; // If the cart is empty, show nothing
    }

    // Add event listeners for the remove buttons (close buttons)
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function() {
            const index = button.getAttribute("data-index");
            removeCartItem(index);
        });
    });
}
// Remove Cart Item
function removeCartItem(index) {
    // Get cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Remove the item at the specified index
    cartItems.splice(index, 1);

    // Save the updated cart items to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Update the cart UI
    updateCartUI();
}

// On page load, update the cart UI to display items stored in localStorage
document.addEventListener("DOMContentLoaded", function () {
    // Ensure viewCartButton is selected
    viewCartButton = document.querySelector('.total .btn-cart');
    updateCartUI();
});