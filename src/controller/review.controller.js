import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../model/product.model.js";
import { Order } from "../model/order.model.js";
const addReview = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const { comment, rating } = req.body;
  const userId = req.user?._id;

  // Check if the user has purchased the product
  const hasPurchased = await Order.findOne({
    userId: userId,
    "products.productId": product_id,
    status: "Delivered",
    // paymentStatus: "Paid",
  });
  if (!hasPurchased) {
    throw new ApiError(400, "You can only review products you have purchased.");
  }
  if (!comment || !rating) {
    throw new ApiError(400, "Comment and rating are required.");
  }

  // Find the product by ID and push the new review to the ratings array
  const product = await Product.findById(product_id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Check if the product already has a review for this order
  const existingReview = product.ratings.find(
    (review) => review.orderId.toString() === hasPurchased._id.toString()
  );

  if (existingReview) {
    throw new ApiError(
      403,
      "You have already reviewed this product for this purchase."
    );
  }

  // Create the review object
  const review = {
    userId,
    orderId: hasPurchased._id,
    rating,
    comment,
    reviewDate: new Date(),
  };
  console.log(review);

  // Add the review to the product's ratings array
  product.ratings.push(review);

  // Update the number of reviews and the average rating
  product.numReviews = product.ratings.length;
  product.averageRating =
    product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

  // Save the updated product
  await product.save();

  res
    .status(201)
    .json(new ApiResponse(200, product, "Review submitted successfully"));
});

export { addReview };
