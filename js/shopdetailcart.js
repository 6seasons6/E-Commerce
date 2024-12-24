// Accessing DOM elements
const addToCartButton = document.getElementById("add-to-cart-btn");
const cartCount = document.getElementById("cart-count");
const cartList = document.getElementById("cart-list");
const productName = document.getElementById("product-name").innerText;
const productPrice = document.getElementById("product-price").innerText;
const productImage = document.getElementById("product-image").src;
const weightSelect = document.getElementById("weight-select");
const quantityInput = document.getElementById("quantity-input");
let viewCartButton = null;
addToCartButton.addEventListener("click", function () {
    const selectedWeight = weightSelect.value;
     const quantityValue = parseInt(quantityInput.value, 10);
     const priceForSelectedWeight = (basePrice / 250) * selectedWeight; 
     const totalPrice = priceForSelectedWeight * quantityValue; 
if (quantityValue <= 0) {
    showSuccessMessage("Please enter a valid quantity."); 
    return;
}
const cartItem = {
        name: productName,
        price: parseFloat(productPrice.replace(/[^\d.-]/g, "")), 
        image: productImage,
        weight: selectedWeight,
        quantity: quantityValue ,
        total: totalPrice,


    };
   // Validate quantity
   if (isNaN(quantityValue) || quantityValue <= 0 || quantityValue > 20) {
    alert("Please enter a valid quantity (1-20).");
    return;
}
     let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    quantityInput.value = 1;
    updateCartUI();
});
// Update Cart UI
function updateCartUI() {
    cartList.innerHTML = "";
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    cartCount.innerText = cartItems.length;
    cartItems.forEach(function (item, index) {
        const cartItemElement = document.createElement("li");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <a href="#" class="photo"><img src="${item.image}" class="cart-thumb" alt="${item.name}" /></a>
            <h6><a href="#">${item.name}</a></h6>
             <div class="price-and-remove">
            <p>1x - <span class="price">${item.price.toFixed(2)}</span></p>
             <td> ${item.quantity}</td>
             <td class="weight-pr">
             <span>${item.weight || 'Not specified'}</span> <!-- Display only the selected weight -->
             </td>
              <td class="total-pr">
                <p>₹${totalPrice.toFixed(2)}</p>
            </td>
                <p>${item.quantity}x - <span class="price">${(item.price * item.quantity).toFixed(2)}</span></p>
             <button class="remove-item" data-index="${index}">X</button> <!-- Close button beside the price -->
             </div>
        `;
        cartList.appendChild(cartItemElement);
    });
    // Add total amount to the "View Cart" button if the cart is not empty
    const totalElement = document.querySelector('.cart-total-amount');
    if (totalAmount > 0) {
        totalElement.textContent = `$${totalAmount.toFixed(2)}`;
    } else {
        totalElement.textContent = ''; 
    }
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            const index = button.getAttribute("data-index");
            removeCartItem(index);
        });
    });
}
// Remove Cart Item
function removeCartItem(index) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartUI();
}
document.addEventListener("DOMContentLoaded", function () {
    viewCartButton = document.querySelector('.total .btn-cart');
    updateCartUI();
});