import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Please enter brand"],
      trim: true,
    },
    style: {
      type: String,
      required: [true, "Please enter style"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Please enter color"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "Please enter size"],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);