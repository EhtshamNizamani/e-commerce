import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../model/product.model.js";
import { Favorite } from "../model/favorite.model.js";
const toggleFavorite = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  console.log(product_id);
  const product = await Product.findById(product_id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const fav = await Favorite.findOne({
    productId: product_id,
    userId: req.user?._id,
  });

  if (fav) {
    await Favorite.findOneAndDelete({
      productId: product_id,
      userId: req.user?._id,
    });

    return res
      .status(200)
      .send(new ApiResponse(201, "Removed from favorite list"));
  }

  await Favorite.create({
    productId: product_id,
    userId: req.user?._id,
  });
  res.status(200).send(new ApiResponse(201, "Saved in favorite list"));
});

export { toggleFavorite };
