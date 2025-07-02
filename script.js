const products = [
  { id: 1, title: 'T-shirt', price: 2000, imageURL: '', description: 'Cool T-shirt' },
  { id: 2, title: 'Jeans', price: 4000, imageURL: '', description: 'Stylish Jeans' }
];

const cart = {};

function renderProducts() {
  const container = document.getElementById('product-list');
  products.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${p.title}</strong> - $${p.price / 100}
      <button onclick="addToCart(${p.id})">Add to cart</button>`;
    container.appendChild(div);
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart');
  container.innerHTML = '';
  Object.keys(cart).forEach(id => {
    const product = products.find(p => p.id == id);
    const div = document.createElement('div');
    div.innerHTML = `${product.title} x ${cart[id]}
      <button onclick="removeFromCart(${id})">Remove</button>`;
    container.appendChild(div);
  });
}

async function checkout() {
  const cartItems = Object.keys(cart).map(id => {
    const product = products.find(p => p.id == id);
    return { ...product, quantity: cart[id] };
  });
  const res = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems })
  });
  const data = await res.json();
  window.location = `https://checkout.stripe.com/pay/${data.id}`;
}

renderProducts();