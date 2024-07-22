import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../model/cart.model.js";
import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";

const addToCart = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const product = await Product.findById(product_id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    // Check if item is already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === product_id
    );
    if (itemIndex > -1) {
      // Item already in cart, update quantity
      cart.items[itemIndex].quantity += 1;
    } else {
      // Item not in cart, add new item
      cart.items.push({ productId: product_id, quantity: 1 });
    }
  } else {
    // No cart for user, create new cart
    cart = new Cart({
      user: req.user._id,
      items: [{ productId: product_id, quantity: 1 }],
    });
  }
  console.log(cart);
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(201, cart, "Product added successfully to the cart"));
});

const getCartProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.aggregate([
    {
      $match: {
        user: userId,
      },
    },
  ]);

  if (!cart) {
    throw new ApiError(404, "Cart not found!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, cart[0], "Cart retrieved successfully"));
});

export { addToCart, getCartProduct };
