document.addEventListener('DOMContentLoaded', function () {

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
   
    const renderProducts = async () => {
        try {
            const response = await fetch('/data/products.json');
            products = await response.json();
            
            const productsContainer = document.querySelector('.products');
            productsContainer.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product');
                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="${product.image}" alt="${product.name}">
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
                `;
                productsContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };
    
    

    const renderCart = () => {
        const cartContainer = document.querySelector('#cart-items');
        const emptyCartMessage = document.querySelector('#empty-cart-message');
        const emptyCartButton = document.querySelector('#empty-cart');
        const finalizeOrderButton = document.querySelector('#finalize-order');
        cartContainer.innerHTML = '';
        let total = 0;
        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block';
            emptyCartButton.style.display = 'none';
            finalizeOrderButton.style.display = 'none';
        } else {
            emptyCartMessage.style.display = 'none';
            emptyCartButton.style.display = 'block';
            finalizeOrderButton.style.display = 'block';
            
            const groupedCartItems = cartItems.reduce((acc, item) => {
                if (!acc[item.id]) {
                    acc[item.id] = { ...item, quantity: 0 };
                }
                acc[item.id].quantity++;
                return acc;
            }, {});
            
            Object.values(groupedCartItems).forEach(item => {
                const cartItem = document.createElement('li');
                cartItem.classList.add('cart-item');
                cartItem.textContent = `${item.name} x ${item.quantity} - $${item.price * item.quantity}`;
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Eliminar';
                removeButton.dataset.id = item.id;
                removeButton.classList.add('remove-from-cart');
                cartItem.appendChild(removeButton);
                cartContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });
        }
        document.querySelector('#total').textContent = `Total: $${total.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cartItems));
    };

    const addToCart = productId => {
        const productToAdd = products.find(product => product.id == productId);
        cartItems.push(productToAdd);
        renderCart();
    };

    const removeFromCart = productId => {
        const index = cartItems.findIndex(item => item.id == productId);
        cartItems.splice(index, 1);
        renderCart();
    };

    document.querySelector('#empty-cart').addEventListener('click', () => {
        cartItems.length = 0;
        renderCart();
    });

    document.querySelector('#finalize-order').addEventListener('click', () => {
        alert('¡Gracias por tu compra!');
        cartItems.length = 0;
        renderCart();
    });

    document.addEventListener('click', event => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.dataset.id;
            addToCart(productId);
        }
        if (event.target.classList.contains('remove-from-cart')) {
            const productId = event.target.dataset.id;
            removeFromCart(productId);
        }
    });

    renderProducts();
    renderCart();
});