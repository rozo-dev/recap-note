import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import Note from "./Note.js";
import User from "./User.js";

const Schema = mongoose.Schema;

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    createdAt: {
      type: String,
      immutable: true,
      default: () => {
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const date = day + "/" + month + "/" + year;
        return date;
      },
    },
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    autoIndex: false, // Disable automatic index creation for this collection
  }
);

collectionSchema.plugin(passportLocalMongoose);

const Collection = mongoose.model("collection", collectionSchema);

export default Collection;
