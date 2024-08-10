import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../model/product.model.js";
import { Order } from "../model/order.model.js";
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
  console.log(orderCount);
  if (orderCount < 1) {
    throw new ApiError(401, "Your should have at least 1 product to order");
  } else if (product.stock < orderCount) {
    throw new ApiError(401, "We don't have that much stock right now");
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

export { order };
