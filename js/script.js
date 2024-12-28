// Dynamic shop details in object form
const products = {
    1: {
        name: "Honey",
        description: "Fresh organic honey.",
        price: "80.00",
        image: "images/honey.jpg",
        image1: "images/honey.jpg",
        image2: "images/honey.jpg",
        datadesc: "This organic honey is harvested straight from natural hives, ensuring purity and natural goodness. Packed with antioxidants, vitamins, and minerals, it serves as a healthy alternative to refined sugars. Perfect for sweetening tea, drizzling on pancakes, or adding to skincare routines. Known for its soothing and healing properties, it supports overall immunity and wellness. A must-have in every kitchen for its versatility and health benefits."

    },
    2: {
        name: "Ghee",
        description: "Fresh organic Ghee.",
        price: "200.00",
        image: "images/ghee.jpg",
        image1: "images/ghee.jpg",
        image2: "images/ghee.jpg",
        datadesc: "Made from 100% organic milk, this clarified butter is a powerhouse of nutrition and flavor. It contains essential fatty acids, vitamins A, D, and E, and supports digestion and immunity. Ideal for sautéing, frying, or as a topping on warm dishes, its rich aroma and nutty taste enhance every recipe. Used traditionally in Indian households, it also has Ayurvedic benefits like improving skin and boosting energy. A wholesome addition to your meals."
    },
    3: {
        name: "Brown Sugar",
        description: "Fresh organic Brown sugar.",
        price: "80.00",
        image: "images/brown sugar.jpg",
        image1: "images/brown sugar.jpg",
        image2: "images/brown sugar.jpg",
        datadesc: "This organic brown sugar retains the natural molasses, giving it a rich, moist texture and a deep caramel flavor. Free from harmful chemicals and additives, it’s a healthier sweetener for baking, beverages, and desserts. Its unrefined nature ensures better retention of natural minerals like calcium, potassium, and iron. A great choice for cookies, cakes, and sweet glazes, it adds depth and richness to your recipes."
    },
    4: {
        name: "Crystal sugar",
        description: "Fresh organic Crystal sugar.",
        price: "80.00",
        image: "images/crystal sugar.jpg",
        image1: "images/crystal sugar.jpg",
        image2: "images/crystal sugar.jpg",
        datadesc: "Large, naturally crystallized sugar grains perfect for traditional Indian sweets and desserts. This organic crystal sugar is free from chemical processing, making it a healthy option for your sweet needs. Ideal for making syrups, beverages, or as a garnish for baked goods. Its pure sweetness and texture make it a versatile pantry staple. Packed in eco-friendly packaging, it ensures long-lasting freshness."
    },
    5: {
        name: "Organtior dal",
        description: "Fresh organic Organtior dal",
        price: "200.00",
        image: "images/dal.jpg",
        image1: "images/dal.jpg",
        image2: "images/dal.jpg",
        datadesc: "Grown without synthetic fertilizers and pesticides, this split pigeon pea is a rich source of protein and dietary fiber. Essential for making hearty dals, sambars, and soups, it has a creamy texture and a nutty flavor when cooked. Toor Dal is not only delicious but also a great source of iron, potassium, and folate, making it a healthy choice for vegetarians and vegans. Perfect for creating wholesome, nutrient-dense meals."
    },
    6: {
        name: "Masala Tea",
        description: "Fresh organic Masala Tea",
        price: "100.00",
        image: "images/masala tea.jpg",
        image1: "images/masala tea.jpg",
        image2: "images/masala tea.jpg",
        datadesc: "Masala Tea is a flavorful and aromatic beverage made from a blend of premium tea leaves and traditional Indian spices. This invigorating drink combines the bold taste of black tea with the warmth of spices like cardamom, cinnamon, ginger, cloves, and black pepper. Known for its comforting and energizing qualities, Masala Tea is a popular choice for tea lovers worldwide."
    },
    7: {
        name: "Organtior dal",
        description: "Fresh organic Organtior dal",
        price: "250.00",
        image: "images/dal.jpg",
        image1: "images/dal.jpg",
        image2: "images/dal.jpg",
        datadesc: "Grown without synthetic fertilizers and pesticides, this split pigeon pea is a rich source of protein and dietary fiber. Essential for making hearty dals, sambars, and soups, it has a creamy texture and a nutty flavor when cooked. Toor Dal is not only delicious but also a great source of iron, potassium, and folate, making it a healthy choice for vegetarians and vegans. Perfect for creating wholesome, nutrient-dense meals."
    },
    8: {
        name: "Pink salt",
        description: "Fresh organic Pink salt",
        price: "100.00",
        image: "images/pink salt.jpg",
        image1: "images/pink salt.jpg",
        image2: "images/pink salt.jpg",
        datadesc: "Harvested from the Himalayan foothills, this pink salt is naturally rich in minerals like magnesium, potassium, and calcium. Its subtle flavor and vibrant pink color make it an attractive and healthy alternative to regular table salt. Known for its detoxifying properties, it helps balance pH levels, regulate hydration, and improve digestion. Sprinkle it on salads, use it in cooking, or dissolve it in water for a mineral-rich drink."
    },
    9: {
        name: "Toor dal",
        description: "Fresh organic Toor dal",
        price: "150.00",
        image: "images/toor dal.jpg",
        image1: "images/toor dal.jpg",
        image2: "images/toor dal.jpg",
        datadesc: "This natural, unrefined salt is packed with essential minerals that promote overall health. Free from additives and chemical bleaching, it retains its natural flavor and benefits. Use it as a healthier seasoning for your everyday meals to enhance taste and nutrition. Ideal for cooking, pickling, or curing, it’s a versatile and eco-friendly choice. Its mineral content supports hydration, electrolyte balance, and overall wellness."
    }
}
// Dynamically set the content
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productID');
const product = products[productId];
if (product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').innerHTML = product.price;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-datadesc').textContent = product.datadesc;
    document.getElementById('product-image1').src = product.image1;
    document.getElementById('product-image2').src = product.image2;
} else {
    document.getElementById('product-name').textContent = "Product not found.";
}
// Function to set carousel images dynamically
function setCarouselImagesForProduct(productId) {
    const product = products[productId];
    if (product && product.image && product.image1 && product.image2) {
        const indicators = document.querySelectorAll('.indicator-image');
        const productImages = [product.image, product.image1, product.image2];
        productImages.forEach((imageSrc, index) => {
            if (indicators[index]) {
                indicators[index].src = imageSrc;
            } else {
                console.log(`Indicator image not found for index ${index}`);
            }
        });
    } else {
        console.log("Product images are missing.");
    }
}
if (productId) {
    setCarouselImagesForProduct(productId);
} else {
    console.log("Product ID is not found in the URL.");
}

//shopdetailscode
const addToCartButton = document.getElementById("add-to-cart-btn");
const cartCount = document.getElementById("cart-count");
const cartList = document.getElementById("cart-list");
const productName = document.getElementById("product-name").innerText;
const productPrice = document.getElementById("product-price").innerText;
const productImage = document.getElementById("product-image").src;
const productImage1 = document.getElementById("product-image1").src;
const productImage2 = document.getElementById("product-image2").src;
const weightSelect = document.getElementById("weight-select");
const quantityInput = document.getElementById("quantity-input");
const priceValue = parseFloat(productPrice.replace(/[^\d.-]/g, ""));
let viewCartButton = null;
addToCartButton.addEventListener("click", function () {
    const selectedWeight = weightSelect.value;
    const quantityValue = parseInt(quantityInput.value, 10) || 1;  // Default to 1 if empty or invalid quantity
    const cartItem = {
        name: productName,
        price: priceValue,
        image: productImage,
        weight: selectedWeight,
        quantity: quantityValue,
      };
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartUI(); 
    showSuccessMessage("Successfully added product to cart!");
});
// Show success message
function showSuccessMessage(message) {
    const successMessageDiv = document.createElement("div");
    successMessageDiv.classList.add("success-message");
    successMessageDiv.textContent = message;

    document.body.appendChild(successMessageDiv);

    setTimeout(function () {
        successMessageDiv.remove();
    }, 3000);
}
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
                <p>${item.price}</p> <!-- Correct price display -->
                <p>Weight: <span class="weight">${item.weight}</span></p> <!-- Display the selected weight -->
                <p>Quantity: ${item.quantity}</p> <!-- Display quantity -->
                 <button class="remove-item" data-index="${index}">X</button> <!-- Close button beside the price -->
            </div>
        `;
        cartList.appendChild(cartItemElement);
    });
   // Update the total price of the cart
    const totalElement = document.querySelector('.cart-total-amount');
    if (totalAmount > 0) {
        totalElement.textContent = `₹${totalAmount.toFixed(2)}`;
    } else {
        totalElement.textContent = '';
    }
    // Add event listener for remove button
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            const index = button.getAttribute("data-index");
            removeCartItem(index);
        });
    });
}

// Remove Cart Item
function removeCartItem(index) {
    let cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartUI(); 
}
document.addEventListener("DOMContentLoaded", function () {
    viewCartButton = document.querySelector('.total .btn-cart');
    updateCartUI(); 
});
// this is price based on weight
let currentProductId = productId; 
function calculatePrice(price, weight) {
    const multiplier = weight / 250; 
    return price * multiplier;
}
function updateProductDetails(productId) {
    const product = products[productId];
if (!product) {
        console.error("Invalid product ID:", productId);
        return;
    }
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-datadesc").textContent = product.datadesc;
    const defaultWeight = 250;
    const price = calculatePrice(product.price, defaultWeight);
    document.getElementById("product-price").textContent = "₹" + price.toFixed(2);
}
document.getElementById("weight-select").addEventListener("change", function () {
    const weightInGrams = parseInt(this.value, 10);

    if (isNaN(weightInGrams)) {
        console.error("Invalid weight selected.");
        return;
    }
    const product = products[currentProductId];
    if (!product || !product.price) {
        console.error("Product not found or missing price.");
        return;
    }
// Calculate price based on the selected weight
    const price = calculatePrice(product.price, weightInGrams); 
    document.getElementById("product-price").textContent = "₹" + price.toFixed(2);
});
function changeProduct(productId) {
    currentProductId = productId;
    updateProductDetails(currentProductId);
}
updateProductDetails(currentProductId);
//calculate price based on weight and quantity
function calculateTotalPrice(pricePer250Grams, weightInGrams, quantity) {
    const priceForSelectedWeight = (pricePer250Grams / 250) * weightInGrams;
    return priceForSelectedWeight * quantity;
}

document.getElementById("weight-select").addEventListener("change", updateTotalPrice);
document.getElementById("quantity-input").addEventListener("input", updateTotalPrice);
function updateTotalPrice() {
    const weightSelect = document.getElementById("weight-select");
    const quantityInput = document.getElementById("quantity-input");

    const selectedWeight = parseInt(weightSelect.value.replace('g', ''), 10);
    const quantity = parseInt(quantityInput.value, 10) || 1;
    const product = products[currentProductId];

    if (product && product.price) {
        const pricePer250Grams = parseFloat(product.price);
        const totalPrice = calculateTotalPrice(pricePer250Grams, selectedWeight, quantity); // Calculate total price
        const totalPriceDiv = document.querySelector(".form-group > div:last-child");
        totalPriceDiv.innerHTML = `<h3>Total Price :<br><br> <span class="underline-price">₹${totalPrice.toFixed(2)}</span></h3>`;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    updateProductDetails(currentProductId);
    updateTotalPrice();
});

