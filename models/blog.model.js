const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    state: { type: String, enum: ["draft", "published"], default: "draft" },
    read_count: { type: Number, default: 0 },
    reading_time: { type: Number, default: 0 }, // in minutes
    tags: [{ type: String, index: true }],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// index for text search on title, description and body
BlogSchema.index({
  title: "text",
  description: "text",
  body: "text",
  tags: "text",
});

module.exports = mongoose.model("Blog", BlogSchema);
