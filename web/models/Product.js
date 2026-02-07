const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    price: { type: Number, required: true },
    description: String,
    features: [String],
    image: String,
    status: {
      type: String,
      enum: ["in-stock", "out-of-stock"],
      default: "in-stock",
    },
    stock: { type: Number, default: 999 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);