import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../model/product.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, brand, stock, image } = req.body;
  if (!req.user?._id) {
    throw new ApiError(400, "Invalid user");
  }
  const product = await Product.create({
    title,
    description,
    price,
    category,
    brand,
    stock,
    image,
    ratings: [{ user: req.user._id, rating: 0, review: "" }],
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

export { createProduct, getAllProduct, editProduct };
