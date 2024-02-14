import razorpay from "razorpay";
import users from "../models/auth.js";
import dotenv from "dotenv";
dotenv.config();
const rzp = new razorpay({
  key_id:  process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createSubscription = async (req, res) => {
  const { userId, plan } = req.body;

  try {
    const amount = calculateSubscriptionAmount(plan);
    const order = await rzp.orders.create({
      amount: amount * 100,
      currency: "INR", 
    });

    const subscriptionExpiresAt = new Date();
    subscriptionExpiresAt.setMonth(subscriptionExpiresAt.getMonth() + 1);

    const updatedUser = await users.findByIdAndUpdate(userId, {
      subscription: plan,
      questionQuota: getQuestionQuota(plan),
      subscriptionExpiresAt, 
      questionsPosted: 0, 
    }, { new: true });

    res.json({ orderId: order.id, amount: order.amount, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Inside updateSubscription function
export const updateSubscription = async (req, res) => {
  const { userId, plan, paymentId } = req.body;

  try {
    const payment = await rzp.payments.fetch(paymentId);
    const subscriptionExpiresAt = new Date();
    subscriptionExpiresAt.setMonth(subscriptionExpiresAt.getMonth() + 1);

    const updatedUser = await users.findByIdAndUpdate(userId, {
      subscription: plan,
      questionQuota: getQuestionQuota(plan),
      subscriptionExpiresAt, 
      questionsPosted: 0, 
    }, { new: true });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
function calculateSubscriptionAmount(plan) {
  switch (plan) {
    case 'silver':
      return 100; 
    case 'gold':
      return 1000; 
    default:
      return 0; 
  }
}

function getQuestionQuota(plan) {
  switch (plan) {
    case 'silver':
      return 5;
    case 'gold':
      return Infinity;
    default:
      return 1;
  }
}
