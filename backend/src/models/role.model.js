import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const roleModel = mongoose.model("Category", roleSchema);
