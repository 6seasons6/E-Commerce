document.addEventListener('DOMContentLoaded', function() {
    // Update the cart count in the navbar when the page loads
    updateCartCount();

    // Render the cart items in the table
    renderCartItems();

    // Function to update the cart count in the navbar
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').innerText = cart.length;
    }

    // Function to render cart items in the table
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

        // Loop through the cart items and render them in the table
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
                    <input type="number" value="${item.quantity}" min="1" class="c-input-text qty text" data-index="${index}" />
                </td>
                <td class="total-pr">
                    <p>$ ${(item.total).toFixed(2)}</p>
                </td>
                <td class="remove-pr">
                    <a href="#" class="remove-item" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </a>
                </td>
            `;
            cartBody.appendChild(row);
        });

        // Add event listeners to the remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const index = button.getAttribute('data-index');
                removeCartItem(index);
            });
        });

        // Add event listeners to the quantity inputs
        document.querySelectorAll('.qty').forEach(input => {
            input.addEventListener('input', function(event) {
                const index = input.getAttribute('data-index');
                updateCartItemQuantity(index, input.value);
            });
        });
    }

    // Function to remove an item from the cart
    function removeCartItem(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // Remove the item from the cart
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); // Re-render the cart table
        updateCartCount(); // Update the cart count
    }

    // Function to update the quantity of an item in the cart
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
    
    // Get cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Clear the cart-body
    cartBody.innerHTML = "";

    // Calculate total amount
    let totalAmount = 0;

    // Add each cart item to the table
    cartItems.forEach((item, index) => {
        const cartRow = document.createElement("tr");

        cartRow.innerHTML = `
            <td><img src="${item.image}" class="cart-thumb" alt="${item.name}" /></td>
            <td>${item.name}</td>
            <td><span class="price">$${item.price.toFixed(2)}</span></td>
            <td>1</td> <!-- Assuming quantity is always 1, can be updated if needed -->
            <td><span class="price">$${item.price.toFixed(2)}</span></td>
            <td><button class="remove-item" data-index="${index}">X</button></td>
        `;

        // Append the cart row to the table body
        cartBody.appendChild(cartRow);

        // Add total price
        totalAmount += item.price;
    });

    // Update the total amount in the footer
    totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;

    // Add event listeners for the remove buttons
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
    updateCartPage();
}

// On page load, update the cart UI to display items stored in localStorage
document.addEventListener("DOMContentLoaded", function() {
    updateCartPage();
});
