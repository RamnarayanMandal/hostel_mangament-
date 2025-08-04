import mongoose from "mongoose";
import { CATEGORY } from "../types/enum";

const categoryFeeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: CATEGORY,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
  },
  { _id: true } 
);

const hotelFeeStructureSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    fees: {
      type: [categoryFeeSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const HotelFeeStructure = mongoose.model(
  "HotelFeeStructure",
  hotelFeeStructureSchema
);

export default HotelFeeStructure;
