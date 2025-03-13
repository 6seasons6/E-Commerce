document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderCartItems();
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        document.getElementById('cart-count').innerText = cart.length;
    }
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
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
    cartItems=cartItems.filter(item=>item.name && item.image);
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
  <td><button class="remove-item" data-index="${index}">Remove</button>
            <a class="btn hvr-hover buy-now-btn" data-fancybox-close="" href="#">Buy Now</a>
</td>
        `;
        updateSubtotal();
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
/*//buy now button code
  // Cart Page Script
  document.addEventListener('DOMContentLoaded', function() {
    const totalPrice = localStorage.getItem('totalPrice');
    if (totalPrice) {
        document.getElementById('order-total-price').textContent = '₹' + totalPrice;
    } else {
        document.getElementById('order-total-price').textContent = '₹0.00';
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const totalProductPrice = parseFloat(document.getElementById("order-total-price").textContent.replace('₹', '')) || 0;
    const discount = parseFloat(document.getElementById("order-discount").textContent.replace('₹', '')) || 0;
    const couponDiscount = parseFloat(document.getElementById("coupon-discount").textContent.replace('₹', '')) || 0;
    const tax = parseFloat(document.getElementById("order-tax").textContent.replace('₹', '')) || 0;

    // Calculate the grand total (subtracting the discount)
    const grandTotal = totalProductPrice - discount - couponDiscount + tax;

    // Update the Grand Total in the DOM
    document.getElementById("grand-total").textContent = `₹${grandTotal.toFixed(2)}`;
});*/
//lavany code cart and buy now
//buy-now button code from cart page
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".buy-now-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            
            let cartRow = this.closest("tr");
            let productName = cartRow.querySelector("td:nth-child(2)").textContent.trim();
            let totalPriceElement = cartRow.querySelector(".total-pr p");
            let quantityElement = cartRow.querySelector(".quantity-pr p"); 

            if (!totalPriceElement || !quantityElement) return;

            let itemTotalPrice = parseFloat(totalPriceElement.textContent.replace("₹", ""));
            let quantity = parseInt(quantityElement.textContent.trim());

            // Store data in localStorage
            localStorage.setItem("productName", productName);
            localStorage.setItem("totalPrice", itemTotalPrice.toFixed(2));
            localStorage.setItem("quantity", quantity);

            // Redirect to checkout
            window.location.href = "checkout.html";
        });
    });


    if (window.location.pathname.includes("checkout.html")) {
        let storedTotalPrice = parseFloat(localStorage.getItem("totalPrice")) || 0;
        let orderTotalElement = document.getElementById("order-total-price");
        orderTotalElement.textContent = `₹${storedTotalPrice.toFixed(2)}`;
        orderTotalElement.setAttribute("data-price", storedTotalPrice);
        updateGrandTotal();
    }
});
function updateGrandTotal() {
    let subtotal = parseFloat(document.getElementById("order-total-price").getAttribute("data-price")) || 0;
    let discount = parseFloat(document.getElementById("order-discount").getAttribute("data-price")) || 0;
    let coupon = parseFloat(document.getElementById("coupon-discount").getAttribute("data-price")) || 0;
    let tax = parseFloat(document.getElementById("order-tax").getAttribute("data-price")) || 0;
    let grandTotal = subtotal - discount - coupon + tax;
    let grandTotalElement = document.getElementById("grand-total");
    grandTotalElement.textContent = `₹${grandTotal.toFixed(2)}`;
    grandTotalElement.setAttribute("data-price", grandTotal);
}

//total amount code to summary
document.addEventListener("DOMContentLoaded", function () {
    updateSubtotal();
});

function updateSubtotal() {
    let cartTotalElement = document.querySelector(".cart-total-amount");
    let orderTotalElement = document.getElementById("order-total-price");

    if (cartTotalElement && orderTotalElement) {
        let cartTotal = parseFloat(cartTotalElement.textContent.replace('₹', '')) || 0;

        // Ensure cart total is valid before updating
        if (!isNaN(cartTotal) && cartTotal > 0) {
            cartTotalElement.setAttribute("data-price", cartTotal);
            orderTotalElement.setAttribute("data-price", cartTotal);
            orderTotalElement.textContent = `₹${cartTotal.toFixed(2)}`;

            // Update the grand total
            updateGrandTotal();
        }
    }
}


function updateGrandTotal() {
    let subtotal = parseFloat(document.getElementById("order-total-price").getAttribute("data-price")) || 0;
    let discount = parseFloat(document.getElementById("order-discount").getAttribute("data-price")) || 0;
    let coupon = parseFloat(document.getElementById("coupon-discount").getAttribute("data-price")) || 0;
    let tax = parseFloat(document.getElementById("order-tax").getAttribute("data-price")) || 0;

    // Calculate Grand Total
    let grandTotal = subtotal - discount - coupon + tax;

    // Update the grand total element
    let grandTotalElement = document.getElementById("grand-total");
    if (grandTotalElement) {
        grandTotalElement.setAttribute("data-price", grandTotal);
        grandTotalElement.textContent = `₹${grandTotal.toFixed(2)}`;
    }
}
//chsdjslk
document.getElementById("checkout-button").addEventListener("click", function () {
    let subtotal = document.getElementById("order-total-price").getAttribute("data-price");
    let discount = document.getElementById("order-discount").getAttribute("data-price");
    let couponDiscount = document.getElementById("coupon-discount").getAttribute("data-price");
    let tax = document.getElementById("order-tax").getAttribute("data-price");
    let shipping = document.getElementById("order-shipping").getAttribute("data-price") === "Free" ? 0 : document.getElementById("order-shipping").getAttribute("data-price");
    let grandTotal = document.getElementById("grand-total").getAttribute("data-price");

    // Store values in localStorage
    localStorage.setItem("subtotal", subtotal);
    localStorage.setItem("discount", discount);
    localStorage.setItem("couponDiscount", couponDiscount);
    localStorage.setItem("tax", tax);
    localStorage.setItem("shipping", shipping);
    localStorage.setItem("grandTotal", grandTotal);
});
//checkout
document.getElementById("checkout-button").addEventListener("click", function () {
    let cartTotal = parseFloat(document.querySelector(".cart-total-amount").textContent.replace('₹', '')) || 0;
    let discount = parseFloat(document.getElementById("order-discount")?.textContent.replace('₹', '') || 0);
    let couponDiscount = parseFloat(document.getElementById("coupon-discount")?.textContent.replace('₹', '') || 0);
    let tax = parseFloat(document.getElementById("order-tax")?.textContent.replace('₹', '') || 0);
    let shippingCost = parseFloat(document.getElementById("shipping-cost")?.textContent.replace('₹', '') || 0);

    // Calculate new grand total
    let grandTotal = cartTotal - discount - couponDiscount + tax + shippingCost;

    // Store values in localStorage
    localStorage.setItem("totalPrice", cartTotal.toFixed(2));  // Store updated subtotal
    localStorage.setItem("grandTotal", grandTotal.toFixed(2));

    // Redirect to checkout page
    window.location.href = "checkout.html";
});
//