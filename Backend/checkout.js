const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
 
// Initialize Razorpay instance with your Test Key and Secret
const razorpay = new Razorpay({
  key_id: 'rzp_test_8Ic05YIxwCqwyr', // Your Test Key ID
  key_secret: 'jbEVfRYdBYikTzelZ3XyTNAz' // Your Test Key Secret
});
 
// Route to create an order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body; // Amount in paise
  try {
    const options = {
      amount: amount, // Amount in paise (e.g., 50000 = Rs. 500)
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1, // Automatically capture the payment
    };
    const order = await razorpay.orders.create(options);
    res.json(order); // Send order details to the frontend
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});
 
module.exports = router;