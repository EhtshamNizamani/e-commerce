import mongoose, { Mongoose } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);
cartSchema.plugin(mongooseAggregatePaginate);

export { Cart };
