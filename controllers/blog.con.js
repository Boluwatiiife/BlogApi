const mongoose = require("mongoose");
const { compute_reading_time } = require("../utils/readingTime");
const blogModel = require("../models/blog.model");

// create blog (logged in user). draft
exports.create_Blog = async (req, res) => {
  try {
    const { title, description, body, tags, state } = req.body;
    const author = req.user._id;
    const reading_time = compute_reading_time(body);
    const blog = await blogModel.create({
      title,
      description,
      body,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      author,
      reading_time,
      state,
    });
    return res.status(201).json(blog);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "title must be unique" });
    return res.status(400).json({ message: err.message });
  }
};

// publish (owner only) set state to punlished
exports.update_blog_state = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    if (!["published", "draft"].includes(state))
      return res.status(400).json({ message: "Invalid state" });

    const blog = await blogModel
      .findOneAndUpdate(
        { _id: id, author: req.user._id },
        { state },
        { new: true }
      )
      .lean();
    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found or you are not the owner" });
    return res.json(blog);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// edit blog (owner only)
exports.edit_blog = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.body) update.reading_time = compute_reading_time(update.body);
    const blog = await blogModel
      .findOneAndUpdate({ _id: id, author: req.user._id }, update, {
        new: true,
      })
      .lean();
    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found or you are not the owner" });
    return res.json(blog);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// delete blog (owner only)
exports.delete_blog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel
      .findOneAndDelete({ _id: id, author: req.user._id })
      .lean();
    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found or you are not the owner" });
    return res
      .status(200)
      .json({ message: `you have deleted blog with title ${blog.title}` });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// get list of published blogs (public)
exports.list_blogs = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      state = "published",
      search,
      author,
      tags,
      sortBy,
      order = "desc",
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};
    if (state) filter.state = state;
    if (author) {
      if (mongoose.Types.ObjectId.isValid(author)) filter.author = author;
      else {
      }
    }
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      filter.tags = { $in: tagList };
    }

    const query = blogModel.find(filter).where("state").equals(state);

    // search: title, tags, author name
    if (search) {
      query.find({ $text: { $search: search } });
    }

    // sorting
    const sortOptions = {};
    if (sortBy) {
      const direction = order === "asc" ? 1 : -1;
      const allowed = ["read_count", "reading_time", "createdAt"];
      if (allowed.includes(sortBy)) sortOptions[sortBy] = direction;
    } else {
      sortOptions.createdAt = -1;
    }

    const total = await blogModel.countDocuments(query.getFilter());
    const blogs = await blogModel
      .find(query.getFilter())
      .populate("author", "first_name last_name email")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({ page, limit, total, data: blogs });
  } catch (err) {
    return res.status(500).json({ measage: err.message });
  }
};

// get single published blog (public) - increment read_count by 1 and return author's info
exports.get_single_blog = async (req, res) => {
  try {
    const { id } = req.params;
    // auto increase read_count
    const blog = await blogModel
      .findOneAndUpdate(
        { _id: id, state: "published" },
        { $inc: { read_count: 1 } },
        { new: true }
      )
      .populate("author", "first_name last_name email")
      .lean();

    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found or not published" });
    return res.json(blog);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// get logged in user's blog (must be logged in)
exports.get_my_blogs = async (req, res) => {
  try {
    let { page = 1, limit = 20, state } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = { author: req.user._id };
    if (state) filter.state = state;

    const total = await blogModel.countDocuments(filter);
    const blogs = await blogModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({ page, limit, total, data: blogs });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
