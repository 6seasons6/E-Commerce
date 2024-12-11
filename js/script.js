
//Dynamic shop details in object form
// Dynamic shop details in object form
const products = {
    1: {
        name: "Honey",
        description: "Fresh organic honey.",
        price: "&#8377;80.00",
        image: "images/honey.jpg",
        datadesc: "This organic honey is harvested straight from natural hives, ensuring purity and natural goodness. Packed with antioxidants, vitamins, and minerals, it serves as a healthy alternative to refined sugars. Perfect for sweetening tea, drizzling on pancakes, or adding to skincare routines. Known for its soothing and healing properties, it supports overall immunity and wellness. A must-have in every kitchen for its versatility and health benefits."
    },
    2: {
        name: "Ghee",
        description: "Fresh organic Ghee.",
        price: "&#8377;200.00",
        image: "images/ghee.jpg",
        datadesc: "Made from 100% organic milk, this clarified butter is a powerhouse of nutrition and flavor. It contains essential fatty acids, vitamins A, D, and E, and supports digestion and immunity. Ideal for sautéing, frying, or as a topping on warm dishes, its rich aroma and nutty taste enhance every recipe. Used traditionally in Indian households, it also has Ayurvedic benefits like improving skin and boosting energy. A wholesome addition to your meals."
    },
    3: {
        name: "Brown Sugar",
        description: "Fresh organic Brown sugar.",
        price: "&#8377;80.00",
        image: "images/brown sugar.jpg",
        datadesc: "This organic brown sugar retains the natural molasses, giving it a rich, moist texture and a deep caramel flavor. Free from harmful chemicals and additives, it’s a healthier sweetener for baking, beverages, and desserts. Its unrefined nature ensures better retention of natural minerals like calcium, potassium, and iron. A great choice for cookies, cakes, and sweet glazes, it adds depth and richness to your recipes."
    },
    4: {
        name: "Crystal sugar",
        description: "Fresh organic Crystal sugar.",
        price: "&#8377;80.00",
        image: "images/crystal sugar.jpg",
        datadesc: "Large, naturally crystallized sugar grains perfect for traditional Indian sweets and desserts. This organic crystal sugar is free from chemical processing, making it a healthy option for your sweet needs. Ideal for making syrups, beverages, or as a garnish for baked goods. Its pure sweetness and texture make it a versatile pantry staple. Packed in eco-friendly packaging, it ensures long-lasting freshness."
    },
    5: {
        name: "Organtior dal",
        description: "Fresh organic Organtior dal",
        price: "&#8377;200.00",
        image: "images/dal.jpg",
        datadesc: "Grown without synthetic fertilizers and pesticides, this split pigeon pea is a rich source of protein and dietary fiber. Essential for making hearty dals, sambars, and soups, it has a creamy texture and a nutty flavor when cooked. Toor Dal is not only delicious but also a great source of iron, potassium, and folate, making it a healthy choice for vegetarians and vegans. Perfect for creating wholesome, nutrient-dense meals."
    },
    6: {
        name: "Masala Tea",
        description: "Fresh organic Masala Tea",
        price: "&#8377;100.00",
        image: "images/masala tea.jpg",
        datadesc: "Masala Tea is a flavorful and aromatic beverage made from a blend of premium tea leaves and traditional Indian spices. This invigorating drink combines the bold taste of black tea with the warmth of spices like cardamom, cinnamon, ginger, cloves, and black pepper. Known for its comforting and energizing qualities, Masala Tea is a popular choice for tea lovers worldwide."
    },
    7: {
        name: "Organtior dal",
        description: "Fresh organic Organtior dal",
        price: "&#8377;250.00",
        image: "images/dal.jpg",
        datadesc: "Grown without synthetic fertilizers and pesticides, this split pigeon pea is a rich source of protein and dietary fiber. Essential for making hearty dals, sambars, and soups, it has a creamy texture and a nutty flavor when cooked. Toor Dal is not only delicious but also a great source of iron, potassium, and folate, making it a healthy choice for vegetarians and vegans. Perfect for creating wholesome, nutrient-dense meals."
    },
    8: {
        name: "Pink salt",
        description: "Fresh organic Pink salt",
        price: "&#8377;100.00",
        image: "images/pink salt.jpg",
        datadesc: "Harvested from the Himalayan foothills, this pink salt is naturally rich in minerals like magnesium, potassium, and calcium. Its subtle flavor and vibrant pink color make it an attractive and healthy alternative to regular table salt. Known for its detoxifying properties, it helps balance pH levels, regulate hydration, and improve digestion. Sprinkle it on salads, use it in cooking, or dissolve it in water for a mineral-rich drink."
    },
    9: {
        name: "Toor dal",
        description: "Fresh organic Toor dal",
        price: "&#8377;150.00",
        image: "images/toor dal.jpg",
        datadesc: "This natural, unrefined salt is packed with essential minerals that promote overall health. Free from additives and chemical bleaching, it retains its natural flavor and benefits. Use it as a healthier seasoning for your everyday meals to enhance taste and nutrition. Ideal for cooking, pickling, or curing, it’s a versatile and eco-friendly choice. Its mineral content supports hydration, electrolyte balance, and overall wellness."
    }
}
// Dynamically set the content

        // Get the product ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productID');

        // Get the product details from the 'products' object
        const product = products[productId];

        if (product) {
            // Update the page with the product details
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price').innerHTML = product.price;
            document.getElementById('product-image').src = product.image;
            document.getElementById('product-datadesc').textContent = product.datadesc;
        } else {
            // If no product found, display a message
            document.getElementById('product-name').textContent = "Product not found.";
        }
        