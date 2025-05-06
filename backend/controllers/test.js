import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function test() {
  try {
    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
    });
    console.log("✅ Razorpay order created:", order);
  } catch (err) {
    console.error("❌ Razorpay error:", err);
  }
}

test();
