import Stripe from "stripe";
import Course from "../models/course.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =============================
//  Create Stripe Checkout
// =============================
export async function createCheckoutSession(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: course.title,
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment-success?courseId=${courseId}&userId=${userId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
}
