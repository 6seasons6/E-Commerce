const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

// Create Order Route
router.post("https://euphonious-maamoul-f82320.netlify.app/create-order", async (req, res) => {
  console.log("Received create order request"); 
  console.log("Received create order request");
  console.log("Request body:", req.body);
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

module.exports = router;
