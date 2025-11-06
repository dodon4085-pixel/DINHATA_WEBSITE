// script.js - Updated for GitHub Pages
class DinhataShop {
    constructor() {
        this.products = this.getProducts();
        this.cart = this.getCart();
        this.init();
    }

    init() {
        this.renderHomeProducts();
        this.renderAllProducts();
        this.setupAdmin();
        this.loadCart();
    }

    // Product management
    getProducts() {
        // Default products
        const defaultProducts = [
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

        try {
            const stored = localStorage.getItem('dinhata_products');
            return stored ? JSON.parse(stored) : defaultProducts;
        } catch (e) {
            return defaultProducts;
        }
    }

    saveProducts(products) {
        try {
            localStorage.setItem('dinhata_products', JSON.stringify(products));
            this.products = products;
        } catch (e) {
            console.error('Save error:', e);
        }
    }

    // Cart management
    getCart() {
        try {
            return JSON.parse(localStorage.getItem('dinhata_cart')) || [];
        } catch (e) {
            return [];
        }
    }

    saveCart(cart) {
        try {
            localStorage.setItem('dinhata_cart', JSON.stringify(cart));
            this.cart = cart;
        } catch (e) {
            console.error('Cart save error:', e);
        }
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.cart.push({...product, cartId: Date.now()});
            this.saveCart(this.cart);
            alert('✅ Product added to cart!');
            this.updateCartCount();
        }
    }

    removeFromCart(cartId) {
        this.cart = this.cart.filter(item => item.cartId !== cartId);
        this.saveCart(this.cart);
        this.loadCart();
        this.updateCartCount();
    }

    clearCart() {
        this.cart = [];
        this.saveCart(this.cart);
        this.loadCart();
        this.updateCartCount();
    }

    // Rendering functions
    renderHomeProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        const homeProducts = this.products.slice(0, 3);
        container.innerHTML = homeProducts.map(p => `
            <div class="product">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300/333/fff?text=Product+Image'">
                <div class="info">
                    <div class="title">${p.name}</div>
                    <div class="price">৳ ${p.price}</div>
                    <button class="add-btn" onclick="shop.addToCart(${p.id})">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }

    renderAllProducts() {
        const container = document.getElementById('productsContainer');
        if (!container || !window.location.pathname.includes('products')) return;

        container.innerHTML = this.products.map(p => `
            <div class="product">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300/333/fff?text=Product+Image'">
                <div class="info">
                    <div class="title">${p.name}</div>
                    <div class="price">৳ ${p.price}</div>
                    <button class="add-btn" onclick="shop.addToCart(${p.id})">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }

    loadCart() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        container.innerHTML = this.cart.map((item, index) => `
            <div class='cart-item'>
                <img src="${item.img}" alt="${item.name}" width="50" style="border-radius:5px;">
                <div>
                    <div><strong>${item.name}</strong></div>
                    <div>৳${item.price}</div>
                </div>
                <button class="delete-btn" onclick='shop.removeFromCart(${item.cartId})'>X</button>
            </div>
        `).join('');
    }

    updateCartCount() {
        const count = this.cart.length;
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    // Admin functions
    setupAdmin() {
        const addForm = document.getElementById('addProductForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewProduct();
            });
            this.loadAdminProducts();
        }
    }

    addNewProduct() {
        const form = document.getElementById('addProductForm');
        const newProduct = {
            id: Date.now(),
            name: document.getElementById('pName').value,
            price: parseInt(document.getElementById('pPrice').value),
            img: document.getElementById('pImage').value,
            cat: document.getElementById('pCategory').value
        };

        this.products.push(newProduct);
        this.saveProducts(this.products);
        
        alert('✅ Product Added Successfully!');
        form.reset();
        this.loadAdminProducts();
    }

    loadAdminProducts() {
        const container = document.getElementById('adminProductList');
        if (!container) return;

        container.innerHTML = this.products.map(p => `
            <div class="product-item">
                <div>
                    <img src="${p.img}" alt="${p.name}" width="60" style="border-radius:5px; margin-right:10px;">
                    <div>
                        <b>${p.name}</b><br>
                        ৳${p.price} | ${p.cat}
                    </div>
                </div>
                <button class="delete-btn" onclick="shop.deleteProduct(${p.id})">Delete</button>
            </div>
        `).join('');
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts(this.products);
            this.loadAdminProducts();
            this.renderAllProducts();
            this.renderHomeProducts();
        }
    }

    // Checkout function
    processCheckout(formData) {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return false;
        }

        const order = {
            ...formData,
            cart: this.cart,
            total: this.cart.reduce((sum, item) => sum + item.price, 0),
            orderId: 'DIN' + Date.now(),
            date: new Date().toLocaleString('bn-BD')
        };

        // Save order
        try {
            localStorage.setItem('dinhata_last_order', JSON.stringify(order));
        } catch (e) {
            console.error('Order save error:', e);
        }

        // Clear cart
        this.clearCart();
        
        return true;
    }
}

// Initialize shop
const shop = new DinhataShop();

// Global functions for HTML onclick
function addToCart(productId) {
    shop.addToCart(productId);
}

function removeFromCart(cartId) {
    shop.removeFromCart(cartId);
}
