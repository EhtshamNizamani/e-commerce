import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../model/product.model.js";
import { Order } from "../model/order.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const order = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const { orderCount } = req.body;

  const product = await Product.findById({ _id: product_id });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  if (!orderCount) {
    throw new ApiError(404, "Order min 1 product");
  }
  if (orderCount < 1) {
    throw new ApiError(401, "Your should have at least 1 product to order");
  } else if (product.stock < orderCount) {
    throw new ApiError(401, "We don't have that much stock right now");
  }

  // Calculate the total amount
  const totalAmount = product.price * orderCount;

  // Create a payment method using Stripe's test card
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: "4242424242424242", // Test card number
      exp_month: 12,
      exp_year: 2024,
      cvc: "123",
    },
  });

  // Extract the paymentMethodId from the response
  const paymentMethodId = paymentMethod.id;

  // Step 1: Confirm payment with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1 * 100, // Convert amount to cents
    currency: "usd",
    automatic_payment_methods: {
      allow_redirects: "never",
      enabled: true,
    },
    payment_method: paymentMethodId, // Use the payment method created above
    confirm: true, // Automatically confirm the payment
  });

  if (paymentIntent.status !== "succeeded") {
    throw new ApiError(402, "Payment failed. Please try again.");
  }

  const orderedProduct = await Order.create({
    userId: req.user?._id,
    productId: product_id,
    quantity: orderCount,
  });

  await Product.findByIdAndUpdate(
    product_id,
    {
      $inc: { stock: -orderCount },
    },
    {
      new: true,
    }
  );
  const orderDetails = {
    orderId: orderedProduct._id,
    userId: orderedProduct.userId,
    productId: orderedProduct.productId,
    productName: product.name,
    productDescription: product.description,
    productPrice: product.price,
    quantity: orderedProduct.quantity,
    totalAmount: product.price * orderCount,
  };

  res
    .status(200)
    .send(
      new ApiResponse(
        201,
        orderDetails,
        "you have successfully purchased order"
      )
    );
});

const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  console.log(userId);
  const aggregate = Order.aggregate([
    { $match: { userId: userId } },

    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails", // Unwind the productDetails array to deconstruct it
    },
    {
      $project: {
        _id: 0, // Exclude the original _id field from the output
        orderId: "$_id", // Create a new field orderId with the value of the _id field
        productId: "$productDetails._id",
        productName: "$productDetails.name",
        productDescription: "$productDetails.description",
        productPrice: "$productDetails.price",
        quantity: 1,
        totalAmount: { $multiply: ["$productDetails.price", "$quantity"] },
        status: 1,
        orderedAt: "$createdAt",
      },
    },
    {
      $sort: { orderedAt: -1 }, // Sort orders by the most recent
    },
  ]);
  // Pagination options
  const options = {
    page: req.query.page || 1, // Default to page 1 if not provided
    limit: req.query.limit || 10, // Default to 10 items per page if not provided
  };
  // Execute the aggregation with pagination
  const orderHistory = await Order.aggregatePaginate(aggregate, options);

  console.log(orderHistory);
  res.status(200).send("");
});

export { order, getOrder };
