const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd"} = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const pi = await stripe.paymentIntents.create({
      amount: Math.floor(Number(amount)),
      currency,
      automatic_payment_methods: { enabled: true },
     
    });

    return res.json({
      success: true,
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id,
    });
  } catch (err) {
    console.error("createPaymentIntent:", err.message);
    return res.status(500).json({ success: false, message: "Stripe error" });
  }
};

const confirmEnrollment = async (req, res, next) => {
  try {
    const { paymentIntentId, user_id, course_id } = req.body;
    if (!paymentIntentId || !user_id || !course_id) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded") {
      return res.status(400).json({ success: false, message: `PI status: ${pi.status}` });
    }

    req.body = { user_id, course_id };
    return next();
  } catch (err) {
    console.error("confirmEnrollment:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createPaymentIntent , confirmEnrollment };
