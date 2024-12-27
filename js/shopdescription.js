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