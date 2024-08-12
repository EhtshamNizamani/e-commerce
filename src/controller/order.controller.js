import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../model/product.model.js";
import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const order = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { products, shippingAddress } = req.body;

  const totalAmount = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

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

  const orderedProduct = new Order({
    userId,
    products,
    shippingAddress,
    totalAmount,
    status: "Pending",
    paymentStatus: "Pending",
  });

  await orderedProduct.save();
  for (const item of products) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with ID ${item.productId} not found` });
    }

    if (product.stock < item.quantity) {
      return res
        .status(400)
        .json({ error: `Insufficient stock for ${product.name}` });
    }

    product.stock -= item.quantity;
    await product.save();
  }

  res
    .status(200)
    .send(
      new ApiResponse(
        201,
        orderedProduct,
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

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (user.role != "admin") {
      throw new ApiError(400, "only admin can user this feature");
    }
    const pipeline = [
      {
        $lookup: {
          from: "users", // Collection name in MongoDB
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "products", // Collection name in MongoDB
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          totalAmount: { $first: "$totalAmount" },
          status: { $first: "$status" },
          shippingAddress: { $first: "$shippingAddress" },
          paymentStatus: { $first: "$paymentStatus" },
          orderDate: { $first: "$orderDate" },
          deliveryDate: { $first: "$deliveryDate" },
          products: {
            $push: {
              productId: "$products.productId",
              quantity: "$products.quantity",
              price: "$products.price",
            },
          },
          userDetails: { $first: "$userDetails" },
          productDetails: { $first: "$productDetails" },
        },
      },
    ];

    // Apply pagination to the aggregation pipeline
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const orders = await Order.aggregatePaginate(
      Order.aggregate(pipeline),
      options
    );

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
export { order, getOrder, getAllOrders };
