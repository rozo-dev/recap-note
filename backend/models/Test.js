import mongoose from "mongoose";

const Schema = mongoose.Schema;

const testSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
  },
  {
    autoIndex: false,
  }
);

const Test = mongoose.model("test", testSchema);

export default Test;
