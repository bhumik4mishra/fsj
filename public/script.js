document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.querySelector('.product-grid');
    const cartItemsContainer = document.getElementById('cart-items-container');

    // Get cart from localStorage or initialize as empty array
    let cart = JSON.parse(localStorage.getItem('groceryCart')) || [];

    // --- GENERAL FUNCTIONS ---

    const saveCart = () => {
        localStorage.setItem('groceryCart', JSON.stringify(cart));
        updateCartCount();
    };

    const updateCartCount = () => {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    };
    
    const updateButtonState = () => {
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.querySelector('.product-name').textContent;
            const container = card.querySelector('.add-to-cart-container');
            const cartItem = cart.find(item => item.name === name);

            if (cartItem) {
                container.innerHTML = `
                    <div class="quantity-controls">
                        <button class="minus-btn" data-name="${name}">-</button>
                        <span class="quantity">${cartItem.quantity}</span>
                        <button class="plus-btn" data-name="${name}">+</button>
                    </div>
                `;
            } else {
                 container.innerHTML = `<button class="add-btn">Add to Cart</button>`;
            }
        });
    };

    // --- PRODUCT PAGE LOGIC ---

    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;

            const name = card.querySelector('.product-name').textContent;
            const price = parseFloat(card.querySelector('.price').dataset.price);
            const image = card.querySelector('img').src;

            // Handle Add button click
            if (e.target.classList.contains('add-btn')) {
                addToCart({ name, price, image });
            }
            // Handle Plus/Minus buttons
            if (e.target.classList.contains('plus-btn')) {
                updateQuantity(name, 1);
            }
            if (e.target.classList.contains('minus-btn')) {
                updateQuantity(name, -1);
            }
        });
        
        updateButtonState(); // Initial state on page load
    }
    
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateButtonState();
    };

    const updateQuantity = (name, change) => {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.name !== name);
            }
        }
        saveCart();
        updateButtonState();
        if(cartItemsContainer) displayCartItems(); // Re-render cart if on cart page
    };

    // --- CART PAGE LOGIC ---

    const displayCartItems = () => {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty. Start shopping!</p>';
            document.getElementById('cart-summary').style.display = 'none';
            return;
        }
         document.getElementById('cart-summary').style.display = 'block';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: ₹${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="minus-btn" data-name="${item.name}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="plus-btn" data-name="${item.name}">+</button>
                </div>
                <button class="remove-btn" data-name="${item.name}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        updateCartSummary();
    };

    const updateCartSummary = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('total-price').textContent = `₹${totalPrice.toFixed(2)}`;
    };

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
             const name = e.target.dataset.name;
             if(!name) return;

             if (e.target.classList.contains('plus-btn')) {
                 updateQuantity(name, 1);
             }
             if (e.target.classList.contains('minus-btn')) {
                 updateQuantity(name, -1);
             }
             if (e.target.classList.contains('remove-btn')) {
                 cart = cart.filter(item => item.name !== name);
                 saveCart();
                 displayCartItems();
             }
        });
        displayCartItems();
    }
    
    // --- INITIAL LOAD ---
    updateCartCount();
});