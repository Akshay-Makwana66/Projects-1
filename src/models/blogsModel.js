const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: {
      type: String,
      required: true,
    },
    authorId: {
      required: true,
      type: ObjectId,
      ref: "Author",
    },
    tags: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
    subcategory: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default:null
    },
  },
  { timestamps: true });

module.exports = mongoose.model("Blogs", blogsSchema);
