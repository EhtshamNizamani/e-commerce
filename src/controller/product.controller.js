import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, brand, stock, image } = req.body;
  if (!req.user?._id) {
    throw new ApiError(400, "Invalid user");
  }
  const user = await User.findById(req.user?._id);
  if (user.role != "admin") {
    throw new ApiError(400, "only admin can create product");
  }
  const product = await Product.create({
    title,
    description,
    price,
    category,
    brand,
    stock,
    image,
  });

  res
    .status(200)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const getAllProduct = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const products = await Product.find().skip(skip).limit(limit).exec();

  const totalCount = await Product.countDocuments();

  const totalPages = Math.ceil(totalCount / limit);

  // Check if products were found
  if (!products) {
    throw new ApiError(400, "Products not found!");
  }

  // Construct pagination metadata
  const pagination = {
    currentPage: page,
    totalPages: totalPages,
    totalProducts: totalCount,
  };

  res.status(200).json({
    success: true,
    data: products,
    pagination: pagination,
    message: "Fetched products successfully",
  });
});

const editProduct = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const { title, description, price, category, brand, stock, image } = req.body;
  if (!product_id) {
    throw new ApiError(400, "product not found");
  }
  const user = await User.findById(req.user?._id);
  if (user.role != "admin") {
    throw new ApiError(400, "only admin can edit product");
  }
  const updateFields = {
    title,
    description,
    price,
    category,
    brand,
    stock,
    image,
  };

  Object.keys(updateFields).forEach(
    (key) =>
      (updateFields[key] === undefined || updateFields[key] === "") &&
      delete updateFields[key]
  );

  const product = await Product.findByIdAndUpdate(
    product_id,
    {
      $set: updateFields,
    },
    {
      new: true,
    }
  );
  if (!product) {
    throw new ApiError(400, "product not found");
  }
  res
    .status(200)
    .json(new ApiResponse(201, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.product_id;
  const user = await User.findById(req.user?._id);
  if (user.role != "admin") {
    throw new ApiError(400, "only admin can edit product");
  }
  if (!productId) {
    throw new ApiError(404, "Product not found");
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }
  res
    .status(200)
    .json(new ApiResponse(201, {}, "Product deleted successfully"));
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const productId = req.params.product_id;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res
    .status(200)
    .json(new ApiResponse(201, product, "Product fetched successfully"));
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;

  if (!category) {
    throw new ApiError(404, "Please provide a category");
  }
  const product = await Product.find({ category });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res
    .status(200)
    .json(new ApiResponse(201, product, "Product fetched by category"));
});

const addReview = asyncHandler(async (req, res) => {
  const { review, rating } = req.body;
  const { product_id } = req.params;

  const product = await Product.findByIdAndUpdate(
    product_id,
    {
      $push: {
        ratings: {
          user: req.user._id,
          rating,
          review,
        },
      },
      $inc: {
        numReviews: 1,
      },
    },

    {
      new: true,
    }
  );
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  console.log(review);
  console.log(rating);
  res
    .status(200)
    .json(new ApiResponse(201, product, "Product fetched by category"));
});
export {
  createProduct,
  getAllProduct,
  editProduct,
  deleteProduct,
  getSingleProduct,
  getProductByCategory,
  addReview,
};
