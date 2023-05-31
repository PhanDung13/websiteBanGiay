const mongoose = require("mongoose");
const { Schema } = mongoose;
const CartSchema = mongoose.Schema(
  {
    id_user: { type: Schema.Types.ObjectId, ref: "user" },
    address: { type: String, require },
    phone: { type: String, required: true },
    totalSum: { type: Number, required: true },
    order_detail: { type: Array, required: true },
    payment: { type: String, required: true },
    status_order: { type: Number, required: true },
    note: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", CartSchema);
