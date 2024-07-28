import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../model/cart.model.js";
import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";
const addToCart = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;

  const product = await Product.findById(product_id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: req.user?._id });

  if (cart) {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === product_id
    );

    if (existingItemIndex !== -1) {
      // Update the quantity of the existing product
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add a new item to the cart
      cart.items.push({ productId: product_id, quantity });
    }
    await cart.save();
  } else {
    // Create a new cart if it doesn't exist
    cart = await Cart.create({
      user: req.user?._id,
      items: [{ productId: product_id, quantity }],
    });
  }

  res
    .status(200)
    .json(new ApiResponse(201, cart, "Product added successfully to the cart"));
});

const getCartProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId })
    .populate({ path: "items.productId", select: "title price" })
    .exec();
  res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

const removeCartProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { product_id } = req.params;
  const cart = await Cart.findOneAndDelete(
    {
      user: userId,
      "items.productId": product_id,
    },
    {
      new: true,
    }
  );

  res.status(200).json(new ApiResponse(200, cart, "Cart deleted successfully"));
});

const removeQuantityOfProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { product_id } = req.params;

  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === product_id
    );
    if (existingItemIndex !== -1) {
      if (cart.items[existingItemIndex].quantity === 1) {
        cart.items.splice(existingItemIndex, 1);
      } else {
        // Update the quantity of the existing product
        cart.items[existingItemIndex].quantity -= 1;
      }
    }
    await cart.save();
  } else {
    res.status(404).json(new ApiError(404, "Product not found"));
  }
  res.status(200).json(new ApiResponse(200, cart, "Cart minus the quantity"));
});
export {
  addToCart,
  getCartProduct,
  removeCartProduct,
  removeQuantityOfProduct,
};
