// Product management functions
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [
        {
            id: 1,
            name: "Stylish Men's T-Shirt",
            price: 299,
            img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            cat: "clothing"
        },
        {
            id: 2,
            name: "Premium Ladies Kurti",
            price: 480,
            img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
            cat: "clothing"
        },
        {
            id: 3,
            name: "Wireless Earbuds",
            price: 650,
            img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
            cat: "electronics"
        }
    ];
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Initialize default products if not exists
if (!localStorage.getItem('products')) {
    saveProducts(getProducts());
}

// Cart functions
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
}

// Render all products (for products page)
function renderAllProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    const products = getProducts();
    container.innerHTML = '';
    products.forEach(p => {
        container.innerHTML += `
            <div class="product">
                <img src="${p.img}" alt="${p.name}">
                <div class="info">
                    <div class="title">${p.name}</div>
                    <div class="price">৳ ${p.price}</div>
                    <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            </div>
        `;
    });
}