document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    // Render the cart items in the table
    renderCartItems();
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').innerText = cart.length;
    }
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartBody = document.getElementById('cart-body');

        // Clear existing cart table content
        cartBody.innerHTML = '';

        // Check if the cart is empty
        if (cart.length === 0) {
            cartBody.innerHTML = `<tr><td colspan="6" class="text-center">Your cart is empty.</td></tr>`;
            return;
        }
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="thumbnail-img">
                    <a href="#"><img class="img-fluid" src="${item.image}" alt="${item.name}" /></a>
                </td>
                <td class="name-pr">
                    <a href="#">${item.name}</a>
                </td>
                <td class="price-pr">
                    <p>$ ${parseFloat(item.price).toFixed(2)}</p>
                </td>


               <td class="quantity-box">
                ${item.quantity} <!-- Display only the quantity as text -->
            </td>
                <td class="total-pr">
                    <p>$ ${(item.total).toFixed(2)}</p>
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

        // Add event listeners to the quantity inputs
        document.querySelectorAll('.qty').forEach(input => {
            input.addEventListener('input', function (event) {
                const index = input.getAttribute('data-index');
                updateCartItemQuantity(index, input.value);
            });
        });
    }


    function removeCartItem(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // Remove the item from the cart
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); // Re-render the cart table
        updateCartCount(); // Update the cart count
    }



    function updateCartItemQuantity(index, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart[index];
        item.quantity = parseInt(quantity);
        item.total = item.price * item.quantity; // Update the total price
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); // Re-render the cart table
    }
});


// Update Cart UI for Cart Page
function updateCartPage() {
    const cartBody = document.getElementById("cart-body");
    const totalAmountElement = document.querySelector(".cart-total-amount");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartBody.innerHTML = "";
    let totalAmount = 0;
    cartItems.forEach((item, index) => {
        const cartRow = document.createElement("tr");

        cartRow.innerHTML = `
             <td><img src="${item.image}" class="cart-thumb" alt="${item.name}" /></td>
             <td>${item.name}</td>
             <td><span class="price">$${item.price.toFixed(2)}</span></td>
             <td>${item.weight}</td> 
             <td> ${item.quantity}</td>
             <td><span class="price">$${item.price.toFixed(2)}</span></td>
             <td><button class="remove-item" data-index="${index}">X</button></td>
            
        `;
        cartBody.appendChild(cartRow);

        // Add total price
        totalAmount += item.price;
    });


    totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
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
// Function to update the quantity of an item in the cart
function updateCartItemQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cart[index];
    item.quantity = parseInt(quantity, 10);
    item.total = item.price * item.quantity; // Update the total price
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
