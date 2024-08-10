import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

orderSchema.plugin(aggregatePaginate);

const Order = mongoose.model("Order", orderSchema);

export { Order };
