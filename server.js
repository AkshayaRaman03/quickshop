const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_your_test_key');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
        images: [item.imageURL],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:3000/success.html',
    cancel_url: 'http://localhost:3000/cancel.html',
  });

  res.json({ id: session.id });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));