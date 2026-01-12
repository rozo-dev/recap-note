import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import User from "./User.js";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
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
    favourited: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    autoIndex: false,
  }
);

noteSchema.plugin(passportLocalMongoose);

const Note = mongoose.model("Note", noteSchema);

export default Note;
