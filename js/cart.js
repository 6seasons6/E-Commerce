document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderCartItems();
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        document.getElementById('cart-count').innerText = cart.length;
    }
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartBody = document.getElementById('cart-body');
        cartBody.innerHTML = '';
        if (cart.length === 0) {
            cartBody.innerHTML = `<tr><td colspan="6" class="text-center">Your cart is empty.</td></tr>`;
            return;
        }
        cart.forEach((item, index) => {
            const weightInGrams = parseInt(item.weight || 250, 10); 
        const calculatedPrice = calculatePrice(item.basePrice, weightInGrams); 
        const totalPrice = calculateTotalPrice(item.basePrice, weightInGrams, item.quantity); 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="thumbnail-img">
                    <a href="#"><img class="img-fluid" src="${item.image}" alt="${item.name}" /></a>
                </td>
                <td class="name-pr">
                    <a href="#">${item.name}</a>
                </td>
                <td class="quantity-box">
                ${item.quantity} <!-- Display only the quantity as text -->
            </td>
                <td class="remove-pr">
                    <a href="#" class="remove-item" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </a>
                </td>
                 <td class="weight-pr">
                <span>${item.weight || 'Not specified'}</span> <!-- Display selected weight or 'Not specified' if undefined -->
            </td>
            `;
            cartBody.appendChild(row);
        });

        // Add event listeners to the remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const index = button.getAttribute('data-index');
                removeCartItem(index);
            });
        });
        document.querySelectorAll('.qty').forEach(input => {
            input.addEventListener('input', function (event) {
                const index = input.getAttribute('data-index');
                updateCartItemQuantity(index, input.value);
            });
        });
    }
     function removeCartItem(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); 
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); 
        updateCartCount(); 
    }
      function updateCartItemQuantity(index, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart[index];
        item.quantity = parseInt(quantity);
        item.total = item.price * item.quantity; 
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); 
    }
});
// Function to update the cart page
function updateCartPage() {
    const cartBody = document.getElementById("cart-body");
    const totalAmountElement = document.querySelector(".cart-total-amount");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartBody.innerHTML = "";
    let totalAmount = 0;
      cartItems.forEach((item, index) => {
        const pricePer250Grams = parseFloat(item.price); 
        const weightInGrams = parseInt(item.weight || 250, 10); 
        const quantity = parseInt(item.quantity || 1, 10);
     // Calculate price based on the selected weight and quantity
        const itemTotalPrice = calculatePrice(pricePer250Grams, weightInGrams) * quantity;
       totalAmount += itemTotalPrice; // Add to the total cart amount
       // Create the table row for each cart item
        const cartRow = document.createElement("tr");
        cartRow.innerHTML = `
            <td><img src="${item.image}" class="cart-thumb" alt="${item.name}" /></td>
            <td>${item.name}</td>
            <td><span class="price">₹${calculatePrice(pricePer250Grams, weightInGrams).toFixed(2)}</span></td> <!-- Price based on weight -->
            <td>${weightInGrams}g</td> <!-- Selected weight -->
            <td class="quantity-pr">
                <p>${quantity}</p> <!-- Display quantity -->
            </td>      
            <td class="total-pr">
                <p>₹${itemTotalPrice.toFixed(2)}</p> <!-- Display total price -->
            </td>
            <td><button class="remove-item" data-index="${index}">X</button></td>
        `;
        cartBody.appendChild(cartRow);
    });
    totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            const index = button.getAttribute("data-index");
            removeCartItem(index);
        });
    });
}
document.querySelectorAll('.weight-edit').forEach(input => {
    input.addEventListener('change', function (event) {
        const index = input.getAttribute('data-index');
        const newWeight = input.value;
        updateCartItemWeight(index, newWeight);
    });
});
document.querySelectorAll('.qty').forEach(input => {
    input.addEventListener('input', function (event) {
        const index = input.getAttribute('data-index');
        updateCartItemQuantity(index, input.value);
    });
});
function updateCartItemQuantity(index, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];
    item.quantity = parseInt(quantity, 10);
    item.total = item.price * item.quantity;
     localStorage.setItem('cartItems', JSON.stringify(cart));
    renderCartItems(); 
}

// Function to update the weight of an item in the cart
function updateCartItemWeight(index, newWeight) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cart[index];
     item.weight = newWeight;
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartUI();
}
// Remove Cart Item
function removeCartItem(index) {
 let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
cartItems.splice(index, 1);
localStorage.setItem("cartItems", JSON.stringify(cartItems));
updateCartPage();
}
document.addEventListener("DOMContentLoaded", function () {
    updateCartPage();
});
function calculateTotalPrice(pricePer250Grams, weightInGrams, quantity) {
    const priceForSelectedWeight = (pricePer250Grams / 250) * weightInGrams;
    return priceForSelectedWeight * quantity;
}
// Function to calculate price based on weight
function calculatePrice(price, weight) {
    const multiplier = weight / 250; 
    return price * multiplier;
}
