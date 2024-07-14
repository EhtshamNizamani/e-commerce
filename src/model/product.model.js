import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please specified a category"],
    },
    brand: {
      type: String,
      required: [true, "Please write a brand name"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String, // URL to the product image
      required: [true, "Image is required"],
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 0,
          max: 5,
        },
        review: {
          type: String,
        },
      },
    ],
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export { Product };
