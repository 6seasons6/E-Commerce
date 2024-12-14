window.onload = function() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBody = document.getElementById('wishlist-body');

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
        });
    });
};
